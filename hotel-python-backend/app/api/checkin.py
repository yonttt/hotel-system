from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.room_utils import update_room_status
from app.models import User

router = APIRouter()

# Pydantic schemas for check-in
class CheckinResponse(BaseModel):
    id: int
    registration_no: Optional[str] = None
    hotel_name: Optional[str] = None
    guest_name: str
    guest_type: Optional[str] = None
    market_segment: Optional[str] = None
    room_number: Optional[str] = None
    nights: Optional[int] = 0
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    payment_amount: Optional[float] = 0
    deposit: Optional[float] = 0
    balance: Optional[float] = 0
    transaction_status: Optional[str] = None
    transaction_by: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ProcessCheckinRequest(BaseModel):
    checkin_by: Optional[str] = None
    notes: Optional[str] = None


@router.get("/today", response_model=List[CheckinResponse])
def get_checkin_today(
    hotel_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all registrations due for check-in today (arrival_date = today) with status Registration."""
    try:
        today = date.today()
        
        query = """
            SELECT 
                id,
                registration_no,
                COALESCE(hotel_name, 'HOTEL NEW IDOLA') as hotel_name,
                guest_name,
                guest_type,
                market_segment,
                room_number,
                nights,
                arrival_date,
                departure_date,
                payment_amount,
                deposit,
                balance,
                transaction_status,
                transaction_by,
                created_at
            FROM hotel_registrations
            WHERE DATE(arrival_date) = :today
            AND transaction_status = 'Registration'
        """
        
        params = {"today": today}
        
        if hotel_name and hotel_name != 'ALL':
            query += " AND (hotel_name = :hotel_name OR (hotel_name IS NULL AND :hotel_name = 'HOTEL NEW IDOLA'))"
            params["hotel_name"] = hotel_name
            
        query += " ORDER BY arrival_date ASC"
        
        result = db.execute(text(query), params)
        rows = result.fetchall()
        
        checkins = []
        for row in rows:
            checkins.append({
                "id": row[0],
                "registration_no": row[1],
                "hotel_name": row[2],
                "guest_name": row[3],
                "guest_type": row[4],
                "market_segment": row[5],
                "room_number": row[6],
                "nights": row[7] or 0,
                "arrival_date": row[8],
                "departure_date": row[9],
                "payment_amount": float(row[10] or 0),
                "deposit": float(row[11] or 0),
                "balance": float(row[12] or 0),
                "transaction_status": row[13],
                "transaction_by": row[14],
                "created_at": row[15]
            })
        
        return checkins
        
    except Exception as e:
        print(f"Error fetching check-in data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching check-in data: {str(e)}"
        )


@router.post("/{registration_id}")
def process_checkin(
    registration_id: int,
    checkin_data: Optional[ProcessCheckinRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process check-in for a registration - updates status from Registration to Check-in."""
    try:
        # Get the registration
        result = db.execute(
            text("""
                SELECT 
                    id, registration_no, guest_name, room_number,
                    COALESCE(hotel_name, 'HOTEL NEW IDOLA') as hotel_name,
                    transaction_status
                FROM hotel_registrations
                WHERE id = :id AND transaction_status = 'Registration'
            """),
            {"id": registration_id}
        )
        row = result.fetchone()
        
        if not row:
            raise HTTPException(
                status_code=404,
                detail="Registration not found or not in Registration status"
            )
        
        checkin_by = checkin_data.checkin_by if checkin_data else current_user.username
        
        # Update registration status to Check-in
        db.execute(
            text("""
                UPDATE hotel_registrations 
                SET transaction_status = 'Check-in',
                    transaction_by = :checkin_by,
                    updated_at = NOW()
                WHERE id = :id
            """),
            {"id": registration_id, "checkin_by": checkin_by}
        )
        
        # Update room status to OR (Occupied Ready)
        room_number = row[3]
        if room_number:
            update_room_status(db, room_number, 'OR')
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Guest {row[2]} has been checked in successfully",
            "registration_no": row[1],
            "room_number": room_number
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error processing check-in: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing check-in: {str(e)}"
        )
