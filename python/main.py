from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import requests
import json
import re
import logging

# ==== FastAPI App ====
app = FastAPI()

# ==== CORS Middleware ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify frontend URL like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== API Keys ====
GOOGLE_API_KEY = "your GOOGLE_API_KEY "
YOUTUBE_API_KEY = "your YOUTUBE_API_KEY "

genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")
logging.basicConfig(level=logging.INFO)

# ==== Pydantic Input Schema ====
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

class Week2Request(UserInfo):
    previous_plan: dict

class Week3Request(UserInfo):
    previous_plan1: dict
    previous_plan2: dict

class Week4Request(UserInfo):
    previous_plan1: dict
    previous_plan2: dict
    previous_plan3: dict

# ==== Prompt Builder ====
def build_workout_prompt(user_info: UserInfo) -> str:
    return f"""
You are a certified fitness trainer.

Create a personalized 7-day gym-based workout plan for the user with exactly 3 exercises per day.

User Info:
- Age: {user_info.age}
- Gender: {user_info.gender}
- Height: {user_info.height_cm} cm
- Weight: {user_info.weight_kg} kg
- Fitness Goal: {user_info.goal}
- Activity Level: {user_info.activity_level}
- Diet: {user_info.diet}
- Preferences: {user_info.workout_preference}
- Allergies or Conditions: {user_info.allergies}
- Special Suggestion: "{user_info.user_suggestion}"

Response format (strictly return valid JSON, no extra text):

{{
  "workout_plan": {{
    "Day 1": {{
      "goal": "e.g. Upper Body Strength",
      "focus": "e.g. Push Exercises",
      "exercises": [
        {{
          "name": "Exercise 1",
          "sets": "e.g. 3 sets",
          "reps": "e.g. 10-12 reps",
          "notes": "e.g. Maintain form, rest 60s"
        }},
        {{
          "name": "Exercise 2",
          "sets": "...",
          "reps": "...",
          "notes": "..."
        }},
        {{
          "name": "Exercise 3",
          "sets": "...",
          "reps": "...",
          "notes": "..."
        }}
      ]
    }},
    ...
    "Day 7": {{
      ...
    }}
  }}
}}
"""

def build_week2_prompt(user_info: UserInfo, prev_plan: dict) -> str:
    prev_json = json.dumps(prev_plan)
    prompt_parts = [
        "You are a certified fitness trainer.",
        "Based on the user's first week workout plan and their info, generate a personalized second week workout plan using progressive overload.",
        "Provide exactly 7 days, each with 3 exercises: name, sets, reps, notes.",
        f"Previous Week Plan JSON:\n{prev_json}",
        f"User Info: Age {user_info.age}, Gender {user_info.gender}, Height {user_info.height_cm} cm, Weight {user_info.weight_kg} kg, \
Fitness Goal {user_info.goal}, Activity Level {user_info.activity_level}, Diet {user_info.diet}, \
Preferences {user_info.workout_preference}, Allergies {user_info.allergies}, Special Suggestion {user_info.user_suggestion}.",
        "Return strictly valid JSON with a top-level 'workout_plan' object containing keys 'Day 1' through 'Day 7'."
    ]
    return "\n".join(prompt_parts)

def build_week3_prompt(user_info: UserInfo, prev_plan1: dict, prev_plan2: dict) -> str:
    p1 = json.dumps(prev_plan1)
    p2 = json.dumps(prev_plan2)
    parts = [
        "You are a certified fitness trainer.",
        "Based on the user's first two weeks workout plans and their info, generate a personalized third week workout plan using progressive overload.",
        "Provide exactly 7 days, each with 3 exercises: name, sets, reps, notes.",
        f"Week 1 Plan JSON:\n{p1}",
        f"Week 2 Plan JSON:\n{p2}",
        f"User Info: Age {user_info.age}, Gender {user_info.gender}, Height {user_info.height_cm} cm, Weight {user_info.weight_kg} kg, Fitness Goal {user_info.goal}, Activity Level {user_info.activity_level}, Diet {user_info.diet}, Preferences {user_info.workout_preference}, Allergies {user_info.allergies}, Special Suggestion {user_info.user_suggestion}.",
        "Return strictly valid JSON with a top-level 'workout_plan' object containing keys 'Day 1' through 'Day 7'."
    ]
    return "\n".join(parts)

def build_week4_prompt(user_info: UserInfo, prev_plan1: dict, prev_plan2: dict, prev_plan3: dict) -> str:
    p1, p2, p3 = json.dumps(prev_plan1), json.dumps(prev_plan2), json.dumps(prev_plan3)
    parts = [
        "You are a certified fitness trainer.",
        "Based on the user's first three weeks workout plans and their info, generate a personalized fourth week workout plan using progressive overload.",
        "Provide exactly 7 days, each with 3 exercises: name, sets, reps, notes.",
        f"Week 1 Plan JSON:\n{p1}",
        f"Week 2 Plan JSON:\n{p2}",
        f"Week 3 Plan JSON:\n{p3}",
        f"User Info: Age {user_info.age}, Gender {user_info.gender}, Height {user_info.height_cm} cm, Weight {user_info.weight_kg} kg, Fitness Goal {user_info.goal}, Activity Level {user_info.activity_level}, Diet {user_info.diet}, Preferences {user_info.workout_preference}, Allergies {user_info.allergies}, Special Suggestion {user_info.user_suggestion}.",
        "Return strictly valid JSON with a top-level 'workout_plan' object containing keys 'Day 1' through 'Day 7'."
    ]
    return "\n".join(parts)

# ==== JSON Extractor ====
def extract_json(text: str):
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        return json.loads(match.group())
    else:
        raise ValueError("Valid JSON not found in Gemini response.")

# ==== YouTube Video Fetcher ====
def get_youtube_video_link(query: str) -> str:
    """Fetch top YouTube video URL for given exercise query."""
    search_query = f"{query} exercise"
    params = {
        "part": "snippet",
        "q": search_query,
        "key": YOUTUBE_API_KEY,
        "maxResults": 1,
        "type": "video"
    }
    # use params to ensure proper encoding
    response = requests.get("https://www.googleapis.com/youtube/v3/search", params=params)
    try:
        response.raise_for_status()
    except Exception as e:
        logging.error(f"YouTube API error for query '{search_query}': {e}")
        return ""
    data = response.json()
    items = data.get("items", [])
    if not items:
        logging.warning(f"No YouTube video found for query: {search_query}")
        return ""
    vid = items[0].get("id", {}).get("videoId", "")
    return f"https://www.youtube.com/watch?v={vid}" if vid else ""

# ==== FastAPI Route ====
@app.post("/generate_workout_plan")
async def generate_workout_plan(user_info: UserInfo):
    try:
        prompt = build_workout_prompt(user_info)
        gemini_response = gemini_model.generate_content(prompt)
        workout_plan = extract_json(gemini_response.text)

        # Add YouTube links
        for day in workout_plan["workout_plan"]:
            for exercise in workout_plan["workout_plan"][day]["exercises"]:
                exercise_name = exercise["name"]
                exercise["video"] = get_youtube_video_link(exercise_name)

        return workout_plan

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_week2_plan")
async def generate_week2_plan(req: Week2Request):
    logging.info("Received Week2 request: %s", req.dict())
    try:
        prompt = build_week2_prompt(req, req.previous_plan)
        logging.info("Week2 prompt built, length=%d", len(prompt))
        gemini_response = gemini_model.generate_content(prompt)
        text = getattr(gemini_response, 'text', None) or str(gemini_response)
        logging.info("LLM response received: %s", text[:200])
        try:
            workout_plan = extract_json(text)
        except ValueError as ve:
            logging.error("Week2 JSON parse error: %s", text)
            raise HTTPException(status_code=502, detail=f"Invalid JSON from LLM: {ve}")
        # Add YouTube links
        for day, details in workout_plan.get("workout_plan", {}).items():
            for exercise in details.get("exercises", []):
                exercise["video"] = get_youtube_video_link(exercise.get("name", ""))
        return workout_plan
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Week2 generation error")
        # Preserve error detail for debugging
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_week3_plan")
async def generate_week3_plan(req: Week3Request):
    logging.info("Received Week3 request: %s", req.dict())
    try:
        prompt = build_week3_prompt(req, req.previous_plan1, req.previous_plan2)
        gemini_response = gemini_model.generate_content(prompt)
        text = getattr(gemini_response, 'text', None) or str(gemini_response)
        workout_plan = extract_json(text)
        for day, details in workout_plan.get("workout_plan", {}).items():
            for exercise in details.get("exercises", []):
                exercise["video"] = get_youtube_video_link(exercise.get("name", ""))
        return workout_plan
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Week3 generation error")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_week4_plan")
async def generate_week4_plan(req: Week4Request):
    logging.info("Received Week4 request: %s", req.dict())
    try:
        prompt = build_week4_prompt(req, req.previous_plan1, req.previous_plan2, req.previous_plan3)
        gemini_response = gemini_model.generate_content(prompt)
        text = getattr(gemini_response, 'text', None) or str(gemini_response)
        workout_plan = extract_json(text)
        for day, details in workout_plan.get("workout_plan", {}).items():
            for exercise in details.get("exercises", []):
                exercise["video"] = get_youtube_video_link(exercise.get("name", ""))
        return workout_plan
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Week4 generation error")
        raise HTTPException(status_code=500, detail=str(e))
