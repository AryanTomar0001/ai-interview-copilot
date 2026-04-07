from fastapi import FastAPI
from app.api import resume
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="AI Interview Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(resume.router)

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}

# from app.services.rag_service import retrieve_context

# @app.get("/test-retrieval")
# def test():
#     result = retrieve_context("What are his skills?")
#     return {"result": result}

from app.api import questions
app.include_router(questions.router)

from app.api import speech
app.include_router(speech.router)

from app.api import evaluate
app.include_router(evaluate.router)

import os

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)