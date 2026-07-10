"""
app/schemas/schemas.py
Pydantic v2 schemas for request validation and response serialization.
Moved from app/schemas.py into the schemas/ package.
"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class UserSchema(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    status: str
    access_token: str
    token_type: str = "bearer"
    user: UserSchema


# ── PG / Room / Review Schemas ────────────────────────────────────────────────

class RoomSchema(BaseModel):
    id: int
    room_type: str
    price: float
    total_beds: int
    occupied_beds: int

    class Config:
        from_attributes = True


class ReviewSchema(BaseModel):
    id: int
    user_name: str
    food_rating: Optional[int] = None
    room_rating: Optional[int] = None
    facilities_rating: Optional[int] = None
    value_rating: Optional[int] = None
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PGListingSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    area: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    gender_category: str
    rating: Optional[float] = None
    owner_id: Optional[int] = None
    owner_phone: Optional[str] = None
    amenities: Optional[str] = None
    rooms: List[RoomSchema] = []
    reviews: List[ReviewSchema] = []

    class Config:
        from_attributes = True


class PGCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    area: str
    gender_category: str
    price: float
    amenities: Optional[str] = None


# ── Chat Schemas ──────────────────────────────────────────────────────────────

class ChatMessageSchema(BaseModel):
    sender: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


class AdminStatsResponse(BaseModel):
    total_pgs: int
    total_users: int
    total_profit: float
    total_reviews: int
    recent_pgs: List[PGListingSchema]
    recent_users: List[dict]


# ── New SMTP-related Schemas ──────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: str


class ForgotPasswordResponse(BaseModel):
    status: str
    message: str


class BookingInquiryRequest(BaseModel):
    name: str
    email: str
    phone: str
    room_type: str


# ── Booking Schemas ───────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    pg_id: int
    user_name: str
    user_email: str
    user_phone: str
    requirements: str
    preferred_time: str


class BookingSchema(BookingCreate):
    id: int
    owner_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
