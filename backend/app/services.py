from typing import Tuple
from .config import settings

try:
    from openai import OpenAI  # type: ignore
    _openai_client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
except Exception:
    _openai_client = None


def analyze_mood(text: str | None) -> Tuple[str, float]:
    if not text:
        return "calm", 0.5
    t = text.lower()
    if any(k in t for k in ["seul", "triste", "fatigu", "épuis"]):
        return "fatigue", 0.3
    if any(k in t for k in ["stress", "angoiss", "tendu"]):
        return "stress", 0.2
    if any(k in t for k in ["inspir", "bouger", "march", "sortir", "énerg"]):
        return "energy", 0.8
    if any(k in t for k in ["heureux", "joyeux", "content", "bien"]):
        return "joy", 0.9
    return "calm", 0.6


def analyze_mood_smart(text: str | None) -> Tuple[str, float]:
    if not text:
        return analyze_mood(text)
    if not _openai_client:
        return analyze_mood(text)
    prompt = (
        "Tu es un classificateur d'émotions. À partir du texte utilisateur, réponds au format JSON {label: string, score: number} "
        "où label ∈ [joy, calm, energy, fatigue, stress, lonely, social, reflective] et score ∈ [0,1]. Texte: "
        f"{text}"
    )
    try:
        resp = _openai_client.chat.completions.create(
            model=settings.openai_emotion_model,
            messages=[{"role": "system", "content": "Classificateur d'émotions"}, {"role": "user", "content": prompt}],
            temperature=0.1,
        )
        content = resp.choices[0].message.content or ""
        import json
        data = json.loads(content)
        label = str(data.get("label", "calm"))
        score = float(data.get("score", 0.6))
        return label, score
    except Exception:
        return analyze_mood(text)


