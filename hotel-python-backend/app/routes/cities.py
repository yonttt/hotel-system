from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter(prefix="/cities", tags=["cities"])

@router.get("/")
async def get_cities(db: Session = Depends(get_db)):
    """Get all active cities."""
    try:
        result = db.execute(text("""
            SELECT id, name, country 
            FROM cities 
            WHERE active = TRUE 
            ORDER BY name ASC
        """))
        cities = [{"id": row[0], "name": row[1], "country": row[2]} for row in result.fetchall()]
        return {"data": cities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")