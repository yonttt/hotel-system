from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings
import logging
import mysql.connector
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

_parsed_db_url = urlparse(settings.DATABASE_URL)

# Create SQLAlchemy Engine (local MySQL — plaintext connection, no SSL needed).
# pool_pre_ping recycles dead connections so the app survives MySQL idle timeouts.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_payment_columns():
    """Idempotently add Midtrans columns to hotel_reservations.

    SQLAlchemy's create_all() only creates missing tables, never adds columns
    to existing ones, so we add them here via information_schema checks.
    """
    from sqlalchemy import text
    columns = {
        "midtrans_order_id": "VARCHAR(100) NULL",
        "midtrans_payment_status": "VARCHAR(30) NULL",
        "midtrans_snap_token": "VARCHAR(255) NULL",
    }
    try:
        with engine.begin() as conn:
            for name, ddl in columns.items():
                exists = conn.execute(text(
                    """
                    SELECT COUNT(*) FROM information_schema.columns
                    WHERE table_schema = DATABASE()
                      AND table_name = 'hotel_reservations'
                      AND column_name = :col
                    """
                ), {"col": name}).scalar()
                if not exists:
                    conn.execute(text(
                        f"ALTER TABLE hotel_reservations ADD COLUMN {name} {ddl}"
                    ))
                    logger.info(f"Added column hotel_reservations.{name}")
    except Exception as e:
        logger.error(f"ensure_payment_columns failed: {e}")

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
        )
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise e
