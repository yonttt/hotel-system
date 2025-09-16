from fastapi import APIRouter, HTTPException
from typing import List
import logging
from ..core.database import get_db_connection

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/registration-types/")
async def get_registration_types():
    """Get all active registration types"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT id, name, active 
        FROM registration_types 
        WHERE active = TRUE 
        ORDER BY name ASC
        """
        cursor.execute(query)
        registration_types = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return {"data": registration_types}
        
    except Exception as e:
        logger.error(f"Error fetching registration types: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/registration-types/{registration_type_id}")
async def get_registration_type(registration_type_id: int):
    """Get specific registration type by ID"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT id, name, active 
        FROM registration_types 
        WHERE id = %s
        """
        cursor.execute(query, (registration_type_id,))
        registration_type = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not registration_type:
            raise HTTPException(status_code=404, detail="Registration type not found")
            
        return {"data": registration_type}
        
    except Exception as e:
        logger.error(f"Error fetching registration type {registration_type_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")