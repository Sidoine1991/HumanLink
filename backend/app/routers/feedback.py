from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user


router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("/", response_model=schemas.FeedbackPublic)
def submit_feedback(fb_in: schemas.FeedbackCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    fb = models.Feedback(user_id=user.id, mood_event_id=fb_in.mood_event_id, sentiment=fb_in.sentiment, note=fb_in.note)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


@router.get("/", response_model=List[schemas.FeedbackPublic])
def list_my_feedback(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return (
        db.query(models.Feedback)
        .filter(models.Feedback.user_id == user.id)
        .order_by(models.Feedback.created_at.desc())
        .limit(50)
        .all()
    )


