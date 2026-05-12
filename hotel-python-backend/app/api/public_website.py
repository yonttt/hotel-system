from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any, Optional

from app.core.database import get_db

router = APIRouter()

@router.get("/rooms")
def get_public_rooms(db: Session = Depends(get_db)):
    """Fetch public room categories with their prices to show on the website."""
    try:
        # Fetch active room categories
        categories = db.execute(
            text("""
                SELECT id, category_code, category_name, description, 
                       normal_rate, weekend_rate, six_hours_rate, hotel_name
                FROM room_categories 
                WHERE is_active = 1
                ORDER BY hotel_name, normal_rate ASC
            """)
        ).fetchall()
        
        # Format the response
        result = []
        for cat in categories:
            cat_dict = dict(cat._mapping)
            
            # Since we don't have images in the DB yet, we'll assign a placeholder or mapped image string 
            # based on category name or just hardcode some nice default pictures. 
            # Later the CMS can override these.
            picture = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80'
            if 'suite' in str(cat_dict['category_name']).lower() or 'exe' in str(cat_dict['category_code']).lower():
                picture = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
            elif 'dlx' in str(cat_dict['category_code']).lower() or 'deluxe' in str(cat_dict['category_name']).lower():
                picture = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
                
            cat_dict['image'] = picture
            cat_dict['amenities'] = ['WiFi Gratis', 'AC', 'TV LED', 'Room Service']
            
            result.append(cat_dict)
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/hotels")
def get_public_hotels(db: Session = Depends(get_db)):
    """Get the distinct list of hotels available."""
    try:
        hotels = db.execute(
            text("""
                SELECT DISTINCT hotel_name 
                FROM room_categories 
                WHERE is_active = 1 AND hotel_name IS NOT NULL
            """)
        ).fetchall()
        return [{"name": h.hotel_name} for h in hotels]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel

class CustomerRegister(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str = ""

@router.post("/register")
def register_customer(data: CustomerRegister, db: Session = Depends(get_db)):
    try:
        # Check if email exists
        existing = db.execute(text("SELECT id FROM customer_accounts WHERE email = :email"), {"email": data.email}).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        hashed_pw = get_password_hash(data.password)
        db.execute(text(
            "INSERT INTO customer_accounts (email, password, full_name, phone) VALUES (:email, :password, :full_name, :phone)"
        ), {
            "email": data.email,
            "password": hashed_pw,
            "full_name": data.full_name,
            "phone": data.phone
        })
        db.commit()
        return {"message": "Registration successful"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login_customer(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.execute(text("SELECT id, email, password, full_name, phone FROM customer_accounts WHERE email = :email"), {"email": form_data.username}).first()
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        token = create_access_token(data={"sub": user.email, "role": "customer", "customer_id": user.id})
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "phone": user.phone
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
