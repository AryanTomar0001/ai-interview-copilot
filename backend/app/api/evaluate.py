from fastapi import APIRouter, UploadFile, File, Form
import tempfile
import os

from app.services.speech_service import speech_to_text
from app.services.scoring_service import evaluate_answer
from app.services.feedback_service import generate_feedback
from app.store.session_store import INTERVIEW_SESSION

router = APIRouter(prefix="/evaluate", tags=["Evaluation"])

# 🔥 ideally DB se aana chahiye
from app.utils.data_loader import QUESTION_DB


@router.post("/")
async def evaluate_answer_api(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    try:
        # =========================
        # 🎤 STEP 1: Speech → Text
        # =========================
        audio_bytes = await file.read()

        transcript = speech_to_text(audio_bytes)  # ✅ DIRECT BYTES

        # =========================
        # 🧠 VALIDATION
        # =========================
        if not transcript or not transcript.strip():
            return {"error": "Speech not recognized"}

        # =========================
        # 📚 Expected Answer
        # =========================
        data = INTERVIEW_SESSION.get(question)

        if not data:
            return {"error": "Question not found in session"}

        expected_answer = data["expected_answer"]
        # category = data["category"]
        # difficulty = data["difficulty"]
        # topic = data["topic"]

        # =========================
        # 🧠 ML Scoring
        # =========================
        score_data = evaluate_answer(
            question=question,
            answer=transcript,
            expected_answer=expected_answer
        )

        # =========================
        # 🤖 LLM Feedback
        # =========================
        feedback = generate_feedback(
            question=question,
            answer=transcript,
            expected_answer=expected_answer,
            score=score_data.get("score", 0)
        )

        return {
            "question": question,
            "transcript": transcript,
            "evaluation": score_data,
            "feedback": feedback
        }

    except Exception as e:
        return {
            "error": "Evaluation failed",
            "details": str(e)
        }