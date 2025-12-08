from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from pydantic import BaseModel
from ..core.database import get_db
from ..core.auth import get_current_user
from ..models import User

router = APIRouter()

# ============================================================================
# RESPONSE MODELS
# ============================================================================

class HotelResponse(BaseModel):
    id: int
    code: str
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    active: bool = True

class RoomStatusResponse(BaseModel):
    id: int
    code: str
    name: str
    color: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0
    active: bool = True

class IdCardTypeResponse(BaseModel):
    id: int
    code: str
    name: str
    active: bool = True

class GuestTitleResponse(BaseModel):
    id: int
    code: str
    name: str
    active: bool = True

class GuestTypeResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    active: bool = True

# ============================================================================
# HOTELS API
# ============================================================================

@router.get("/hotels", response_model=List[HotelResponse])
def get_hotels(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all hotels."""
    try:
        query = "SELECT id, code, name, address, phone, email, active FROM hotels"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY name"
        
        result = db.execute(text(query))
        hotels = []
        for row in result:
            hotels.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "address": row[3],
                "phone": row[4],
                "email": row[5],
                "active": bool(row[6])
            })
        return hotels
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ============================================================================
# ROOM STATUSES API
# ============================================================================

@router.get("/room-statuses", response_model=List[RoomStatusResponse])
def get_room_statuses(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all room statuses."""
    try:
        query = "SELECT id, code, name, color, description, sort_order, active FROM room_statuses"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY sort_order"
        
        result = db.execute(text(query))
        statuses = []
        for row in result:
            statuses.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "color": row[3],
                "description": row[4],
                "sort_order": row[5],
                "active": bool(row[6])
            })
        return statuses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ============================================================================
# ID CARD TYPES API
# ============================================================================

@router.get("/id-card-types", response_model=List[IdCardTypeResponse])
def get_id_card_types(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all ID card types."""
    try:
        query = "SELECT id, code, name, active FROM id_card_types"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY id"
        
        result = db.execute(text(query))
        types = []
        for row in result:
            types.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "active": bool(row[3])
            })
        return types
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ============================================================================
# GUEST TITLES API
# ============================================================================

@router.get("/guest-titles", response_model=List[GuestTitleResponse])
def get_guest_titles(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guest titles."""
    try:
        query = "SELECT id, code, name, active FROM guest_titles"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY id"
        
        result = db.execute(text(query))
        titles = []
        for row in result:
            titles.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "active": bool(row[3])
            })
        return titles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ============================================================================
# GUEST TYPES API
# ============================================================================

@router.get("/guest-types", response_model=List[GuestTypeResponse])
def get_guest_types(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guest types."""
    try:
        query = "SELECT id, code, name, description, active FROM guest_types"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY id"
        
        result = db.execute(text(query))
        types = []
        for row in result:
            types.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "description": row[3],
                "active": bool(row[4])
            })
        return types
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
