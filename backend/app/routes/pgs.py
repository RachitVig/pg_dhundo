from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/pgs", tags=["PG Listings"])

def serialize_pg(pg):
    return {
        "id": pg.id,
        "name": pg.name,
        "description": pg.description,
        "address": pg.address,
        "area": pg.area,
        "lat": pg.lat or 30.7333,
        "lng": pg.lng or 76.7794,
        "gender_category": pg.gender_category,
        "rating": pg.rating,
        "owner_id": pg.owner_id,
        "owner_phone": pg.owner_phone,
        "amenities": pg.amenities,
        "status": pg.status,
        "rooms": [{
            "id": r.id,
            "room_type": r.room_type,
            "price": r.price,
            "total_beds": r.total_beds,
            "occupied_beds": r.occupied_beds
        } for r in pg.rooms],
        "reviews": [{
            "id": rev.id,
            "user_name": rev.user_name,
            "food_rating": rev.food_rating,
            "room_rating": rev.room_rating,
            "facilities_rating": rev.facilities_rating,
            "value_rating": rev.value_rating,
            "comment": rev.comment
        } for rev in pg.reviews]
    }

@router.get("/", response_model=List[schemas.PGListingSchema])
async def get_pgs(
    area: Optional[str] = None, 
    gender: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(models.PGListing).filter(models.PGListing.status == "APPROVED")
        if area:
            query = query.filter(models.PGListing.area.ilike(f"%{area}%"))
        if gender and gender != "All":
            query = query.filter(models.PGListing.gender_category == gender.upper())
        
        pgs = query.all()
        return [serialize_pg(pg) for pg in pgs]
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=schemas.PGListingSchema)
async def create_pg(
    pg_data: schemas.PGCreateRequest,
    db: Session = Depends(get_db)
):
    try:
        # Get a default owner for now if owner is not specified
        owner = db.query(models.Owner).first()
        if not owner:
            owner = models.Owner(name="Default Owner", email="owner@example.com", phone="9999999999")
            db.add(owner)
            db.commit()
            db.refresh(owner)

        new_pg = models.PGListing(
            name=pg_data.name,
            description=pg_data.description,
            address=pg_data.address,
            area=pg_data.area,
            gender_category=pg_data.gender_category,
            lat=30.7333, # Default logic
            lng=76.7794,
            rating=5.0, # Initial rating
            owner_id=owner.id,
            owner_phone=owner.phone,
            amenities="WiFi, AC, Security, Meals", # Default
            status="PENDING"
        )
        db.add(new_pg)
        db.flush()
        
        # Add default room
        new_room = models.Room(
            pg_id=new_pg.id,
            room_type="SINGLE",
            price=pg_data.price,
            total_beds=5,
            occupied_beds=0
        )
        db.add(new_room)
        db.commit()
        db.refresh(new_pg)
        
        return serialize_pg(new_pg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all", response_model=List[schemas.PGListingSchema])
async def get_all_pgs(db: Session = Depends(get_db)):
    # For Admin
    pgs = db.query(models.PGListing).order_by(models.PGListing.id.desc()).all()
    return [serialize_pg(pg) for pg in pgs]

@router.get("/owner/{owner_id}", response_model=List[schemas.PGListingSchema])
async def get_owner_pgs(owner_id: int, db: Session = Depends(get_db)):
    pgs = db.query(models.PGListing).filter(models.PGListing.owner_id == owner_id).order_by(models.PGListing.id.desc()).all()
    return [serialize_pg(pg) for pg in pgs]

@router.put("/{pg_id}/status")
async def update_pg_status(pg_id: int, status: str, db: Session = Depends(get_db)):
    pg = db.query(models.PGListing).filter(models.PGListing.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")
    pg.status = status
    db.commit()
    db.refresh(pg)
    return serialize_pg(pg)
