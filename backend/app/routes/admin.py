from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database import get_db
from app import models, schemas
from app.routes.pgs import serialize_pg

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard", response_model=schemas.AdminStatsResponse)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        total_pgs = db.query(models.PGListing).count()
        total_users = db.query(models.User).count()
        total_reviews = db.query(models.Review).count()
        
        # Calculate real profit (sum of price * occupied_beds for all rooms)
        rooms = db.query(models.Room).all()
        total_profit = sum([room.price * room.occupied_beds for room in rooms])
        
        recent_pg_models = db.query(models.PGListing).order_by(models.PGListing.id.desc()).limit(5).all()
        recent_pgs = [serialize_pg(pg) for pg in recent_pg_models]
        
        recent_user_models = db.query(models.User).order_by(models.User.created_at.desc()).limit(5).all()
        recent_users = [{"id": u.id, "name": u.name, "email": u.email, "created_at": u.created_at.isoformat() if u.created_at else None} for u in recent_user_models]
        
        return {
            "total_pgs": total_pgs,
            "total_users": total_users,
            "total_profit": total_profit,
            "total_reviews": total_reviews,
            "recent_pgs": recent_pgs,
            "recent_users": recent_users
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
