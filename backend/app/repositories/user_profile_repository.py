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