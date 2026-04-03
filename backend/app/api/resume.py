from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text_from_pdf

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    
    text = extract_text_from_pdf(contents)

    return {
        "filename": file.filename,
        "text_preview": text[:500]  # first 500 chars
    }