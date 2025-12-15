from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User
from pydantic import BaseModel

router = APIRouter()

# Pydantic Models for Room Categories and Pricing
class RoomCategoryResponse(BaseModel):
    id: int
    category_code: str
    category_name: str
    description: Optional[str]
    normal_rate: float
    weekend_rate: float
    is_active: bool
    
    class Config:
        from_attributes = True

class RoomCategoryUpdate(BaseModel):
    category_code: Optional[str] = None
    category_name: Optional[str] = None
    description: Optional[str] = None
    normal_rate: Optional[float] = None
    weekend_rate: Optional[float] = None
    is_active: Optional[bool] = None

class RoomPricingResponse(BaseModel):
    room_type: str
    category_name: str
    normal_rate: float
    weekend_rate: float
    current_rate: float
    is_weekend: bool

@router.get("/categories", response_model=List[RoomCategoryResponse])
def get_room_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all room categories with pricing information."""
    try:
        categories = db.execute(
            text("""
                SELECT id, category_code, category_name, description, 
                       normal_rate, weekend_rate, is_active
                FROM room_categories 
                WHERE is_active = 1
                ORDER BY category_code
            """)
        ).fetchall()
        
        return [dict(category._mapping) for category in categories]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/pricing/{room_type}", response_model=RoomPricingResponse)
def get_room_pricing(
    room_type: str,
    check_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pricing information for a specific room type."""
    try:
        # Use provided date or current date
        date_to_check = check_date if check_date else "CURDATE()"
        if check_date:
            # Validate date format and use it directly in query
            from datetime import datetime
            try:
                datetime.strptime(check_date, '%Y-%m-%d')
                date_to_check = f"'{check_date}'"
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        # Check if the date is weekend (Saturday = 7, Sunday = 1)
        is_weekend_query = db.execute(
            text(f"SELECT DAYOFWEEK({date_to_check}) IN (1, 7) as is_weekend")
        ).first()
        is_weekend = bool(is_weekend_query.is_weekend)
        
        # Get pricing for the room type
        pricing = db.execute(
            text(f"""
                SELECT category_code, category_name, normal_rate, weekend_rate,
                       CASE 
                           WHEN DAYOFWEEK({date_to_check}) IN (1, 7) THEN weekend_rate
                           ELSE normal_rate
                       END as current_rate
                FROM room_categories 
                WHERE category_code = :room_type AND is_active = 1
            """),
            {"room_type": room_type.upper()}
        ).first()
        
        if not pricing:
            raise HTTPException(status_code=404, detail="Room type pricing not found")
        
        return {
            "room_type": pricing.category_code,
            "category_name": pricing.category_name,
            "normal_rate": float(pricing.normal_rate),
            "weekend_rate": float(pricing.weekend_rate),
            "current_rate": float(pricing.current_rate),
            "is_weekend": is_weekend
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/pricing")
def get_all_room_pricing(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pricing information for all room types."""
    try:
        pricing = db.execute(
            text("""
                SELECT category_code as room_type, category_name, normal_rate, weekend_rate,
                       CASE 
                           WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN weekend_rate
                           ELSE normal_rate
                       END as current_rate,
                       DAYOFWEEK(CURDATE()) IN (1, 7) as is_weekend
                FROM room_categories 
                WHERE is_active = 1
                ORDER BY category_code
            """)
        ).fetchall()
        
        return [
            {
                "room_type": row.room_type,
                "category_name": row.category_name,
                "normal_rate": float(row.normal_rate),
                "weekend_rate": float(row.weekend_rate),
                "current_rate": float(row.current_rate),
                "is_weekend": bool(row.is_weekend)
            }
            for row in pricing
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.put("/categories/{category_id}", response_model=RoomCategoryResponse)
def update_room_category(
    category_id: int,
    category_update: RoomCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a room category (admin/manager only)."""
    try:
        # Check user role
        if current_user.role not in ['admin', 'manager']:
            raise HTTPException(status_code=403, detail="Only admin or manager can update room categories")
        
        # Check if category exists
        existing = db.execute(
            text("SELECT id FROM room_categories WHERE id = :id"),
            {"id": category_id}
        ).first()
        
        if not existing:
            raise HTTPException(status_code=404, detail="Room category not found")
        
        # Build update query
        update_fields = []
        params = {"id": category_id}
        
        if category_update.category_code is not None:
            update_fields.append("category_code = :category_code")
            params["category_code"] = category_update.category_code
            
        if category_update.category_name is not None:
            update_fields.append("category_name = :category_name")
            params["category_name"] = category_update.category_name
            
        if category_update.description is not None:
            update_fields.append("description = :description")
            params["description"] = category_update.description
            
        if category_update.normal_rate is not None:
            update_fields.append("normal_rate = :normal_rate")
            params["normal_rate"] = category_update.normal_rate
            
        if category_update.weekend_rate is not None:
            update_fields.append("weekend_rate = :weekend_rate")
            params["weekend_rate"] = category_update.weekend_rate
            
        if category_update.is_active is not None:
            update_fields.append("is_active = :is_active")
            params["is_active"] = category_update.is_active
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_query = f"""
            UPDATE room_categories 
            SET {', '.join(update_fields)}
            WHERE id = :id
        """
        
        db.execute(text(update_query), params)
        db.commit()
        
        # Get the updated category
        updated = db.execute(
            text("""
                SELECT id, category_code, category_name, description, 
                       normal_rate, weekend_rate, is_active
                FROM room_categories 
                WHERE id = :id
            """),
            {"id": category_id}
        ).first()
        
        return dict(updated._mapping)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")