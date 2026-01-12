from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def is_password_hashed(password: str) -> bool:
    """Check if a password string appears to be a bcrypt hash."""
    # Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters
    return (
        password is not None 
        and len(password) == 60 
        and password.startswith(('$2a$', '$2b$', '$2y$'))
    )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash.
    
    SECURITY NOTE: This function includes backward compatibility for legacy 
    plain-text passwords. In production, all passwords should be hashed.
    """
    if not plain_password or not hashed_password:
        return False
    
    # Check if the stored password is properly hashed
    if is_password_hashed(hashed_password):
        # Proper bcrypt verification
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            return False
    else:
        # LEGACY: Plain text password comparison
        # Log warning for security audit - this should be migrated
        if plain_password == hashed_password:
            logger.warning(
                "⚠️ SECURITY WARNING: Plain text password detected. "
                "Please migrate this user's password to bcrypt hash."
            )
            return True
        return False

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return username."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            print("WARNING: Token payload missing 'sub' field")
            return None
        return username
    except JWTError as e:
        print(f"JWT Error: {e}")
        return None