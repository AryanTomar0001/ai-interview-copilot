from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api.v1 import resume
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions.handlers import global_exception_handler
app = FastAPI(title="AI Interview Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_exception_handler(
    Exception,
    global_exception_handler
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
from app.api.v1 import speech
from app.api.v1 import evaluate
from app.api.v1 import questions
from app.api.v1 import jobmatch

app.include_router(questions.router)
app.include_router(speech.router)

app.include_router(evaluate.router)

import os

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)