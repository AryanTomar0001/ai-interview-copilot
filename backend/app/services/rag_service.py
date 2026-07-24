from app.rag.chunking import chunk_text
from app.rag.embeddings import get_embeddings
from app.rag.retriever import VectorStore
vector_store = None

def process_resume(text):
    global vector_store
    
    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks)

    dimension = len(embeddings[0])
    vector_store = VectorStore(dimension)

    vector_store.add(embeddings, chunks)

    return "Resume processed successfully"


def retrieve_context(query):
    global vector_store

    if vector_store is None:
        return ["No resume data found. Please upload resume first."]

    query_embedding = get_embeddings([query])[0]
    results = vector_store.search(query_embedding)
    
    return "\n\n".join(results)


from app.services.llm_service import llm_service

from app.repositories.interview_repository import InterviewRepository

async def generate_questions_from_resume(
    user_id:str,
    query: str ="Generate interview questions",
):
    repository = InterviewRepository()

    context = retrieve_context("candidate resume skills projects")
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