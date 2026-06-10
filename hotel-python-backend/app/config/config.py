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
    # TiDB settings - loaded from environment variable
    TIDB_HOST: str | None = os.getenv("TIDB_HOST")
    TIDB_PORT: int | None = int(os.getenv("TIDB_PORT")) if os.getenv("TIDB_PORT") else 4000
    TIDB_USER: str | None = os.getenv("TIDB_USER")
    TIDB_PASSWORD: str | None = os.getenv("TIDB_PASSWORD")
    TIDB_DB_NAME: str | None = os.getenv("TIDB_DB_NAME")

    # Local MySQL settings - loaded from environment variable
    MYSQL_HOST: str | None = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int | None = int(os.getenv("MYSQL_PORT")) if os.getenv("MYSQL_PORT") else 3306
    MYSQL_USER: str | None = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str | None = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB_NAME: str | None = os.getenv("MYSQL_DB_NAME", "hotel_analytics")

    # Database settings - loaded from environment variable
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://user:password@localhost/hotel_system")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # If TiDB is configured, override the DATABASE_URL
        if self.TIDB_HOST and self.TIDB_USER and self.TIDB_DB_NAME:
            port = self.TIDB_PORT or 4000
            pwd = self.TIDB_PASSWORD or ""
            # TiDB Serverless requires ssl_verify_cert and ssl_verify_identity
            self.DATABASE_URL = f"mysql+pymysql://{self.TIDB_USER}:{pwd}@{self.TIDB_HOST}:{port}/{self.TIDB_DB_NAME}?ssl_verify_cert=true&ssl_verify_identity=true"
    
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

    # Email & Notification Settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_TITLE: str = os.getenv("SMTP_TITLE", "Eva Group Hotel")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "yonathantambani109@gmail.com")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()