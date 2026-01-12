from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.auth import get_current_user, get_current_admin_user
from app.core.security_middleware import record_failed_login, clear_failed_logins, limiter
from app.models import User
from app.schemas import UserCreate, UserResponse, UserUpdate, Token
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/login", response_model=Token)
@limiter.limit("10/minute")  # Rate limit: 10 login attempts per minute
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login endpoint that returns JWT token."""
    client_ip = request.client.host if request.client else "unknown"
    
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password):
        # Record failed attempt
        record_failed_login(client_ip)
        logger.warning(f"Failed login attempt for user '{form_data.username}' from IP: {client_ip}")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Clear failed attempts on successful login
    clear_failed_logins(client_ip)
    
    # Update last login
    user.last_login = datetime.now()
    db.commit()
    
    logger.info(f"Successful login for user '{form_data.username}' from IP: {client_ip}")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Register a new user (admin only)."""
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    
    # Determine account type based on role
    account_type = "Management" if user.role in ["admin", "manager"] else "Non Management"
    
    # Set title based on role if not provided
    title = user.title
    if not title:
        title_map = {
            "admin": "Admin Hotel",
            "manager": "Finance Hotel",
            "frontoffice": "Operational Front Office",
            "housekeeping": "Leader Housekeeping",
            "staff": "Staff"
        }
        title = title_map.get(user.role, user.role)
    
    db_user = User(
        username=user.username,
        email=user.email,
        role=user.role,
        password=hashed_password,
        full_name=user.full_name or user.username.upper(),
        title=title,
        hotel_name=user.hotel_name or "HOTEL NEW IDOLA",
        account_type=account_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    if user_update.username and user_update.username != current_user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
        current_user.username = user_update.username
    
    if user_update.email:
        current_user.email = user_update.email
    
    if user_update.password:
        current_user.password = get_password_hash(user_update.password)
    
    # Only admin can change roles
    if user_update.role and current_user.role == "admin":
        current_user.role = user_update.role
    
    db.commit()
    db.refresh(current_user)
    return current_user