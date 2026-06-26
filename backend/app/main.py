from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import json
from app.prompts.question_prompt import build_question_prompt


from app.config import MODEL_NAME, ALLOWED_ORIGINS
model = genai.GenerativeModel(MODEL_NAME)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Mock Interview Backend Running"}


@app.get("/questions")
def generate_questions(
    role: str,
    experience_level: str = "Junior",
    question_count: int = 5,
    interview_type: str = "Technical",
):

    prompt = build_question_prompt(
    role=role,
    experience_level=experience_level,
    question_count=question_count,
    interview_type=interview_type,
)

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        result = json.loads(text)

        return result

    except Exception as e:
        {
            "error": str(e)
        }


@app.post("/evaluate")
def evaluate_interview(data: dict):

    questions = data.get("questions", [])
    answers = data.get("answers", {})
    role = data.get("role", "Unknown")

    prompt = f"""
You are a senior professional interviewer.

Role:
{role}

Interview Questions:
{questions}

Candidate Answers:
{answers}

Interview Evaluation Philosophy:

- Judge candidates based on demonstrated knowledge, not perfection.
- Reward partial understanding.
- Reward logical thinking even if the answer is incomplete.
- Do not be overly harsh.
- Do not be overly generous.
- Act like a professional interviewer.

Evaluate the candidate on:

1. Role Knowledge
2. Practical Understanding
3. Problem Solving
4. Communication
5. Quality and Completeness of Answers

Interview Summary Rules:

- Write a concise summary of the candidate's overall performance.
- Mention strengths.
- Mention areas for improvement.
- Keep it between 3 and 6 sentences.
- Write professionally.

Scoring Rules:

0-1 = Completely incorrect, irrelevant, or empty answer
2-3 = Very weak answer with minimal understanding
4-5 = Basic understanding but lacks depth
6-7 = Good answer showing reasonable knowledge
8-9 = Strong answer with examples and reasoning
10 = Exceptional answer
Skill Breakdown Rules:

- Generate 4 role-specific skills.
- Skills must match the profession being interviewed.
- Assign a score from 0-100 for each skill.

Examples:

Software Engineer:
- Programming Fundamentals
- Debugging
- System Design
- Communication

Chef:
- Food Safety
- Kitchen Operations
- Menu Planning
- Communication

Teacher:
- Subject Knowledge
- Classroom Management
- Student Engagement
- Communication

Marketing Manager:
- Market Research
- Campaign Strategy
- Analytics
- Communication
Return ONLY valid JSON.

Format:

{{
    "summary": "Overall interview summary",

    "overall_score": 78,

    "skill_breakdown": {{
        "Skill 1": 80,
        "Skill 2": 75,
        "Skill 3": 70,
        "Skill 4": 85
    }},

    "question_feedback": [
        {{
            "question": "Question text",
            "score": 8,
            "feedback": "Detailed feedback"
        }}
    ],

    "strengths": [
        "Strength 1",
        "Strength 2"
    ],

    "weaknesses": [
        "Weakness 1",
        "Weakness 2"
    ],

    "suggestions": [
        "Suggestion 1",
        "Suggestion 2"
    ]
}}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        print("\n===== GEMINI RESPONSE =====")
        print(text)
        print("===========================\n")

        result = json.loads(text)

        return result

    except Exception as e:
        print("EVALUATION ERROR:", str(e))

        return {
    "summary": "Unable to generate interview summary.",

    "overall_score": 0,

    "skill_breakdown": {},

    "question_feedback": [],

    "strengths": [],
    "weaknesses": [str(e)],
    "suggestions": []
}                       