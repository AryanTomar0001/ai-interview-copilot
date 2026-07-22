from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text_from_pdf
from app.services.rag_service import process_resume
router = APIRouter(prefix="/resume", tags=["Resume"])



@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    process_resume(text)  # 🔥 ADD THIS
    return {
        "message": "Resume uploaded & processed",
        "preview": text[:300]
    }