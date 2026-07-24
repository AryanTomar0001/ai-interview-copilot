from pydantic import BaseModel
from datetime import datetime


class Interview(BaseModel):
    question: str
    expected_answer: str
    category: str
    difficulty: str
    topic: str
    created_at: datetime = datetime.utcnow()