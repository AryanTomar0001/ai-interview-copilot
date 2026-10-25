
from typing import Literal

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from starlette.concurrency import run_in_threadpool

from app.utils.pdf_parser import extract_text_from_pdf
from app.services.rag_service import process_resume
from app.repositories.resume_repository import ResumeRepository
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume"])

InterviewType = Literal["technical", "project", "hr", "combined"]


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    interview_type: InterviewType = Form("combined"),
    total_questions: int = Form(10, ge=1, le=20),
    current_user=Depends(get_current_user)
):
    user_id = current_user["id"]

    # 1. Validate the uploaded file.
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume."
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # 2. Extract and validate the resume before changing saved data.
    try:
        text = await run_in_threadpool(
            extract_text_from_pdf,
            contents
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Could not read this PDF. Please upload a valid resume."
        ) from exc

    if not text or not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found. Please upload a text-based PDF."
        )

    # 3. Process the resume into Qdrant.
    try:
        processing_result = await run_in_threadpool(
            process_resume,
            user_id,
            text
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Resume processing failed. Please try again."
        ) from exc

    # 4. Save the new resume and its preferences.
    repository = ResumeRepository()

    try:
        await repository.delete_by_user_id(user_id)

        await repository.create({
            "user_id": user_id,
            "filename": file.filename,
            "text": text,
            "interview_type": interview_type,
            "total_questions": total_questions,
            "resume_id": processing_result["resume_id"]
        })
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Resume processing completed, but saving resume "
                "metadata failed. Please retry or contact support."
            )
        ) from exc

    return {
        "message": "Resume uploaded and processed successfully.",
        "filename": file.filename,
        "resume_id": processing_result["resume_id"],
        "interview_type": interview_type,
        "total_questions": total_questions,
        "chunks_processed": processing_result["chunks_processed"],
        "preview": text[:300]
    }
