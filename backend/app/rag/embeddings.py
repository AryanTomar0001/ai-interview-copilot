# from sentence_transformers import SentenceTransformer

# model = SentenceTransformer('all-MiniLM-L6-v2')

# def get_embeddings(chunks):
#     return model.encode(chunks)

# def get_embedding(text: str):
#     return model.encode(text)
from fastembed import TextEmbedding

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

model = TextEmbedding(model_name=MODEL_NAME)


def get_embeddings(chunks):
    return list(model.embed(chunks))


def get_embedding(text: str):
    return list(model.embed([text]))[0]