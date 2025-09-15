from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_manager_or_admin_user
from app.models import User, HotelReservation
from app.schemas import (
    ReservationCreate, 
    ReservationResponse, 
    ReservationUpdate
)

router = APIRouter()

@router.post("/", response_model=ReservationResponse)
def create_reservation(
    reservation: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new hotel reservation."""
    # Check if reservation number already exists
    existing_reservation = db.query(HotelReservation).filter(
        HotelReservation.reservation_no == reservation.reservation_no
    ).first()
    
    if existing_reservation:
        raise HTTPException(
            status_code=400,
            detail="Reservation number already exists"
        )
    
    db_reservation = HotelReservation(**reservation.dict())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@router.get("/", response_model=List[ReservationResponse])
def get_reservations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reservations with pagination."""
    reservations = db.query(HotelReservation).offset(skip).limit(limit).all()
    return reservations

@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific reservation by ID."""
    reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

@router.put("/{reservation_id}", response_model=ReservationResponse)
def update_reservation(
    reservation_id: int,
    reservation_update: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Update a reservation (manager/admin only)."""
    reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    update_data = reservation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reservation, field, value)
    
    db.commit()
    db.refresh(reservation)
    return reservation

@router.delete("/{reservation_id}")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a reservation (manager/admin only)."""
    reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    db.delete(reservation)
    db.commit()
    return {"message": "Reservation deleted successfully"}

@router.get("/by-status/{status}", response_model=List[ReservationResponse])
def get_reservations_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get reservations by status."""
    reservations = db.query(HotelReservation).filter(
        HotelReservation.transaction_status == status
    ).all()
    return reservations