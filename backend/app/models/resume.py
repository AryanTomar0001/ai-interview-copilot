from pydantic import BaseModel
from datetime import datetime


class Resume(BaseModel):
    filename: str
    text: str
    uploaded_at: datetime = datetime.utcnow()