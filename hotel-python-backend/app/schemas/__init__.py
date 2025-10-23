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

# Guest Registration Schemas
class GuestRegistrationBase(BaseModel):
    registration_no: str
    category_market_id: Optional[int] = None
    market_segment: str = "Normal"
    member_id: Optional[str] = None
    transaction_by: Optional[str] = None
    id_card_type: str = "KTP"
    id_card_number: Optional[str] = None
    guest_name: Optional[str] = None
    guest_title: str = "MR"
    mobile_phone: Optional[str] = None
    address: Optional[str] = None
    nationality_id: Optional[int] = None
    city_id: Optional[int] = None
    email: Optional[str] = None
    arrival_date: Optional[datetime] = None
    arrival_time: Optional[str] = None
    nights: int = 1
    departure_date: Optional[datetime] = None
    guest_type: str = "Normal"
    guest_count_male: int = 0
    guest_count_female: int = 0
    guest_count_child: int = 0
    extra_bed_nights: int = 0
    extra_bed_qty: int = 0
    room_number: Optional[str] = None
    transaction_status: str = "Registration"
    payment_method_id: Optional[int] = None
    notes: Optional[str] = None
    payment_amount: Decimal = Decimal('0.00')
    discount: Decimal = Decimal('0.00')
    payment_diskon: Decimal = Decimal('0.00')
    deposit: Decimal = Decimal('0.00')
    balance: Decimal = Decimal('0.00')
    created_by: Optional[int] = None
    hotel_name: str = "New Idola Hotel"

class GuestRegistrationCreate(GuestRegistrationBase):
    pass

class GuestRegistrationUpdate(BaseModel):
    category_market_id: Optional[int] = None
    market_segment: Optional[str] = None
    member_id: Optional[str] = None
    transaction_by: Optional[str] = None
    id_card_type: Optional[str] = None
    id_card_number: Optional[str] = None
    guest_name: Optional[str] = None
    guest_title: Optional[str] = None
    mobile_phone: Optional[str] = None
    address: Optional[str] = None
    nationality_id: Optional[int] = None
    city_id: Optional[int] = None
    email: Optional[str] = None
    arrival_date: Optional[datetime] = None
    arrival_time: Optional[str] = None
    nights: Optional[int] = None
    departure_date: Optional[datetime] = None
    guest_type: Optional[str] = None
    guest_count_male: Optional[int] = None
    guest_count_female: Optional[int] = None
    guest_count_child: Optional[int] = None
    extra_bed_nights: Optional[int] = None
    extra_bed_qty: Optional[int] = None
    room_number: Optional[str] = None
    transaction_status: Optional[str] = None
    payment_method_id: Optional[int] = None
    notes: Optional[str] = None
    payment_amount: Optional[Decimal] = None
    discount: Optional[Decimal] = None
    payment_diskon: Optional[Decimal] = None
    deposit: Optional[Decimal] = None
    balance: Optional[Decimal] = None
    created_by: Optional[int] = None
    hotel_name: Optional[str] = None

class GuestRegistrationResponse(GuestRegistrationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Group Booking Room Schema
class GroupBookingRoomBase(BaseModel):
    room_number: str
    room_type: Optional[str] = None
    guest_name: str
    guest_title: Optional[str] = "MR"
    id_card_type: Optional[str] = "KTP"
    id_card_number: Optional[str] = None
    mobile_phone: Optional[str] = None
    nationality: Optional[str] = "INDONESIA"
    city: Optional[str] = None
    address: Optional[str] = None
    guest_count_male: Optional[int] = 1
    guest_count_female: Optional[int] = 0
    guest_count_child: Optional[int] = 0
    extra_bed: Optional[int] = 0
    rate: Optional[Decimal] = Decimal('0.000')
    discount: Optional[Decimal] = Decimal('0.000')
    subtotal: Optional[Decimal] = Decimal('0.000')
    room_status: Optional[str] = "Reserved"

class GroupBookingRoomCreate(GroupBookingRoomBase):
    group_booking_id: str
    reservation_no: str

class GroupBookingRoomResponse(GroupBookingRoomBase):
    id: int
    group_booking_id: str
    reservation_no: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Group Booking Schema
class GroupBookingBase(BaseModel):
    group_name: str
    group_pic: str
    pic_phone: str
    pic_email: Optional[str] = None
    arrival_date: datetime
    departure_date: datetime
    nights: int
    payment_method: str
    total_deposit: Optional[Decimal] = Decimal('0.000')
    notes: Optional[str] = None

from typing import List

class GroupBookingCreate(GroupBookingBase):
    rooms: List[GroupBookingRoomBase]
    created_by: Optional[str] = "ADMIN"
    hotel_name: Optional[str] = "New Idola Hotel"

class GroupBookingUpdate(BaseModel):
    group_name: Optional[str] = None
    group_pic: Optional[str] = None
    pic_phone: Optional[str] = None
    pic_email: Optional[str] = None
    payment_method: Optional[str] = None
    total_deposit: Optional[Decimal] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class GroupBookingResponse(GroupBookingBase):
    id: int
    group_booking_id: str
    total_rooms: int
    total_amount: Decimal
    total_deposit: Decimal
    total_balance: Decimal
    status: str
    created_by: str
    hotel_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GroupBookingWithRoomsResponse(GroupBookingResponse):
    rooms: List[GroupBookingRoomResponse] = []

    class Config:
        from_attributes = True