from fastapi import APIRouter
from app.services.rag_service import generate_questions_from_resume
from fastapi import Depends

from app.security.dependencies import get_current_user
router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/generate")
async def generate_questions(current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    result = await generate_questions_from_resume(user_id)
    return result