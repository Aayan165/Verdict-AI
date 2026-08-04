from datetime import datetime

from sqlalchemy.orm import Session

from app.models.user_profile import UserProfile

class UserProfileRepository:
    def get_by_id(
        self,
        db: Session,
        user_id: str
    ):
        return (
            db.query(UserProfile)
            .filter(UserProfile.id == user_id)
            .first()
        )

    def upsert_full_name(
        self,
        db: Session,
        user_id: str,
        full_name: str | None,
    ):
        profile = self.get_by_id(db, user_id)

        if profile is None:
            profile = UserProfile(
                id=user_id,
                full_name=full_name,
                created_at=datetime.utcnow(),
            )
            db.add(profile)
        else:
            profile.full_name = full_name

        db.commit()
        db.refresh(profile)

        return profile