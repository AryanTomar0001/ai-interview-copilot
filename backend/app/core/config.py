from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str

    MONGODB_URL: str

    DATABASE_NAME: str = "ai_interview"

    JWT_SECRET: str

    JWT_ALGORITHM: str = "HS256"

    QDRANT_HOST: str

    QDRANT_PORT: int
    
    QDRANT_COLLECTION: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()