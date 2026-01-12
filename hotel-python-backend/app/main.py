from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api import auth, users, hotel_rooms, room_pricing, guests, hotel_registrations, hotel_reservations, cities, nationalities, category_markets, market_segments, payment_methods, group_bookings, revenue_reports, master_data, room_rates, master_meja, kategori_menu_resto, checkout, night_audit
from app.core.config import settings
from app.core.security_middleware import (
    limiter, 
    SecurityHeadersMiddleware, 
    LoginProtectionMiddleware,
    rate_limit_exceeded_handler
)

app = FastAPI(
    title="Hotel Management System API",
    description="Modern Python API for Eva Group Hotel Management System",
    version="2.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Add Security Middlewares (order matters - first added = last executed)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoginProtectionMiddleware)

# Configure CORS with more specific settings
# For production, replace with your actual domain(s)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    # Add production domains here:
    # "https://your-hotel-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
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
app.include_router(revenue_reports.router, prefix="/revenue-reports", tags=["revenue-reports"])
app.include_router(master_data.router, prefix="/master-data", tags=["master-data"])
app.include_router(room_rates.router, prefix="/room-rates", tags=["room-rates"])
app.include_router(master_meja.router, prefix="", tags=["master-meja"])
app.include_router(kategori_menu_resto.router, prefix="", tags=["kategori-menu-resto"])
app.include_router(checkout.router, prefix="/checkout", tags=["checkout"])
app.include_router(night_audit.router, prefix="/night-audit", tags=["night-audit"])

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