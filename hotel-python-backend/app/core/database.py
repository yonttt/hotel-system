from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import mysql.connector
import logging

logger = logging.getLogger(__name__)

engine = create_engine(settings.DATABASE_URL)
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
        # Parse DATABASE_URL to get connection parameters
        # Format: mysql+pymysql://user:password@host:port/database
        url = settings.DATABASE_URL
        if url.startswith('mysql+pymysql://'):
            url = url.replace('mysql+pymysql://', '')
        
        # Extract components
        if '@' in url:
            credentials, host_db = url.split('@', 1)
            if ':' in credentials:
                username, password = credentials.split(':', 1)
            else:
                username, password = credentials, ''
        else:
            username, password = 'root', ''
            host_db = url
            
        if '/' in host_db:
            host_port, database = host_db.split('/', 1)
        else:
            host_port, database = host_db, 'hotel_system'
            
        if ':' in host_port:
            host, port = host_port.split(':', 1)
            port = int(port)
        else:
            host, port = host_port, 3306
        
        # Create connection
        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database=database,
            charset='utf8mb4',
            autocommit=False
        )
        
        return connection
        
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        # Fallback to default connection
        try:
            connection = mysql.connector.connect(
                host='localhost',
                port=3306,
                user='system',
                password='yont29921',
                database='hotel_system',
                charset='utf8mb4',
                autocommit=False
            )
            return connection
        except Exception as fallback_error:
            logger.error(f"Fallback connection failed: {str(fallback_error)}")
            raise fallback_error