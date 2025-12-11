from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from app.core.database import get_db

router = APIRouter()

# Pydantic schemas
class RoomRateBase(BaseModel):
    hotel_name: str = "HOTEL NEW IDOLA"
    rate_name: str
    room_type: str
    room_rate: Decimal = Decimal('0')
    extrabed: Decimal = Decimal('0')
    effective_date: date

class RoomRateCreate(RoomRateBase):
    pass

class RoomRateUpdate(BaseModel):
    hotel_name: Optional[str] = None
    rate_name: Optional[str] = None
    room_type: Optional[str] = None
    room_rate: Optional[Decimal] = None
    extrabed: Optional[Decimal] = None
    effective_date: Optional[date] = None
    is_active: Optional[bool] = None

class RoomRateResponse(RoomRateBase):
    id: int
    is_active: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True

# Get all room rates
@router.get("/", response_model=List[dict])
def get_room_rates(
    skip: int = 0,
    limit: int = 100,
    hotel_name: Optional[str] = None,
    rate_name: Optional[str] = None,
    room_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all room rates with optional filters"""
    query = "SELECT * FROM room_rates WHERE is_active = 1"
    params = {}
    
    if hotel_name:
        query += " AND hotel_name = :hotel_name"
        params["hotel_name"] = hotel_name
    
    if rate_name:
        query += " AND rate_name LIKE :rate_name"
        params["rate_name"] = f"%{rate_name}%"
    
    if room_type:
        query += " AND room_type = :room_type"
        params["room_type"] = room_type
    
    query += " ORDER BY effective_date DESC, room_type ASC"
    query += f" LIMIT {limit} OFFSET {skip}"
    
    result = db.execute(text(query), params)
    rows = result.fetchall()
    
    return [
        {
            "id": row[0],
            "hotel_name": row[1],
            "rate_name": row[2],
            "room_type": row[3],
            "room_rate": float(row[4]) if row[4] else 0,
            "extrabed": float(row[5]) if row[5] else 0,
            "effective_date": str(row[6]) if row[6] else None,
            "is_active": bool(row[7]),
            "created_at": str(row[8]) if row[8] else None,
            "updated_at": str(row[9]) if row[9] else None
        }
        for row in rows
    ]

# Get room rate by ID
@router.get("/{rate_id}")
def get_room_rate(rate_id: int, db: Session = Depends(get_db)):
    """Get a specific room rate by ID"""
    result = db.execute(
        text("SELECT * FROM room_rates WHERE id = :id"),
        {"id": rate_id}
    )
    row = result.fetchone()
    
    if not row:
        raise HTTPException(status_code=404, detail="Room rate not found")
    
    return {
        "id": row[0],
        "hotel_name": row[1],
        "rate_name": row[2],
        "room_type": row[3],
        "room_rate": float(row[4]) if row[4] else 0,
        "extrabed": float(row[5]) if row[5] else 0,
        "effective_date": str(row[6]) if row[6] else None,
        "is_active": bool(row[7]),
        "created_at": str(row[8]) if row[8] else None,
        "updated_at": str(row[9]) if row[9] else None
    }

# Create new room rate
@router.post("/", response_model=dict)
def create_room_rate(rate: RoomRateCreate, db: Session = Depends(get_db)):
    """Create a new room rate"""
    result = db.execute(
        text("""
            INSERT INTO room_rates (hotel_name, rate_name, room_type, room_rate, extrabed, effective_date)
            VALUES (:hotel_name, :rate_name, :room_type, :room_rate, :extrabed, :effective_date)
        """),
        {
            "hotel_name": rate.hotel_name,
            "rate_name": rate.rate_name,
            "room_type": rate.room_type,
            "room_rate": rate.room_rate,
            "extrabed": rate.extrabed,
            "effective_date": rate.effective_date
        }
    )
    db.commit()
    
    # Get the created record
    new_id = result.lastrowid
    return get_room_rate(new_id, db)

# Update room rate
@router.put("/{rate_id}")
def update_room_rate(rate_id: int, rate: RoomRateUpdate, db: Session = Depends(get_db)):
    """Update an existing room rate"""
    # Check if exists
    existing = db.execute(
        text("SELECT id FROM room_rates WHERE id = :id"),
        {"id": rate_id}
    ).fetchone()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Room rate not found")
    
    # Build update query dynamically
    update_fields = []
    params = {"id": rate_id}
    
    if rate.hotel_name is not None:
        update_fields.append("hotel_name = :hotel_name")
        params["hotel_name"] = rate.hotel_name
    
    if rate.rate_name is not None:
        update_fields.append("rate_name = :rate_name")
        params["rate_name"] = rate.rate_name
    
    if rate.room_type is not None:
        update_fields.append("room_type = :room_type")
        params["room_type"] = rate.room_type
    
    if rate.room_rate is not None:
        update_fields.append("room_rate = :room_rate")
        params["room_rate"] = rate.room_rate
    
    if rate.extrabed is not None:
        update_fields.append("extrabed = :extrabed")
        params["extrabed"] = rate.extrabed
    
    if rate.effective_date is not None:
        update_fields.append("effective_date = :effective_date")
        params["effective_date"] = rate.effective_date
    
    if rate.is_active is not None:
        update_fields.append("is_active = :is_active")
        params["is_active"] = rate.is_active
    
    if update_fields:
        query = f"UPDATE room_rates SET {', '.join(update_fields)} WHERE id = :id"
        db.execute(text(query), params)
        db.commit()
    
    return get_room_rate(rate_id, db)

# Delete room rate (soft delete)
@router.delete("/{rate_id}")
def delete_room_rate(rate_id: int, db: Session = Depends(get_db)):
    """Soft delete a room rate"""
    result = db.execute(
        text("UPDATE room_rates SET is_active = 0 WHERE id = :id"),
        {"id": rate_id}
    )
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Room rate not found")
    
    return {"message": "Room rate deleted successfully"}

# Get unique rate names for dropdown
@router.get("/lookup/rate-names")
def get_rate_names(db: Session = Depends(get_db)):
    """Get unique rate names for dropdown"""
    result = db.execute(
        text("SELECT DISTINCT rate_name FROM room_rates WHERE is_active = 1 ORDER BY rate_name")
    )
    return [row[0] for row in result.fetchall()]

# Get unique room types for dropdown
@router.get("/lookup/room-types")
def get_room_types(db: Session = Depends(get_db)):
    """Get unique room types for dropdown"""
    result = db.execute(
        text("SELECT DISTINCT room_type FROM room_rates WHERE is_active = 1 ORDER BY room_type")
    )
    return [row[0] for row in result.fetchall()]
