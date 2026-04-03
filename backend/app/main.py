from fastapi import FastAPI
from app.api import resume

app = FastAPI(title="AI Interview Copilot")

# Include routes
app.include_router(resume.router)

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}