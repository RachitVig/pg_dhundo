"""
app/models/models.py
SQLAlchemy ORM models for PG Dhundo.
Moved from app/models.py into the models/ package.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime
import enum

from app.database import Base


# ── Enums ─────────────────────────────────────────────────────────────────────

class GenderCategory(enum.Enum):
    BOYS = "BOYS"
    GIRLS = "GIRLS"
    MIXED = "MIXED"


class RoomType(enum.Enum):
    SINGLE = "SINGLE"
    DOUBLE = "DOUBLE"
    TRIPLE = "TRIPLE"
    QUAD = "QUAD"


# ── ORM Models ────────────────────────────────────────────────────────────────

class PGListing(Base):
    __tablename__ = "pg_listings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    address = Column(String)
    area = Column(String, index=True)
    lat = Column(Float)
    lng = Column(Float)
    gender_category = Column(String, nullable=False)  # BOYS | GIRLS | MIXED
    rating = Column(Float, default=4.0)
    owner_id = Column(Integer, ForeignKey("owners.id"))
    owner_phone = Column(String)
    amenities = Column(String)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    
    owner = relationship("Owner", back_populates="pgs")
    rooms = relationship("Room", back_populates="pg", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="pg", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"), nullable=False)
    room_type = Column(String, nullable=False)  # SINGLE | DOUBLE | TRIPLE | QUAD
    price = Column(Float, nullable=False)
    total_beds = Column(Integer, nullable=False)
    occupied_beds = Column(Integer, default=0)

    pg = relationship("PGListing", back_populates="rooms")
    beds = relationship("Bed", back_populates="room", cascade="all, delete-orphan")


class Bed(Base):
    __tablename__ = "beds"

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    is_available = Column(Boolean, default=True)
    available_from = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("Room", back_populates="beds")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # bcrypt hash
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)

    pgs = relationship("PGListing", back_populates="owner")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"), nullable=False)
    user_name = Column(String, nullable=False)

    # Categorized ratings (1-5)
    food_rating = Column(Integer)
    room_rating = Column(Integer)
    facilities_rating = Column(Integer)
    value_rating = Column(Integer)

    comment = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    pg = relationship("PGListing", back_populates="reviews")


class ChatMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"), nullable=False)
    sender_id = Column(String, nullable=False)
    receiver_id = Column(String, nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    pg = relationship("PGListing")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"))
    owner_id = Column(Integer, ForeignKey("owners.id"))
    user_name = Column(String)
    user_email = Column(String)
    user_phone = Column(String)
    requirements = Column(String)
    preferred_time = Column(String)
    status = Column(String, default="PENDING") # PENDING, CONFIRMED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    pg = relationship("PGListing")
    owner = relationship("Owner")
