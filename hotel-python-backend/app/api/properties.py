from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from pydantic import BaseModel
from ..core.database import get_db
from ..core.auth import get_current_user, get_current_manager_or_admin_user
from ..models import User

router = APIRouter()

# ============================================================================
# RESPONSE MODELS
# ============================================================================

class PropertyResponse(BaseModel):
    id: int
    code: Optional[str] = None
    name: str
    category: Optional[str] = "HOTEL"
    address: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    logo_url: Optional[str] = None
    umh: Optional[float] = 0
    umk: Optional[float] = 0
    plafon_covid: Optional[str] = "100%"
    sub_cabang: Optional[float] = 0
    t_tetap: Optional[float] = 0
    t_jabatan: Optional[float] = 0
    t_penempatan: Optional[float] = 0
    extrabed: Optional[int] = 0
    active: bool = True

class PropertyCreate(BaseModel):
    code: Optional[str] = None
    name: str
    category: Optional[str] = "HOTEL"
    address: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    logo_url: Optional[str] = None
    umh: Optional[float] = 0
    umk: Optional[float] = 0
    plafon_covid: Optional[str] = "100%"
    sub_cabang: Optional[float] = 0
    t_tetap: Optional[float] = 0
    t_jabatan: Optional[float] = 0
    t_penempatan: Optional[float] = 0
    extrabed: Optional[int] = 0
    active: bool = True

class PropertyUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    logo_url: Optional[str] = None
    umh: Optional[float] = None
    umk: Optional[float] = None
    plafon_covid: Optional[str] = None
    sub_cabang: Optional[float] = None
    t_tetap: Optional[float] = None
    t_jabatan: Optional[float] = None
    t_penempatan: Optional[float] = None
    extrabed: Optional[int] = None
    active: Optional[bool] = None

# ============================================================================
# ENSURE TABLE HAS ALL COLUMNS
# ============================================================================

def ensure_properties_columns(db: Session):
    """Add missing columns to hotels table if they don't exist."""
    columns_to_add = [
        ("category", "VARCHAR(50) DEFAULT 'HOTEL'"),
        ("fax", "VARCHAR(50)"),
        ("photo_url", "VARCHAR(500)"),
        ("logo_url", "VARCHAR(500)"),
        ("umh", "DECIMAL(15,0) DEFAULT 0"),
        ("umk", "DECIMAL(15,0) DEFAULT 0"),
        ("plafon_covid", "VARCHAR(20) DEFAULT '100%'"),
        ("sub_cabang", "DECIMAL(15,0) DEFAULT 0"),
        ("t_tetap", "DECIMAL(15,0) DEFAULT 0"),
        ("t_jabatan", "DECIMAL(15,0) DEFAULT 0"),
        ("t_penempatan", "DECIMAL(15,0) DEFAULT 0"),
        ("extrabed", "INT DEFAULT 0"),
    ]
    
    for col_name, col_def in columns_to_add:
        try:
            db.execute(text(f"ALTER TABLE hotels ADD COLUMN {col_name} {col_def}"))
            db.commit()
        except Exception:
            db.rollback()  # Column likely already exists


# ============================================================================
# GET ALL PROPERTIES
# ============================================================================

@router.get("/", response_model=List[PropertyResponse])
def get_properties(
    active_only: bool = False,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all properties/hotels."""
    try:
        ensure_properties_columns(db)
        
        query = """
            SELECT id, code, name, 
                   COALESCE(category, 'HOTEL') as category,
                   address, phone, 
                   COALESCE(fax, '') as fax,
                   email,
                   COALESCE(photo_url, '') as photo_url,
                   COALESCE(logo_url, '') as logo_url,
                   COALESCE(umh, 0) as umh,
                   COALESCE(umk, 0) as umk,
                   COALESCE(plafon_covid, '100%') as plafon_covid,
                   COALESCE(sub_cabang, 0) as sub_cabang,
                   COALESCE(t_tetap, 0) as t_tetap,
                   COALESCE(t_jabatan, 0) as t_jabatan,
                   COALESCE(t_penempatan, 0) as t_penempatan,
                   COALESCE(extrabed, 0) as extrabed,
                   active
            FROM hotels
        """
        
        conditions = []
        if active_only:
            conditions.append("active = 1")
        if category:
            conditions.append(f"category = :category")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += " ORDER BY id"
        
        params = {}
        if category:
            params["category"] = category
        
        result = db.execute(text(query), params)
        properties = []
        for row in result:
            properties.append({
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "category": row[3],
                "address": row[4],
                "phone": row[5],
                "fax": row[6],
                "email": row[7],
                "photo_url": row[8],
                "logo_url": row[9],
                "umh": float(row[10]) if row[10] else 0,
                "umk": float(row[11]) if row[11] else 0,
                "plafon_covid": row[12],
                "sub_cabang": float(row[13]) if row[13] else 0,
                "t_tetap": float(row[14]) if row[14] else 0,
                "t_jabatan": float(row[15]) if row[15] else 0,
                "t_penempatan": float(row[16]) if row[16] else 0,
                "extrabed": int(row[17]) if row[17] else 0,
                "active": bool(row[18])
            })
        return properties
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# GET SINGLE PROPERTY
# ============================================================================

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single property by ID."""
    try:
        ensure_properties_columns(db)
        
        query = """
            SELECT id, code, name,
                   COALESCE(category, 'HOTEL') as category,
                   address, phone,
                   COALESCE(fax, '') as fax,
                   email,
                   COALESCE(photo_url, '') as photo_url,
                   COALESCE(logo_url, '') as logo_url,
                   COALESCE(umh, 0) as umh,
                   COALESCE(umk, 0) as umk,
                   COALESCE(plafon_covid, '100%') as plafon_covid,
                   COALESCE(sub_cabang, 0) as sub_cabang,
                   COALESCE(t_tetap, 0) as t_tetap,
                   COALESCE(t_jabatan, 0) as t_jabatan,
                   COALESCE(t_penempatan, 0) as t_penempatan,
                   COALESCE(extrabed, 0) as extrabed,
                   active
            FROM hotels WHERE id = :id
        """
        
        result = db.execute(text(query), {"id": property_id})
        row = result.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Property not found")
        
        return {
            "id": row[0],
            "code": row[1],
            "name": row[2],
            "category": row[3],
            "address": row[4],
            "phone": row[5],
            "fax": row[6],
            "email": row[7],
            "photo_url": row[8],
            "logo_url": row[9],
            "umh": float(row[10]) if row[10] else 0,
            "umk": float(row[11]) if row[11] else 0,
            "plafon_covid": row[12],
            "sub_cabang": float(row[13]) if row[13] else 0,
            "t_tetap": float(row[14]) if row[14] else 0,
            "t_jabatan": float(row[15]) if row[15] else 0,
            "t_penempatan": float(row[16]) if row[16] else 0,
            "extrabed": int(row[17]) if row[17] else 0,
            "active": bool(row[18])
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# CREATE PROPERTY
# ============================================================================

@router.post("/", response_model=PropertyResponse)
def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Create a new property."""
    try:
        ensure_properties_columns(db)
        
        query = """
            INSERT INTO hotels (code, name, category, address, phone, fax, email,
                               photo_url, logo_url, umh, umk, plafon_covid,
                               sub_cabang, t_tetap, t_jabatan, t_penempatan, extrabed, active)
            VALUES (:code, :name, :category, :address, :phone, :fax, :email,
                    :photo_url, :logo_url, :umh, :umk, :plafon_covid,
                    :sub_cabang, :t_tetap, :t_jabatan, :t_penempatan, :extrabed, :active)
        """
        
        db.execute(text(query), {
            "code": property_data.code,
            "name": property_data.name,
            "category": property_data.category,
            "address": property_data.address,
            "phone": property_data.phone,
            "fax": property_data.fax,
            "email": property_data.email,
            "photo_url": property_data.photo_url,
            "logo_url": property_data.logo_url,
            "umh": property_data.umh,
            "umk": property_data.umk,
            "plafon_covid": property_data.plafon_covid,
            "sub_cabang": property_data.sub_cabang,
            "t_tetap": property_data.t_tetap,
            "t_jabatan": property_data.t_jabatan,
            "t_penempatan": property_data.t_penempatan,
            "extrabed": property_data.extrabed,
            "active": property_data.active
        })
        db.commit()
        
        # Get the newly created record
        result = db.execute(text("SELECT LAST_INSERT_ID()"))
        new_id = result.fetchone()[0]
        
        return get_property(new_id, db, current_user)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# UPDATE PROPERTY
# ============================================================================

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Update an existing property."""
    try:
        ensure_properties_columns(db)
        
        # Check if property exists
        check = db.execute(text("SELECT id FROM hotels WHERE id = :id"), {"id": property_id})
        if not check.fetchone():
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Build dynamic update query
        update_fields = {}
        update_data = property_data.dict(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        set_clauses = []
        for key, value in update_data.items():
            set_clauses.append(f"{key} = :{key}")
            update_fields[key] = value
        
        update_fields["id"] = property_id
        query = f"UPDATE hotels SET {', '.join(set_clauses)} WHERE id = :id"
        
        db.execute(text(query), update_fields)
        db.commit()
        
        return get_property(property_id, db, current_user)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# DELETE PROPERTY
# ============================================================================

@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin_user)
):
    """Delete a property."""
    try:
        check = db.execute(text("SELECT id FROM hotels WHERE id = :id"), {"id": property_id})
        if not check.fetchone():
            raise HTTPException(status_code=404, detail="Property not found")
        
        db.execute(text("DELETE FROM hotels WHERE id = :id"), {"id": property_id})
        db.commit()
        
        return {"message": "Property deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
