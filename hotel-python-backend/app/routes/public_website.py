from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config.database import get_db
from app.tables import HotelReservation

router = APIRouter()

@router.get("/rooms")
def get_public_rooms(db: Session = Depends(get_db)):
    """Fetch public room categories with their prices to show on the website."""
    try:
        # Fetch active room categories
        categories = db.execute(
            text("""
                SELECT id, category_code, category_name, description,
                       normal_rate, weekend_rate, six_hours_rate, photo_url, discount_percentage, hotel_name
                FROM room_categories
                WHERE is_active = 1
                ORDER BY hotel_name, normal_rate ASC
            """)
        ).fetchall()

        # Format the response
        result = []
        for cat in categories:
            cat_dict = dict(cat._mapping)

            # Staff-managed photo (Master Room Type page) takes priority; fall back to a
            # generic placeholder image only if nothing has been uploaded yet.
            if not cat_dict.get('photo_url'):
                picture = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80'
                if 'suite' in str(cat_dict['category_name']).lower() or 'exe' in str(cat_dict['category_code']).lower():
                    picture = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
                elif 'dlx' in str(cat_dict['category_code']).lower() or 'deluxe' in str(cat_dict['category_name']).lower():
                    picture = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
                cat_dict['image'] = picture
            else:
                cat_dict['image'] = cat_dict['photo_url']

            cat_dict['amenities'] = ['WiFi Gratis', 'AC', 'TV LED', 'Room Service']

            # Published price for the website = normal_rate minus the staff-configured discount.
            discount_pct = float(cat_dict.get('discount_percentage') or 0)
            normal_rate = float(cat_dict['normal_rate'])
            cat_dict['original_rate'] = normal_rate
            cat_dict['discount_percentage'] = discount_pct
            cat_dict['published_rate'] = round(normal_rate * (1 - discount_pct / 100), 2) if discount_pct > 0 else normal_rate

            result.append(cat_dict)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/hotels")
def get_public_hotels(db: Session = Depends(get_db)):
    """Get the distinct list of hotels available, with contact info for display on the site."""
    try:
        room_hotels = db.execute(
            text("""
                SELECT DISTINCT hotel_name
                FROM room_categories
                WHERE is_active = 1 AND hotel_name IS NOT NULL
            """)
        ).fetchall()
        names = [h.hotel_name for h in room_hotels]
        if not names:
            return []

        hotels = db.execute(text("SELECT name, phone, address, email FROM hotels")).fetchall()
        by_name = {h.name: h for h in hotels}
        return [
            {
                "name": name,
                "phone": by_name[name].phone if name in by_name else None,
                "address": by_name[name].address if name in by_name else None,
                "email": by_name[name].email if name in by_name else None,
            }
            for name in names
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/booking-lookup")
def lookup_booking(reservation_no: str, email: str, db: Session = Depends(get_db)):
    """Let a guest check their own booking status and payment proof.

    Requires both reservation_no and the email used at booking time, so a
    guest can't enumerate other people's reservations by guessing numbers.
    """
    reservation = db.query(HotelReservation).filter(
        HotelReservation.reservation_no == reservation_no,
        HotelReservation.email == email
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Booking not found. Periksa kembali nomor reservasi dan email Anda.")

    return {
        "reservation_no": reservation.reservation_no,
        "guest_name": reservation.guest_name,
        "hotel_name": reservation.hotel_name,
        "room_type": reservation.room_type,
        "arrival_date": reservation.arrival_date,
        "departure_date": reservation.departure_date,
        "nights": reservation.nights,
        "transaction_status": reservation.transaction_status,
        "payment_method": reservation.payment_method,
        "payment_amount": reservation.payment_amount,
        "deposit": reservation.deposit,
        "balance": reservation.balance,
        "payment_proof": f"/{reservation.payment_proof}" if reservation.payment_proof else None,
        "payment_deadline": reservation.payment_deadline,
    }

from fastapi.security import OAuth2PasswordRequestForm
from app.config.security import get_password_hash, verify_password, create_access_token
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
