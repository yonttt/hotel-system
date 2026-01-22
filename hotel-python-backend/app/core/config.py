import os
import secrets
import logging
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)


def get_secret_key() -> str:
    """
    Get SECRET_KEY from environment or generate a secure one.
    IMPORTANT: In production, always set SECRET_KEY in .env file!
    """
    secret = os.getenv("SECRET_KEY")
    
    # Check if SECRET_KEY is set and not a weak default
    weak_defaults = [
        "hotel-management-secret-key-change-in-production",
        "secret",
        "changeme",
        ""
    ]
    
    if not secret or secret in weak_defaults:
        logger.warning(
            "⚠️ SECURITY WARNING: SECRET_KEY not properly configured. "
            "Please set a strong SECRET_KEY in your .env file!"
        )
        # Generate a temporary secure key (will change on restart)
        secret = secrets.token_urlsafe(64)
    
    return secret


class Settings(BaseSettings):
    # Database settings - loaded from environment variable
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://user:password@localhost/hotel_system")
    
    # JWT settings - loaded from environment variable
    SECRET_KEY: str = get_secret_key()
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))  # 8 hours
    
    # API settings
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Hotel Management System")
    
    # Security settings
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "200"))
    LOGIN_ATTEMPT_LIMIT: int = int(os.getenv("LOGIN_ATTEMPT_LIMIT", "5"))
    LOGIN_LOCKOUT_MINUTES: int = int(os.getenv("LOGIN_LOCKOUT_MINUTES", "15"))
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()