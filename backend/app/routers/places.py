from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user


router = APIRouter(prefix="/places", tags=["places"])


@router.get("/suggest", response_model=List[schemas.PlaceSuggestion])
def suggest_places(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    last_mood = (
        db.query(models.MoodEvent)
        .filter(models.MoodEvent.user_id == user.id)
        .order_by(models.MoodEvent.created_at.desc())
        .first()
    )
    if not last_mood or last_mood.lat is None or last_mood.lng is None:
        raise HTTPException(status_code=400, detail="User location/mood required")

    # Simple stub: propose generic safe public spots near the given point
    base_lat, base_lng = last_mood.lat, last_mood.lng
    return [
        schemas.PlaceSuggestion(name="Parc", lat=base_lat + 0.001, lng=base_lng + 0.001, type="park"),
        schemas.PlaceSuggestion(name="Café", lat=base_lat - 0.001, lng=base_lng + 0.001, type="cafe"),
        schemas.PlaceSuggestion(name="Bibliothèque", lat=base_lat + 0.001, lng=base_lng - 0.001, type="library"),
    ]


