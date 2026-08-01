# System Architecture

## Overview

Verdict AI follows a layered architecture to separate API logic, business logic, database access, and AI evaluation.

```
                +----------------------+
                |      Frontend        |
                |   React + Vite UI    |
                +----------+-----------+
                           |
                     HTTP / REST API
                           |
                           v
                +----------------------+
                |      FastAPI API     |
                |      Routes Layer    |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |    Service Layer     |
                | Business Logic       |
                +----------+-----------+
                           |
            +--------------+--------------+
            |                             |
            v                             v
+----------------------+      +----------------------+
|   LangGraph Engine   |      |  Repository Layer    |
| AI Evaluation Flow   |      | Database Operations  |
+----------+-----------+      +----------+-----------+
           |                             |
           v                             v
+----------------------+      +----------------------+
| Gemini API Critics   |      | Supabase PostgreSQL  |
+----------------------+      +----------------------+
```

---

# Project Structure

```
backend/
│
├── app/
│   ├── adjudicator/
│   ├── agents/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── exceptions/
│   ├── graph/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── requirements.txt
└── .env
```

---

# Request Flow

```
Client
   │
   ▼
FastAPI Route
   │
   ▼
Service Layer
   │
   ▼
LangGraph Workflow
   │
   ├── Accuracy Agent
   ├── Logic Agent
   ├── Completeness Agent
   │
   ▼
Adjudicator
   │
   ▼
Evaluation Result
   │
   ▼
Repository Layer
   │
   ▼
Supabase Database
   │
   ▼
JSON Response
```

---

# Layer Responsibilities

## API Layer

- Defines REST endpoints
- Validates requests
- Handles authentication
- Returns API responses

---

## Service Layer

- Implements business logic
- Executes LangGraph workflow
- Coordinates repositories
- Handles exports and analytics

---

## Repository Layer

- Performs database operations
- Creates, updates, deletes and retrieves records
- Isolates SQLAlchemy logic from services

---

## LangGraph Layer

Coordinates the evaluation pipeline.

```
Prompt + Response
        │
        ▼
Parallel Execution
        │
 ┌──────┼──────┐
 │      │      │
 ▼      ▼      ▼
Accuracy Logic Completeness
        │
        ▼
Adjudicator
        │
        ▼
Final Verdict
```

---

# Database

## Users

Stores registered users.

## Evaluations

Stores every evaluated response.

Each evaluation belongs to one user and may optionally belong to one experiment.

## Experiments

Groups related evaluations.

Deleting an experiment sets the associated evaluations' `experiment_id` to `NULL`, preserving the evaluation history.

---

# Authentication

JWT-based authentication.

```
Register
      │
      ▼
Password Hashing
      │
      ▼
Database
      │
      ▼
Login
      │
      ▼
JWT Token
      │
      ▼
Protected Endpoints
```

---

# Technologies

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Backend | FastAPI |
| Workflow | LangGraph |
| LLM | Google Gemini |
| Database | Supabase PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT |
| Validation | Pydantic |
| Deployment | Vercel |