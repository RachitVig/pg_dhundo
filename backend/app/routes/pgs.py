from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import PGListing, Room, Owner
from app.schemas import PGListingSchema, PGCreateRequest

router = APIRouter()


def serialize_pg(pg) -> dict:
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


@router.get("/", response_model=List[PGListingSchema])
async def get_pgs(
    area: Optional[str] = None,
    gender: Optional[str] = None,
    db: Session = Depends(get_db),
):
    try:
        query = db.query(PGListing).filter(PGListing.status == "APPROVED")
        if area:
            query = query.filter(PGListing.area.ilike(f"%{area}%"))
        if gender and gender.upper() != "ALL":
            query = query.filter(PGListing.gender_category == gender.upper())

        return [serialize_pg(pg) for pg in query.all()]
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all", response_model=List[PGListingSchema])
async def get_all_pgs(db: Session = Depends(get_db)):
    pgs = db.query(PGListing).order_by(PGListing.id.desc()).all()
    return [serialize_pg(pg) for pg in pgs]


@router.get("/owner/{owner_id}", response_model=List[PGListingSchema])
async def get_owner_pgs(owner_id: int, db: Session = Depends(get_db)):
    pgs = db.query(PGListing).filter(PGListing.owner_id == owner_id).order_by(PGListing.id.desc()).all()
    return [serialize_pg(pg) for pg in pgs]


@router.get("/{pg_id}", response_model=PGListingSchema)
async def get_pg(pg_id: int, db: Session = Depends(get_db)):
    pg = db.query(PGListing).filter(PGListing.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG listing not found.")
    return serialize_pg(pg)


@router.post("/", response_model=PGListingSchema, status_code=status.HTTP_201_CREATED)
async def create_pg(pg_data: PGCreateRequest, db: Session = Depends(get_db)):
    try:
        owner = db.query(Owner).first()
        if not owner:
            owner = Owner(name="Default Owner", email="owner@pgdhundo.com", phone="9999999999")
            db.add(owner)
            db.commit()
            db.refresh(owner)

        new_pg = PGListing(
            name=pg_data.name,
            description=pg_data.description,
            address=pg_data.address or "",
            area=pg_data.area,
            gender_category=pg_data.gender_category.upper(),
            lat=30.7333,
            lng=76.7794,
            rating=5.0,
            owner_id=owner.id,
            owner_phone=owner.phone,
            amenities="WiFi, AC, Security, Meals",
            status="PENDING"
        )
        db.add(new_pg)
        db.flush()

        new_room = Room(
            pg_id=new_pg.id,
            room_type="SINGLE",
            price=pg_data.price,
            total_beds=5,
            occupied_beds=0,
        )
        db.add(new_room)
        db.commit()
        db.refresh(new_pg)

        return serialize_pg(new_pg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{pg_id}/status")
async def update_pg_status(pg_id: int, status: str, db: Session = Depends(get_db)):
    pg = db.query(PGListing).filter(PGListing.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")
    pg.status = status
    db.commit()
    db.refresh(pg)
    return serialize_pg(pg)
