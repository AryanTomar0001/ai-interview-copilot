from qdrant_client import QdrantClient
from app.core.config import settings

print("URL:", settings.QDRANT_URL)
print("API KEY EXISTS:", bool(settings.QDRANT_API_KEY))

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)

try:
    result = client.get_collections()
    print("SUCCESS")
    print(result)

except Exception as e:
    print("ERROR:", type(e).__name__)
    print(e)