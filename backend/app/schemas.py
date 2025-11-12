from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int


class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    bio: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=72, description="Password must be between 6 and 72 characters")


class UserPublic(UserBase):
    id: int
    email_verified: bool = False

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=255)
    bio: Optional[str] = Field(default=None, max_length=1000)


class EmailVerification(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, description="6-digit verification code")


class VerifyEmailResponse(BaseModel):
    verified: bool
    message: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class ResendVerificationResponse(BaseModel):
    sent: bool
    message: str


class MoodCreate(BaseModel):
    text: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class MoodPublic(BaseModel):
    id: int
    user_id: int
    text: Optional[str]
    mood_label: str
    mood_score: float
    lat: Optional[float]
    lng: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class MatchSuggestion(BaseModel):
    user_id: int
    distance_m: Optional[float]
    mood_label: str
    display_name: Optional[str]
    lat: Optional[float] = None
    lng: Optional[float] = None


class PlaceSuggestion(BaseModel):
    name: str
    lat: float
    lng: float
    type: str
    distance_m: Optional[float] = None


class FeedbackCreate(BaseModel):
    mood_event_id: Optional[int] = None
    sentiment: str
    note: Optional[str] = None


class FeedbackPublic(BaseModel):
    id: int
    user_id: int
    sentiment: str
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationPublic(BaseModel):
    id: int
    user_one_id: int
    user_two_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    conversation_id: Optional[int] = None
    recipient_id: int
    text: str


class MessagePublic(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    recipient_id: int
    text: str
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationPublic(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    created_at: datetime
    read_at: Optional[datetime] = None
    icon: Optional[str] = None

    class Config:
        from_attributes = True


class DesignTokenPublic(BaseModel):
    key: str
    value: dict
    updated_at: datetime

