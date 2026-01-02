from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User

router = APIRouter()

# Pydantic schemas for checkout
class CheckoutResponse(BaseModel):
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
    transaction_by: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class CheckoutHistoryResponse(BaseModel):
    id: int
    registration_id: Optional[int] = None
    registration_no: Optional[str] = None
    hotel_name: Optional[str] = None
    guest_name: str
    room_number: Optional[str] = None
    room_type: Optional[str] = None
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    checkout_date: Optional[datetime] = None
    nights: Optional[int] = 0
    total_charge: Optional[float] = 0
    deposit: Optional[float] = 0
    balance: Optional[float] = 0
    checkout_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProcessCheckoutRequest(BaseModel):
    checkout_by: Optional[str] = None
    notes: Optional[str] = None


def update_room_status(db: Session, room_number: str, new_status: str):
    """Update room status in hotel_rooms table."""
    try:
        db.execute(
            text("UPDATE hotel_rooms SET status = :status WHERE room_number = :room_number"),
            {"status": new_status, "room_number": room_number}
        )
    except Exception as e:
        print(f"Warning: Could not update room status: {e}")


@router.get("/today", response_model=List[CheckoutResponse])
def get_checkout_today(
    hotel_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all registrations due for checkout today (departure_date = today) with status Check-in."""
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
                transaction_by,
                created_at
            FROM hotel_registrations
            WHERE DATE(departure_date) = :today
            AND transaction_status = 'Check-in'
        """
        
        params = {"today": today}
        
        if hotel_name and hotel_name != 'ALL':
            query += " AND (hotel_name = :hotel_name OR (hotel_name IS NULL AND :hotel_name = 'HOTEL NEW IDOLA'))"
            params["hotel_name"] = hotel_name
            
        query += " ORDER BY departure_date ASC"
        
        result = db.execute(text(query), params)
        rows = result.fetchall()
        
        checkouts = []
        for row in rows:
            checkouts.append({
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
                "transaction_by": row[13],
                "created_at": row[14]
            })
        
        return checkouts
        
    except Exception as e:
        print(f"Error fetching checkout data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching checkout data: {str(e)}"
        )


@router.post("/{registration_id}")
def process_checkout(
    registration_id: int,
    checkout_data: Optional[ProcessCheckoutRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process checkout for a registration - updates status and creates checkout history."""
    try:
        # Get the registration
        result = db.execute(
            text("""
                SELECT 
                    id, registration_no, guest_name, guest_title, id_card_type, id_card_number,
                    mobile_phone, address, nationality, city, email, room_number,
                    category_market, market_segment, guest_type, arrival_date, departure_date,
                    nights, guest_count_male, guest_count_female, guest_count_child,
                    extra_bed_nights, extra_bed_qty, payment_method, payment_amount,
                    discount, deposit, balance, notes,
                    COALESCE(hotel_name, 'HOTEL NEW IDOLA') as hotel_name
                FROM hotel_registrations
                WHERE id = :id AND transaction_status = 'Check-in'
            """),
            {"id": registration_id}
        )
        row = result.fetchone()
        
        if not row:
            raise HTTPException(
                status_code=404,
                detail="Registration not found or not in Check-in status"
            )
        
        checkout_by = checkout_data.checkout_by if checkout_data else current_user.username
        notes = checkout_data.notes if checkout_data else None
        
        # Calculate total charge (you can customize this calculation)
        total_charge = float(row[24] or 0)  # payment_amount
        
        # Insert into checkout_history
        db.execute(
            text("""
                INSERT INTO checkout_history (
                    registration_id, registration_no, hotel_name, guest_name, guest_title,
                    id_card_type, id_card_number, mobile_phone, address, nationality, city, email,
                    room_number, category_market, market_segment, guest_type,
                    arrival_date, departure_date, checkout_date, nights,
                    guest_count_male, guest_count_female, guest_count_child,
                    extra_bed_nights, extra_bed_qty, payment_method, payment_amount,
                    discount, deposit, balance, total_charge, checkout_by, notes
                ) VALUES (
                    :registration_id, :registration_no, :hotel_name, :guest_name, :guest_title,
                    :id_card_type, :id_card_number, :mobile_phone, :address, :nationality, :city, :email,
                    :room_number, :category_market, :market_segment, :guest_type,
                    :arrival_date, :departure_date, NOW(), :nights,
                    :guest_count_male, :guest_count_female, :guest_count_child,
                    :extra_bed_nights, :extra_bed_qty, :payment_method, :payment_amount,
                    :discount, :deposit, :balance, :total_charge, :checkout_by, :notes
                )
            """),
            {
                "registration_id": row[0],
                "registration_no": row[1],
                "hotel_name": row[28],
                "guest_name": row[2],
                "guest_title": row[3],
                "id_card_type": row[4],
                "id_card_number": row[5],
                "mobile_phone": row[6],
                "address": row[7],
                "nationality": row[8],
                "city": row[9],
                "email": row[10],
                "room_number": row[11],
                "category_market": row[12],
                "market_segment": row[13],
                "guest_type": row[14],
                "arrival_date": row[15],
                "departure_date": row[16],
                "nights": row[17],
                "guest_count_male": row[18],
                "guest_count_female": row[19],
                "guest_count_child": row[20],
                "extra_bed_nights": row[21],
                "extra_bed_qty": row[22],
                "payment_method": row[23],
                "payment_amount": row[24],
                "discount": row[25],
                "deposit": row[26],
                "balance": row[27],
                "total_charge": total_charge,
                "checkout_by": checkout_by,
                "notes": notes
            }
        )
        
        # Update registration status to Check-out
        db.execute(
            text("""
                UPDATE hotel_registrations 
                SET transaction_status = 'Check-out',
                    updated_at = NOW()
                WHERE id = :id
            """),
            {"id": registration_id}
        )
        
        # Update room status to CO (Checkout) then VD (Vacant Dirty) for housekeeping
        room_number = row[11]
        if room_number:
            update_room_status(db, room_number, 'CO')
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Guest {row[2]} has been checked out successfully",
            "registration_no": row[1],
            "room_number": room_number
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error processing checkout: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing checkout: {str(e)}"
        )


@router.get("/history", response_model=List[CheckoutHistoryResponse])
def get_checkout_history(
    skip: int = 0,
    limit: int = 100,
    hotel_name: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get checkout history with optional filters."""
    try:
        query = """
            SELECT 
                id, registration_id, registration_no, hotel_name, guest_name,
                room_number, room_type, arrival_date, departure_date, checkout_date,
                nights, total_charge, deposit, balance, checkout_by
            FROM checkout_history
            WHERE 1=1
        """
        params = {}
        
        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = :hotel_name"
            params["hotel_name"] = hotel_name
            
        if start_date:
            query += " AND DATE(checkout_date) >= :start_date"
            params["start_date"] = start_date
            
        if end_date:
            query += " AND DATE(checkout_date) <= :end_date"
            params["end_date"] = end_date
            
        query += " ORDER BY checkout_date DESC LIMIT :limit OFFSET :skip"
        params["limit"] = limit
        params["skip"] = skip
        
        result = db.execute(text(query), params)
        rows = result.fetchall()
        
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "registration_id": row[1],
                "registration_no": row[2],
                "hotel_name": row[3],
                "guest_name": row[4],
                "room_number": row[5],
                "room_type": row[6],
                "arrival_date": row[7],
                "departure_date": row[8],
                "checkout_date": row[9],
                "nights": row[10] or 0,
                "total_charge": float(row[11] or 0),
                "deposit": float(row[12] or 0),
                "balance": float(row[13] or 0),
                "checkout_by": row[14]
            })
        
        return history
        
    except Exception as e:
        print(f"Error fetching checkout history: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching checkout history: {str(e)}"
        )
