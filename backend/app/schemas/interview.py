from typing import Literal

from pydantic import BaseModel, Field


class InterviewConfig(BaseModel):
    mode: Literal[
        "technical",
        "project",
        "hr",
        "combined"
    ]

    difficulty: Literal[
        "easy",
        "medium",
        "hard",
        "mixed"
    ] = "mixed"

    question_count: int = Field(
        default=10,
        ge=1,
        le=20
    )