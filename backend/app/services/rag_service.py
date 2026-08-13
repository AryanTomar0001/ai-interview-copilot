from app.rag.chunking import chunk_text
from app.rag.embeddings import get_embeddings
from app.rag.qdrant_service import qdrant_service

from app.services.llm_service import llm_service
from app.repositories.interview_repository import InterviewRepository

def process_resume(user_id: str, text: str):

    chunks = chunk_text(text)

    embeddings = get_embeddings(chunks)

    qdrant_service.recreate_user_vectors(
        user_id=user_id,
        chunks=chunks,
        embeddings=embeddings
    )

    return "Resume processed successfully"


def retrieve_context(
    user_id: str,
    query: str
):

    query_embedding = get_embeddings([query])[0]

    results = qdrant_service.search_vectors(
        user_id=user_id,
        query_embedding=query_embedding
    )

    return "\n\n".join(results)


from app.services.llm_service import llm_service

from app.repositories.interview_repository import InterviewRepository

async def generate_questions_from_resume(
    user_id:str,
    query: str ="Generate interview questions",
):
    repository = InterviewRepository()

    context = retrieve_context(
    user_id=user_id,
    query="candidate resume skills projects"
)
    if isinstance(context, list):
        context = " ".join(context)

    result = llm_service.generate_questions(context)

    for category in ["technical", "hr", "project"]:
        for q in result.get(category, []):
            await repository.create({
                "user_id": user_id,
                "question": q["question"],
                "expected_answer": q.get("expected_answer", ""),
                "difficulty": q.get("difficulty", ""),
                "topic": q.get("topic", ""),
                "category": category
            })

    return result