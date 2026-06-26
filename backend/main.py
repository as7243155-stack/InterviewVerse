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
    level: str = "Fresher"
):

    prompt = f"""
You are an expert interviewer.

Create a structured interview for the role:

Role: {role}

Experience Level: {level}

Generate EXACTLY 5 questions.

Question Structure:

Question 1:
Fundamentals
- Test basic concepts and terminology.

Question 2:
Core Knowledge
- Test understanding of important concepts used in the role.

Question 3:
Practical Application
- Ask how the candidate would apply knowledge in real work.

Question 4:
Scenario-Based Problem Solving
- Present a realistic situation and ask how they would respond.

Question 5:
Advanced Thinking / Decision Making
- Test reasoning, judgement, optimization, or leadership appropriate to the experience level.

Difficulty Rules:

Fresher:
- Focus on concepts and understanding.
- Avoid very advanced topics.
- Avoid system design.
- Avoid difficult coding challenges.
- Do not require writing large code blocks.

Mid-Level:
- Focus on practical experience.
- Include troubleshooting and decision making.
- Moderate difficulty.

Senior:
- Focus on architecture, leadership, trade-offs, and strategic decisions.
- Higher difficulty.

Important:
- Questions must be specific to the role.
- Questions should evaluate knowledge and reasoning.
- Avoid asking candidates to write complete programs.
- Avoid LeetCode-style coding challenges unless the role explicitly requires them.
- Return ONLY the 5 questions.
- One question per line.
"""

    try:
        response = model.generate_content(prompt)

        questions = [
            q.strip()
            for q in response.text.split("\n")
            if q.strip()
        ]

        return {"questions": questions}

    except Exception as e:
        return {
            "questions": [
                f"Error generating questions: {str(e)}"
            ]
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