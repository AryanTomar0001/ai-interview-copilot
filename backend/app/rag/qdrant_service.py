from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    FilterSelector,
)
from app.core.config import settings

class QdrantService:

    def __init__(self):
        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT
        )

        self.collection_name = settings.QDRANT_COLLECTION

    def create_collection(self):
        """
        Create collection only if it doesn't already exist.
        """

        if self.client.collection_exists(self.collection_name):
            print(f"Collection '{self.collection_name}' already exists.")
            return

        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

        print(f"Collection '{self.collection_name}' created successfully.")


    def upload_vectors(
        self,
        user_id: str,
        chunks: list[str],
        embeddings
    ):
        """
        Store resume embeddings in Qdrant.
        """

        points = []

        for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):

            points.append(
                PointStruct(
                    id=str(uuid4()),
                    vector=embedding.tolist(),
                    payload={
                        "user_id": user_id,
                        "chunk": chunk,
                        "chunk_index": index,
                    }
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )



    def search_vectors(
        self,
        user_id: str,
        query_embedding,
        limit: int = 5
    ):

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding.tolist(),
            limit=limit,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                    )
                ]
            )
        )

        return [
            point.payload["chunk"]
            for point in results.points
        ]


    def delete_user_vectors(self, user_id: str):
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=FilterSelector(
                filter=Filter(
                    must=[
                        FieldCondition(
                            key="user_id",
                            match=MatchValue(value=user_id),
                        )
                    ]
                )
            ),
        )



    def recreate_user_vectors(
        self,
        user_id,
        chunks,
        embeddings
    ):

        self.delete_user_vectors(user_id)

        self.upload_vectors(
            user_id,
            chunks,
            embeddings
        )


qdrant_service = QdrantService()


if __name__ == "__main__":
    qdrant_service.create_collection()

    print(
        qdrant_service.client.get_collections()
    )