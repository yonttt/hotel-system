"""
app/routes/chatbot.py - Bilingual LLM Chatbot for Eva Group Hotel
"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from app.config.database import get_db
from app.config.auth import get_current_user
from app.tables import ChatbotKnowledgeBase, ChatbotSession, HotelReservation, User
from app.rules import (
    ChatbotKnowledgeCreate, ChatbotKnowledgeUpdate, ChatbotKnowledgeResponse,
    ChatbotAskRequest, ChatbotAskResponse, ChatbotSessionResponse
)
import uuid
import logging
import os
import re
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# ── Global LLM state ──
_groq_client = None
RAG_AVAILABLE = False


def init_rag():
    """Initialize the Groq client on first use, reading the API key from the
    GROQ_API_KEY environment variable (.env). If the key is missing, the chatbot
    gracefully falls back to keyword matching instead of crashing."""
    global _groq_client, RAG_AVAILABLE
    if RAG_AVAILABLE:
        return
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        RAG_AVAILABLE = False
        logger.warning(
            "⚠️ GROQ_API_KEY is not set — the chatbot will fall back to keyword "
            "matching. Set GROQ_API_KEY in your .env to enable AI answers and voice."
        )
        return
    try:
        from groq import Groq
        _groq_client = Groq(api_key=api_key)
        RAG_AVAILABLE = True
        logger.info("✅ Groq client initialized successfully.")
    except Exception as e:
        RAG_AVAILABLE = False
        logger.warning(f"⚠️ Groq not available: {e}")


# ── Intent detection ──
# Explicit availability phrases (multi-word to avoid false positives).
REALTIME_KEYWORDS = [
    "how many rooms", "berapa kamar", "berapa banyak kamar",
    "rooms available", "room available", "available rooms",
    "kamar tersedia", "kamar yang tersedia", "kamar kosong",
    "sisa kamar", "masih ada kamar", "ketersediaan kamar",
    "currently occupied", "how many occupied", "vacant room", "vacancy",
]
# A question counts as "availability" if it mentions a room AND an availability
# word — this catches "how many standard rooms are available" without misfiring
# on "what facilities are available?".
_ROOM_WORDS = ("room", "rooms", "kamar")
_AVAIL_WORDS = (
    "available", "availability", "vacant", "vacancy", "left",
    "tersedia", "kosong", "sisa", "ketersediaan",
)

# Confidential / private data — always refuse. Worded to avoid blocking
# legitimate FAQs (e.g. "do I need an ID at check-in", "what is your phone number").
CONFIDENTIAL_KEYWORDS = [
    # financials
    "profit", "revenue", "income", "earnings", "laba", "pendapatan", "keuntungan",
    "net income", "financial report", "laporan keuangan", "total revenue",
    "how much money", "occupancy rate", "tingkat hunian",
    "staff salary", "salaries", "gaji karyawan", "employee pay", "payroll",
    # other guests' private data
    "guest list", "guest names", "list of guests", "daftar tamu", "daftar nama tamu",
    "who is staying", "who's staying", "siapa yang menginap", "siapa menginap",
    "other guest", "other guests", "tamu lain", "guest in room", "tamu di kamar",
    "siapa di kamar", "guest phone", "guest email", "nomor telepon tamu",
    "email tamu", "kontak tamu", "guest data", "data tamu", "informasi pribadi tamu",
    # system / credentials
    "password", "kata sandi", "credential", "api key", "secret key",
    "akses admin", "admin login",
]

def is_confidential_question(message: str) -> bool:
    msg_lower = message.lower()
    return any(kw in msg_lower for kw in CONFIDENTIAL_KEYWORDS)

def is_realtime_question(message: str) -> bool:
    m = message.lower()
    if any(kw in m for kw in REALTIME_KEYWORDS):
        return True
    has_room = any(w in m for w in _ROOM_WORDS)
    has_avail = any(w in m for w in _AVAIL_WORDS)
    return has_room and has_avail


def get_realtime_context(message: str, db: Session) -> str:
    """Live, NON-SENSITIVE operational data for the chatbot: room-availability
    counts only. Never returns guest names, contacts, payments, financials, or
    any other private information — only aggregate counts per room type."""
    from sqlalchemy import text
    today = datetime.now().date()
    parts = [f"Today's date: {today.strftime('%B %d, %Y')}"]
    try:
        # Rooms ready to sell = status 'VR' (Vacant Ready). Map the room-type
        # code (STD, DLX, ...) to its friendly category name.
        rows = db.execute(text(
            """
            SELECT COALESCE(rc.category_name, hr.room_type) AS type_name,
                   COUNT(*) AS available
            FROM hotel_rooms hr
            LEFT JOIN room_categories rc
              ON rc.category_code = hr.room_type AND rc.hotel_name = hr.hotel_name
            WHERE hr.is_active = 1 AND hr.status = 'VR'
            GROUP BY type_name
            ORDER BY type_name
            """
        )).fetchall()

        total_rooms = db.execute(text(
            "SELECT COUNT(*) FROM hotel_rooms WHERE is_active = 1"
        )).scalar() or 0

        if rows:
            total_available = sum(int(r._mapping["available"]) for r in rows)
            parts.append("Rooms ready to book right now (by type):")
            for r in rows:
                d = r._mapping
                parts.append(f"- {d['type_name']}: {int(d['available'])} available")
            parts.append(f"Total rooms available now: {total_available} out of {total_rooms}.")
        else:
            parts.append(
                "No rooms are currently marked ready to book. Please contact the "
                "front desk at 021-220-85812 for the latest availability."
            )
    except Exception as e:
        logger.warning(f"Realtime availability query failed: {e}")
        parts.append(
            "Live availability cannot be retrieved right now. Please contact the "
            "front desk at 021-220-85812 or WhatsApp 0812-1109-8511."
        )
    return "\n".join(parts)


SYSTEM_PROMPT = """
You are Eva, a warm and professional AI concierge for Eva Group Hotel.
Eva Group Hotel is a hospitality group that operates several hotels, including Hotel New Idola.
When a guest asks about "the hotel" in general, represent Eva Group Hotel; when they ask about a specific property such as Hotel New Idola, answer for that property using the context.
IMPORTANT: Always respond in the SAME LANGUAGE as the guest's question.
- If the guest writes in Indonesian (Bahasa Indonesia), respond fully in Indonesian.
- If the guest writes in English, respond in English.
Answer the guest's question naturally and helpfully using ONLY the context provided.

PRIVACY & SECURITY (very important — never violate):
- NEVER reveal personal data about any guest: names, phone numbers, emails, ID/KTP/passport numbers, addresses, which room a guest is in, or who is staying.
- NEVER reveal staff data, salaries, passwords, API keys, database details, or any internal system information.
- NEVER reveal financial figures such as revenue, profit, income, or occupancy rates.
- You MAY share general information only: room types, rates, facilities, services, policies, and how many rooms are currently available (counts only).
- If asked for any forbidden information, politely refuse and offer to help with general hotel information instead.

FORMATTING:
- When the answer contains several items — such as room types, facilities, amenities, services, price lists, or step-by-step instructions — format them as a bullet list, one item per line, each line starting with "- ".
- Add a short introductory sentence before the list, and keep each bullet concise.
- For a simple, single-fact answer (e.g. check-in time), reply in a normal sentence without bullets.

WHEN A GUEST WANTS TO BOOK A ROOM:
- Do NOT give phone numbers, WhatsApp, email, or website to make the booking. The booking is done directly through the link.
- The context may include an "AVAILABLE ROOMS & BOOKING LINKS" section listing each room type with its booking link.
- Reply briefly and warmly, then give the booking link as a markdown link, and tell the guest to click it and fill in their booking details (check-in/check-out dates, number of guests, and contact information) on the page that opens.
- For a specific room type, use that room's link, e.g. [Book Standard Room](/booking?room=3).
- If the guest hasn't chosen a room type yet, use the general link [Book Now](/booking) and briefly mention the available room types.
- Only use links that appear in the context. Never invent a link or a room id.
- Example reply (Indonesian): "Tentu! Silakan klik link berikut untuk memesan Kamar Standard: [Book Standard Room](/booking?room=3). Setelah halaman terbuka, lengkapi tanggal menginap dan data Anda untuk menyelesaikan pemesanan. 😊"

The phone/WhatsApp/email contact details are only for when a guest asks how to CONTACT the hotel, or when the requested information is not available — NOT for making a booking.

If the answer is not in the context, say (in the guest's language):
English: "I'm sorry, I don't have that information right now. Please contact our front desk at 021-220-85812 or WhatsApp 0812-1109-8511."
Indonesian: "Mohon maaf, saya tidak memiliki informasi tersebut saat ini. Silakan hubungi resepsionis kami di 021-220-85812 atau WhatsApp 0812-1109-8511."
Keep answers concise, friendly, and professional.
Never make up information not in the context.
"""

def get_booking_context(db: Session, hotel_id: Optional[int] = None) -> str:
    """Fetch active room categories and build a booking-link reference for the LLM."""
    from sqlalchemy import text
    try:
        sql = """
            SELECT id, category_name, normal_rate, hotel_name
            FROM room_categories
            WHERE is_active = 1
            ORDER BY hotel_name, normal_rate ASC
        """
        rows = db.execute(text(sql)).fetchall()
        if not rows:
            return ""
        from urllib.parse import quote
        lines = []
        for r in rows:
            d = dict(r._mapping)
            try:
                rate = f"Rp {int(d['normal_rate']):,}".replace(",", ".")
            except (TypeError, ValueError):
                rate = "—"
            link = f"/booking?room={d['id']}"
            if d.get("hotel_name"):
                link += f"&destination={quote(str(d['hotel_name']))}"
            lines.append(
                f"- {d['category_name']} ({rate}/night) → booking link: {link}"
            )
        return "AVAILABLE ROOMS & BOOKING LINKS:\n" + "\n".join(lines)
    except Exception as e:
        logger.warning(f"Could not load booking rooms: {e}")
        return ""


def generate_llm_answer(query: str, context: str, lang: str = "en") -> str:
    if not RAG_AVAILABLE:
        return None
    try:
        # Strong, per-request language anchor. The KB context is mostly Indonesian,
        # which can make the model drift; this forces it to match the guest.
        if lang == "id":
            lang_directive = (
                "\n\nLANGUAGE INSTRUCTION: The guest wrote in Indonesian. Write your "
                "ENTIRE answer in Bahasa Indonesia, even though the context may be in "
                "another language."
            )
        else:
            lang_directive = (
                "\n\nLANGUAGE INSTRUCTION: The guest wrote in English. Write your "
                "ENTIRE answer in English, even though the context may be in "
                "another language."
            )
        user_message = (
            f"Context:\n---\n{context}\n---\nGuest question: {query}{lang_directive}\n\n"
            "Answer based only on the context above:"
        )
        response = _groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            max_tokens=1024,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"LLM error: {e}")
        return None


# Clearly-Indonesian words only. Ambiguous English-collision words (e.g. "hotel",
# "booking", "checkin") are intentionally excluded so English questions are not
# misdetected as Indonesian.
_ID_WORDS = {
    "apa", "ada", "tidak", "bisa", "saya", "kamu", "kami", "kita",
    "kamar", "harga", "berapa", "dimana", "kapan", "bagaimana", "tolong",
    "mau", "ingin", "boleh", "apakah", "dengan", "untuk", "dari", "yang",
    "dan", "atau", "ini", "itu", "juga", "sudah", "belum", "akan",
    "sarapan", "parkir", "fasilitas", "reservasi", "pesan",
    "makan", "minum", "restoran", "bayar", "pembayaran",
    "selamat", "pagi", "siang", "sore", "malam", "halo",
    "mohon", "maaf", "terima", "kasih", "tersedia",
}

def detect_language(message: str) -> str:
    words = set(re.sub(r'[^\w\s]', '', message.lower()).split())
    return "id" if words & _ID_WORDS else "en"

def _fallback(lang: str, kind: str) -> str:
    if lang == "id":
        if kind == "confidential":
            return (
                "Mohon maaf, informasi tersebut bersifat rahasia dan tidak dapat kami sampaikan "
                "melalui layanan ini. Silakan hubungi manajemen hotel secara langsung untuk informasi lebih lanjut."
            )
        elif kind == "realtime":
            return (
                "Untuk informasi ketersediaan kamar terkini, silakan hubungi resepsionis kami "
                "di 021-220-85812 atau WhatsApp 0812-1109-8511. Kami siap membantu!"
            )
        else:
            return (
                "Terima kasih atas pesan Anda. Saat ini kami belum memiliki informasi spesifik "
                "mengenai hal tersebut. Silakan hubungi resepsionis kami di 021-220-85812 "
                "atau WhatsApp 0812-1109-8511 untuk bantuan lebih lanjut."
            )
    else:
        if kind == "confidential":
            return (
                "I'm sorry, that information is confidential and not available through this channel. "
                "Please contact the hotel management directly for assistance."
            )
        elif kind == "realtime":
            return (
                "For the most up-to-date room availability, please contact our front desk "
                "at 021-220-85812 or WhatsApp 0812-1109-8511. We're happy to assist!"
            )
        else:
            return (
                "Thank you for your message. I don't have specific information about that topic yet. "
                "Please contact our front desk at 021-220-85812 or WhatsApp 0812-1109-8511 for assistance."
            )


_STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "i", "you", "he", "she", "it", "we",
    "they", "me", "him", "her", "us", "them", "my", "your", "his", "its",
    "our", "their", "what", "which", "who", "this", "that", "these", "those",
    "where", "when", "why", "how", "any", "some", "no", "not", "there",
    "here", "in", "on", "at", "by", "for", "with", "about", "from", "to",
    "and", "but", "or", "if", "of", "up", "than", "so", "just", "also",
}

def keyword_match(message: str, entries: List) -> Optional[str]:
    def meaningful_words(text: str) -> set:
        words = set(re.sub(r'[^\w\s]', '', text.lower()).split())
        return words - _STOP_WORDS

    user_words = meaningful_words(message)
    if not user_words:
        return None

    best_answer = None
    best_score = 0
    for entry in entries:
        entry_words = meaningful_words(entry["question"])
        score = len(user_words & entry_words)
        if score > best_score:
            best_score = score
            best_answer = entry["answer"]
    return best_answer if best_score > 0 else None


# ── Main endpoint ──
@router.post("/ask", response_model=ChatbotAskResponse)
def ask_chatbot(request: ChatbotAskRequest, db: Session = Depends(get_db)):
    # Initialize RAG on first request
    init_rag()

    try:
        session_id = request.session_id or str(uuid.uuid4())
        bot_response = None

        # Load knowledge base
        kb_query = db.query(ChatbotKnowledgeBase).filter(
            ChatbotKnowledgeBase.is_active == True
        )
        if request.hotel_id:
            kb_query = kb_query.filter(
                (ChatbotKnowledgeBase.hotel_id == request.hotel_id) |
                (ChatbotKnowledgeBase.hotel_id == None)
            )
        else:
            kb_query = kb_query.filter(ChatbotKnowledgeBase.hotel_id == None)
        # Convert to plain dicts immediately — ORM objects detach after session closes
        entries = [{"question": e.question, "answer": e.answer} for e in kb_query.all()]

        lang = detect_language(request.message)

        # Refuse confidential / financial questions
        if is_confidential_question(request.message):
            bot_response = _fallback(lang, "confidential")
        # Detect intent and route
        elif is_realtime_question(request.message):
            logger.info(f"[Chatbot] Real-time: {request.message}")
            realtime_context = get_realtime_context(request.message, db)
            bot_response = generate_llm_answer(request.message, realtime_context, lang)
            if not bot_response:
                bot_response = _fallback(lang, "realtime")
        else:
            logger.info(f"[Chatbot] KB lookup: {request.message}")
            if RAG_AVAILABLE and entries:
                # Pass all KB entries as context — Groq handles multilingual natively
                context = "\n\n".join(
                    f"Q: {e['question']}\nA: {e['answer']}" for e in entries
                )
                # Append live room list + booking links so Eva can guide bookings
                booking_context = get_booking_context(db, request.hotel_id)
                if booking_context:
                    context += "\n\n" + booking_context
                bot_response = generate_llm_answer(request.message, context, lang)
            if not bot_response:
                bot_response = keyword_match(request.message, entries)

        if not bot_response:
            bot_response = _fallback(lang, "generic")

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


# ── Voice transcript cleanup ──
class TranscriptCleanRequest(BaseModel):
    text: str


TRANSCRIPT_CLEAN_PROMPT = (
    "You are a strict transcription corrector for raw speech-to-text from a hotel guest.\n"
    "Your ONLY job is to fix capitalization, punctuation, and clear spelling errors.\n"
    "STRICT RULES:\n"
    "- Do NOT add, remove, reorder, complete, or replace any words.\n"
    "- Do NOT invent content, finish sentences, or add questions/phrases that were not spoken.\n"
    "- Keep exactly the same words, meaning, and language (Indonesian or English).\n"
    "- If the text is already correct, return it unchanged.\n"
    "Output ONLY the corrected text — nothing else, no quotes, no explanation."
)


def _clean_text(text: str) -> str:
    """Fix spelling/punctuation/casing of a transcript via the LLM, strictly
    without adding, removing, or rephrasing any words."""
    text = (text or "").strip()
    if not text or not RAG_AVAILABLE:
        return text
    try:
        response = _groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": TRANSCRIPT_CLEAN_PROMPT},
                {"role": "user", "content": text},
            ],
            temperature=0,
            max_tokens=256,
        )
        cleaned = response.choices[0].message.content.strip()
        return cleaned or text
    except Exception as e:
        logger.warning(f"Transcript cleanup failed: {e}")
        return text


@router.post("/clean-transcript")
def clean_transcript(req: TranscriptCleanRequest):
    """Clean up a raw text transcript with the LLM before it is shown."""
    init_rag()
    return {"text": _clean_text(req.text)}


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe an uploaded audio clip with Groq Whisper and return it as-is.
    Works in any browser that can record audio (MediaRecorder), including Brave,
    Firefox, and Safari. Whisper auto-detects Indonesian vs English."""
    init_rag()
    if not RAG_AVAILABLE:
        raise HTTPException(status_code=503, detail="Speech service unavailable.")
    try:
        data = await audio.read()
        if not data:
            return {"text": ""}
        filename = audio.filename or "recording.webm"
        result = _groq_client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=(filename, data),
            response_format="text",
        )
        raw = result if isinstance(result, str) else getattr(result, "text", "")
        # Return Whisper's transcription as-is. We deliberately do NOT run it
        # through the LLM cleanup — Whisper is already accurate, and the small
        # cleanup model tended to rephrase/answer the words instead of just
        # fixing them (e.g. "can you speak in English" -> "yes i can ...").
        return {"text": (raw or "").strip()}
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed.")


# ── Knowledge Base CRUD ──
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
    query = db.query(ChatbotKnowledgeBase)
    if category:
        query = query.filter(ChatbotKnowledgeBase.category == category)
    if hotel_id is not None:
        query = query.filter(ChatbotKnowledgeBase.hotel_id == hotel_id)
    if is_active is not None:
        query = query.filter(ChatbotKnowledgeBase.is_active == is_active)
    return query.order_by(ChatbotKnowledgeBase.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/knowledge", response_model=ChatbotKnowledgeResponse)
def create_knowledge_entry(
    entry: ChatbotKnowledgeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    db_entry = db.query(ChatbotKnowledgeBase).filter(ChatbotKnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Knowledge entry not found")
    db.delete(db_entry)
    db.commit()
    return {"message": "Knowledge entry deleted successfully"}


# ── Session Logs ──
@router.get("/sessions", response_model=List[ChatbotSessionResponse])
def get_chatbot_sessions(
    session_id: Optional[str] = None,
    hotel_id: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ChatbotSession)
    if session_id:
        query = query.filter(ChatbotSession.session_id == session_id)
    if hotel_id is not None:
        query = query.filter(ChatbotSession.hotel_id == hotel_id)
    return query.order_by(ChatbotSession.created_at.desc()).offset(skip).limit(limit).all()