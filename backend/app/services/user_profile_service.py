from sqlalchemy.orm import Session

#Repositories
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.evaluation_repository import EvaluationRepository
from app.repositories.experiment_repository import ExperimentRepository

class UserProfileService:
    def __init__(self):
        self.repository = UserProfileRepository()
        self.evaluation_repository = EvaluationRepository()
        self.experiment_repository = ExperimentRepository()

    def _build_profile_response(
        self,
        profile,
        current_user,
        db: Session,
    ):
        evaluation_count = self.evaluation_repository.count_by_user(
            db=db,
            user_id=current_user.id
        )
        experiment_count = self.experiment_repository.count_by_user(
            db=db,
            user_id=current_user.id
        )

        return {
            "id": profile.id,
            "full_name": profile.full_name,
            "email": current_user.email,
            "created_at": profile.created_at,
            "total_evaluations": evaluation_count,
            "total_experiments": experiment_count,
        }

    def get_profile(
        self,
        db: Session,
        current_user
    ):
        profile = self.repository.get_by_id(db, current_user.id)

        if profile is None:
            return None

        return self._build_profile_response(profile, current_user, db)

    def update_profile(
        self,
        db: Session,
        current_user,
        full_name: str | None,
    ):
        profile = self.repository.upsert_full_name(
            db=db,
            user_id=current_user.id,
            full_name=full_name,
        )

        return self._build_profile_response(profile, current_user, db)