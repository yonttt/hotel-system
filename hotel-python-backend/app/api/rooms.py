from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_manager_or_admin_user
from app.models import User, Room
from app.schemas import RoomCreate, RoomResponse, RoomUpdate

router = APIRouter()

@router.post("/", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Create a new room (manager/admin only)."""
    try:
        existing_room = db.query(Room).filter(Room.room_number == room.room_number).first()
        if existing_room:
            raise HTTPException(
                status_code=400,
                detail="Room number already exists"
            )
        
        db_room = Room(**room.dict())
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return db_room
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/", response_model=List[RoomResponse])
def get_rooms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all rooms with pagination."""
    try:
        rooms = db.query(Room).offset(skip).limit(limit).all()
        return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{room_number}", response_model=RoomResponse)
def get_room(
    room_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific room by room number."""
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.put("/{room_number}", response_model=RoomResponse)
def update_room(
    room_number: str,
    room_update: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update room status."""
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room_update.status:
        room.status = room_update.status
    
    db.commit()
    db.refresh(room)
    return room

@router.delete("/{room_number}")
def delete_room(
    room_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a room (manager/admin only)."""
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(room)
    db.commit()
    return {"message": "Room deleted successfully"}

@router.get("/status/{status}", response_model=List[RoomResponse])
def get_rooms_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get rooms by status."""
    try:
        rooms = db.query(Room).filter(Room.status == status).all()
        return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")