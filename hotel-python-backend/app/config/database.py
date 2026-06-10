from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings
import logging
import mysql.connector
from urllib.parse import urlparse
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)


# Parse DATABASE_URL for potential SSL configuration
parsed_url = urlparse(settings.DATABASE_URL)
query_params = parse_qs(parsed_url.query)

connect_args = {}
ssl_ca_path = None

if 'ssl_ca' in query_params:
    ssl_ca_path = query_params['ssl_ca'][0]
    connect_args["ssl"] = {"ca": ssl_ca_path} # For pymysql via SQLAlchemy
    # Clean the URL for SQLAlchemy so it doesn't get confused by the custom query param
    clean_url = settings.DATABASE_URL.split('?')[0]
else:
    clean_url = settings.DATABASE_URL

# Create SQLAlchemy Engine
engine = create_engine(clean_url, connect_args=connect_args)

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
        # This function now parses the DATABASE_URL from your environment settings.
        # Replace mysql+pymysql:// with mysql:// for mysql.connector
        url = clean_url
        if url.startswith("mysql+pymysql://"):
            url = url.replace("mysql+pymysql://", "mysql://")
            
        parsed = urlparse(url)
        
        conn_params = {
            "host": parsed.hostname,
            "port": parsed.port or 4000, # Use default TiDB port if not specified
            "user": parsed.username or 'root',
            "password": parsed.password or '',
            "database": parsed.path.lstrip('/') or 'test',
            "charset": 'utf8mb4',
            "autocommit": False
        }
        
        # Add SSL params for mysql.connector if CA cert is provided
        if ssl_ca_path:
            conn_params["ssl_ca"] = ssl_ca_path
            conn_params["ssl_verify_cert"] = True
            
        return mysql.connector.connect(**conn_params)
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise e