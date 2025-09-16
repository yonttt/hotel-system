from fastapi import APIRouter, HTTPException
from typing import List
import logging
from ..core.database import get_db_connection

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/payment-methods/")
async def get_payment_methods():
    """Get all active payment methods"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT id, name, type, active 
        FROM payment_methods 
        WHERE active = TRUE 
        ORDER BY name ASC
        """
        cursor.execute(query)
        payment_methods = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return {"data": payment_methods}
        
    except Exception as e:
        logger.error(f"Error fetching payment methods: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/payment-methods/{payment_method_id}")
async def get_payment_method(payment_method_id: int):
    """Get specific payment method by ID"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT id, name, type, active 
        FROM payment_methods 
        WHERE id = %s
        """
        cursor.execute(query, (payment_method_id,))
        payment_method = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not payment_method:
            raise HTTPException(status_code=404, detail="Payment method not found")
            
        return {"data": payment_method}
        
    except Exception as e:
        logger.error(f"Error fetching payment method {payment_method_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")