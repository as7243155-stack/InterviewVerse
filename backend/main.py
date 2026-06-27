from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    # Back-compat with the old client that sent `level=...`
    level: str | None = None,
):
    if level and (not experience_level or experience_level == "Junior"):
        experience_level = level

    if question_count not in (5, 10, 15):
        question_count = 5

    prompt = f"""
You are an expert technical interviewer designing a structured mock interview.

Generate a complete interview as STRICT JSON ONLY (no prose, no markdown fences).

Inputs:
- Role: {role}
- Experience Level: {experience_level}
- Interview Type: {interview_type}
- Number of questions: {question_count}

Stages to cycle through across the {question_count} questions (in order, looping if needed):
Fundamentals, Core Knowledge, Practical Application, Scenario-Based Problem Solving, Advanced Thinking / Decision Making.

Difficulty must scale with experience level:
- Intern / Junior: concepts and understanding; avoid system design and heavy coding.
- Mid-Level: practical experience, troubleshooting, moderate difficulty.
- Senior / Staff: architecture, trade-offs, leadership, strategic decisions.

Return JSON in this EXACT shape:

{{
  "interview": {{
    "role": "{role}",
    "experience_level": "{experience_level}",
    "interview_type": "{interview_type}",
    "question_count": {question_count},
    "estimated_duration_minutes": <integer total minutes>,
    "introduction": "<2-4 sentence welcome that frames the session>",
    "questions": [
      {{
        "id": 1,
        "stage": "Fundamentals",
        "difficulty_level": <integer 1-5>,
        "evaluation_focus": "<what this question evaluates>",
        "expected_time_minutes": <integer minutes>,
        "is_programming_problem": <true|false>,
        "question": "<the question text>"
      }}
    ],
    "stage_transitions": [
      "<short sentence bridging question 1 -> 2>",
      "<short sentence bridging question 2 -> 3>"
    ],
    "closing": "<2-3 sentence closing message thanking the candidate>"
  }}
}}

Rules:
- Output ONLY the JSON object above. No commentary, no markdown.
- Generate EXACTLY {question_count} questions with ids 1..{question_count}.
- stage_transitions has length {question_count - 1}.
- Questions must be specific to the role and appropriate to the experience level.
- Avoid LeetCode-style problems unless the role explicitly requires them.
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        if "interview" not in data:
            data = {"interview": data}
        return data

    except Exception as e:
        return {
            "error": f"Failed to generate interview: {str(e)}",
            "interview": None,
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