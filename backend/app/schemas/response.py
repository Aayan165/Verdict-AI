from pydantic import BaseModel
from typing import List
from app.schemas.verdict import FinalVerdict

class EvaluationResponse(BaseModel):
    accuracy_score: float
    logic_score: float
    completeness_score: float

    overall_score: float
    verdict: str
    summary: str

    strengths: List[str]
    weaknesses: List[str]
    improvements: List[str]