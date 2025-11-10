from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, hotel_rooms, room_pricing, guests, hotel_registrations, hotel_reservations, cities, nationalities, category_markets, market_segments, payment_methods, group_bookings
from app.core.config import settings

app = FastAPI(
    title="Hotel Management System API",
    description="Modern Python API for Eva Group Hotel Management System",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # React dev server (prioritize 5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Hotel Management System API is running"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(hotel_rooms.router, prefix="/hotel-rooms", tags=["hotel-rooms"])
app.include_router(room_pricing.router, prefix="/room-pricing", tags=["room-pricing"])
app.include_router(guests.router, prefix="/guests", tags=["guests"])
app.include_router(hotel_registrations.router, prefix="/hotel-registrations", tags=["hotel-registrations"])
app.include_router(hotel_reservations.router, prefix="/hotel-reservations", tags=["hotel-reservations"])
app.include_router(group_bookings.router, prefix="", tags=["group-bookings"])
app.include_router(cities.router, prefix="", tags=["cities"])
app.include_router(nationalities.router, prefix="", tags=["countries"])
app.include_router(category_markets.router, prefix="", tags=["category-markets"])
app.include_router(market_segments.router, prefix="", tags=["market-segments"])
app.include_router(payment_methods.router, prefix="", tags=["payment-methods"])

@app.get("/")
def read_root():
    return {"message": "Hotel Management System API is running!"}

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        from app.core.database import engine
        from app.models import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("API will still work but database operations may fail")

@app.get("/")
async def root():
    return {
        "message": "Eva Group Hotel Management System API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}