from fastapi import APIRouter, UploadFile, File
from app.services.speech_service import speech_to_text

router = APIRouter(prefix="/speech", tags=["Speech"])

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    text = speech_to_text(audio_bytes)

    return {
        "transcript": text
    }