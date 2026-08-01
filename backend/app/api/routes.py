#Libraries
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Depends
from fastapi import Query
from fastapi.responses import Response
from fastapi import status
from sqlalchemy.orm import Session

#Schemas
from app.schemas.request import EvaluationRequest
from app.schemas.response import EvaluationResponse
from app.schemas.evaluation import EvaluationRecord
from app.schemas.analytics import AnalyticsResponse
from app.schemas.model_comparision import ModelComparison
from app.schemas.experiment import (
    ExperimentCreate,
    ExperimentResponse
)

#Database
from app.database.session import SessionLocal
from app.database.dependencies import get_db

#Models
from app.models.evaluation import Evaluation

#Exceptions
from app.exceptions.custom import (
    DatabaseError,
    EvaluationError,
    LLMGenerationError
)

#Serivices
from app.services.evaluation_service import EvaluationService
from app.services.experiment_service import ExperimentService

#Workflow (langgraph)
from app.graph.workflow import build_graph

#Authentication
from app.auth.service import AuthService
from app.schemas.auth import LoginRequest, AuthResponse
from app.auth.dependencies import get_current_user

#===============================================================================

router = APIRouter()
service = EvaluationService()
experiment_service = ExperimentService()
auth_service = AuthService()

#===============================================================================
#           Posts
#===============================================================================

@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=AuthResponse,
    summary="User login",
    description="Authenticates a user and returns access and refresh tokens."
)
def login(data: LoginRequest):
    try:
        session = auth_service.login(
            email=data.email, 
            password=data.password
        )

        return AuthResponse(
            access_token=session.session.access_token,
            refresh_token=session.session.refresh_token,
            token_type=session.session.token_type
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post(
    "/evaluate",
    status_code=status.HTTP_200_OK,
    response_model=EvaluationResponse,
    summary="Evaluate an LLM response",
    description="Evaluates a prompt-response pair using the multi-agent LangGraph evaluation pipeline."
)
def evaluate(
    data: EvaluationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        result = service.evaluate(
            db=db,
            prompt=data.prompt,
            response=data.response, 
            model_name=data.model_name,
            user_id=current_user.id,
            experiment_id=data.experiment_id
        )

        return result
    
    except LLMGenerationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    
    except EvaluationError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected Server error.")


@router.post(
    "/experiments",
    status_code=status.HTTP_201_CREATED,
    response_model=ExperimentResponse,
    summary="Create a new experiment",
    description="Creates a new experiment for the authenticated user."
)
def create_experiment(
    data: ExperimentCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return experiment_service.create_experiment(
        db=db,
        user_id=current_user.id,
        name=data.name,
        description=data.description
    )

@router.post(
    "/experiments/{experiment_id}/evaluations/{evaluation_id}"
)
def evaluation_to_experiment(
    experiment_id: int,
    evaluation_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    experiment = experiment_service.add_evaluation_to_experiment(
        db=db,
        experiment_id=experiment_id,
        evaluation_id=evaluation_id,
        user_id=current_user.id
    )

    return {
        "message": "Evaluation added to experiment successfully.",
    }

#===============================================================================
#           Gets
#===============================================================================

@router.get(
    "/",
    summary="Get API home",
    description="Returns a simple message indicating that the LLM Output Arbitrator API is running."
)
def home():
    return {
        "message": "LLM Output Arbitrator API is running"
    }

@router.get(
    "/health",
    summary="Check API health",
    description="Returns the health status of the API."
)
def health():
    return {
        "status": "healthy"
    }

@router.get(
    "/my-evaluations",
    response_model=list[EvaluationRecord],
    summary="Get all evaluations created by the user",
    description="Returns a list of all evaluations created by the authenticated user."
)
def get_my_evaluations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return service.get_user_evaluations(
        db=db,
        user_id=current_user.id
    )


@router.get(
    "/my-evaluations/{evaluation_id}",
    response_model=EvaluationRecord,
    summary="Get a specific evaluation",
    description="Returns the details of a specific evaluation created by the user."
)
def get_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)    
):
    evaluation = service.get_evaluation(
        db=db,
        evaluation_id=evaluation_id,
        user_id=current_user.id
    )
    if evaluation is None:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not Found."
        )
    return evaluation

@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
    summary="Get user analytics",
    description="Returns analytics such as average scores, verdict distribution and total evaluations."
)
def get_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return service.get_user_analytics(
        db=db,
        user_id=current_user.id
    )


@router.get(
    "/model-comparison",
    response_model=list[ModelComparison],
    summary="Get model comparison",
    description="Returns a comparison of models based on their average scores and verdict distribution."
)
def get_model_comparison(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return service.get_model_comparison(
        db=db,
        user_id=current_user.id
    )

@router.get(
    "/experiments",
    response_model=list[ExperimentResponse],
    summary="Get user experiments",
    description="Returns a list of experiments created by the user."
)
def get_experiments(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return experiment_service.get_user_experiments(
        db,
        current_user.id
    )

@router.get(
    "/experiments/{experiment_id}",
    response_model=ExperimentResponse,
    summary="Get experiment details",
    description="Returns the details of a specific experiment created by the user."
)
def get_experiment(
    experiment_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    experiment = experiment_service.get_experiment(
        db=db,
        experiment_id=experiment_id,
        user_id=current_user.id
    )

    if experiment is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not Found."
        )

    return experiment

@router.get(
    "/experiments/{experiment_id}/evaluations",
    response_model=list[EvaluationRecord],
    summary="Get evaluations for an experiment",
    description="Returns a list of evaluations associated with a specific experiment created by the user."
)
def get_experiment_evaluations(
    experiment_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    experiment = experiment_service.get_experiment(
        db=db,
        experiment_id=experiment_id,
        user_id=current_user.id
    )
    if experiment is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not Found."
        )

    return service.repository.get_by_experiment(
        db,
        experiment_id,
        current_user.id
    )

@router.get(
    "/evaluations",
    response_model=list[EvaluationRecord],
    summary="Get evaluations with filters",
    description="Returns a list of evaluations based on the provided filters such as verdict and experiment ID."
)
def get_evaluations(
    verdict: str | None = Query(None),
    experiment_id: int | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return service.get_evaluations(
        db=db,
        user_id=current_user.id,
        verdict=verdict,
        experiment_id=experiment_id,
        page=page,
        limit=limit
    )

@router.get(
    "/export/evaluations",
    summary="Export evaluations to CSV",
    description="Exports all evaluations of the current user to a CSV file."
)
def export_evaluations(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    csv_data = service.export_csv(
        db,
        current_user.id
    )

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=evalutions.csv"
        }
    )

@router.get(
    "/experiments/{experiment_id}/export",
    summary="Export experiment evaluations to CSV",
    description="Exports all evaluations associated with a specific experiment to a CSV file."
)
def export_experiment(
    experiment_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    csv_data = experiment_service.export_csv(
        db=db,
        experiment_id=experiment_id,
        user_id=current_user.id
    )

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition":
            f'attachment; filename="experiment_{experiment_id}.csv"'
        }
    )

#===============================================================================
#           Deletes
#===============================================================================

@router.delete(
    "/experiments/{experiment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an experiment",
    description="Deletes a specific experiment created by the user along with all its associated evaluations."
)
def delete_experiment(
    experiment_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    experiment = experiment_service.delete_experiment(
        db=db,
        experiment_id=experiment_id,
        user_id=current_user.id
    )

    if experiment is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not found."
        )

    return {
        "message": "Experiment deleted successfully."
    }

@router.delete(
    "/experiments/{experiment_id}/evaluations/{evaluation_id}"
)
def remove_evaluation_from_experiment(
    experiment_id: int,
    evaluation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    experiment_service.remove_evaluation_from_experiment(
        db=db,
        experiment_id=experiment_id,
        evaluation_id=evaluation_id,
        user_id=current_user.id
    )

    return {
        "message": "Evaluation removed from experiment successfully."
    }