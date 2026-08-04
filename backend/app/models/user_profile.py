from sqlalchemy import Column, String, Text, DateTime

from app.database.session import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(
        String,
        primary_key=True,
        index=True
    )

    full_name = Column(
        Text,
        nullable=True
    )

    created_at = Column(DateTime)