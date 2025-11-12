from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user


router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=List[schemas.NotificationPublic])
def list_notifications(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
	return (
		db.query(models.Notification)
		.filter(models.Notification.user_id == user.id)
		.order_by(desc(models.Notification.created_at))
		.limit(200)
		.all()
	)


@router.post("/{notification_id}/read", response_model=schemas.NotificationPublic)
def mark_as_read(notification_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
	notif = (
		db.query(models.Notification)
		.filter(models.Notification.id == notification_id, models.Notification.user_id == user.id)
		.first()
	)
	if not notif:
		raise HTTPException(status_code=404, detail="Notification not found")
	notif.read_at = datetime.utcnow()
	db.commit()
	db.refresh(notif)
	return notif


