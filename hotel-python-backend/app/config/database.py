from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings
import logging
import os
import mysql.connector
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# TiDB Cloud (and most managed MySQL hosts) reject plaintext connections, so we
# need to present a CA to negotiate TLS. Local/dev MySQL has no such cert chain,
# so SSL is only enabled when connecting to a non-local host.
_CA_CERT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "isrgrootx1.pem")

def _ssl_connect_args(hostname):
    if hostname in (None, "localhost", "127.0.0.1") or not os.path.exists(_CA_CERT_PATH):
        return {}
    return {"ssl_ca": _CA_CERT_PATH, "ssl_verify_cert": True, "ssl_verify_identity": True}

_parsed_db_url = urlparse(settings.DATABASE_URL)

# Create SQLAlchemy Engine
engine = create_engine(settings.DATABASE_URL, connect_args=_ssl_connect_args(_parsed_db_url.hostname))

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
        url = settings.DATABASE_URL
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
            autocommit=False,
            **_ssl_connect_args(parsed.hostname)
        )
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise e