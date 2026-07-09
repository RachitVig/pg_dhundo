"""
app/routes/admin.py
Admin dashboard statistics endpoint.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PGListing, User, Review, Room
from app.schemas import AdminStatsResponse
from app.routes.pgs import serialize_pg

router = APIRouter()


@router.get("/dashboard", response_model=AdminStatsResponse)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Return aggregate platform statistics for the admin dashboard."""
    try:
        total_pgs = db.query(PGListing).count()
        total_users = db.query(User).count()
        total_reviews = db.query(Review).count()

        # Revenue: sum(price * occupied_beds) across all rooms
        rooms = db.query(Room).all()
        total_profit = sum(room.price * room.occupied_beds for room in rooms)

        recent_pgs = [
            serialize_pg(pg)
            for pg in db.query(PGListing).order_by(PGListing.id.desc()).limit(5).all()
        ]
        recent_users = [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in db.query(User).order_by(User.created_at.desc()).limit(5).all()
        ]

        return {
            "total_pgs": total_pgs,
            "total_users": total_users,
            "total_profit": total_profit,
            "total_reviews": total_reviews,
            "recent_pgs": recent_pgs,
            "recent_users": recent_users,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
