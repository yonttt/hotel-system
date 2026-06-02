from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any

from app.config.database import get_db
from app.config.auth import get_current_user

router = APIRouter()

@router.get("/content")
def get_website_content(db: Session = Depends(get_db)):
    """Fetch website configuration content for public or admin use."""
    try:
        results = db.execute(text("SELECT section_name, setting_key, setting_value, setting_type FROM website_content")).fetchall()
        return [dict(r._mapping) for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.put("/content")
def update_website_content(payload: Dict[str, str], db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    """Update website content (Admin Only)"""
    try:
        if current_user.role not in ['admin', 'manager']:
            raise HTTPException(status_code=403, detail="Not authorized to edit website content")
        
        for key, value in payload.items():
            db.execute(
                text("UPDATE website_content SET setting_value = :val WHERE setting_key = :key"),
                {"val": value, "key": key}
            )
        db.commit()
        return {"message": "Content updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
