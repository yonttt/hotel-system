from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.core.database import get_db_connection
from app.core.auth import get_current_user

router = APIRouter(prefix="/adjustments", tags=["Adjustments"])


# ==================== PYDANTIC MODELS ====================

class AdjustmentBase(BaseModel):
    hotel_name: Optional[str] = None
    adj_date: Optional[date] = None
    adj_type: Optional[str] = None
    category: str  # 'food_beverage', 'inventory', 'kos', 'laundry', 'meeting_room', 'petty_cash'
    reference_no: Optional[str] = None
    description: Optional[str] = None
    guest_name: Optional[str] = None
    room_number: Optional[str] = None
    item_name: Optional[str] = None
    original_amount: Optional[float] = 0
    adjusted_amount: Optional[float] = 0
    difference: Optional[float] = 0
    reason: Optional[str] = None
    status: Optional[str] = "Pending"
    notes: Optional[str] = None


class AdjustmentCreate(AdjustmentBase):
    pass


class AdjustmentUpdate(BaseModel):
    hotel_name: Optional[str] = None
    adj_date: Optional[date] = None
    adj_type: Optional[str] = None
    reference_no: Optional[str] = None
    description: Optional[str] = None
    guest_name: Optional[str] = None
    room_number: Optional[str] = None
    item_name: Optional[str] = None
    original_amount: Optional[float] = None
    adjusted_amount: Optional[float] = None
    difference: Optional[float] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class AdjustmentResponse(AdjustmentBase):
    id: int
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== TABLE SETUP ====================

def ensure_table_exists(connection):
    """Create adjustments table if not exists"""
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS adjustments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hotel_name VARCHAR(255) DEFAULT NULL,
            adj_date DATE DEFAULT NULL,
            adj_type VARCHAR(100) DEFAULT NULL,
            category VARCHAR(50) NOT NULL,
            reference_no VARCHAR(100) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            guest_name VARCHAR(255) DEFAULT NULL,
            room_number VARCHAR(20) DEFAULT NULL,
            item_name VARCHAR(255) DEFAULT NULL,
            original_amount DECIMAL(15,2) DEFAULT 0,
            adjusted_amount DECIMAL(15,2) DEFAULT 0,
            difference DECIMAL(15,2) DEFAULT 0,
            reason TEXT DEFAULT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            notes TEXT DEFAULT NULL,
            created_by VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_hotel (hotel_name),
            INDEX idx_category (category),
            INDEX idx_status (status),
            INDEX idx_adj_date (adj_date),
            INDEX idx_adj_type (adj_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)
    connection.commit()
    cursor.close()


# ==================== GENERIC CRUD ENDPOINTS ====================

@router.get("/", response_model=List[AdjustmentResponse])
async def get_adjustments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    category: Optional[str] = None,
    hotel_name: Optional[str] = None,
    status: Optional[str] = None,
    adj_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all adjustments with optional filtering by category and other fields"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM adjustments WHERE 1=1"
        params = []

        if category:
            query += " AND category = %s"
            params.append(category)

        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = %s"
            params.append(hotel_name)

        if status:
            query += " AND status = %s"
            params.append(status)

        if adj_type:
            query += " AND adj_type = %s"
            params.append(adj_type)

        if start_date:
            query += " AND adj_date >= %s"
            params.append(start_date)

        if end_date:
            query += " AND adj_date <= %s"
            params.append(end_date)

        query += " ORDER BY id DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])

        cursor.execute(query, params)
        adjustments = cursor.fetchall()

        cursor.close()
        connection.close()

        return adjustments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching adjustments: {str(e)}")


@router.get("/{adj_id}", response_model=AdjustmentResponse)
async def get_adjustment(
    adj_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific adjustment by ID"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM adjustments WHERE id = %s", (adj_id,))
        adjustment = cursor.fetchone()

        cursor.close()
        connection.close()

        if not adjustment:
            raise HTTPException(status_code=404, detail="Adjustment not found")

        return adjustment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching adjustment: {str(e)}")


@router.post("/", response_model=AdjustmentResponse)
async def create_adjustment(
    adj: AdjustmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new adjustment"""
    try:
        valid_categories = ['food_beverage', 'inventory', 'kos', 'laundry', 'meeting_room', 'petty_cash']
        if adj.category not in valid_categories:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}"
            )

        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        # Calculate difference
        difference = (adj.adjusted_amount or 0) - (adj.original_amount or 0)

        cursor.execute("""
            INSERT INTO adjustments
            (hotel_name, adj_date, adj_type, category, reference_no, description,
             guest_name, room_number, item_name, original_amount, adjusted_amount,
             difference, reason, status, notes, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            adj.hotel_name, adj.adj_date or date.today(), adj.adj_type,
            adj.category, adj.reference_no, adj.description,
            adj.guest_name, adj.room_number, adj.item_name,
            adj.original_amount, adj.adjusted_amount, difference,
            adj.reason, adj.status, adj.notes,
            current_user.get('username', current_user.get('sub', 'system'))
        ))

        connection.commit()
        new_id = cursor.lastrowid

        cursor.execute("SELECT * FROM adjustments WHERE id = %s", (new_id,))
        new_adj = cursor.fetchone()

        cursor.close()
        connection.close()

        return new_adj
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating adjustment: {str(e)}")


@router.put("/{adj_id}", response_model=AdjustmentResponse)
async def update_adjustment(
    adj_id: int,
    adj: AdjustmentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an adjustment"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM adjustments WHERE id = %s", (adj_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Adjustment not found")

        update_data = adj.dict(exclude_unset=True)

        # Recalculate difference if amounts changed
        if 'original_amount' in update_data or 'adjusted_amount' in update_data:
            orig = update_data.get('original_amount', existing['original_amount'])
            adjusted = update_data.get('adjusted_amount', existing['adjusted_amount'])
            update_data['difference'] = float(adjusted or 0) - float(orig or 0)

        update_fields = []
        update_values = []
        for field, value in update_data.items():
            update_fields.append(f"{field} = %s")
            update_values.append(value)

        if not update_fields:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=400, detail="No fields to update")

        update_values.append(adj_id)
        query = f"UPDATE adjustments SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, update_values)
        connection.commit()

        cursor.execute("SELECT * FROM adjustments WHERE id = %s", (adj_id,))
        updated = cursor.fetchone()

        cursor.close()
        connection.close()

        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating adjustment: {str(e)}")


@router.delete("/{adj_id}")
async def delete_adjustment(
    adj_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete an adjustment"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM adjustments WHERE id = %s", (adj_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Adjustment not found")

        cursor.execute("DELETE FROM adjustments WHERE id = %s", (adj_id,))
        connection.commit()

        cursor.close()
        connection.close()

        return {"message": "Adjustment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting adjustment: {str(e)}")


# ==================== CATEGORY-SPECIFIC SHORTCUT ENDPOINTS ====================

@router.get("/category/{category}", response_model=List[AdjustmentResponse])
async def get_adjustments_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    hotel_name: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all adjustments for a specific category"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM adjustments WHERE category = %s"
        params = [category]

        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = %s"
            params.append(hotel_name)

        if status:
            query += " AND status = %s"
            params.append(status)

        query += " ORDER BY id DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])

        cursor.execute(query, params)
        adjustments = cursor.fetchall()

        cursor.close()
        connection.close()

        return adjustments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching {category} adjustments: {str(e)}")
