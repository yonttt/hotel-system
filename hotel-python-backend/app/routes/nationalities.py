from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter(prefix="/countries", tags=["countries"])

@router.get("/")
async def get_countries(db: Session = Depends(get_db)):
    """Get all active countries/nationalities."""
    try:
        result = db.execute(text("""
            SELECT id, name, code 
            FROM nationalities 
            WHERE active = TRUE 
            ORDER BY name ASC
        """))
        countries = [{"id": row[0], "name": row[1], "code": row[2]} for row in result.fetchall()]
        return {"data": countries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")