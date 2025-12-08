import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database settings (same as current PHP system)
    DATABASE_URL: str = "mysql+pymysql://system:yont29921@localhost/hotel_system"
    
    # JWT settings
    SECRET_KEY: str = "hotel-management-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Hotel Management System"
    
    class Config:
        case_sensitive = True

settings = Settings()