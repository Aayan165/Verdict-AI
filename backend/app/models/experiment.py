from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

#Databases
from app.database.session import Base

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Text, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    evaluations = relationship(
        "Evaluation",
        back_populates="experiment",
        passive_deletes=True,
    )

    @property
    def evaluation_count(self):
        return len(self.evaluations)