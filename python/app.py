from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import google.generativeai as genai
import json
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, specify your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Or specify ["POST", "OPTIONS"] if you prefer
    allow_headers=["*"],
)
GOOGLE_API_KEY = "your google api key"
YOUTUBE_API_KEY = "your youtube api key"

genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

# ==== Pydantic Model ====
class UserInfo(BaseModel):
    age: int
    gender: str
    height_cm: int
    weight_kg: int
    goal: str
    diet: str
    activity_level: str
    workout_preference: str
    allergies: str
    user_suggestion: str

# ==== Pydantic Models for Multi-week Meal Plans ====
class Week2MealRequest(UserInfo):
    previous_plan: dict

class Week3MealRequest(UserInfo):
    previous_plan1: dict
    previous_plan2: dict

class Week4MealRequest(UserInfo):
    previous_plan1: dict
    previous_plan2: dict
    previous_plan3: dict

# ==== Prompt Template ====
def generate_prompt(user_info):
    return f"""
You are a certified fitness and nutrition expert.

Create a 7-day {user_info.diet.lower()} meal plan for muscle gain:
- Age: {user_info.age}
- Gender: {user_info.gender}
- Height: {user_info.height_cm} cm
- Weight: {user_info.weight_kg} kg
- Activity: {user_info.activity_level}
- Allergies: {user_info.allergies}

Include this user suggestion: "{user_info.user_suggestion}"

Return a valid JSON only:
{{
  "meal_plan": {{
    "Day 1": {{
      "breakfast": {{
        "main": "...",
        "calories": "...",
        "prep_tip": "..."
      }},
      "lunch": {{
        "main": "...",
        "calories": "...",
        "prep_tip": "..."
      }},
      "dinner": {{
        "main": "...",
        "calories": "...",
        "prep_tip": "..."
      }},
      "snacks": {{
        "main": "...",
        "calories": "...",
        "prep_tip": "..."
      }}
    }},
    ...
  }},
  "alternate_meals": {{
    "breakfast": [
      {{
        "main": "...",
        "calories": "...",
        "prep_tip": "..."
      }},
      ...
    ],
    "lunch": [...],
    "dinner": [...],
    "snacks": [...]
  }}
}}
"""

# ==== Prompt Builders for Multi-week Meal Plans ====
def build_week2_meal_prompt(user_info: UserInfo, prev_plan: dict) -> str:
    prev_json = json.dumps(prev_plan)
    return f"""
You are a certified nutrition expert.

Based on the user's first week meal plan and their info, generate a personalized 7-day {user_info.diet.lower()} meal plan with varied meals.

User Info:
- Age: {user_info.age}
- Gender: {user_info.gender}
- Height: {user_info.height_cm} cm
- Weight: {user_info.weight_kg} kg
- Activity Level: {user_info.activity_level}
- Allergies: {user_info.allergies}

User Suggestion: "{user_info.user_suggestion}"

Previous Week Plan JSON:
{prev_json}

Return strictly valid JSON only:
{{
  "meal_plan": {{}},
  "alternate_meals": {{}}
}}
"""

def build_week3_meal_prompt(user_info: UserInfo, prev_plan1: dict, prev_plan2: dict) -> str:
    p1, p2 = json.dumps(prev_plan1), json.dumps(prev_plan2)
    return f"""
You are a certified nutrition expert.

Based on the user's first two weeks meal plans and their info, generate a personalized third 7-day {user_info.diet.lower()} meal plan.

Week 1 Plan JSON:
{p1}

Week 2 Plan JSON:
{p2}

User Info:
- Age: {user_info.age}
- Gender: {user_info.gender}
- Height: {user_info.height_cm} cm
- Weight: {user_info.weight_kg} kg
- Activity Level: {user_info.activity_level}
- Allergies: {user_info.allergies}

User Suggestion: "{user_info.user_suggestion}"

Return strictly valid JSON only:
{{
  "meal_plan": {{}},
  "alternate_meals": {{}}
}}
"""

def build_week4_meal_prompt(user_info: UserInfo, prev_plan1: dict, prev_plan2: dict, prev_plan3: dict) -> str:
    p1, p2, p3 = json.dumps(prev_plan1), json.dumps(prev_plan2), json.dumps(prev_plan3)
    return f"""
You are a certified nutrition expert.

Based on the user's first three weeks meal plans and their info, generate a personalized fourth 7-day {user_info.diet.lower()} meal plan.

Week 1 Plan JSON:
{p1}

Week 2 Plan JSON:
{p2}

Week 3 Plan JSON:
{p3}

User Info:
- Age: {user_info.age}
- Gender: {user_info.gender}
- Height: {user_info.height_cm} cm
- Weight: {user_info.weight_kg} kg
- Activity Level: {user_info.activity_level}
- Allergies: {user_info.allergies}

User Suggestion: "{user_info.user_suggestion}"

Return strictly valid JSON only:
{{
  "meal_plan": {{}},
  "alternate_meals": {{}}
}}
"""

# ==== Extract JSON from Gemini Response ====
def extract_json(text):
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        return json.loads(match.group())
    else:
        raise ValueError("Valid JSON not found in Gemini response.")

# ==== FastAPI Endpoint ====
@app.post("/generate_meal_plan")
async def generate_meal_plan(user_info: UserInfo):
    try:
        prompt = generate_prompt(user_info)
        gemini_response = gemini_model.generate_content(prompt)
        plan = extract_json(gemini_response.text)
        return plan

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==== FastAPI Endpoints for Multi-week Meal Plans ====
@app.post("/generate_week2_meal_plan")
async def generate_week2_meal_plan(req: Week2MealRequest):
    try:
        prompt = build_week2_meal_prompt(req, req.previous_plan)
        gemini_response = gemini_model.generate_content(prompt)
        plan_json = extract_json(gemini_response.text)
        return plan_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_week3_meal_plan")
async def generate_week3_meal_plan(req: Week3MealRequest):
    try:
        prompt = build_week3_meal_prompt(req, req.previous_plan1, req.previous_plan2)
        gemini_response = gemini_model.generate_content(prompt)
        plan_json = extract_json(gemini_response.text)
        return plan_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_week4_meal_plan")
async def generate_week4_meal_plan(req: Week4MealRequest):
    try:
        prompt = build_week4_meal_prompt(req, req.previous_plan1, req.previous_plan2, req.previous_plan3)
        gemini_response = gemini_model.generate_content(prompt)
        plan_json = extract_json(gemini_response.text)
        return plan_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
