from datetime import datetime
from typing import List, Optional, Tuple
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user


router = APIRouter(prefix="/chat", tags=["chat"])


def get_or_create_conversation(db: Session, user_a_id: int, user_b_id: int) -> models.Conversation:
    # Order pair to avoid duplicates (A,B) and (B,A)
    a, b = sorted([user_a_id, user_b_id])
    conv = (
        db.query(models.Conversation)
        .filter(and_(models.Conversation.user_one_id == a, models.Conversation.user_two_id == b))
        .first()
    )
    if conv:
        return conv
    conv = models.Conversation(user_one_id=a, user_two_id=b)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.get("/conversations", response_model=List[schemas.ConversationPublic])
def list_conversations(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return (
        db.query(models.Conversation)
        .filter(or_(models.Conversation.user_one_id == user.id, models.Conversation.user_two_id == user.id))
        .order_by(desc(models.Conversation.created_at))
        .all()
    )


@router.get("/messages/{conversation_id}", response_model=List[schemas.MessagePublic])
def list_messages(conversation_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    conv = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
    if not conv or (user.id not in [conv.user_one_id, conv.user_two_id]):
        raise HTTPException(status_code=404, detail="Conversation not found")
    return (
        db.query(models.Message)
        .filter(models.Message.conversation_id == conversation_id)
        .order_by(models.Message.created_at.asc())
        .limit(200)
        .all()
    )


@router.post("/send", response_model=schemas.MessagePublic)
def send_message(payload: schemas.MessageCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Message text is required")
    if payload.recipient_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")

    # Ensure conversation exists
    if payload.conversation_id:
        conv = db.query(models.Conversation).filter(models.Conversation.id == payload.conversation_id).first()
        if not conv or (user.id not in [conv.user_one_id, conv.user_two_id]):
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conv = get_or_create_conversation(db, user.id, payload.recipient_id)

    msg = models.Message(
        conversation_id=conv.id,
        sender_id=user.id,
        recipient_id=payload.recipient_id,
        text=payload.text.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Create notification for recipient
    notif = models.Notification(
        user_id=payload.recipient_id,
        type="message",
        title="Nouveau message",
        message=payload.text[:120],
        icon="💬",
    )
    db.add(notif)
    db.commit()

    return msg


