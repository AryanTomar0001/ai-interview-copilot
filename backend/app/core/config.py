from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str

    MONGODB_URL: str

    DATABASE_NAME: str = "ai_interview"

    class Config:
        env_file = ".env"


settings = Settings()



