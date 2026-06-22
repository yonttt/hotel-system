from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.config.auth import get_current_user, get_current_manager_or_admin_user, get_optional_user
from app.config.room_utils import update_room_status
from app.tables import User, HotelRegistration, HotelReservation, Guest
from app.rules import (
    GuestRegistrationCreate, 
    GuestRegistrationResponse, 
    GuestRegistrationUpdate
)

router = APIRouter()

@router.post("/", response_model=GuestRegistrationResponse)
def create_guest_registration(
    registration: GuestRegistrationCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user)
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
        if current_user:
            registration_data['created_by'] = current_user.id
        else:
            registration_data['created_by'] = None
        
        # Auto-link or create guest if guest_id not provided
        if not registration_data.get('guest_id') and registration_data.get('guest_name'):
            # Try to find existing guest by name
            existing_guest = db.query(Guest).filter(
                Guest.guest_name == registration_data['guest_name']
            ).first()
            if existing_guest:
                registration_data['guest_id'] = existing_guest.id
            else:
                # Create new guest from registration data
                new_guest = Guest(
                    guest_name=registration_data.get('guest_name'),
                    email=registration_data.get('email'),
                    phone=registration_data.get('mobile_phone'),
                    address=registration_data.get('address'),
                    id_number=registration_data.get('id_card_number'),
                    nationality=registration_data.get('nationality', 'INDONESIA')
                )
                db.add(new_guest)
                db.flush()
                registration_data['guest_id'] = new_guest.id
                
        # Remove fields that do not exist in the HotelRegistration model to prevent SQLAlchemy errors
        if 'arrival_time' in registration_data:
            del registration_data['arrival_time']
        
        db_registration = HotelRegistration(**registration_data)
        db.add(db_registration)
        
        # Update room status based on transaction_status
        if registration.room_number:
            if registration.transaction_status == 'Check-in':
                # Validate guest details before allowing check-in status
                missing_fields = []
                if not registration_data.get('guest_name') or not str(registration_data.get('guest_name')).strip():
                    missing_fields.append("Guest Name")
                if not registration_data.get('id_card_number') or not str(registration_data.get('id_card_number')).strip():
                    missing_fields.append("ID Card Number (KTP/Passport)")
                if not registration_data.get('mobile_phone') or not str(registration_data.get('mobile_phone')).strip():
                    missing_fields.append("Phone Number")
                    
                if missing_fields:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Cannot check-in. Missing required guest information: {', '.join(missing_fields)}."
                    )

                # OR = Occupied Ready (guest has checked in)
                update_room_status(db, registration.room_number, 'OR')
            elif registration.transaction_status == 'Registration':
                # AR = Arrival (registered but not yet checked in)
                update_room_status(db, registration.room_number, 'AR')

        # If this registration was created from a reservation, close that
        # reservation out so it stops showing up as pending/confirmed.
        if registration.reservation_no:
            source_reservation = db.query(HotelReservation).filter(
                HotelReservation.reservation_no == registration.reservation_no
            ).first()
            if source_reservation and source_reservation.transaction_status not in ('Checked-in', 'Checked-out', 'Cancelled'):
                source_reservation.transaction_status = 'Checked-in'

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
    
    # Remove fields that do not exist in the HotelRegistration model to prevent SQLAlchemy errors
    if 'arrival_time' in update_data:
        del update_data['arrival_time']
    
    # Check if transaction_status is being updated
    if 'transaction_status' in update_data and registration.room_number:
        new_status = update_data['transaction_status']
        if new_status == 'Check-in':
            # Validate guest details before allowing check-in status
            missing_fields = []
            if not update_data.get('guest_name', registration.guest_name) or not str(update_data.get('guest_name', registration.guest_name)).strip():
                missing_fields.append("Guest Name")
            if not update_data.get('id_card_number', registration.id_card_number) or not str(update_data.get('id_card_number', registration.id_card_number)).strip():
                missing_fields.append("ID Card Number (KTP/Passport)")
            if not update_data.get('mobile_phone', registration.mobile_phone) or not str(update_data.get('mobile_phone', registration.mobile_phone)).strip():
                missing_fields.append("Phone Number")
                
            if missing_fields:
                raise HTTPException(
                    status_code=422,
                    detail=f"Cannot check-in. Missing required guest information: {', '.join(missing_fields)}."
                )

            update_room_status(db, registration.room_number, 'OR')  # Occupied Ready
        elif new_status == 'Check-out':
            update_room_status(db, registration.room_number, 'CO')  # Checkout
        elif new_status == 'Cancelled':
            update_room_status(db, registration.room_number, 'VR')  # Vacant Ready
    
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
    
    # Update room status back to VR (Vacant Ready) when registration is deleted
    if registration.room_number:
        update_room_status(db, registration.room_number, 'VR')
    
    db.delete(registration)
    db.commit()
    return {"message": "Guest registration deleted successfully"}

@router.get("/next/registration-number")
def get_next_registration_number(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user)
):
    """Generate next available registration number."""
    try:
        from sqlalchemy import text
        import re
        # Get the latest registration number using raw SQL to avoid model mismatch issues
        result = db.execute(text("SELECT registration_no FROM hotel_registrations ORDER BY id DESC LIMIT 1")).fetchone()

        if result and result[0]:
            try:
                # Extract only digits from the registration number (e.g. REG00000001 -> 1)
                num_str = re.sub(r'\D', '', result[0])
                last_number = int(num_str) if num_str else 0
                next_number = last_number + 1
            except ValueError:
                # If parsing fails, start from 1
                next_number = 1
        else:
            next_number = 1
        
        # Format with prefix and 8 digits
        next_registration_no = f"REG{next_number:08d}"
        
        return {"next_registration_no": next_registration_no}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/number/{registration_no}/cancel")
def cancel_registration_by_number(
    registration_no: str,
    db: Session = Depends(get_db)
):
    """Mark a registration as Cancelled due to payment timeout.

    Intentionally unauthenticated so the public booking site can self-cancel
    its own timed-out registration. To limit abuse from anyone guessing/
    enumerating registration numbers, this only works while the registration
    is still in 'Registration' status - it can't be used to cancel a guest
    who has already checked in or checked out.
    """
    db_reg = db.query(HotelRegistration).filter(HotelRegistration.registration_no == registration_no).first()
    if db_reg is None:
        raise HTTPException(status_code=404, detail="Registration not found")

    if db_reg.transaction_status == 'Cancelled':
        return {"message": "Registration cancelled successfully"}

    if db_reg.transaction_status != 'Registration':
        raise HTTPException(
            status_code=409,
            detail="Only a pending registration can be cancelled this way. Please contact the hotel."
        )

    db_reg.transaction_status = 'Cancelled'
    if db_reg.room_number:
        update_room_status(db, db_reg.room_number, 'VR')
    db.commit()

    return {"message": "Registration cancelled successfully"}