from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Interview(BaseModel):
    user_id: str
    question: str
    expected_answer: str
    category: str
    difficulty: str
    topic: str
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)