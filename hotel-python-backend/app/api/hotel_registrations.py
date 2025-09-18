from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_manager_or_admin_user
from app.models import User, HotelRegistration
from app.schemas import (
    GuestRegistrationCreate, 
    GuestRegistrationResponse, 
    GuestRegistrationUpdate
)

router = APIRouter()

@router.post("/", response_model=GuestRegistrationResponse)
def create_guest_registration(
    registration: GuestRegistrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new guest registration."""
    try:
        # Check if registration number already exists
        existing_registration = db.query(HotelRegistration).filter(
            HotelRegistration.registration_no == registration.registration_no
        ).first()
        
        if existing_registration:
            raise HTTPException(
                status_code=400,
                detail="Registration number already exists"
            )
        
        # Set created_by to current user's ID
        registration_data = registration.dict()
        registration_data['created_by'] = current_user.id
        
        db_registration = HotelRegistration(**registration_data)
        db.add(db_registration)
        db.commit()
        db.refresh(db_registration)
        return db_registration
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/", response_model=List[GuestRegistrationResponse])
def get_guest_registrations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guest registrations with pagination."""
    try:
        registrations = db.query(HotelRegistration).offset(skip).limit(limit).all()
        return registrations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    registrations = db.query(HotelRegistration).offset(skip).limit(limit).all()
    return registrations

@router.get("/{registration_id}", response_model=GuestRegistrationResponse)
def get_guest_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific guest registration by ID."""
    registration = db.query(HotelRegistration).filter(HotelRegistration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Guest registration not found")
    return registration

@router.get("/number/{registration_no}", response_model=GuestRegistrationResponse)
def get_guest_registration_by_number(
    registration_no: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific guest registration by registration number."""
    registration = db.query(HotelRegistration).filter(HotelRegistration.registration_no == registration_no).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Guest registration not found")
    return registration

@router.put("/{registration_id}", response_model=GuestRegistrationResponse)
def update_guest_registration(
    registration_id: int,
    registration_update: GuestRegistrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Update a guest registration (manager or admin only)."""
    registration = db.query(HotelRegistration).filter(HotelRegistration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Guest registration not found")
    
    # Update only provided fields
    update_data = registration_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(registration, field, value)
    
    db.commit()
    db.refresh(registration)
    return registration

@router.delete("/{registration_id}")
def delete_guest_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a guest registration (manager or admin only)."""
    registration = db.query(HotelRegistration).filter(HotelRegistration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Guest registration not found")
    
    db.delete(registration)
    db.commit()
    return {"message": "Guest registration deleted successfully"}

@router.get("/next/registration-number")
def get_next_registration_number(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate next available registration number."""
    try:
        # Get the latest registration number
        latest_registration = db.query(HotelRegistration).order_by(HotelRegistration.id.desc()).first()
        
        if latest_registration and latest_registration.registration_no:
            try:
                # Extract number from the registration number (assuming 10-digit format like "0000000001")
                last_number = int(latest_registration.registration_no)
                next_number = last_number + 1
            except ValueError:
                # If parsing fails, start from 1
                next_number = 1
        else:
            next_number = 1
        
        # Format as 10 digits with leading zeros
        next_registration_no = f"{next_number:010d}"
        
        return {"next_registration_no": next_registration_no}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")