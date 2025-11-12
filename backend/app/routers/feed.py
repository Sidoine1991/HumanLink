from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from ..db import get_db
from .. import models
from ..auth import get_current_user

router = APIRouter(prefix="/feed", tags=["feed"])


@router.get("/posts")
def list_feed_posts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """
    Retourne un flux de 'posts' basé sur les derniers MoodEvent de tous les utilisateurs.
    """
    rows = (
        db.query(
            models.MoodEvent.id.label("id"),
            models.User.display_name.label("author"),
            models.MoodEvent.text.label("content"),
            models.MoodEvent.created_at.label("timestamp"),
            models.MoodEvent.mood_label.label("mood"),
        )
        .join(models.User, models.User.id == models.MoodEvent.user_id)
        .order_by(desc(models.MoodEvent.created_at))
        .limit(50)
        .all()
    )
    # Shape into simple dicts expected by mobile
    return [
        {
            "id": str(r.id),
            "author": r.author or "Utilisateur",
            "content": r.content or "",
            "timestamp": r.timestamp.isoformat(),
            "likes": 0,
            "comments": 0,
            "mood": r.mood,
        }
        for r in rows
    ]


