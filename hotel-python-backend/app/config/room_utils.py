"""
Shared room utility functions for the hotel management system.
This module contains reusable functions for room operations.
"""
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)


def update_room_status(db: Session, room_number: str, new_status: str):
    """
    Update room status in hotel_rooms table.
    
    Args:
        db: Database session
        room_number: The room number to update
        new_status: The new status code (e.g., 'VR', 'OR', 'AR', 'VC', etc.)
    """
    try:
        db.execute(
            text("UPDATE hotel_rooms SET status = :status WHERE room_number = :room_number"),
            {"status": new_status, "room_number": room_number}
        )
    except Exception as e:
        logger.warning(f"Could not update room status for room {room_number}: {e}")
