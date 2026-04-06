from fastapi import APIRouter
from app.services.rag_service import generate_questions_from_resume

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/generate")
def generate_questions():
    result = generate_questions_from_resume()
    return result