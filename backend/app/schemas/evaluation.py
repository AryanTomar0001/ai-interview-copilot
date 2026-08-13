from pydantic import BaseModel
from typing import List


class Evaluation(BaseModel):
    score: float
    confidence: float
    method: str


class Feedback(BaseModel):
    missing: List[str]
    improvements: List[str]
    ideal_answer: str


class EvaluationResponse(BaseModel):
    question: str
    transcript: str
    evaluation: Evaluation
    feedback: Feedback