
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.security.dependencies import get_current_user
from app.services.rag_service import generate_questions_from_resume
from app.repositories.resume_repository import ResumeRepository

router = APIRouter(prefix="/questions", tags=["Questions"])

InterviewMode = Literal["technical", "project", "hr", "combined"]


class GenerateQuestionsRequest(BaseModel):
    mode: Optional[InterviewMode] = None
    total_questions: Optional[int] = Field(default=None, ge=1, le=20)

    # Explicit category counts are optional.
    technical_count: Optional[int] = Field(default=None, ge=0, le=20)
    hr_count: Optional[int] = Field(default=None, ge=0, le=20)
    project_count: Optional[int] = Field(default=None, ge=0, le=20)


def calculate_counts(mode: str, total: int) -> dict:
    """Return category counts whose sum equals total."""

    if not 1 <= total <= 20:
        raise HTTPException(
            status_code=422,
            detail="total_questions must be between 1 and 20."
        )

    if mode == "technical":
        return {
            "technical_count": total,
            "hr_count": 0,
            "project_count": 0
        }

    if mode == "hr":
        return {
            "technical_count": 0,
            "hr_count": total,
            "project_count": 0
        }

    if mode == "project":
        return {
            "technical_count": 0,
            "hr_count": 0,
            "project_count": total
        }

    # Combined: approximately 50% technical, 30% project,
    # and the remainder HR, with an exact total.
    technical = round(total * 0.5)
    project = round(total * 0.3)
    hr = total - technical - project

    return {
        "technical_count": technical,
        "hr_count": hr,
        "project_count": project
    }


@router.post("/generate")
async def generate_questions(
    request: Optional[GenerateQuestionsRequest] = None,
    current_user=Depends(get_current_user)
):
    user_id = current_user["id"]

    # 1. Load saved resume preferences.
    resume_repo = ResumeRepository()
    resume = await resume_repo.get_latest_by_user(user_id)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume found. Please upload a resume first."
        )

    # 2. Use saved preferences unless the request overrides them.
    mode = (
        request.mode if request and request.mode
        else resume.get("interview_type", "combined")
    )

    total = (
        request.total_questions
        if request and request.total_questions is not None
        else resume.get("total_questions", 10)
    )

    if mode not in ("technical", "project", "hr", "combined"):
        raise HTTPException(
            status_code=422,
            detail="Invalid interview mode."
        )

    # 3. Calculate default counts or validate explicit counts.
    count_fields = ("technical_count", "hr_count", "project_count")

    has_explicit_counts = (
        request is not None
        and any(
            getattr(request, field) is not None
            for field in count_fields
        )
    )

    if has_explicit_counts:
        counts = {
            "technical_count": request.technical_count or 0,
            "hr_count": request.hr_count or 0,
            "project_count": request.project_count or 0
        }

        # For explicit category counts, the sum is authoritative.
        total = sum(counts.values())

        if not 1 <= total <= 20:
            raise HTTPException(
                status_code=422,
                detail="The sum of category counts must be between 1 and 20."
            )

        expected_category = {
            "technical": "technical_count",
            "hr": "hr_count",
            "project": "project_count"
        }

        if mode != "combined":
            selected_field = expected_category[mode]

            if counts[selected_field] != total or any(
                count != 0
                for field, count in counts.items()
                if field != selected_field
            ):
                raise HTTPException(
                    status_code=422,
                    detail=(
                        f"For mode '{mode}', all questions must belong "
                        "to that category."
                    )
                )
    else:
        counts = calculate_counts(mode, total)

    # 4. Generate and persist the questions using the existing RAG service.
    result = await generate_questions_from_resume(
        user_id=user_id,
        mode=mode,
        **counts
    )

    return {
        **result,
        "mode": mode,
        "total_questions": total,
        "question_counts": counts
    }
