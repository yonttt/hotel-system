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
def create_hotel_reservation(
    reservation: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new hotel reservation."""
    try:
        # Check if reservation number already exists
        existing_reservation = db.query(HotelReservation).filter(
            HotelReservation.reservation_no == reservation.reservation_no
        ).first()
        
        if existing_reservation:
            raise HTTPException(
                status_code=400,
                detail="Reservation number already exists"
            )
        
        # Set created_by to current user's ID
        reservation_data = reservation.dict()
        reservation_data['created_by'] = current_user.id
        
        db_reservation = HotelReservation(**reservation_data)
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
        return db_reservation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/", response_model=List[ReservationResponse])
def get_hotel_reservations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all hotel reservations with pagination."""
    try:
        reservations = db.query(HotelReservation).offset(skip).limit(limit).all()
        return reservations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    reservations = db.query(HotelReservation).offset(skip).limit(limit).all()
    return reservations

@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_hotel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific hotel reservation by ID."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@router.get("/number/{reservation_no}", response_model=ReservationResponse)
def get_hotel_reservation_by_number(
    reservation_no: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific hotel reservation by reservation number."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.reservation_no == reservation_no).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@router.put("/{reservation_id}", response_model=ReservationResponse)
def update_hotel_reservation(
    reservation_id: int,
    reservation: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Update a hotel reservation."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    reservation_data = reservation.dict(exclude_unset=True)
    for field, value in reservation_data.items():
        setattr(db_reservation, field, value)
    
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@router.delete("/{reservation_id}")
def delete_hotel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a hotel reservation."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    db.delete(db_reservation)
    db.commit()
    return {"message": "Reservation deleted successfully"}

@router.get("/next/reservation-number")
def get_next_reservation_number(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the next available reservation number."""
    try:
        # Get the latest reservation number
        latest_reservation = db.query(HotelReservation).order_by(HotelReservation.id.desc()).first()
        
        if latest_reservation and latest_reservation.reservation_no:
            try:
                # Extract number from the reservation number (assuming 10-digit format like "0000000001")
                last_number = int(latest_reservation.reservation_no)
                next_number = last_number + 1
            except ValueError:
                # If parsing fails, start from 1
                next_number = 1
        else:
            next_number = 1
        
        # Format as 10 digits with leading zeros
        next_reservation_no = f"{next_number:010d}"
        
        return {"next_reservation_no": next_reservation_no}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")