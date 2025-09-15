from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_manager_or_admin_user
from app.models import User, Guest
from app.schemas import GuestCreate, GuestResponse, GuestUpdate

router = APIRouter()

@router.post("/", response_model=GuestResponse)
def create_guest(
    guest: GuestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new guest."""
    db_guest = Guest(**guest.dict())
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return db_guest

@router.get("/", response_model=List[GuestResponse])
def get_guests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guests with pagination."""
    guests = db.query(Guest).offset(skip).limit(limit).all()
    return guests

@router.get("/{guest_id}", response_model=GuestResponse)
def get_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific guest by ID."""
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest

@router.put("/{guest_id}", response_model=GuestResponse)
def update_guest(
    guest_id: int,
    guest_update: GuestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update guest information."""
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    update_data = guest_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(guest, field, value)
    
    db.commit()
    db.refresh(guest)
    return guest

@router.delete("/{guest_id}")
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a guest (manager/admin only)."""
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    db.delete(guest)
    db.commit()
    return {"message": "Guest deleted successfully"}

@router.get("/search/{query}", response_model=List[GuestResponse])
def search_guests(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search guests by name, email, or phone."""
    guests = db.query(Guest).filter(
        (Guest.first_name.contains(query)) |
        (Guest.last_name.contains(query)) |
        (Guest.email.contains(query)) |
        (Guest.phone.contains(query))
    ).all()
    return guests