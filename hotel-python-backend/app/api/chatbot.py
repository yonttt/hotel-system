from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import ChatbotKnowledgeBase, ChatbotSession, User
from app.schemas import (
    ChatbotKnowledgeCreate, ChatbotKnowledgeUpdate, ChatbotKnowledgeResponse,
    ChatbotAskRequest, ChatbotAskResponse, ChatbotSessionResponse
)
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def get_knowledge_context(db: Session, hotel_id: Optional[int] = None) -> str:
    """Retrieve active knowledge base entries as context for the chatbot."""
    query = db.query(ChatbotKnowledgeBase).filter(ChatbotKnowledgeBase.is_active == True)
    if hotel_id:
        query = query.filter(
            (ChatbotKnowledgeBase.hotel_id == hotel_id) | (ChatbotKnowledgeBase.hotel_id == None)
        )
    else:
        query = query.filter(ChatbotKnowledgeBase.hotel_id == None)
    
    entries = query.all()
    if not entries:
        return "No knowledge base entries available."
    
    context_parts = []
    for entry in entries:
        context_parts.append(f"Q: {entry.question}\nA: {entry.answer}")
    
    return "\n\n".join(context_parts)


# --- Chat Endpoint ---

@router.post("/ask", response_model=ChatbotAskResponse)
def ask_chatbot(request: ChatbotAskRequest, db: Session = Depends(get_db)):
    """Receives guest message, uses knowledge base context to generate a response."""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get knowledge base context
        context = get_knowledge_context(db, request.hotel_id)
        
        # Build response from knowledge base (keyword matching)
        user_msg = request.message.lower()
        best_answer = None
        best_score = 0
        
        query = db.query(ChatbotKnowledgeBase).filter(ChatbotKnowledgeBase.is_active == True)
        if request.hotel_id:
            query = query.filter(
                (ChatbotKnowledgeBase.hotel_id == request.hotel_id) | (ChatbotKnowledgeBase.hotel_id == None)
            )
        entries = query.all()
        
        for entry in entries:
            # Simple keyword matching score
            keywords = entry.question.lower().split()
            score = sum(1 for kw in keywords if kw in user_msg)
            if score > best_score:
                best_score = score
                best_answer = entry.answer
        
        if best_answer and best_score > 0:
            bot_response = best_answer
        else:
            bot_response = (
                "Thank you for your message. I don't have specific information about that topic yet. "
                "Please contact our front desk at +62 21 1234 567 or email info@hotelresort.com for further assistance."
            )
        
        # Save session log
        session_log = ChatbotSession(
            session_id=session_id,
            user_message=request.message,
            bot_response=bot_response,
            hotel_id=request.hotel_id
        )
        db.add(session_log)
        db.commit()
        
        return ChatbotAskResponse(response=bot_response, session_id=session_id)
    
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")


# --- Knowledge Base CRUD (Admin) ---

@router.get("/knowledge", response_model=List[ChatbotKnowledgeResponse])
def get_knowledge_base(
    category: Optional[str] = None,
    hotel_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves chatbot knowledge base entries (admin use)."""
    query = db.query(ChatbotKnowledgeBase)
    
    if category:
        query = query.filter(ChatbotKnowledgeBase.category == category)
    if hotel_id is not None:
        query = query.filter(ChatbotKnowledgeBase.hotel_id == hotel_id)
    if is_active is not None:
        query = query.filter(ChatbotKnowledgeBase.is_active == is_active)
    
    entries = query.order_by(ChatbotKnowledgeBase.created_at.desc()).offset(skip).limit(limit).all()
    return entries


@router.post("/knowledge", response_model=ChatbotKnowledgeResponse)
def create_knowledge_entry(
    entry: ChatbotKnowledgeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a new knowledge base entry (admin use)."""
    db_entry = ChatbotKnowledgeBase(
        category=entry.category.value,
        question=entry.question,
        answer=entry.answer,
        hotel_id=entry.hotel_id,
        is_active=entry.is_active
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.put("/knowledge/{entry_id}", response_model=ChatbotKnowledgeResponse)
def update_knowledge_entry(
    entry_id: int,
    entry: ChatbotKnowledgeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates a knowledge base entry (admin use)."""
    db_entry = db.query(ChatbotKnowledgeBase).filter(ChatbotKnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Knowledge entry not found")
    
    update_data = entry.dict(exclude_unset=True)
    if 'category' in update_data and update_data['category']:
        update_data['category'] = update_data['category'].value
    
    for key, value in update_data.items():
        setattr(db_entry, key, value)
    
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.delete("/knowledge/{entry_id}")
def delete_knowledge_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletes a knowledge base entry (admin use)."""
    db_entry = db.query(ChatbotKnowledgeBase).filter(ChatbotKnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Knowledge entry not found")
    
    db.delete(db_entry)
    db.commit()
    return {"message": "Knowledge entry deleted successfully"}


# --- Session Logs (Admin) ---

@router.get("/sessions", response_model=List[ChatbotSessionResponse])
def get_chatbot_sessions(
    session_id: Optional[str] = None,
    hotel_id: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves chatbot conversation logs for analytics (admin use)."""
    query = db.query(ChatbotSession)
    
    if session_id:
        query = query.filter(ChatbotSession.session_id == session_id)
    if hotel_id is not None:
        query = query.filter(ChatbotSession.hotel_id == hotel_id)
    
    sessions = query.order_by(ChatbotSession.created_at.desc()).offset(skip).limit(limit).all()
    return sessions
