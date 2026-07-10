from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app import models, schemas
from app.core.mail import send_booking_inquiry_to_owner, send_booking_confirmation_to_user, send_booking_acknowledgment_to_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=schemas.BookingSchema)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Verify PG exists
    pg = db.query(models.PGListing).filter(models.PGListing.id == booking.pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")
        
    owner = db.query(models.Owner).filter(models.Owner.id == pg.owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found for this PG")

    # Create booking request
    new_booking = models.Booking(
        pg_id=booking.pg_id,
        owner_id=owner.id,
        user_name=booking.user_name,
        user_email=booking.user_email,
        user_phone=booking.user_phone,
        requirements=booking.requirements,
        preferred_time=booking.preferred_time,
        status="PENDING"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Send beautiful email to owner
    # Pass owner email, if none use dummy
    owner_email = owner.email if owner.email else "owner@example.com"
    send_booking_inquiry_to_owner(
        owner_email=owner_email,
        pg_name=pg.name,
        user_name=booking.user_name,
        user_email=booking.user_email,
        user_phone=booking.user_phone,
        requirements=booking.requirements,
        preferred_time=booking.preferred_time
    )

    # Send acknowledgment email to user
    send_booking_acknowledgment_to_user(
        user_email=booking.user_email,
        user_name=booking.user_name,
        pg_name=pg.name,
        preferred_time=booking.preferred_time,
        requirements=booking.requirements
    )

    return new_booking

@router.get("/owner/{owner_id}")
def get_owner_bookings(owner_id: int, db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(models.Booking.owner_id == owner_id).order_by(models.Booking.created_at.desc()).all()
    
    # We return related pg name as well for frontend convenience
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "pg_id": b.pg_id,
            "pg_name": b.pg.name if b.pg else "Unknown PG",
            "owner_id": b.owner_id,
            "user_name": b.user_name,
            "user_email": b.user_email,
            "user_phone": b.user_phone,
            "requirements": b.requirements,
            "preferred_time": b.preferred_time,
            "status": b.status,
            "created_at": b.created_at
        })
    return result

class BookingVerifyRequest(BaseModel):
    scheduled_time: str
    owner_message: str

@router.put("/{booking_id}/verify")
def verify_booking(booking_id: int, request: BookingVerifyRequest, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    booking.status = "CONFIRMED"
    db.commit()
    db.refresh(booking)
    
    pg_name = booking.pg.name if booking.pg else "the PG"
    
    # Send confirmation email to user
    send_booking_confirmation_to_user(
        user_email=booking.user_email,
        user_name=booking.user_name,
        pg_name=pg_name,
        scheduled_time=request.scheduled_time,
        owner_message=request.owner_message
    )
    
    return {"status": "success", "message": "Booking confirmed and email sent to user"}
