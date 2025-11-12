from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user
from ..services import analyze_mood_smart


router = APIRouter(prefix="/mood", tags=["mood"])

# Utilitaire simple pour convertir un rayon (m) en degrés approx (latitude/longitude)
def meters_to_degrees(delta_m: float) -> float:
    # 1 degré ~ 111_000 m (approx)
    return delta_m / 111_000.0


@router.post("/", response_model=schemas.MoodPublic)
def submit_mood(mood_in: schemas.MoodCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    label, score = analyze_mood_smart(mood_in.text)
    ev = models.MoodEvent(
        user_id=user.id,
        text=mood_in.text,
        mood_label=label,
        mood_score=score,
        lat=mood_in.lat,
        lng=mood_in.lng,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


@router.get("/", response_model=List[schemas.MoodPublic])
def list_my_moods(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return (
        db.query(models.MoodEvent)
        .filter(models.MoodEvent.user_id == user.id)
        .order_by(models.MoodEvent.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/nearby", response_model=List[schemas.MatchSuggestion])
def list_nearby_latest_moods(
    lat: float,
    lng: float,
    radius_m: float = 1500,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """
    Retourne la dernière humeur (avec position) de chaque utilisateur à proximité.
    Le filtrage de proximité est approximatif (fenêtre en degrés).
    """
    # Sous-requête: dernière date par utilisateur
    from sqlalchemy import func, and_

    sub = (
        db.query(
            models.MoodEvent.user_id.label("u_id"),
            func.max(models.MoodEvent.created_at).label("last_dt"),
        )
        .group_by(models.MoodEvent.user_id)
        .subquery()
    )

    # Joindre avec MoodEvent pour obtenir l'enregistrement complet de la dernière humeur
    q = (
        db.query(models.MoodEvent, models.User.display_name)
        .join(sub, and_(models.MoodEvent.user_id == sub.c.u_id, models.MoodEvent.created_at == sub.c.last_dt))
        .join(models.User, models.User.id == models.MoodEvent.user_id)
        .filter(models.MoodEvent.lat.isnot(None), models.MoodEvent.lng.isnot(None))
    )

    # Filtre de proximité approximatif via fenêtre en degrés
    deg = meters_to_degrees(radius_m)
    q = q.filter(
        models.MoodEvent.lat.between(lat - deg, lat + deg),
        models.MoodEvent.lng.between(lng - deg, lng + deg),
    )

    rows = q.limit(200).all()

    results: list[schemas.MatchSuggestion] = []
    for ev, display_name in rows:
        results.append(
            schemas.MatchSuggestion(
                user_id=ev.user_id,
                distance_m=None,  # Optionnel: calculer la distance haversine si nécessaire
                mood_label=ev.mood_label,
                display_name=display_name,
                lat=ev.lat,
                lng=ev.lng,
            )
        )
    return results

