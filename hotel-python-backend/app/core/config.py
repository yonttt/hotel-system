import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Database settings - loaded from environment variable
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://system:yont29921@localhost/hotel_system")
    
    # JWT settings - loaded from environment variable
    SECRET_KEY: str = os.getenv("SECRET_KEY", "hotel-management-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))  # 8 hours
    
    # API settings
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Hotel Management System")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()