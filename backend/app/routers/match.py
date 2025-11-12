from fastapi import APIRouter, Depends, HTTPException
from typing import List
from math import radians, sin, cos, asin, sqrt
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user
from ..config import settings


router = APIRouter(prefix="/match", tags=["match"])


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return R * c


def is_mood_compatible(a: str, b: str) -> bool:
    if a == b:
        return True
    complementary: dict[str, set[str]] = {
        "calm": {"calm", "joy"},
        "joy": {"joy", "calm", "energy"},
        "energy": {"energy", "joy"},
        "fatigue": {"calm", "joy"},
        "stress": {"calm"},
    }
    return b in complementary.get(a, {a})


@router.get("/suggestions", response_model=List[schemas.MatchSuggestion])
def match_suggestions(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
    radius_m: int | None = None,
    anonymous: bool = True,
):
    radius = radius_m or settings.default_matching_radius_m
    last_mood = (
        db.query(models.MoodEvent)
        .filter(models.MoodEvent.user_id == user.id)
        .order_by(models.MoodEvent.created_at.desc())
        .first()
    )
    if not last_mood or last_mood.lat is None or last_mood.lng is None:
        raise HTTPException(status_code=400, detail="User location/mood required")

    candidates = (
        db.query(models.MoodEvent, models.User)
        .join(models.User, models.User.id == models.MoodEvent.user_id)
        .filter(models.MoodEvent.id != last_mood.id)
        .filter(models.MoodEvent.lat.isnot(None))
        .filter(models.MoodEvent.lng.isnot(None))
        .order_by(models.MoodEvent.created_at.desc())
        .limit(200)
        .all()
    )

    out: list[schemas.MatchSuggestion] = []
    for ev, u in candidates:
        d = haversine_m(last_mood.lat, last_mood.lng, ev.lat, ev.lng)
        if d <= radius and (is_mood_compatible(last_mood.mood_label, ev.mood_label) or abs(ev.mood_score - last_mood.mood_score) < 0.2):
            name = u.display_name
            if anonymous or not name:
                # simple deterministic pseudonym
                name = f"Anonyme #{u.id%10000:04d}"
            out.append(
                schemas.MatchSuggestion(
                    user_id=u.id,
                    distance_m=round(d, 1),
                    mood_label=ev.mood_label,
                    display_name=name,
                    lat=ev.lat,
                    lng=ev.lng,
                )
            )
    return sorted(out, key=lambda s: (s.distance_m or 0))


