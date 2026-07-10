from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import datetime
from app.database import Base
import enum

class GenderCategory(enum.Enum):
    BOYS = "BOYS"
    GIRLS = "GIRLS"
    MIXED = "MIXED"

class RoomType(enum.Enum):
    SINGLE = "SINGLE"
    DOUBLE = "DOUBLE"
    TRIPLE = "TRIPLE"
    QUAD = "QUAD"

class PGListing(Base):
    __tablename__ = "pg_listings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    address = Column(String)
    area = Column(String, index=True) # For area-based search
    lat = Column(Float)
    lng = Column(Float)
    gender_category = Column(String)  # BOYS, GIRLS, MIXED
    rating = Column(Float, default=4.0)
    owner_id = Column(Integer, ForeignKey("owners.id"))
    owner_phone = Column(String)
    amenities = Column(String)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    
    owner = relationship("Owner", back_populates="pgs")
    rooms = relationship("Room", back_populates="pg")
    reviews = relationship("Review", back_populates="pg")

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"))
    room_type = Column(String) # SINGLE, DOUBLE, etc.
    price = Column(Float)
    total_beds = Column(Integer)
    occupied_beds = Column(Integer, default=0)
    
    pg = relationship("PGListing", back_populates="rooms")
    beds = relationship("Bed", back_populates="room")

class Bed(Base):
    __tablename__ = "beds"
    
    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    is_available = Column(Boolean, default=True)
    available_from = Column(DateTime, default=datetime.datetime.utcnow) # Forecast field
    
    room = relationship("Room", back_populates="beds")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String) # In real app, hash this
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Owner(Base):
    __tablename__ = "owners"
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    
    pgs = relationship("PGListing", back_populates="owner")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    pg_id = Column(Integer, ForeignKey("pg_listings.id"))
    user_name = Column(String)
    
    # Categorized ratings
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
    pg_id = Column(Integer, ForeignKey("pg_listings.id"))
    sender_id = Column(String)
    receiver_id = Column(String)
    content = Column(String)
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
