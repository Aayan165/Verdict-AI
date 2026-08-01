from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

#Models
from app.models.experiment import Experiment
from app.models.evaluation import Evaluation

#Utils
from app.utils.logger import logger
from app.utils.timer import Timer

class ExperimentRepository:
    def save(
        self,
        db: Session,
        experiment: Experiment
    ):
        db.add(experiment)
        db.commit()
        db.refresh(experiment)

        return experiment

    def get_all(
        self,
        db: Session,
        user_id: str
    ):
        return (
            db.query(Experiment)
            .filter(Experiment.user_id == user_id)
            .order_by(Experiment.created_at.desc())
            .all()
        )

    def get_by_id(
            self,
            db: Session,
            experiment_id: int,
            user_id: str
    ):
        return (
            db.query(Experiment)
            .filter(
                Experiment.id == experiment_id,
                Experiment.user_id == user_id
            )
            .first()
        )

    def delete(
        self,
        db: Session,
        experiment: Experiment
    ):
        db.delete(experiment)
        db.commit()

    def has_access(
        self,
        db: Session,
        experiment_id: int,
        user_id: str
    ):
        return (
            db.query(Experiment)
            .filter(
                Experiment.id == experiment_id,
                Experiment.user_id == user_id
            )
            .first()
            is not None
        )

    def export_experiment(
        self,
        db: Session,
        experiment_id: int,
        user_id: str
    ):
        return (
            db.query(Experiment)
            .filter(
                Experiment.id == experiment_id,
                Experiment.user_id == user_id
            )
            .order_by(Experiment.created_at.desc())
            .all()
        )

    def add_evaluation_to_experiment(
        self,
        db: Session,
        experiment_id: int,
        evaluation_id: int,
        user_id: str
    ):
        timer = Timer()
        timer.start()
        logger.info("Adding evaluation to experiment")
        experiment = (
            db.query(Experiment)
            .filter(
                Experiment.id == experiment_id,
                Experiment.user_id == user_id
            )
            .first()
        )
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
            logger.exception("Experiment not found")

        evaluation = (
            db.query(Evaluation)
            .filter(
                Evaluation.id == evaluation_id,
                Evaluation.user_id == user_id
            )
            .first()
        )

        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation not found")
            logger.exception("Evaluation not found")
        
        evaluation.experiment_id = experiment_id

        db.commit()
        db.refresh(evaluation)

        elapsed = timer.stop()
        logger.info(
            "Evaluation added to experiment in %.3f seconds",
            elapsed
        )

        return evaluation

    def remove_evaluation_from_experiment(
        self,
        db: Session,
        experiment_id: int,
        evaluation_id: int,
        user_id: str
    ):
        timer = Timer()
        timer.start()
        logger.info("Removing evaluation from experiment")
        experiment = (
            db.query(Experiment)
            .filter(
                Experiment.id == experiment_id,
                Experiment.user_id == user_id
            )
            .first()
        )
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
            logger.exception("Experiment not found")

        evaluation = (
            db.query(Evaluation)
            .filter(
                Evaluation.id == evaluation_id,
                Evaluation.user_id == user_id,
                Evaluation.experiment_id == experiment_id
            )
            .first()
        )

        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation not found")
            logger.exception("Evaluation not found")
        
        evaluation.experiment_id = None

        db.commit()
        db.refresh(evaluation)

        elapsed = timer.stop()
        logger.info(
            "Evaluation removed from experiment in %.3f seconds",
            elapsed
        )

        return evaluation