from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

class UserProfileResponse(BaseModel):
    id: UUID
    full_name: str | None = None
    email: str
    created_at: datetime
    total_evaluations: int
    total_experiments: int
    class Config:
        from_attributes = True