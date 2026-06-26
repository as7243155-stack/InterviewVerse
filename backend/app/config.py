import os

from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Environment Variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini Configuration
MODEL_NAME = "gemini-2.5-flash"

genai.configure(api_key=GEMINI_API_KEY)

# CORS
ALLOWED_ORIGINS = ["*"]