from sqlalchemy import Column, Integer, String, DateTime, Enum, Text, Boolean, DECIMAL
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    email = Column(String(100))
    role = Column(Enum('admin', 'manager', 'staff'), default='staff')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Room(Base):
    __tablename__ = "rooms"
    
    room_number = Column(String(20), primary_key=True)
    status = Column(String(20), default='available')

class Guest(Base):
    __tablename__ = "guests"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    id_number = Column(String(50))
    nationality = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class HotelReservation(Base):
    __tablename__ = "hotel_reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    reservation_no = Column(String(20), unique=True)
    category_market = Column(String(50), default='Walkin')
    market_segment = Column(String(50), default='Normal')
    member_id = Column(String(50))
    transaction_by = Column(String(100))
    id_card_type = Column(Enum('KTP', 'SIM', 'PASSPORT', 'OTHERS'), default='KTP')
    id_card_number = Column(String(50))
    guest_title = Column(Enum('MR', 'MRS', 'MS', 'DR', 'PROF'), default='MR')
    guest_name = Column(String(100))
    mobile_phone = Column(String(20))
    address = Column(Text)
    nationality = Column(String(50), default='INDONESIA')
    city = Column(String(100))
    email = Column(String(100))
    arrival_date = Column(DateTime)
    nights = Column(Integer, default=1)
    departure_date = Column(DateTime)
    guest_type = Column(Enum('Normal', 'VIP', 'Corporate'), default='Normal')
    guest_male = Column(Integer, default=1)
    guest_female = Column(Integer, default=0)
    guest_child = Column(Integer, default=0)
    extra_bed_nights = Column(Integer, default=0)
    extra_bed_qty = Column(Integer, default=0)
    room_number = Column(String(20))
    transaction_status = Column(Enum('Pending', 'Confirmed', 'Cancelled'), default='Pending')
    payment_method = Column(String(50), default='Debit BCA 446')
    registration_type = Column(Enum('Reservasi', 'Walkin', 'Group'), default='Reservasi')
    note = Column(Text)
    payment_amount = Column(DECIMAL(10, 2), default=0.00)
    discount = Column(DECIMAL(10, 2), default=0.00)
    payment_diskon = Column(DECIMAL(10, 2), default=0.00)
    deposit = Column(DECIMAL(10, 2), default=0.00)
    balance = Column(DECIMAL(10, 2), default=0.00)
    hotel_name = Column(String(100), default='New Idola Hotel')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class GuestRegistration(Base):
    __tablename__ = "guest_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_no = Column(String(20), unique=True)
    category_market_id = Column(Integer)
    market_segment = Column(String(100), default='Normal')
    member_id = Column(String(50))
    transaction_by = Column(String(100))
    id_card_type = Column(String(10), default='KTP')
    id_card_number = Column(String(50))
    guest_name = Column(String(200))
    guest_title = Column(String(10), default='MR')
    mobile_phone = Column(String(20))
    address = Column(Text)
    nationality_id = Column(Integer)
    city_id = Column(Integer)
    email = Column(String(100))
    arrival_date = Column(DateTime)
    arrival_time = Column(String(10))
    nights = Column(Integer, default=1)
    departure_date = Column(DateTime)
    guest_type = Column(String(50), default='Normal')
    guest_count_male = Column(Integer, default=0)
    guest_count_female = Column(Integer, default=0)
    guest_count_child = Column(Integer, default=0)
    extra_bed_nights = Column(Integer, default=0)
    extra_bed_qty = Column(Integer, default=0)
    room_number = Column(String(20))
    transaction_status = Column(String(50), default='Registration')
    payment_method_id = Column(Integer)
    registration_type_id = Column(Integer)
    notes = Column(Text)
    payment_amount = Column(DECIMAL(12, 2), default=0.00)
    discount = Column(DECIMAL(12, 2), default=0.00)
    payment_diskon = Column(DECIMAL(12, 2), default=0.00)
    deposit = Column(DECIMAL(12, 2), default=0.00)
    balance = Column(DECIMAL(12, 2), default=0.00)
    created_by = Column(Integer)
    hotel_name = Column(String(100), default='New Idola Hotel')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())