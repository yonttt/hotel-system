from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.database import get_db_connection
from app.core.auth import get_current_user

router = APIRouter(prefix="/kategori-menu-resto", tags=["Kategori Menu Resto"])


# Pydantic models
class KategoriMenuRestoBase(BaseModel):
    hotel_id: Optional[int] = 1
    hotel_name: Optional[str] = "HOTEL NEW IDOLA"
    nama_kategori: str
    description: Optional[str] = None


class KategoriMenuRestoCreate(KategoriMenuRestoBase):
    pass


class KategoriMenuRestoUpdate(BaseModel):
    hotel_id: Optional[int] = None
    hotel_name: Optional[str] = None
    nama_kategori: Optional[str] = None
    description: Optional[str] = None


class KategoriMenuRestoResponse(KategoriMenuRestoBase):
    id: int
    active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# GET all categories
@router.get("/", response_model=List[KategoriMenuRestoResponse])
async def get_kategori_menu_resto(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    hotel_id: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all restaurant menu categories with optional filtering"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM kategori_menu_resto WHERE active = TRUE"
        params = []
        
        if hotel_id:
            query += " AND hotel_id = %s"
            params.append(hotel_id)
        
        query += " ORDER BY id ASC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        cursor.execute(query, params)
        categories = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")


# GET category by ID
@router.get("/{category_id}", response_model=KategoriMenuRestoResponse)
async def get_kategori_menu_resto_by_id(
    category_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific category by ID"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM kategori_menu_resto WHERE id = %s AND active = TRUE", (category_id,))
        category = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        return category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching category: {str(e)}")


# CREATE new category
@router.post("/", response_model=KategoriMenuRestoResponse)
async def create_kategori_menu_resto(
    category_data: KategoriMenuRestoCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new restaurant menu category"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can create categories")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if category already exists for this hotel
        cursor.execute(
            "SELECT id FROM kategori_menu_resto WHERE hotel_id = %s AND nama_kategori = %s AND active = TRUE",
            (category_data.hotel_id, category_data.nama_kategori)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Category already exists for this hotel")
        
        query = """
            INSERT INTO kategori_menu_resto (hotel_id, hotel_name, nama_kategori, description, active)
            VALUES (%s, %s, %s, %s, TRUE)
        """
        cursor.execute(query, (
            category_data.hotel_id,
            category_data.hotel_name,
            category_data.nama_kategori,
            category_data.description
        ))
        
        connection.commit()
        new_id = cursor.lastrowid
        
        # Fetch the created record
        cursor.execute("SELECT * FROM kategori_menu_resto WHERE id = %s", (new_id,))
        new_category = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return new_category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")


# UPDATE category
@router.put("/{category_id}", response_model=KategoriMenuRestoResponse)
async def update_kategori_menu_resto(
    category_id: int,
    category_data: KategoriMenuRestoUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a restaurant menu category"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can update categories")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if category exists
        cursor.execute("SELECT * FROM kategori_menu_resto WHERE id = %s AND active = TRUE", (category_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        if category_data.hotel_id is not None:
            update_fields.append("hotel_id = %s")
            params.append(category_data.hotel_id)
        if category_data.hotel_name is not None:
            update_fields.append("hotel_name = %s")
            params.append(category_data.hotel_name)
        if category_data.nama_kategori is not None:
            update_fields.append("nama_kategori = %s")
            params.append(category_data.nama_kategori)
        if category_data.description is not None:
            update_fields.append("description = %s")
            params.append(category_data.description)
        
        if update_fields:
            query = f"UPDATE kategori_menu_resto SET {', '.join(update_fields)} WHERE id = %s"
            params.append(category_id)
            cursor.execute(query, params)
            connection.commit()
        
        # Fetch updated record
        cursor.execute("SELECT * FROM kategori_menu_resto WHERE id = %s", (category_id,))
        updated_category = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return updated_category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating category: {str(e)}")


# DELETE category (soft delete)
@router.delete("/{category_id}")
async def delete_kategori_menu_resto(
    category_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a restaurant menu category (soft delete)"""
    # Check role
    if current_user.get('role') not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Only admin and manager can delete categories")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check if category exists
        cursor.execute("SELECT id FROM kategori_menu_resto WHERE id = %s AND active = TRUE", (category_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Soft delete
        cursor.execute("UPDATE kategori_menu_resto SET active = FALSE WHERE id = %s", (category_id,))
        connection.commit()
        
        cursor.close()
        connection.close()
        
        return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting category: {str(e)}")


# GET hotels list for filter dropdown
@router.get("/hotels/list")
async def get_hotels_list(
    current_user: dict = Depends(get_current_user)
):
    """Get unique hotels list from kategori_menu_resto"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT DISTINCT hotel_id, hotel_name 
            FROM kategori_menu_resto 
            WHERE active = TRUE 
            ORDER BY hotel_name
        """)
        hotels = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return hotels
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching hotels: {str(e)}")
