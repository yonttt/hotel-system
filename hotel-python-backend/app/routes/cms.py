import os
import uuid
import shutil

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, Optional
from pydantic import BaseModel

from app.config.database import get_db
from app.config.auth import get_current_user

router = APIRouter()

ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
WEBSITE_UPLOAD_DIR = "uploads/website"


def _require_editor(current_user: Any):
    """Only admins/managers may change website content."""
    if current_user.role not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized to edit website content")


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
    """Update website content (Admin Only).

    Upserts each key: updates if it already exists, inserts otherwise. This lets the
    editor introduce new content fields without anyone having to pre-seed the table.
    """
    try:
        _require_editor(current_user)

        for key, value in payload.items():
            exists = db.execute(
                text("SELECT 1 FROM website_content WHERE setting_key = :key LIMIT 1"),
                {"key": key}
            ).first()

            if exists:
                db.execute(
                    text("UPDATE website_content SET setting_value = :val WHERE setting_key = :key"),
                    {"val": value, "key": key}
                )
            else:
                # Derive a section name from the key prefix (e.g. "hero_title" -> "hero").
                section = key.split('_')[0] if '_' in key else 'general'
                setting_type = 'image' if 'image' in key or 'img' in key else 'text'
                db.execute(
                    text(
                        "INSERT INTO website_content (section_name, setting_key, setting_value, setting_type) "
                        "VALUES (:section, :key, :val, :stype)"
                    ),
                    {"section": section, "key": key, "val": value, "stype": setting_type}
                )
        db.commit()
        return {"message": "Content updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/upload")
async def upload_website_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: Any = Depends(get_current_user),
):
    """Upload an image from the website editor and return its public URL.

    The editor stores plain URL strings, so we return an *absolute* URL (built from
    the request host) — that way the same value renders correctly whether it's read
    by the admin frontend or the public site, which run on different origins.
    """
    _require_editor(current_user)

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Tipe file tidak didukung. Gunakan: jpg, jpeg, png, webp, gif")

    os.makedirs(WEBSITE_UPLOAD_DIR, exist_ok=True)

    # Filename is fully synthetic (no user input) to rule out path traversal.
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(WEBSITE_UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan file: {e}")

    # str(request.base_url) already ends with a trailing slash.
    url = f"{str(request.base_url).rstrip('/')}/{WEBSITE_UPLOAD_DIR}/{filename}"
    return {"url": url, "message": "Gambar berhasil diunggah"}


@router.get("/rooms")
def get_cms_rooms(db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    """List room categories so the editor can manage their photo/description/discount.

    Mirrors the public room data but is admin-gated and returns the raw editable
    fields (no placeholder fallbacks) so the form reflects exactly what is stored.
    """
    _require_editor(current_user)
    try:
        rows = db.execute(
            text("""
                SELECT rc.id, rc.category_code, rc.category_name, rc.description,
                       rc.normal_rate, rc.photo_url, rc.discount_percentage, rc.is_active,
                       rc.hotel_name, rc.online_quota,
                       rc.room_size, rc.bed_type, rc.capacity, rc.amenities,
                       (SELECT COUNT(*) FROM hotel_rooms hr
                          WHERE hr.is_active = 1
                            AND hr.status IN ('available', 'VC', 'VR')
                            AND hr.room_type = rc.category_code
                            AND (hr.hotel_name = rc.hotel_name OR rc.hotel_name IS NULL)
                       ) AS physical_available
                FROM room_categories rc
                ORDER BY rc.hotel_name, rc.category_code
            """)
        ).fetchall()
        return [dict(r._mapping) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


class RoomCMSUpdate(BaseModel):
    description: Optional[str] = None
    photo_url: Optional[str] = None
    discount_percentage: Optional[float] = None
    # How many rooms of this type to offer online. None = show all available rooms;
    # a number caps the online listing so some rooms stay reserved for walk-ins.
    online_quota: Optional[int] = None
    # Lets the editor explicitly clear a previously-set quota back to "show all".
    clear_quota: Optional[bool] = False
    # Website-facing specs shown on the room card.
    room_size: Optional[str] = None
    bed_type: Optional[str] = None
    capacity: Optional[int] = None
    amenities: Optional[str] = None  # comma-separated list, e.g. "WiFi, AC, TV"


@router.put("/rooms/{room_id}")
def update_cms_room(
    room_id: int,
    payload: RoomCMSUpdate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Update the website-facing fields of a room category (Admin Only).

    Only touches the fields the website editor is responsible for — description,
    photo and discount — leaving rates and codes to the Master Room Type page.
    """
    _require_editor(current_user)
    try:
        existing = db.execute(
            text("SELECT id FROM room_categories WHERE id = :id"), {"id": room_id}
        ).first()
        if not existing:
            raise HTTPException(status_code=404, detail="Tipe kamar tidak ditemukan")

        fields = []
        params: Dict[str, Any] = {"id": room_id}
        if payload.description is not None:
            fields.append("description = :description")
            params["description"] = payload.description
        if payload.photo_url is not None:
            fields.append("photo_url = :photo_url")
            params["photo_url"] = payload.photo_url
        if payload.discount_percentage is not None:
            if payload.discount_percentage < 0 or payload.discount_percentage > 100:
                raise HTTPException(status_code=400, detail="Diskon harus antara 0 dan 100")
            fields.append("discount_percentage = :discount_percentage")
            params["discount_percentage"] = payload.discount_percentage
        if payload.clear_quota:
            fields.append("online_quota = NULL")
        elif payload.online_quota is not None:
            if payload.online_quota < 0:
                raise HTTPException(status_code=400, detail="Kuota tidak boleh negatif")
            fields.append("online_quota = :online_quota")
            params["online_quota"] = payload.online_quota
        if payload.room_size is not None:
            fields.append("room_size = :room_size")
            params["room_size"] = payload.room_size
        if payload.bed_type is not None:
            fields.append("bed_type = :bed_type")
            params["bed_type"] = payload.bed_type
        if payload.capacity is not None:
            if payload.capacity < 0:
                raise HTTPException(status_code=400, detail="Kapasitas tidak boleh negatif")
            fields.append("capacity = :capacity")
            params["capacity"] = payload.capacity
        if payload.amenities is not None:
            fields.append("amenities = :amenities")
            params["amenities"] = payload.amenities

        if not fields:
            return {"message": "Tidak ada perubahan"}

        db.execute(text(f"UPDATE room_categories SET {', '.join(fields)} WHERE id = :id"), params)
        db.commit()
        return {"message": "Tipe kamar diperbarui"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/hotels")
def get_cms_hotels(db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    """List hotels with their website-facing fields so the editor can manage them.

    Returns all active hotels (not only the ones already shown publicly) so staff can
    decide which to enable via `show_on_website`.
    """
    _require_editor(current_user)
    try:
        rows = db.execute(
            text("""
                SELECT h.id, h.name, h.address, h.phone, h.email, h.photo_url,
                       h.logo_url, h.description, h.show_on_website,
                       (SELECT COUNT(*) FROM room_categories rc
                          WHERE rc.is_active = 1
                            AND rc.hotel_name COLLATE utf8mb4_general_ci = h.name COLLATE utf8mb4_general_ci
                       ) AS room_count
                FROM hotels h
                WHERE h.active = 1
                ORDER BY h.name
            """)
        ).fetchall()
        return [dict(r._mapping) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


class HotelCMSUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    description: Optional[str] = None
    show_on_website: Optional[bool] = None


@router.put("/hotels/{hotel_id}")
def update_cms_hotel(
    hotel_id: int,
    payload: HotelCMSUpdate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Update a hotel's website-facing fields (Admin Only).

    Deliberately limited to display fields — name/code and the payroll columns on the
    shared hotels table are left to the Master Hotel page.
    """
    _require_editor(current_user)
    try:
        existing = db.execute(text("SELECT id FROM hotels WHERE id = :id"), {"id": hotel_id}).first()
        if not existing:
            raise HTTPException(status_code=404, detail="Hotel tidak ditemukan")

        fields = []
        params: Dict[str, Any] = {"id": hotel_id}
        for col in ("address", "phone", "email", "photo_url", "description"):
            val = getattr(payload, col)
            if val is not None:
                fields.append(f"{col} = :{col}")
                params[col] = val
        if payload.show_on_website is not None:
            fields.append("show_on_website = :show_on_website")
            params["show_on_website"] = 1 if payload.show_on_website else 0

        if not fields:
            return {"message": "Tidak ada perubahan"}

        db.execute(text(f"UPDATE hotels SET {', '.join(fields)} WHERE id = :id"), params)
        db.commit()
        return {"message": "Hotel diperbarui"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
