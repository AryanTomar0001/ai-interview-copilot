from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(chunks):
    return model.encode(chunks)



def get_embedding(text: str):
    return model.encode(text)