
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends
)
from starlette.concurrency import run_in_threadpool
import traceback

from app.services.speech_service import speech_to_text
from app.services.llm_service import llm_service
from app.schemas.evaluation import EvaluationResponse
from app.repositories.interview_repository import InterviewRepository
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/evaluate", tags=["Evaluation"])


@router.post("/", response_model=EvaluationResponse)
async def evaluate_answer_api(
    file: UploadFile = File(...),
    question_id: str = Form(...),
    current_user=Depends(get_current_user)
):
    try:
        audio_bytes = await file.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty"
            )

        user_id = current_user["id"]

        transcript = await run_in_threadpool(
            speech_to_text,
            audio_bytes
        )

        if not transcript or not transcript.strip():
            raise HTTPException(
                status_code=400,
                detail="Speech not recognized"
            )

        repository = InterviewRepository()

        # Retrieve the exact question belonging to this user.
        data = await repository.get_by_id(
            question_id=question_id,
            user_id=user_id
        )

        if not data:
            raise HTTPException(
                status_code=404,
                detail="Question not found for this user"
            )

        question = data["question"]
        expected_answer = data.get("expected_answer", "")
        category = data.get("category", "").lower()

        try:
            if category == "technical":
                evaluator = llm_service.evaluate_technical_answer
            elif category == "project":
                evaluator = llm_service.evaluate_project_answer
            elif category == "hr":
                evaluator = llm_service.evaluate_hr_answer
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid question category"
                )

            result = await run_in_threadpool(
                evaluator,
                question,
                transcript,
                expected_answer
            )

        except HTTPException:
            raise
        except Exception as exc:
            traceback.print_exc()
            raise HTTPException(
                status_code=502,
                detail="AI evaluation failed. Please try again."
            ) from exc

        evaluation = {
            "score": result["score"],
            "strengths": result.get("strengths", []),
            "missing": result.get("missing", []),
            "incorrect_claims": result.get("incorrect_claims", []),
            "improvements": result.get("improvements", []),
            "ideal_answer": result.get("ideal_answer", ""),
            "overall_feedback": result.get("overall_feedback", "")
        }

        # Save evaluation to the exact question document.
        saved = await repository.save_evaluation(
            question_id=question_id,
            user_id=user_id,
            evaluation=evaluation,
            transcript=transcript
        )

        if not saved or saved.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Question not found while saving evaluation"
            )

        return EvaluationResponse(
            question=question,
            transcript=transcript,
            evaluation=evaluation
        )

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="An unexpected evaluation error occurred"
        )
