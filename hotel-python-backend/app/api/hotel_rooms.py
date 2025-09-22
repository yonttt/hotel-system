from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_manager_or_admin_user
from app.models import User
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

router = APIRouter()

# Pydantic Models for Hotel Rooms
class RoomTypeEnum(str, Enum):
    STD = "STD"
    SPR = "SPR"
    DLX = "DLX"
    EXE = "EXE"
    BIS = "BIS"
    APT = "APT"

class StatusEnum(str, Enum):
    available = "available"
    occupied = "occupied"
    maintenance = "maintenance"
    out_of_order = "out_of_order"

class VIPStatusEnum(str, Enum):
    YES = "YES"
    NO = "NO"

class SmokingEnum(str, Enum):
    Yes = "Yes"
    No = "No"

class TaxStatusEnum(str, Enum):
    YA = "YA"
    TIDAK = "TIDAK"

class HotelRoomBase(BaseModel):
    hotel_name: str = "HOTEL NEW IDOLA"
    room_number: str
    room_type: RoomTypeEnum
    floor_number: int
    vip_status: VIPStatusEnum = VIPStatusEnum.NO
    smoking_allowed: SmokingEnum
    tax_status: TaxStatusEnum
    hit_count: int = 0
    room_size: Optional[str] = None
    bed_type: str = "Double"
    max_occupancy: int = 2
    status: StatusEnum = StatusEnum.available

class HotelRoomCreate(HotelRoomBase):
    pass

class HotelRoomUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    hit_count: Optional[int] = None
    room_size: Optional[str] = None
    bed_type: Optional[str] = None
    max_occupancy: Optional[int] = None

class HotelRoomResponse(BaseModel):
    id: int
    hotel_name: str
    room_number: str
    room_type: str
    floor_number: int
    vip_status: str
    smoking_allowed: str
    tax_status: str
    hit_count: int
    room_size: Optional[str]
    bed_type: str
    max_occupancy: int
    status: str
    category_id: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class RoomAvailabilityResponse(BaseModel):
    id: int
    hotel_name: str
    room_number: str
    room_type: str
    category_name: Optional[str]
    floor_number: int
    vip_status: str
    smoking_allowed: str
    tax_status: str
    hit_count: int
    room_size: Optional[str]
    bed_type: str
    max_occupancy: int
    status: str
    weekend_rate: Optional[float]
    normal_rate: Optional[float]
    current_rate: Optional[float]
    status_display: str
    
    class Config:
        from_attributes = True

class RoomStatsResponse(BaseModel):
    room_type: str
    total_rooms: int
    available_rooms: int
    occupied_rooms: int
    maintenance_rooms: int
    avg_hit_count: float
    max_hit_count: int
    min_hit_count: int

# API Endpoints
@router.post("/", response_model=HotelRoomResponse)
def create_room(
    room: HotelRoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Create a new hotel room (manager/admin only)."""
    try:
        # Check if room number already exists
        existing_room = db.execute(
            text("SELECT id FROM hotel_rooms WHERE room_number = :room_number"),
            {"room_number": room.room_number}
        ).first()
        
        if existing_room:
            raise HTTPException(
                status_code=400,
                detail="Room number already exists"
            )
        
        # Insert new room
        result = db.execute(
            text("""
                INSERT INTO hotel_rooms 
                (hotel_name, room_number, room_type, floor_number, vip_status, 
                 smoking_allowed, tax_status, hit_count, room_size, bed_type, 
                 max_occupancy, status, created_by)
                VALUES 
                (:hotel_name, :room_number, :room_type, :floor_number, :vip_status,
                 :smoking_allowed, :tax_status, :hit_count, :room_size, :bed_type,
                 :max_occupancy, :status, :created_by)
            """),
            {
                "hotel_name": room.hotel_name,
                "room_number": room.room_number,
                "room_type": room.room_type.value,
                "floor_number": room.floor_number,
                "vip_status": room.vip_status.value,
                "smoking_allowed": room.smoking_allowed.value,
                "tax_status": room.tax_status.value,
                "hit_count": room.hit_count,
                "room_size": room.room_size,
                "bed_type": room.bed_type,
                "max_occupancy": room.max_occupancy,
                "status": room.status.value,
                "created_by": current_user.username
            }
        )
        
        db.commit()
        
        # Get the created room
        room_id = result.lastrowid
        created_room = db.execute(
            text("SELECT * FROM hotel_rooms WHERE id = :id"),
            {"id": room_id}
        ).first()
        
        return dict(created_room._mapping)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/", response_model=List[HotelRoomResponse])
def get_rooms(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    room_type: Optional[RoomTypeEnum] = None,
    floor: Optional[int] = None,
    status: Optional[StatusEnum] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all hotel rooms with filtering and pagination."""
    try:
        # Build query with filters
        where_conditions = ["is_active = 1"]
        params = {"skip": skip, "limit": limit}
        
        if room_type:
            where_conditions.append("room_type = :room_type")
            params["room_type"] = room_type.value
            
        if floor:
            where_conditions.append("floor_number = :floor")
            params["floor"] = floor
            
        if status:
            where_conditions.append("status = :status")
            params["status"] = status.value
        
        where_clause = " AND ".join(where_conditions)
        
        query = f"""
            SELECT * FROM hotel_rooms 
            WHERE {where_clause}
            ORDER BY floor_number, room_number
            LIMIT :limit OFFSET :skip
        """
        
        rooms = db.execute(text(query), params).fetchall()
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/availability", response_model=List[RoomAvailabilityResponse])
def get_room_availability(
    room_type: Optional[RoomTypeEnum] = None,
    floor: Optional[int] = None,
    status: Optional[StatusEnum] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get room availability with pricing information."""
    try:
        where_conditions = []
        params = {}
        
        if room_type:
            where_conditions.append("room_type = :room_type")
            params["room_type"] = room_type.value
            
        if floor:
            where_conditions.append("floor_number = :floor")
            params["floor"] = floor
            
        if status:
            where_conditions.append("status = :status")
            params["status"] = status.value
            
        if min_price:
            where_conditions.append("current_rate >= :min_price")
            params["min_price"] = min_price
            
        if max_price:
            where_conditions.append("current_rate <= :max_price")
            params["max_price"] = max_price
        
        where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
        
        query = f"""
            SELECT * FROM room_availability 
            WHERE {where_clause}
            ORDER BY floor_number, room_number
        """
        
        rooms = db.execute(text(query), params).fetchall()
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/stats", response_model=List[RoomStatsResponse])
def get_room_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get room statistics by type."""
    try:
        stats = db.execute(
            text("""
                SELECT 
                    room_type,
                    COUNT(*) as total_rooms,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_rooms,
                    SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_rooms,
                    SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_rooms,
                    ROUND(AVG(hit_count), 2) as avg_hit_count,
                    MAX(hit_count) as max_hit_count,
                    MIN(hit_count) as min_hit_count
                FROM hotel_rooms 
                WHERE is_active = 1
                GROUP BY room_type 
                ORDER BY total_rooms DESC
            """)
        ).fetchall()
        
        return [dict(stat._mapping) for stat in stats]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{room_number}", response_model=RoomAvailabilityResponse)
def get_room(
    room_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific room by room number with pricing."""
    try:
        room = db.execute(
            text("SELECT * FROM room_availability WHERE room_number = :room_number"),
            {"room_number": room_number}
        ).first()
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
            
        return dict(room._mapping)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.put("/{room_number}", response_model=HotelRoomResponse)
def update_room(
    room_number: str,
    room_update: HotelRoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update room information."""
    try:
        # Check if room exists
        existing_room = db.execute(
            text("SELECT id FROM hotel_rooms WHERE room_number = :room_number"),
            {"room_number": room_number}
        ).first()
        
        if not existing_room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # Build update query
        update_fields = []
        params = {"room_number": room_number}
        
        if room_update.status is not None:
            update_fields.append("status = :status")
            params["status"] = room_update.status.value
            
        if room_update.hit_count is not None:
            update_fields.append("hit_count = :hit_count")
            params["hit_count"] = room_update.hit_count
            
        if room_update.room_size is not None:
            update_fields.append("room_size = :room_size")
            params["room_size"] = room_update.room_size
            
        if room_update.bed_type is not None:
            update_fields.append("bed_type = :bed_type")
            params["bed_type"] = room_update.bed_type
            
        if room_update.max_occupancy is not None:
            update_fields.append("max_occupancy = :max_occupancy")
            params["max_occupancy"] = room_update.max_occupancy
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_query = f"""
            UPDATE hotel_rooms 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE room_number = :room_number
        """
        
        db.execute(text(update_query), params)
        db.commit()
        
        # Get updated room
        updated_room = db.execute(
            text("SELECT * FROM hotel_rooms WHERE room_number = :room_number"),
            {"room_number": room_number}
        ).first()
        
        return dict(updated_room._mapping)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{room_number}")
def delete_room(
    room_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a room (manager/admin only) - sets is_active to false."""
    try:
        # Check if room exists
        existing_room = db.execute(
            text("SELECT id FROM hotel_rooms WHERE room_number = :room_number AND is_active = 1"),
            {"room_number": room_number}
        ).first()
        
        if not existing_room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # Soft delete - set is_active to false
        db.execute(
            text("UPDATE hotel_rooms SET is_active = 0 WHERE room_number = :room_number"),
            {"room_number": room_number}
        )
        db.commit()
        
        return {"message": "Room deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/status/{status}", response_model=List[HotelRoomResponse])
def get_rooms_by_status(
    status: StatusEnum,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get rooms by status."""
    try:
        rooms = db.execute(
            text("""
                SELECT * FROM hotel_rooms 
                WHERE status = :status AND is_active = 1
                ORDER BY floor_number, room_number
            """),
            {"status": status.value}
        ).fetchall()
        
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/type/{room_type}", response_model=List[RoomAvailabilityResponse])
def get_rooms_by_type(
    room_type: RoomTypeEnum,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get rooms by type with pricing information."""
    try:
        rooms = db.execute(
            text("""
                SELECT * FROM room_availability 
                WHERE room_type = :room_type
                ORDER BY floor_number, room_number
            """),
            {"room_type": room_type.value}
        ).fetchall()
        
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/floor/{floor_number}", response_model=List[HotelRoomResponse])
def get_rooms_by_floor(
    floor_number: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get rooms by floor number."""
    try:
        rooms = db.execute(
            text("""
                SELECT * FROM hotel_rooms 
                WHERE floor_number = :floor_number AND is_active = 1
                ORDER BY room_number
            """),
            {"floor_number": floor_number}
        ).fetchall()
        
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/{room_number}/increment-hit")
def increment_room_hit_count(
    room_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Increment hit count for a room (used when room is booked/used)."""
    try:
        # Check if room exists
        existing_room = db.execute(
            text("SELECT id, hit_count FROM hotel_rooms WHERE room_number = :room_number AND is_active = 1"),
            {"room_number": room_number}
        ).first()
        
        if not existing_room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # Increment hit count
        new_hit_count = existing_room.hit_count + 1
        db.execute(
            text("UPDATE hotel_rooms SET hit_count = :hit_count WHERE room_number = :room_number"),
            {"hit_count": new_hit_count, "room_number": room_number}
        )
        db.commit()
        
        return {"message": "Hit count incremented", "new_hit_count": new_hit_count}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/analytics/popular")
def get_popular_rooms(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get most popular rooms by hit count."""
    try:
        rooms = db.execute(
            text("""
                SELECT room_number, room_type, floor_number, hit_count, status
                FROM hotel_rooms 
                WHERE is_active = 1
                ORDER BY hit_count DESC, room_number
                LIMIT :limit
            """),
            {"limit": limit}
        ).fetchall()
        
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/analytics/underutilized")
def get_underutilized_rooms(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get least utilized rooms for optimization."""
    try:
        rooms = db.execute(
            text("""
                SELECT room_number, room_type, floor_number, hit_count, status
                FROM hotel_rooms 
                WHERE is_active = 1 AND status = 'available'
                ORDER BY hit_count ASC, room_number
                LIMIT :limit
            """),
            {"limit": limit}
        ).fetchall()
        
        return [dict(room._mapping) for room in rooms]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")