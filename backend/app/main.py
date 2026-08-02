from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# API
from app.api.routes import router

# Database
from app.database.session import Base, engine

# Models
from app.models.evaluation import Evaluation
from app.models.experiment import Experiment

# Create tables (development only)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Verdict AI",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://verdictaiapp.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)