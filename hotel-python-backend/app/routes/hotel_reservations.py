from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import os
import uuid
import shutil
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.config.auth import get_current_user, get_current_manager_or_admin_user, get_optional_user
from app.config.room_utils import update_room_status
from app.config.email_utils import send_booking_notification
from app.tables import User, HotelReservation, Guest
from app.rules import (
    ReservationCreate, 
    ReservationResponse, 
    ReservationUpdate,
    ReservationUpgrade
)

router = APIRouter()

@router.put("/{reservation_id}/upgrade", response_model=ReservationResponse)
def upgrade_hotel_reservation(
    reservation_id: int,
    upgrade_data: ReservationUpgrade,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Upgrade a hotel reservation room, calculate additional deposit and send notification."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    old_room = db_reservation.room_number
    new_room = upgrade_data.new_room_number

    # Free up old room
    if old_room:
        update_room_status(db, old_room, 'VR')
        
    # Update to new room
    update_room_status(db, new_room, 'AR')

    # Update reservation financial records
    db_reservation.room_number = new_room
    db_reservation.additional_deposit = (db_reservation.additional_deposit or Decimal('0')) + upgrade_data.additional_deposit
    db_reservation.payment_amount = upgrade_data.new_payment_amount
    db_reservation.balance = upgrade_data.new_balance
    if upgrade_data.note:
        existing_notes = db_reservation.note or ""
        db_reservation.note = f"{existing_notes}\n[Upgrade from {old_room} to {new_room}]: {upgrade_data.note}"
    
    db.commit()
    db.refresh(db_reservation)

    # TODO Requirement 14: Send notification to hotel unit about the change.
    print(f"NOTIFICATION: Room upgraded from {old_room} to {new_room} for {db_reservation.guest_name}. Additional Deposit: {upgrade_data.additional_deposit}")

    return db_reservation

@router.post("/", response_model=ReservationResponse)
def create_hotel_reservation(
    reservation: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user)
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
        if current_user:
            reservation_data['created_by'] = current_user.id
        else:
            reservation_data['created_by'] = None
        
        # Auto-link or create guest if guest_id not provided
        if not reservation_data.get('guest_id') and reservation_data.get('guest_name'):
            # Try to find existing guest by name
            existing_guest = db.query(Guest).filter(
                Guest.guest_name == reservation_data['guest_name']
            ).first()
            if existing_guest:
                reservation_data['guest_id'] = existing_guest.id
            else:
                # Create new guest from reservation data
                new_guest = Guest(
                    guest_name=reservation_data.get('guest_name'),
                    email=reservation_data.get('email'),
                    phone=reservation_data.get('mobile_phone'),
                    address=reservation_data.get('address'),
                    id_number=reservation_data.get('id_card_number'),
                    nationality=reservation_data.get('nationality')
                )
                db.add(new_guest)
                db.flush()
                reservation_data['guest_id'] = new_guest.id
                
        # Remove fields that do not exist in the HotelReservation model to prevent SQLAlchemy errors
        if 'market_segment' in reservation_data:
            del reservation_data['market_segment']
        if 'arrival_time' in reservation_data:
            del reservation_data['arrival_time']
        
        # Calculate payment deadline based on business rules (2 hours if unpaid/Pending, else 24 hours)
        is_paid = reservation_data.get('transaction_status') == 'Confirmed' or reservation_data.get('payment_proof') is not None
        
        # Determine duration: 2 hours if not paid, otherwise maybe not needed or 24 hrs
        deadline_hours = 24 if is_paid else 2
        reservation_data['payment_deadline'] = datetime.now() + timedelta(hours=deadline_hours)

        db_reservation = HotelReservation(**reservation_data)
        db.add(db_reservation)
        
        # Update room status to AR (Arrival) when reservation is created
        if reservation.room_number:
            update_room_status(db, reservation.room_number, 'AR')
        
        db.commit()
        db.refresh(db_reservation)

        # Send Email Notification
        try:
            # We run it synchronously or rely on it not blocking too long/failing silently
            # Safely format dates
            ci_str = str(db_reservation.arrival_date) if db_reservation.arrival_date else str(reservation.arrival_date)
            co_str = str(db_reservation.departure_date) if db_reservation.departure_date else str(reservation.departure_date)
            
            guest_email = db_reservation.email if hasattr(db_reservation, 'email') else reservation.email

            send_booking_notification(
                reservation_no=db_reservation.reservation_no,
                guest_name=db_reservation.guest_name,
                guest_email=guest_email,
                room_number=db_reservation.room_number,
                check_in=ci_str,
                check_out=co_str
            )
        except Exception as e:
            # Log ignore failure so the booking still succeeds
            print(f"Warning: Failed to send email: {str(e)}")
            pass

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
    
    # Remove fields that do not exist in the HotelReservation model to prevent SQLAlchemy errors
    if 'market_segment' in reservation_data:
        del reservation_data['market_segment']
    if 'arrival_time' in reservation_data:
        del reservation_data['arrival_time']
        
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
    
    # Update room status back to VR (Vacant Ready) when reservation is deleted
    if db_reservation.room_number:
        update_room_status(db, db_reservation.room_number, 'VR')
    
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

@router.post("/number/{reservation_no}/cancel")
def cancel_reservation_by_number(
    reservation_no: str,
    db: Session = Depends(get_db)
):
    """Mark a reservation as Cancelled due to payment timeout."""
    db_reservation = db.query(HotelReservation).filter(HotelReservation.reservation_no == reservation_no).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    if db_reservation.transaction_status != 'Cancelled':
        db_reservation.transaction_status = 'Cancelled'
        if db_reservation.room_number:
            update_room_status(db, db_reservation.room_number, 'VR')
        db.commit()
    
    return {"message": "Reservation cancelled successfully"}
@router.post("/number/{reservation_no}/upload-proof")
async def upload_payment_proof(
    reservation_no: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    db_reservation = db.query(HotelReservation).filter(HotelReservation.reservation_no == reservation_no).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{reservation_no}_{uuid.uuid4().hex[:8]}.{ext}"
    file_path = os.path.join("uploads/payment_proofs", filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")
    
    db_reservation.payment_proof = file_path
    db_reservation.payment_proof_at = datetime.now()
    if db_reservation.transaction_status == 'Pending':
        db_reservation.transaction_status = 'Confirmed'
    
    db.commit()
    
    return {"message": "Payment proof uploaded successfully", "file_path": f"/uploads/payment_proofs/{filename}"}
