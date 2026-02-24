from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.core.database import get_db_connection
from app.core.auth import get_current_user

router = APIRouter(prefix="/laundry", tags=["Laundry"])


# Pydantic models
class LaundryOrderBase(BaseModel):
    hotel_name: Optional[str] = None
    room_number: Optional[str] = None
    guest_name: Optional[str] = None
    registration_no: Optional[str] = None
    order_date: Optional[date] = None
    item_name: str
    quantity: Optional[int] = 1
    unit_price: Optional[float] = 0
    total_price: Optional[float] = 0
    status: Optional[str] = "Pending"
    notes: Optional[str] = None


class LaundryOrderCreate(LaundryOrderBase):
    pass


class LaundryOrderUpdate(BaseModel):
    hotel_name: Optional[str] = None
    room_number: Optional[str] = None
    guest_name: Optional[str] = None
    registration_no: Optional[str] = None
    order_date: Optional[date] = None
    item_name: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class LaundryOrderResponse(LaundryOrderBase):
    id: int
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


def ensure_table_exists(connection):
    """Create laundry_orders table if not exists"""
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS laundry_orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hotel_name VARCHAR(255) DEFAULT NULL,
            room_number VARCHAR(20) DEFAULT NULL,
            guest_name VARCHAR(255) DEFAULT NULL,
            registration_no VARCHAR(50) DEFAULT NULL,
            order_date DATE DEFAULT NULL,
            item_name VARCHAR(255) NOT NULL,
            quantity INT DEFAULT 1,
            unit_price DECIMAL(15,2) DEFAULT 0,
            total_price DECIMAL(15,2) DEFAULT 0,
            status VARCHAR(50) DEFAULT 'Pending',
            notes TEXT DEFAULT NULL,
            created_by VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_hotel (hotel_name),
            INDEX idx_status (status),
            INDEX idx_order_date (order_date),
            INDEX idx_room (room_number)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)
    connection.commit()
    cursor.close()


@router.get("/", response_model=List[LaundryOrderResponse])
async def get_laundry_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    hotel_name: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all laundry orders with optional filtering"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM laundry_orders WHERE 1=1"
        params = []

        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = %s"
            params.append(hotel_name)

        if status:
            query += " AND status = %s"
            params.append(status)

        if start_date:
            query += " AND order_date >= %s"
            params.append(start_date)

        if end_date:
            query += " AND order_date <= %s"
            params.append(end_date)

        query += " ORDER BY id DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])

        cursor.execute(query, params)
        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching laundry orders: {str(e)}")


@router.get("/{order_id}", response_model=LaundryOrderResponse)
async def get_laundry_order(
    order_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific laundry order by ID"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM laundry_orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()

        cursor.close()
        connection.close()

        if not order:
            raise HTTPException(status_code=404, detail="Laundry order not found")

        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching laundry order: {str(e)}")


@router.post("/", response_model=LaundryOrderResponse)
async def create_laundry_order(
    order: LaundryOrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new laundry order"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        # Calculate total_price if not provided
        total = order.total_price if order.total_price else (order.quantity or 1) * (order.unit_price or 0)

        cursor.execute("""
            INSERT INTO laundry_orders 
            (hotel_name, room_number, guest_name, registration_no, order_date, 
             item_name, quantity, unit_price, total_price, status, notes, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            order.hotel_name, order.room_number, order.guest_name,
            order.registration_no, order.order_date or date.today(),
            order.item_name, order.quantity, order.unit_price, total,
            order.status, order.notes,
            current_user.get('username', current_user.get('sub', 'system'))
        ))

        connection.commit()
        new_id = cursor.lastrowid

        cursor.execute("SELECT * FROM laundry_orders WHERE id = %s", (new_id,))
        new_order = cursor.fetchone()

        cursor.close()
        connection.close()

        return new_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating laundry order: {str(e)}")


@router.put("/{order_id}", response_model=LaundryOrderResponse)
async def update_laundry_order(
    order_id: int,
    order: LaundryOrderUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a laundry order"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        # Check exists
        cursor.execute("SELECT * FROM laundry_orders WHERE id = %s", (order_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Laundry order not found")

        # Build dynamic update
        update_fields = []
        update_values = []
        update_data = order.dict(exclude_unset=True)

        for field, value in update_data.items():
            update_fields.append(f"{field} = %s")
            update_values.append(value)

        if not update_fields:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=400, detail="No fields to update")

        update_values.append(order_id)
        query = f"UPDATE laundry_orders SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, update_values)
        connection.commit()

        cursor.execute("SELECT * FROM laundry_orders WHERE id = %s", (order_id,))
        updated = cursor.fetchone()

        cursor.close()
        connection.close()

        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating laundry order: {str(e)}")


@router.delete("/{order_id}")
async def delete_laundry_order(
    order_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a laundry order"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM laundry_orders WHERE id = %s", (order_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Laundry order not found")

        cursor.execute("DELETE FROM laundry_orders WHERE id = %s", (order_id,))
        connection.commit()

        cursor.close()
        connection.close()

        return {"message": "Laundry order deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting laundry order: {str(e)}")
