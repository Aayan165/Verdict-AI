# API Documentation

Base URL

```
http://localhost:8000
```

---

# Authentication

## Register

**POST** `/register`

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "User registered successfully."
}
```

---

## Login

**POST** `/login`

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

---

# Evaluation

## Evaluate Response

**POST** `/evaluate`

### Request

```json
{
  "prompt": "What is AI?",
  "response": "Artificial Intelligence...",
  "model_name": "GPT-5.1",
  "experiment_id": 1
}
```

`experiment_id` is optional.

### Response

```json
{
  "accuracy_score": 9.5,
  "logic_score": 9.0,
  "completeness_score": 8.5,
  "overall_score": 9.0,
  "verdict": "Excellent",
  "summary": "The response achieved an overall score of 9.0/10.",
  "strengths": [],
  "weaknesses": [],
  "improvements": []
}
```

---

## Get User Evaluations

**GET** `/my-evaluations`

Returns all evaluations belonging to the authenticated user.

---

## Get Evaluation

**GET** `/my-evaluations/{evaluation_id}`

Returns a single evaluation.

---

## Delete Evaluation

**DELETE** `/evaluations/{evaluation_id}`

Deletes the specified evaluation.

---

## Get Evaluations (Paginated)

**GET** `/evaluations`

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| page | Page number |
| limit | Items per page |
| verdict | Filter by verdict |
| experiment_id | Filter by experiment |

Example

```
GET /evaluations?page=1&limit=10
```

---

## Export Evaluations

**GET** `/export/evaluations`

Downloads every evaluation belonging to the authenticated user as a CSV file.

---

# Experiments

## Create Experiment

**POST** `/experiments`

### Request

```json
{
  "name": "GPT Benchmark",
  "description": "Model comparison experiment"
}
```

---

## Get Experiments

**GET** `/experiments`

Returns all experiments created by the authenticated user.

---

## Get Experiment

**GET** `/experiments/{experiment_id}`

Returns a specific experiment.

---

## Delete Experiment

**DELETE** `/experiments/{experiment_id}`

Deletes an experiment.

> Evaluations are **not deleted**. Their `experiment_id` is set to `NULL`.

---

# Experiment Evaluations

## Add Evaluation to Experiment

**POST**

```
/experiments/{experiment_id}/evaluations/{evaluation_id}
```

Associates an existing evaluation with an experiment.

---

## Remove Evaluation from Experiment

**DELETE**

```
/experiments/{experiment_id}/evaluations/{evaluation_id}
```

Removes an evaluation from an experiment.

The evaluation itself is preserved.

---

## Get Experiment Evaluations

**GET**

```
/experiments/{experiment_id}/evaluations
```

Returns every evaluation inside an experiment.

---

## Export Experiment

**GET**

```
/experiments/{experiment_id}/export
```

Downloads all evaluations belonging to a specific experiment as a CSV file.

---

# Analytics

## Dashboard Analytics

**GET**

```
/analytics
```

### Response

```json
{
  "total_evaluations": 25,
  "average_accuracy_score": 8.8,
  "average_logic_score": 8.5,
  "average_completeness_score": 8.9,
  "average_overall_score": 8.73,
  "verdict_distribution": {
    "Excellent": 8,
    "Good": 12,
    "Average": 5
  }
}
```

---

# Model Comparison

## Compare Models

**GET**

```
/model-comparison
```

Returns evaluation results grouped by model.

Example response:

```json
[
  {
    "model_name": "GPT-5.1",
    "accuracy_score": 9.5,
    "logic_score": 9.0,
    "completeness_score": 8.5,
    "overall_score": 9.0,
    "verdict": "Excellent",
    "created_at": "2026-08-02T12:30:00"
  }
]
```

---

# Authentication

All protected endpoints require a JWT access token.

Include the token in the request header:

```
Authorization: Bearer <access_token>
```

---

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |