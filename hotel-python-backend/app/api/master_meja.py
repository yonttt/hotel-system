from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.database import get_db_connection
from app.core.auth import get_current_user

router = APIRouter(prefix="/master-meja", tags=["Master Meja"])


# Pydantic models
class MasterMejaBase(BaseModel):
    hotel_id: Optional[int] = 1
    hotel_name: Optional[str] = "HOTEL NEW IDOLA"
    no_meja: str
    lantai: Optional[int] = 1
    kursi: Optional[int] = 4
    status: Optional[str] = "Tersedia"
    hit: Optional[int] = 0
    description: Optional[str] = None


class MasterMejaCreate(MasterMejaBase):
    pass


class MasterMejaUpdate(BaseModel):
    hotel_id: Optional[int] = None
    hotel_name: Optional[str] = None
    no_meja: Optional[str] = None
    lantai: Optional[int] = None
    kursi: Optional[int] = None
    status: Optional[str] = None
    hit: Optional[int] = None
    description: Optional[str] = None


class MasterMejaResponse(MasterMejaBase):
    id: int
    active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# GET all tables
@router.get("/", response_model=List[MasterMejaResponse])
async def get_master_meja(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    hotel_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all restaurant tables with optional filtering"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM master_meja WHERE active = TRUE"
        params = []
        
        if hotel_id:
            query += " AND hotel_id = %s"
            params.append(hotel_id)
        
        if status:
            query += " AND status = %s"
            params.append(status)
        
        query += " ORDER BY CAST(no_meja AS UNSIGNED) DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        cursor.execute(query, params)
        tables = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return tables
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tables: {str(e)}")


# GET table by ID
@router.get("/{table_id}", response_model=MasterMejaResponse)
async def get_master_meja_by_id(
    table_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific table by ID"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM master_meja WHERE id = %s AND active = TRUE", (table_id,))
        table = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        
        return table
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching table: {str(e)}")


# CREATE new table
@router.post("/", response_model=MasterMejaResponse)
async def create_master_meja(
    table_data: MasterMejaCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new restaurant table"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can create tables")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if table number already exists for this hotel
        cursor.execute(
            "SELECT id FROM master_meja WHERE hotel_id = %s AND no_meja = %s AND active = TRUE",
            (table_data.hotel_id, table_data.no_meja)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Table number already exists for this hotel")
        
        query = """
            INSERT INTO master_meja (hotel_id, hotel_name, no_meja, lantai, kursi, status, hit, description, active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE)
        """
        cursor.execute(query, (
            table_data.hotel_id,
            table_data.hotel_name,
            table_data.no_meja,
            table_data.lantai,
            table_data.kursi,
            table_data.status,
            table_data.hit,
            table_data.description
        ))
        
        connection.commit()
        new_id = cursor.lastrowid
        
        # Fetch the created record
        cursor.execute("SELECT * FROM master_meja WHERE id = %s", (new_id,))
        new_table = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return new_table
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating table: {str(e)}")


# UPDATE table
@router.put("/{table_id}", response_model=MasterMejaResponse)
async def update_master_meja(
    table_id: int,
    table_data: MasterMejaUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a restaurant table"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can update tables")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if table exists
        cursor.execute("SELECT * FROM master_meja WHERE id = %s AND active = TRUE", (table_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        if table_data.hotel_id is not None:
            update_fields.append("hotel_id = %s")
            params.append(table_data.hotel_id)
        if table_data.hotel_name is not None:
            update_fields.append("hotel_name = %s")
            params.append(table_data.hotel_name)
        if table_data.no_meja is not None:
            update_fields.append("no_meja = %s")
            params.append(table_data.no_meja)
        if table_data.lantai is not None:
            update_fields.append("lantai = %s")
            params.append(table_data.lantai)
        if table_data.kursi is not None:
            update_fields.append("kursi = %s")
            params.append(table_data.kursi)
        if table_data.status is not None:
            update_fields.append("status = %s")
            params.append(table_data.status)
        if table_data.hit is not None:
            update_fields.append("hit = %s")
            params.append(table_data.hit)
        if table_data.description is not None:
            update_fields.append("description = %s")
            params.append(table_data.description)
        
        if update_fields:
            query = f"UPDATE master_meja SET {', '.join(update_fields)} WHERE id = %s"
            params.append(table_id)
            cursor.execute(query, params)
            connection.commit()
        
        # Fetch updated record
        cursor.execute("SELECT * FROM master_meja WHERE id = %s", (table_id,))
        updated_table = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return updated_table
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating table: {str(e)}")


# DELETE table (soft delete)
@router.delete("/{table_id}")
async def delete_master_meja(
    table_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a restaurant table (soft delete)"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can delete tables")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if table exists
        cursor.execute("SELECT id FROM master_meja WHERE id = %s AND active = TRUE", (table_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Soft delete
        cursor.execute("UPDATE master_meja SET active = FALSE WHERE id = %s", (table_id,))
        connection.commit()
        
        cursor.close()
        connection.close()
        
        return {"message": "Table deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting table: {str(e)}")


# GET hotels list for filter dropdown
@router.get("/hotels/list")
async def get_hotels_list(
    current_user: dict = Depends(get_current_user)
):
    """Get unique hotels list from master_meja"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT DISTINCT hotel_id, hotel_name 
            FROM master_meja 
            WHERE active = TRUE 
            ORDER BY hotel_name
        """)
        hotels = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return hotels
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching hotels: {str(e)}")
