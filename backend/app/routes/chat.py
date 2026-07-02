from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
import asyncio
import random

router = APIRouter(tags=["Chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

manager = ConnectionManager()

async def get_ai_response(content: str, pg_name: str):
    responses = [
        f"Thanks for reaching out to {pg_name}! Yes, we have single occupancy rooms available from next month.",
        f"Welcome! {pg_name} offers premium amenities including high-speed WiFi and 3-tier security. Would you like to schedule a visit?",
        f"Hello! Regarding your query about {pg_name}, the monthly rent includes electricity up to 100 units and 3 meals a day.",
        "That's a great question! Let me check with the facility manager and get back to you shortly."
    ]
    await asyncio.sleep(1.5)
    return random.choice(responses)

@router.get("/chat/history/{pg_id}/{client_id}", response_model=List[schemas.ChatMessageSchema])
async def get_chat_history(pg_id: int, client_id: str, db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.pg_id == pg_id,
        ((models.ChatMessage.sender_id == client_id) | (models.ChatMessage.receiver_id == client_id))
    ).order_by(models.ChatMessage.timestamp.asc()).all()
    
    return [{
        "sender": "You" if m.sender_id == client_id else "Owner",
        "content": m.content,
        "timestamp": m.timestamp
    } for m in messages]

@router.websocket("/ws/chat/{pg_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, pg_id: int, client_id: str, db: Session = Depends(get_db)):
    await manager.connect(websocket, client_id)
    try:
        pg = db.query(models.PGListing).filter(models.PGListing.id == pg_id).first()
        if not pg:
            await websocket.send_text("System: Error - Property not found.")
            return

        while True:
            data = await websocket.receive_text()
            
            user_msg = models.ChatMessage(
                pg_id=pg_id,
                sender_id=client_id,
                receiver_id="OWNER",
                content=data
            )
            db.add(user_msg)
            db.commit()

            await websocket.send_text(f"You says: {data}")
            ai_text = await get_ai_response(data, pg.name)
            
            ai_msg = models.ChatMessage(
                pg_id=pg_id,
                sender_id="OWNER",
                receiver_id=client_id,
                content=ai_text
            )
            db.add(ai_msg)
            db.commit()
            
            await websocket.send_text(f"Owner says: {ai_text}")

    except WebSocketDisconnect:
        manager.disconnect(client_id)
