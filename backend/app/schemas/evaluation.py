
from pydantic import BaseModel, Field
from typing import List, Optional


class Evaluation(BaseModel):
    score: float
    strengths: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)
    incorrect_claims: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    ideal_answer: str = ""
    overall_feedback: str = ""


class EvaluationResponse(BaseModel):
    question: str
    transcript: str
    evaluation: Evaluation
