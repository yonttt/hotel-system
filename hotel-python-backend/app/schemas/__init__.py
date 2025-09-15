from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum

# User Schemas
class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    staff = "staff"

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    role: UserRole = UserRole.staff

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Guest Schemas
class GuestBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    id_number: Optional[str] = None
    nationality: Optional[str] = None

class GuestCreate(GuestBase):
    pass

class GuestUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    id_number: Optional[str] = None
    nationality: Optional[str] = None

class GuestResponse(GuestBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Room Schemas
class RoomBase(BaseModel):
    room_number: str
    status: str = "available"

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    status: Optional[str] = None

class RoomResponse(RoomBase):
    class Config:
        from_attributes = True

# Reservation Schemas
class IDCardType(str, Enum):
    KTP = "KTP"
    SIM = "SIM"
    PASSPORT = "PASSPORT"
    OTHERS = "OTHERS"

class GuestTitle(str, Enum):
    MR = "MR"
    MRS = "MRS"
    MS = "MS"
    DR = "DR"
    PROF = "PROF"

class GuestType(str, Enum):
    Normal = "Normal"
    VIP = "VIP"
    Corporate = "Corporate"

class TransactionStatus(str, Enum):
    Pending = "Pending"
    Confirmed = "Confirmed"
    Cancelled = "Cancelled"

class RegistrationType(str, Enum):
    Reservasi = "Reservasi"
    Walkin = "Walkin"
    Group = "Group"

class ReservationBase(BaseModel):
    reservation_no: str
    category_market: str = "Walkin"
    market_segment: str = "Normal"
    member_id: Optional[str] = None
    transaction_by: Optional[str] = None
    id_card_type: IDCardType = IDCardType.KTP
    id_card_number: Optional[str] = None
    guest_title: GuestTitle = GuestTitle.MR
    guest_name: str
    mobile_phone: Optional[str] = None
    address: Optional[str] = None
    nationality: str = "INDONESIA"
    city: Optional[str] = None
    email: Optional[str] = None
    arrival_date: datetime
    nights: int = 1
    departure_date: datetime
    guest_type: GuestType = GuestType.Normal
    guest_male: int = 1
    guest_female: int = 0
    guest_child: int = 0
    extra_bed_nights: int = 0
    extra_bed_qty: int = 0
    room_number: Optional[str] = None
    transaction_status: TransactionStatus = TransactionStatus.Pending
    payment_method: str = "Debit BCA 446"
    registration_type: RegistrationType = RegistrationType.Reservasi
    note: Optional[str] = None
    payment_amount: Decimal = Decimal('0.00')
    discount: Decimal = Decimal('0.00')
    payment_diskon: Decimal = Decimal('0.00')
    deposit: Decimal = Decimal('0.00')
    balance: Decimal = Decimal('0.00')
    hotel_name: str = "New Idola Hotel"

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    category_market: Optional[str] = None
    market_segment: Optional[str] = None
    member_id: Optional[str] = None
    transaction_by: Optional[str] = None
    id_card_type: Optional[IDCardType] = None
    id_card_number: Optional[str] = None
    guest_title: Optional[GuestTitle] = None
    guest_name: Optional[str] = None
    mobile_phone: Optional[str] = None
    address: Optional[str] = None
    nationality: Optional[str] = None
    city: Optional[str] = None
    email: Optional[str] = None
    arrival_date: Optional[datetime] = None
    nights: Optional[int] = None
    departure_date: Optional[datetime] = None
    guest_type: Optional[GuestType] = None
    guest_male: Optional[int] = None
    guest_female: Optional[int] = None
    guest_child: Optional[int] = None
    extra_bed_nights: Optional[int] = None
    extra_bed_qty: Optional[int] = None
    room_number: Optional[str] = None
    transaction_status: Optional[TransactionStatus] = None
    payment_method: Optional[str] = None
    registration_type: Optional[RegistrationType] = None
    note: Optional[str] = None
    payment_amount: Optional[Decimal] = None
    discount: Optional[Decimal] = None
    payment_diskon: Optional[Decimal] = None
    deposit: Optional[Decimal] = None
    balance: Optional[Decimal] = None
    hotel_name: Optional[str] = None

class ReservationResponse(ReservationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True