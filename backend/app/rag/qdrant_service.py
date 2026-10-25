
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
    PayloadSchemaType,
)

from app.core.config import settings
from app.rag.chunking import infer_section
from app.rag.embeddings import VECTOR_SIZE


class QdrantService:

    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.collection_name = settings.QDRANT_COLLECTION

    def create_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=VECTOR_SIZE,
                    distance=Distance.COSINE
                )
            )

        # Also create missing indexes when the collection
        # already exists.
        info = self.client.get_collection(self.collection_name)
        payload_schema = info.payload_schema or {}

        for field in ("user_id", "resume_id", "section"):
            if field not in payload_schema:
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name=field,
                    field_schema=PayloadSchemaType.KEYWORD
                )

    @staticmethod
    def _vector_to_list(vector):
        if hasattr(vector, "tolist"):
            vector = vector.tolist()
        return [float(value) for value in vector]

    def upload_vectors(
        self,
        user_id: str,
        resume_id: str,
        chunks: list[str],
        embeddings: list[list[float]]
    ):
        if len(chunks) != len(embeddings):
            raise ValueError(
                "Number of chunks and embeddings must match"
            )

        if not chunks:
            raise ValueError("No chunks available for indexing")

        points = []

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):
            if len(embedding) != VECTOR_SIZE:
                raise ValueError(
                    f"Expected {VECTOR_SIZE}-dimensional vector"
                )

            points.append(
                PointStruct(
                    id=str(uuid4()),
                    vector=self._vector_to_list(embedding),
                    payload={
                        "user_id": user_id,
                        "resume_id": resume_id,
                        "chunk": chunk,
                        "chunk_index": index,
                        "section": infer_section(chunk),
                    }
                )
            )

        # Wait for insertion to finish.
        self.client.upsert(
            collection_name=self.collection_name,
            points=points,
            wait=True
        )

    def search_vectors(
        self,
        user_id: str,
        query_embedding,
        limit: int = 5
    ) -> list[dict]:
        if limit <= 0:
            raise ValueError("limit must be positive")

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=self._vector_to_list(query_embedding),
            limit=limit,
            with_payload=True,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                    )
                ]
            )
        )

        matches = []

        for point in results.points:
            payload = point.payload or {}
            chunk = payload.get("chunk")

            if not chunk:
                continue

            matches.append({
                "chunk": chunk,
                "section": payload.get("section", "other"),
                "chunk_index": payload.get("chunk_index"),
                "resume_id": payload.get("resume_id"),
                "score": float(point.score or 0.0)
            })

        return matches

    def delete_user_vectors(
        self,
        user_id: str,
        keep_resume_id: str | None = None
    ):
        filters = [
            FieldCondition(
                key="user_id",
                match=MatchValue(value=user_id)
            )
        ]

        delete_filter = Filter(must=filters)

        if keep_resume_id is not None:
            delete_filter = Filter(
                must=filters,
                must_not=[
                    FieldCondition(
                        key="resume_id",
                        match=MatchValue(value=keep_resume_id)
                    )
                ]
            )

        self.client.delete(
            collection_name=self.collection_name,
            points_selector=FilterSelector(
                filter=delete_filter
            ),
            wait=True
        )

    def recreate_user_vectors(
        self,
        user_id: str,
        resume_id: str,
        chunks: list[str],
        embeddings: list[list[float]]
    ):
        # Upload first. If this fails, previous vectors remain.
        self.upload_vectors(
            user_id=user_id,
            resume_id=resume_id,
            chunks=chunks,
            embeddings=embeddings
        )

        # Only after successful upload, remove older vectors.
        self.delete_user_vectors(
            user_id=user_id,
            keep_resume_id=resume_id
        )


qdrant_service = QdrantService()
