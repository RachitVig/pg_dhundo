"""
app/main.py
FastAPI application factory for PG Dhundo.
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.core.config import settings
from app import models  # triggers model registration
from app.routes import pgs, chat, auth, admin, bookings

# ── Create all tables ─────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)
# ── Create all tables ─────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)
# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# ── Include Routers ───────────────────────────────────────────────────────────
app.include_router(pgs.router,      prefix="/pgs",   tags=["PGs"])
app.include_router(chat.router)                              # prefix baked into route paths
app.include_router(auth.router,     prefix="/auth",  tags=["Auth"])
app.include_router(admin.router,    prefix="/admin", tags=["Admin"])
app.include_router(bookings.router)                          # prefix declared on router itself


@app.get("/")
async def root():
    return {"status": "Active", "service": "PG Dhundo API"}


@app.get("/seed")
async def seed_data(db: Session = Depends(get_db)):
    try:
        # Clear existing
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

        owner = models.Owner(name="Rachit", email="rachit@example.com", phone="9876543210")
        db.add(owner)
        db.flush()

        def add_pg(name, area, address, lat, lng, gender, rating, amenities, price, desc):
            pg = models.PGListing(
                name=name, area=area, address=address, lat=lat, lng=lng,
                gender_category=gender, rating=rating, amenities=amenities,
                owner_id=owner.id, owner_phone=owner.phone,
                description=desc, status="APPROVED"
            )
            db.add(pg)
            db.flush()

            # Add rooms
            db.add(models.Room(pg_id=pg.id, room_type="SINGLE", price=price, total_beds=5, occupied_beds=2))
            db.add(models.Room(pg_id=pg.id, room_type="DOUBLE", price=price / 1.5, total_beds=10, occupied_beds=4))

            # Add some reviews
            db.add(models.Review(
                pg_id=pg.id, user_name="Aryan", food_rating=5, room_rating=4,
                facilities_rating=5, value_rating=4, comment="Exceptional stay!"
            ))
            return pg

        add_pg("Regal Heritage", "Sector 15", "Sector 15-C, Chandigarh", 30.7333, 76.7794, "MIXED", 4.8,
               "Fiber Internet,AC,Security,Power Backup,Gym", 16000, "Chandigarh's most luxury student living.")
        add_pg("BlueSky Girls", "Sector 34", "Sector 34-A, Chandigarh", 30.7233, 76.7694, "GIRLS", 4.5,
               "Meals,Laundry,CCTV,Warden,Library", 12000, "Secure and peaceful environment for working women.")
        add_pg("The Boys Hub", "Sector 22", "Sector 22-B, Chandigarh", 30.7433, 76.7594, "BOYS", 4.2,
               "WiFi,Gaming Room,Parking,Mess", 9000, "Active community living for bachelors.")

        db.commit()
        return {"status": "success", "message": "Database seeded with sample data"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
