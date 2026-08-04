from datetime import datetime
from pydantic import BaseModel

class ExperimentCreate(BaseModel):
    name: str
    description: str | None = None

class ExperimentResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    created_at: datetime
    evaluation_count: int

    class Config:
        from_attributes = True
