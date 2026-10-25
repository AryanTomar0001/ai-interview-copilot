
from uuid import uuid4

from app.rag.chunking import chunk_text
from app.rag.embeddings import get_embeddings, get_embedding
from app.rag.qdrant_service import qdrant_service
from app.services.llm_service import llm_service
from app.repositories.interview_repository import InterviewRepository


def process_resume(user_id: str, text: str):
    chunks = chunk_text(text)

    if not chunks:
        raise ValueError("Resume contains no usable text")

    embeddings = get_embeddings(chunks)

    if len(embeddings) != len(chunks):
        raise ValueError("Resume embedding count mismatch")

    # Use a new ID for every processed resume version.
    resume_id = str(uuid4())

    qdrant_service.recreate_user_vectors(
        user_id=user_id,
        resume_id=resume_id,
        chunks=chunks,
        embeddings=embeddings
    )

    return {
        "message": "Resume processed successfully",
        "resume_id": resume_id,
        "chunks_processed": len(chunks)
    }


def retrieve_context(
    user_id: str,
    query: str | list[str],
    limit_per_query: int = 4
) -> str:
    queries = [query] if isinstance(query, str) else query

    # Keep the best-scoring match for each unique chunk.
    best_hits = {}

    for search_query in queries:
        if not isinstance(search_query, str) or not search_query.strip():
            continue

        query_embedding = get_embedding(search_query)

        results = qdrant_service.search_vectors(
            user_id=user_id,
            query_embedding=query_embedding,
            limit=limit_per_query
        )

        for hit in results:
            chunk = hit["chunk"]
            score = hit["score"]

            if (
                chunk not in best_hits
                or score > best_hits[chunk]["score"]
            ):
                best_hits[chunk] = hit

    ranked_hits = sorted(
        best_hits.values(),
        key=lambda hit: hit["score"],
        reverse=True
    )

    # Include section as a hint; never treat it as guaranteed truth.
    return "\n\n".join(
        f"[Possible resume section: {hit['section']}]\n{hit['chunk']}"
        for hit in ranked_hits
    )



async def generate_questions_from_resume(
    user_id: str,
    mode: str = "combined",
    technical_count: int = 3,
    hr_count: int = 2,
    project_count: int = 4
):
    repository = InterviewRepository()

    retrieval_queries = {
        "technical": [
            "Programming languages, technical skills, frameworks, "
            "databases, APIs, algorithms and technical concepts"
        ],
        "project": [
            "Project names, project descriptions, architecture, "
            "features, implementation, APIs, database design and challenges"
        ],
        "hr": [
            "Education, internships, work experience, achievements, "
            "teamwork, leadership and documented responsibilities"
        ],
        "combined": [
            "Programming languages, technical skills, frameworks, "
            "databases, APIs and technical concepts",
            "Project names, descriptions, architecture, features "
            "and implementation",
            "Education, work experience, internships and achievements"
        ]
    }

    if mode not in retrieval_queries:
        raise ValueError(
            "Invalid mode. Use technical, project, hr or combined."
        )

    context = retrieve_context(
        user_id=user_id,
        query=retrieval_queries[mode],
        limit_per_query=6
    )

    if not context.strip():
        raise ValueError(
            "No relevant resume context found. Please upload a valid resume."
        )


    if mode == "technical":
        result = llm_service.generate_technical_questions(
            context,
            count=technical_count
        )

    elif mode == "project":
        result = llm_service.generate_project_questions(
            context,
            count=project_count
        )

    elif mode == "hr":
        result = llm_service.generate_hr_questions(
            context,
            count=hr_count
        )

    elif mode == "combined":
        result = llm_service.generate_combined_questions(
            context,
            technical_count=technical_count,
            hr_count=hr_count,
            project_count=project_count
        )

    else:
        raise ValueError("Invalid interview mode")


    if not isinstance(result, dict) or result.get("error"):
        raise ValueError("Question generation failed")

    # Persist only the questions generated for the selected mode.

    # Create one session for this interview.
    interview_id = await repository.create_session(
        user_id=user_id,
        mode=mode
    )

    saved_questions = {
        "technical": [],
        "hr": [],
        "project": []
    }

    # Persist questions linked to this interview session.
    for category in ("technical", "hr", "project"):
        for question in result[category]:
            question_id = await repository.create({
                "user_id": user_id,
                "interview_id": interview_id,
                "question": question["question"],
                "expected_answer": question["expected_answer"],
                "difficulty": question["difficulty"],
                "topic": question["topic"],
                "category": category
            })

            saved_questions[category].append({
                **question,
                "question_id": question_id
            })

    return {
        "interview_id": interview_id,
        "mode": mode,
        "total_questions": sum(
            len(saved_questions[category])
            for category in ("technical", "hr", "project")
        ),
        **saved_questions
    }

