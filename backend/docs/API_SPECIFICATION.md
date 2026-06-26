# InterviewVerse API Specification

Version: 2.0
Status: Draft

---

# Base URL

http://localhost:8000

---

# Endpoint 1

GET /questions

Description:

Generates a complete interview.

---

## Query Parameters

role (string)

Required

Example:

Backend Developer

---

level (string)

Required

Possible values:

Intern

Junior

Mid-Level

Senior

Staff

---

question_count (integer)

Required

Allowed values:

5

10

15

---

interview_type (string)

Default:

Technical

Future values:

HR

Behavioral

System Design

---

## Success Response

HTTP 200

```json
{
    "interview": {

        "role": "Backend Developer",

        "experience_level": "Junior",

        "question_count": 10,

        "estimated_duration": 30,

        "introduction": "...",

        "questions": [

            {
                "id": 1,
                "type": "Fundamentals",
                "difficulty": "Easy",
                "expected_duration": 3,
                "question": "..."
            }

        ],

        "stage_transitions": [

            "...",

            "...",

            "...",

            "...",

            "..."

        ],

        "closing": "..."
    }
}
```

---

# Endpoint 2

POST /evaluate

Description:

Evaluates the completed interview.

---

## Request

```json
{
    "role":"Backend Developer",

    "experience_level":"Junior",

    "questions":[...],

    "answers":{...}
}
```

---

## Response

```json
{
    "pre_summary_message":"Thank you for completing today's interview. I'm reviewing your responses.",

    "summary":"...",

    "overall_score":84,

    "skill_breakdown":{

    },

    "question_feedback":[

    ],

    "strengths":[

    ],

    "weaknesses":[

    ],

    "suggestions":[

    ]
}
```

---

# Future Endpoints

POST /resume/upload

POST /resume/analyze

POST /company/interview

POST /voice/start

POST /voice/end

GET /history

GET /dashboard

POST /feedback

---

# Design Principles

- JSON only

- Consistent response format

- Predictable endpoint naming

- Future-compatible

- Frontend independent

- Mobile friendly