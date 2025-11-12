from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
import json
import httpx

from ..db import get_db
from .. import models, schemas
from ..auth import get_current_user
from ..config import settings

router = APIRouter(prefix="/design", tags=["design"])


@router.get("/tokens", response_model=List[schemas.DesignTokenPublic])
def list_tokens(db: Session = Depends(get_db), user=Depends(get_current_user)):
    rows = (
        db.query(models.DesignToken)
        .order_by(desc(models.DesignToken.updated_at))
        .all()
    )
    result: List[schemas.DesignTokenPublic] = []
    for r in rows:
        try:
            parsed = json.loads(r.value)
        except Exception:
            parsed = {}
        result.append(
            schemas.DesignTokenPublic(
                key=r.key,
                value=parsed,
                updated_at=r.updated_at,
            )
        )
    return result


@router.post("/tokens")
def upsert_tokens(payload: Dict[str, Dict], db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    Upsert de tokens au format { key: { ...json... }, ... }.
    """
    for key, value in payload.items():
        value_str = json.dumps(value, ensure_ascii=False)
        existing = db.query(models.DesignToken).filter(models.DesignToken.key == key).first()
        if existing:
            existing.value = value_str
        else:
            db.add(models.DesignToken(key=key, value=value_str))
    db.commit()
    return {"updated": len(payload)}


@router.post("/sync")
def sync_from_figma(file_key: str = Query(..., description="Figma file key"), db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    Récupère le fichier Figma brut via API et le stocke dans design_tokens sous la clé figma:file:{file_key}.
    Nécessite FIGMA_TOKEN dans la configuration.
    """
    if not settings.figma_token:
        raise HTTPException(status_code=400, detail="FIGMA_TOKEN manquant dans la configuration")

    headers = {
        "Authorization": f"Bearer {settings.figma_token}",
    }
    url = f"https://api.figma.com/v1/files/{file_key}"
    try:
        with httpx.Client(timeout=30.0) as client:
            r = client.get(url, headers=headers)
            if r.status_code != 200:
                raise HTTPException(status_code=r.status_code, detail=f"Echec Figma API: {r.text[:500]}")
            data = r.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur appel Figma API: {e}")

    key = f"figma:file:{file_key}"
    value_str = json.dumps(data, ensure_ascii=False)
    existing = db.query(models.DesignToken).filter(models.DesignToken.key == key).first()
    if existing:
        existing.value = value_str
    else:
        db.add(models.DesignToken(key=key, value=value_str))
    db.commit()

    return {"status": "ok", "stored_key": key, "bytes": len(value_str)}


