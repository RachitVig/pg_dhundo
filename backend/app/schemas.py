from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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
    food_rating: int
    room_rating: int
    facilities_rating: int
    value_rating: int
    comment: str

    class Config:
        from_attributes = True

class PGListingSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    address: str
    area: str
    lat: float
    lng: float
    gender_category: str
    rating: float
    owner_id: int
    owner_phone: str
    amenities: str
    rooms: List[RoomSchema]
    reviews: List[ReviewSchema]

    class Config:
        from_attributes = True

class ChatMessageSchema(BaseModel):
    sender: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class PGCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    area: str
    gender_category: str
    price: float

class AdminStatsResponse(BaseModel):
    total_pgs: int
    total_users: int
    total_profit: float
    total_reviews: int
    recent_pgs: List[PGListingSchema]
    recent_users: List[dict]
