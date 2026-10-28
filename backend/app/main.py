
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from app.rag.qdrant_service import qdrant_service
from app.exceptions.handlers import global_exception_handler

from app.api.v1 import (
    resume,
    speech,
    evaluate,
    questions,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Qdrant before accepting API requests.
    await run_in_threadpool(
        qdrant_service.create_collection
    )

    yield


app = FastAPI(
    title="AI Interview Copilot",
    lifespan=lifespan,
)

# Replace/add origins according to your actual frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(
    Exception,
    global_exception_handler
)

app.include_router(resume.router)
app.include_router(speech.router)
app.include_router(evaluate.router)
app.include_router(questions.router)


@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 10000))

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
    )
