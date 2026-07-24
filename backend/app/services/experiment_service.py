from sqlalchemy.orm import Session
import csv
import io
from fastapi import HTTPException

#Models
from app.models.experiment import Experiment
from app.models.evaluation import Evaluation

#Repositories
from app.repositories.experiment_repository import ExperimentRepository
from app.repositories.evaluation_repository import EvaluationRepository

#Utils
from app.utils.logger import logger
from app.utils.timer import Timer

class ExperimentService:
    def __init__(self):
        self.repository = ExperimentRepository()
        self.evaluation_repository = EvaluationRepository()

    def create_experiment(
        self,
        db: Session,
        user_id: str,
        name: str,
        description: str | None
    ):
        timer = Timer()
        timer.start()
        logger.info("Creating new experiment")
        
        experiment = Experiment(
            user_id=user_id,
            name=name,
            description=description
        )

        elapsed = timer.stop()
        logger.info(
            "Experiment created in %.3f seconds",
            elapsed
        )

        return self.repository.save(
            db,
            experiment
        )

    def get_user_experiments(
        self,
        db: Session,
        user_id: str
    ):
        return self.repository.get_all(
            db,
            user_id
        )

    def get_experiment(
        self,
        db: Session,
        experiment_id: int,
        user_id: str
    ):
        return self.repository.get_by_id(
            db,
            experiment_id,
            user_id
        )

    def delete_experiment(
        self,
        db: Session,
        experiment_id: int,
        user_id: str
    ):
        timer = Timer()
        timer.start()
        logger.info("Deleting experiment")
        experiment = self.repository.get_by_id(
            db,
            experiment_id,
            user_id
        )

        if experiment is None:
            return None

        self.repository.delete(
            db,
            experiment
        )

        elapsed = timer.stop()
        logger.info(
            "Experiment deleted in %.3f seconds",
            elapsed
        )

        return experiment

    def export_csv(
        self,
        db: Session,
        experiment_id: int,
        user_id: str
    ):
        timer = Timer()
        timer.start()
        logger.info("Exporting experiment evaluations to CSV")

        experiment = self.repository.get_by_id(
            db,
            experiment_id,
            user_id
        )

        if experiment is None:
            logger.exception("Experiment not found")
            raise HTTPException(
                status_code=404,
                detail="Experiment not found"
            )

        evaluations = self.evaluation_repository.get_by_experiment(
            db,
            experiment_id,
            user_id
        )

        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            "Model",
            "Prompt",
            "Response",
            "Accuracy",
            "Logic",
            "Completeness",
            "Overall",
            "Verdict",
            "Summary",
            "Created At"
        ])

        logger.info("Writing experiment's evaluations to CSV")

        for evaluation in evaluations:
            writer.writerow([
                evaluation.model_name,
                evaluation.prompt,
                evaluation.response,
                evaluation.accuracy_score,
                evaluation.logic_score,
                evaluation.completeness_score,
                evaluation.overall_score,
                evaluation.verdict,
                evaluation.summary,
                evaluation.created_at
            ])

        elapsed = timer.stop()
        logger.info(
            "Experiment evaluations exported to CSV in %.3f seconds",
            elapsed
        )

        return output.getvalue()