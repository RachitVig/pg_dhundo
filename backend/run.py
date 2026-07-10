"""
backend/run.py
Production-ready entry point for PG Dhundo API.
Run with:  python run.py
"""
import os
import sys

# Ensure the backend/ directory is on sys.path so `app` package resolves
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=not settings.is_production,
        log_level="info",
    )
