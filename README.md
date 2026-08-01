# Veriq

> AI Evaluation & Model Intelligence Platform

Veriq is an AI-powered evaluation platform that analyzes Large Language Model (LLM) responses using multiple independent evaluation agents. Instead of relying on a single score, Veriq evaluates responses across multiple dimensions and produces a final adjudicated verdict.

The platform also enables users to organize evaluations into experiments, compare models, analyze performance trends, and export evaluation reports.

---

## Features

### AI Response Evaluation

- Evaluate any LLM response
- Multi-agent evaluation pipeline
- Accuracy critic
- Logic critic
- Completeness critic
- Final adjudicated verdict
- Human-readable summary

### Evaluation Management

- View evaluation history
- Search evaluations
- Pagination
- Filtering
- Sorting
- Delete evaluations

### Analytics

- Total evaluations
- Average scores
- Verdict distribution
- Performance overview

### Model Comparison

- Compare different LLMs
- Average score comparison
- Performance benchmarking

### Experiments

- Create experiments
- Add evaluations to experiments
- Remove evaluations from experiments
- Delete experiments
- Preserve evaluations after experiment deletion

### Export

- Export all evaluations as CSV
- Export evaluations from a specific experiment

### Authentication

- User registration
- Login
- JWT authentication
- User-specific data isolation

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Hook Form
- React Router
- Axios
- Zod

## Backend

- FastAPI
- LangGraph
- SQLAlchemy
- PostgreSQL
- Supabase
- Pydantic
- JWT Authentication

## AI

- Google Gemini
- Multi-Agent Evaluation
- LangGraph Workflow

---

# Project Structure

```text
Veriq/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── adjudicator/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── database/
│   │   ├── exceptions/
│   │   ├── graph/
│   │   ├── llms/
│   │   ├── models/
│   │   ├── prompts/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│
│   ├── tests/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# System Architecture

```text
                    React Frontend
                           │
                           ▼
                     FastAPI Backend
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
     Business Services             LangGraph Workflow
            │                             │
            ▼                             ▼
     SQLAlchemy Layer      Accuracy / Logic / Completeness
            │                             │
            ▼                             ▼
      PostgreSQL / Supabase         Adjudicator
                    │                     │
                    └──────────┬──────────┘
                               ▼
                         Final Evaluation
```

---

# Evaluation Pipeline

```text
Prompt
+
LLM Response
      │
      ▼
 Evaluation Request
      │
      ▼
 LangGraph
      │
 ┌────┼────┐
 ▼    ▼    ▼
Accuracy
Logic
Completeness
      │
      ▼
 Adjudicator
      │
      ▼
 Final Verdict
      │
      ▼
 Database
      │
      ▼
 Dashboard
```

---

# Database

## Users

Stores application users.

## Evaluations

Stores every evaluated LLM response.

Includes:

- Prompt
- Response
- Model Name
- Accuracy Score
- Logic Score
- Completeness Score
- Overall Score
- Verdict
- Summary
- Timestamp

## Experiments

Stores user-created experiment collections.

Evaluations may optionally belong to an experiment.

Deleting an experiment **does not delete** its evaluations.

---

# API

## Authentication

```
POST /register
POST /login
```

## Evaluation

```
POST /evaluate
GET /evaluations
GET /my-evaluations
GET /my-evaluations/{id}
DELETE /evaluations/{id}
```

## Analytics

```
GET /analytics
```

## Model Comparison

```
GET /model-comparison
```

## Experiments

```
POST /experiments
GET /experiments
GET /experiments/{id}
DELETE /experiments/{id}
```

## Experiment Evaluations

```
POST /experiments/{experiment_id}/evaluations/{evaluation_id}

DELETE /experiments/{experiment_id}/evaluations/{evaluation_id}

GET /experiments/{experiment_id}/evaluations

GET /experiments/{experiment_id}/export
```

## Export

```
GET /export/evaluations
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/<username>/Veriq.git
```

```bash
cd Veriq
```

---

# Backend Setup

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file.

```env
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run the backend.

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

# Frontend Setup

Navigate to frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run development server.

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Roadmap

## Version 1

- Multi-agent evaluation
- Authentication
- Evaluation history
- Analytics
- Model comparison
- Experiments
- CSV export
- Responsive dashboard

## Version 2

- Automated benchmark experiments
- Multiple AI provider support
- Token usage analytics
- Cost tracking
- Evaluation templates
- Team workspaces
- Scheduled experiments
- Advanced visualizations
- Benchmark datasets
- Public API

---

# License

This project is licensed under the MIT License.

---

# Author

**Syed Aayan Mahmood**

Computer Science Student — FAST NUCES Karachi

AI Engineer | Backend Developer
