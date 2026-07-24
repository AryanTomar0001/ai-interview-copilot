from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text_from_pdf
from app.services.rag_service import process_resume
from app.repositories.resume_repository import ResumeRepository
from fastapi import Depends

from app.security.dependencies import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume"])



@router.post("/upload")
async def upload_resume(file: UploadFile = File(...),current_user=Depends(get_current_user)):
    user_id = current_user["id"]
    print(user_id)
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    repository = ResumeRepository()

    await repository.create({

    "user_id": user_id,

    "filename": file.filename,

    "text": text

    })
    process_resume(text)
    return {
        "message": "Resume uploaded & processed",
        "preview": text[:300]
    }