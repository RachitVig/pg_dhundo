"""
app/routes/chat.py
WebSocket-based real-time chat endpoints.
"""
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import asyncio
import random

from app.database import get_db
from app.models import ChatMessage, PGListing
from app.schemas import ChatMessageSchema

router = APIRouter()


class ConnectionManager:
    """Manages active WebSocket connections keyed by client_id."""

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)

    async def send_personal_message(self, message: str, client_id: str):
        ws = self.active_connections.get(client_id)
        if ws:
            await ws.send_text(message)


manager = ConnectionManager()


async def _get_ai_response(content: str, pg_name: str) -> str:
    """Simulated AI/owner auto-reply with a brief delay."""
    responses = [
        f"Thanks for reaching out to {pg_name}! We have single occupancy rooms available from next month.",
        f"Welcome! {pg_name} offers premium amenities including high-speed WiFi and 3-tier security. Would you like to schedule a visit?",
        f"Regarding {pg_name}, the monthly rent includes electricity up to 100 units and 3 meals a day.",
        "Great question! Let me check with the facility manager and get back to you shortly.",
        f"At {pg_name} we offer flexible payment options — monthly and quarterly deposits are accepted.",
    ]
    await asyncio.sleep(1.2)
    return random.choice(responses)


@router.get("/chat/history/{pg_id}/{client_id}", response_model=List[ChatMessageSchema])
async def get_chat_history(pg_id: int, client_id: str, db: Session = Depends(get_db)):
    """Fetch message history for a client in a given PG chat room."""
    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.pg_id == pg_id,
            (ChatMessage.sender_id == client_id) | (ChatMessage.receiver_id == client_id),
        )
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )
    return [
        {
            "sender": "You" if m.sender_id == client_id else "Owner",
            "content": m.content,
            "timestamp": m.timestamp,
        }
        for m in messages
    ]


@router.websocket("/ws/chat/{pg_id}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    pg_id: int,
    client_id: str,
    db: Session = Depends(get_db),
):
    """WebSocket endpoint for real-time chat between a user and a PG owner (simulated)."""
    await manager.connect(websocket, client_id)
    try:
        pg = db.query(PGListing).filter(PGListing.id == pg_id).first()
        if not pg:
            await websocket.send_text("System: Error — Property not found.")
            await websocket.close(code=1008)
            return

        while True:
            data = await websocket.receive_text()

            # Persist user message
            user_msg = ChatMessage(
                pg_id=pg_id, sender_id=client_id, receiver_id="OWNER", content=data
            )
            db.add(user_msg)
            db.commit()

           
            await websocket.send_text(f"You: {data}")

          
            ai_text = await _get_ai_response(data, pg.name)
            ai_msg = ChatMessage(
                pg_id=pg_id, sender_id="OWNER", receiver_id=client_id, content=ai_text
            )
            db.add(ai_msg)
            db.commit()

            await websocket.send_text(f"Owner: {ai_text}")

    except WebSocketDisconnect:
        manager.disconnect(client_id)
