from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings
import logging
import mysql.connector
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Hardcoded local database URL to guarantee connection to your phpMyAdmin
LOCAL_DATABASE_URL = "mysql+pymysql://system:yont29921@localhost/hotel_system"

# Create SQLAlchemy Engine
engine = create_engine(LOCAL_DATABASE_URL)

# Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_connection():
    """Get direct MySQL connection for raw queries"""
    try:
        url = LOCAL_DATABASE_URL
        if url.startswith("mysql+pymysql://"):
            url = url.replace("mysql+pymysql://", "mysql://")
            
        parsed = urlparse(url)
        
        return mysql.connector.connect(
            host=parsed.hostname or 'localhost',
            port=parsed.port or 3306,
            user=parsed.username or 'root',
            password=parsed.password or '',
            database=parsed.path.lstrip('/') or 'hotel_system',
            charset='utf8mb4',
            autocommit=False
        )
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise e