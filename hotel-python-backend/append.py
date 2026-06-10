import sys
import shutil
import os
import uuid
from datetime import datetime

endpoint = """
@router.post("/number/{reservation_no}/upload-proof")
async def upload_payment_proof(
    reservation_no: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    db_reservation = db.query(HotelReservation).filter(HotelReservation.reservation_no == reservation_no).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{reservation_no}_{uuid.uuid4().hex[:8]}.{ext}"
    file_path = os.path.join("uploads/payment_proofs", filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")
    
    db_reservation.payment_proof = file_path
    db_reservation.payment_proof_at = datetime.now()
    if db_reservation.transaction_status == 'Pending':
        db_reservation.transaction_status = 'Confirmed'
    
    db.commit()
    
    return {"message": "Payment proof uploaded successfully", "file_path": far/uploads/payment_proofs/{filename}"}
"""

with open('hotel-python-backend/app/routes/hotel_reservations.py', 'a', encoding='utf-8') as f:
    f.write(endpoint)