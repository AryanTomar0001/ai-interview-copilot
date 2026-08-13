from app.rag.qdrant_service import QdrantService
from app.rag.embeddings import get_embeddings, get_embedding


qdrant = QdrantService()

user_id = "test-user-123"

chunks = [
    "I developed an AI Interview Copilot using React and FastAPI.",
    "The project uses Qdrant for vector search and RAG.",
    "I implemented JWT authentication using Express.js."
]

embeddings = get_embeddings(chunks)

qdrant.upload_vectors(
    user_id=user_id,
    chunks=chunks,
    embeddings=embeddings
)

query = "What AI project did the candidate develop?"

query_embedding = get_embedding(query)

results = qdrant.search_vectors(
    user_id=user_id,
    query_embedding=query_embedding,
    limit=2
)

print("\nRetrieved chunks:")
for result in results:
    print("-", result)