
from fastembed import TextEmbedding

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
VECTOR_SIZE = 384

# Load the embedding model once, not on every request.
model = TextEmbedding(model_name=MODEL_NAME)


def get_embeddings(chunks: list[str]) -> list[list[float]]:
    if not chunks:
        return []

    if not all(isinstance(chunk, str) and chunk.strip() for chunk in chunks):
        raise ValueError("Every embedding input must be non-empty text")

    vectors = list(model.embed(chunks))

    if len(vectors) != len(chunks):
        raise ValueError("Embedding count does not match input count")

    results = []

    for vector in vectors:
        if hasattr(vector, "tolist"):
            vector = vector.tolist()
        else:
            vector = list(vector)

        if len(vector) != VECTOR_SIZE:
            raise ValueError(
                f"Expected {VECTOR_SIZE} dimensions, got {len(vector)}"
            )

        results.append([float(value) for value in vector])

    return results


def get_embedding(text: str) -> list[float]:
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Embedding input must be non-empty text")

    return get_embeddings([text])[0]
