from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime
from decimal import Decimal

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import GroupBooking, GroupBookingRoom, HotelReservation, User
from app.schemas import (
    GroupBookingCreate,
    GroupBookingUpdate,
    GroupBookingResponse,
    GroupBookingWithRoomsResponse,
    GroupBookingRoomResponse
)

router = APIRouter(prefix="/group-bookings", tags=["Group Bookings"])

@router.post("/", response_model=GroupBookingWithRoomsResponse)
async def create_group_booking(
    booking: GroupBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new group booking with multiple rooms
    """
    try:
        # Generate unique group booking ID
        group_booking_id = f"GRP-{int(datetime.now().timestamp())}"
        
        # Calculate totals
        total_amount = sum(room.subtotal for room in booking.rooms)
        total_balance = total_amount - booking.total_deposit
        
        # Create group booking header
        db_group_booking = GroupBooking(
            group_booking_id=group_booking_id,
            group_name=booking.group_name,
            group_pic=booking.group_pic,
            pic_phone=booking.pic_phone,
            pic_email=booking.pic_email,
            arrival_date=booking.arrival_date,
            departure_date=booking.departure_date,
            nights=booking.nights,
            total_rooms=len(booking.rooms),
            payment_method=booking.payment_method,
            total_amount=Decimal(str(total_amount)),
            total_deposit=Decimal(str(booking.total_deposit)),
            total_balance=Decimal(str(total_balance)),
            notes=booking.notes,
            status='Active',
            created_by=booking.created_by or current_user.username,
            hotel_name=booking.hotel_name
        )
        
        db.add(db_group_booking)
        db.flush()  # Get the ID without committing
        
        # Create individual room bookings
        room_records = []
        reservation_records = []
        
        for index, room in enumerate(booking.rooms):
            # Generate reservation number
            timestamp = int(datetime.now().timestamp())
            reservation_no = f"GRP{timestamp}{str(index + 1).zfill(3)}"[:10]
            
            # Create group booking room record
            db_room = GroupBookingRoom(
                group_booking_id=group_booking_id,
                reservation_no=reservation_no,
                room_number=room.room_number,
                room_type=room.room_type,
                guest_name=room.guest_name,
                guest_title=room.guest_title,
                id_card_type=room.id_card_type,
                id_card_number=room.id_card_number,
                mobile_phone=room.mobile_phone,
                nationality=room.nationality,
                city=room.city,
                address=room.address,
                guest_count_male=room.guest_count_male,
                guest_count_female=room.guest_count_female,
                guest_count_child=room.guest_count_child,
                extra_bed=room.extra_bed,
                rate=Decimal(str(room.rate)),
                discount=Decimal(str(room.discount)),
                subtotal=Decimal(str(room.subtotal)),
                room_status='Reserved'
            )
            room_records.append(db_room)
            
            # Also create entries in hotel_reservations table for compatibility
            db_reservation = HotelReservation(
                reservation_no=reservation_no,
                category_market='Group',
                market_segment='Normal',
                member_id=group_booking_id,  # Link to group booking
                transaction_by=booking.created_by or current_user.username,
                id_card_type=room.id_card_type or 'KTP',
                id_card_number=room.id_card_number,
                guest_name=room.guest_name,
                guest_title=room.guest_title or 'MR',
                mobile_phone=room.mobile_phone,
                address=room.address,
                nationality=room.nationality or 'INDONESIA',
                city=room.city,
                email=booking.pic_email,
                arrival_date=booking.arrival_date,
                arrival_time=datetime.now().strftime('%I:%M %p'),
                departure_date=booking.departure_date,
                nights=booking.nights,
                guest_type='Normal',
                guest_count_male=room.guest_count_male or 0,
                guest_count_female=room.guest_count_female or 0,
                guest_count_child=room.guest_count_child or 0,
                extra_bed=room.extra_bed or 0,
                room_number=room.room_number,
                transaction_status='Reservation',
                payment_method=booking.payment_method,
                notes=f"Group: {booking.group_name}, PIC: {booking.group_pic}, Phone: {booking.pic_phone}. {booking.notes or ''}",
                payment_amount=Decimal(str(room.rate)),
                discount=Decimal(str(room.discount)),
                payment_diskon=Decimal(str(room.rate - room.discount)),
                deposit=Decimal(str(booking.total_deposit)) if index == 0 else Decimal('0'),
                balance=Decimal(str(room.subtotal - (booking.total_deposit if index == 0 else 0))),
                hotel_name=booking.hotel_name
            )
            reservation_records.append(db_reservation)
        
        # Add all records
        db.add_all(room_records)
        db.add_all(reservation_records)
        
        # Commit transaction
        db.commit()
        db.refresh(db_group_booking)
        
        # Fetch rooms for response
        rooms = db.query(GroupBookingRoom).filter(
            GroupBookingRoom.group_booking_id == group_booking_id
        ).all()
        
        # Prepare response
        response = GroupBookingWithRoomsResponse(
            id=db_group_booking.id,
            group_booking_id=db_group_booking.group_booking_id,
            group_name=db_group_booking.group_name,
            group_pic=db_group_booking.group_pic,
            pic_phone=db_group_booking.pic_phone,
            pic_email=db_group_booking.pic_email,
            arrival_date=db_group_booking.arrival_date,
            departure_date=db_group_booking.departure_date,
            nights=db_group_booking.nights,
            total_rooms=db_group_booking.total_rooms,
            payment_method=db_group_booking.payment_method,
            total_amount=db_group_booking.total_amount,
            total_deposit=db_group_booking.total_deposit,
            total_balance=db_group_booking.total_balance,
            notes=db_group_booking.notes,
            status=db_group_booking.status,
            created_by=db_group_booking.created_by,
            hotel_name=db_group_booking.hotel_name,
            created_at=db_group_booking.created_at,
            updated_at=db_group_booking.updated_at,
            rooms=[GroupBookingRoomResponse.from_orm(room) for room in rooms]
        )
        
        return response
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create group booking: {str(e)}")

@router.get("/", response_model=List[GroupBookingResponse])
async def get_group_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all group bookings with pagination
    """
    query = db.query(GroupBooking)
    
    if status:
        query = query.filter(GroupBooking.status == status)
    
    bookings = query.order_by(desc(GroupBooking.created_at)).offset(skip).limit(limit).all()
    return bookings

@router.get("/{group_booking_id}", response_model=GroupBookingWithRoomsResponse)
async def get_group_booking(
    group_booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific group booking with all rooms
    """
    booking = db.query(GroupBooking).filter(
        GroupBooking.group_booking_id == group_booking_id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Group booking not found")
    
    rooms = db.query(GroupBookingRoom).filter(
        GroupBookingRoom.group_booking_id == group_booking_id
    ).all()
    
    response = GroupBookingWithRoomsResponse(
        id=booking.id,
        group_booking_id=booking.group_booking_id,
        group_name=booking.group_name,
        group_pic=booking.group_pic,
        pic_phone=booking.pic_phone,
        pic_email=booking.pic_email,
        arrival_date=booking.arrival_date,
        departure_date=booking.departure_date,
        nights=booking.nights,
        total_rooms=booking.total_rooms,
        payment_method=booking.payment_method,
        total_amount=booking.total_amount,
        total_deposit=booking.total_deposit,
        total_balance=booking.total_balance,
        notes=booking.notes,
        status=booking.status,
        created_by=booking.created_by,
        hotel_name=booking.hotel_name,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        rooms=[GroupBookingRoomResponse.from_orm(room) for room in rooms]
    )
    
    return response

@router.put("/{group_booking_id}", response_model=GroupBookingResponse)
async def update_group_booking(
    group_booking_id: str,
    booking_update: GroupBookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a group booking
    """
    booking = db.query(GroupBooking).filter(
        GroupBooking.group_booking_id == group_booking_id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Group booking not found")
    
    # Update fields
    update_data = booking_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(booking, field, value)
    
    db.commit()
    db.refresh(booking)
    
    return booking

@router.delete("/{group_booking_id}")
async def delete_group_booking(
    group_booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete/Cancel a group booking
    """
    booking = db.query(GroupBooking).filter(
        GroupBooking.group_booking_id == group_booking_id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Group booking not found")
    
    # Update status to Cancelled instead of deleting
    booking.status = 'Cancelled'
    db.commit()
    
    return {"message": "Group booking cancelled successfully"}
