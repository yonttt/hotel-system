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
        # Fetch active room categories. `physical_available` counts how many physical
        # rooms of this type are currently vacant/ready (statuses VR/VC/available); the
        # correlated subquery matches rooms by room_type = category_code within the hotel.
        categories = db.execute(
            text("""
                SELECT rc.id, rc.category_code, rc.category_name, rc.description,
                       rc.normal_rate, rc.weekend_rate, rc.six_hours_rate, rc.photo_url,
                       rc.discount_percentage, rc.hotel_name, rc.online_quota,
                       rc.room_size, rc.bed_type, rc.capacity, rc.amenities,
                       (SELECT COUNT(*) FROM hotel_rooms hr
                          WHERE hr.is_active = 1
                            AND hr.status IN ('available', 'VC', 'VR')
                            AND hr.room_type = rc.category_code
                            AND (hr.hotel_name = rc.hotel_name OR rc.hotel_name IS NULL)
                       ) AS physical_available
                FROM room_categories rc
                WHERE rc.is_active = 1
                ORDER BY rc.hotel_name, rc.normal_rate ASC
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

            # Website-facing specs are editable per room type via the CMS. Fall back to
            # sensible defaults when a field hasn't been filled in yet.
            cat_dict['size'] = cat_dict.get('room_size') or '30 m²'
            cat_dict['bed_type'] = cat_dict.get('bed_type') or 'King Size'
            cat_dict['capacity'] = cat_dict.get('capacity') or 2
            amenities_raw = cat_dict.get('amenities')
            if amenities_raw:
                cat_dict['amenities'] = [a.strip() for a in amenities_raw.split(',') if a.strip()]
            else:
                cat_dict['amenities'] = ['WiFi Gratis', 'AC', 'TV LED', 'Room Service']

            # Published price for the website = normal_rate minus the staff-configured discount.
            discount_pct = float(cat_dict.get('discount_percentage') or 0)
            normal_rate = float(cat_dict['normal_rate'])
            cat_dict['original_rate'] = normal_rate
            cat_dict['discount_percentage'] = discount_pct
            cat_dict['published_rate'] = round(normal_rate * (1 - discount_pct / 100), 2) if discount_pct > 0 else normal_rate

            # How many rooms to actually offer online. The staff-set online_quota lets the
            # hotel hold some rooms back for walk-in guests: we never show more than the
            # quota, and never more than what is physically available right now.
            physical = int(cat_dict.get('physical_available') or 0)
            quota = cat_dict.get('online_quota')
            cat_dict['available_rooms'] = physical if quota is None else max(0, min(physical, int(quota)))

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

@router.get("/website-hotels")
def get_website_hotels(db: Session = Depends(get_db)):
    """Public list of hotels to show on the website Hotels page.

    Only hotels explicitly enabled (show_on_website = 1) are returned, so staff can
    control which of the shared/payroll hotel records appear publicly. Each hotel
    also carries a count of its active room types.
    """
    try:
        rows = db.execute(
            text("""
                SELECT h.id, h.name, h.address, h.phone, h.email, h.photo_url,
                       h.logo_url, h.description,
                       (SELECT COUNT(*) FROM room_categories rc
                          WHERE rc.is_active = 1
                            AND rc.hotel_name COLLATE utf8mb4_general_ci = h.name COLLATE utf8mb4_general_ci
                       ) AS room_count
                FROM hotels h
                WHERE h.active = 1 AND h.show_on_website = 1
                ORDER BY h.name
            """)
        ).fetchall()
        return [dict(r._mapping) for r in rows]
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
