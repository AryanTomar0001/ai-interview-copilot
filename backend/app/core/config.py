from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    GROQ_API_KEY: str

    MONGODB_URL: str
    DATABASE_NAME: str = "ai_interview"

    JWT_SECRET: str
    JWT_EXPIRE: str = "7d"
    JWT_ALGORITHM: str = "HS256"

    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION: str = "resume_chunks"

    class Config:
        env_file = ".env"


settings = Settings()