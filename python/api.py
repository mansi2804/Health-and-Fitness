from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import torchvision.models as models
import pandas as pd
import io
import os
import logging
import base64
import json
import google.generativeai as genai
import difflib
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini LLM config
genai.configure(api_key="your gemini api key")
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

@app.post("/analyze/")
async def analyze(image: UploadFile = File(..., description="Food image file"),
                  weight: str = Form(..., description="Food weight in grams")):
    try:
        try:
            weight_float = float(weight)
        except ValueError:
            return JSONResponse(status_code=400, content={"error": "Weight must be a number"})
        image_bytes = await image.read()
        b64 = base64.b64encode(image_bytes).decode()
        prompt = f"""
You are a food image classifier.
Here is a base64-encoded food image:

{b64}

Return strictly valid JSON with keys "food_name" (string) and "confidence" (0.0 to 1.0).
"""
        gemini_resp = gemini_model.generate_content(prompt)
        resp_text = getattr(gemini_resp, 'text', '') or str(gemini_resp)
        # Debug and parse classification response
        logging.debug(f"Classification raw response: {resp_text}")
        # extract JSON part if present
        match = re.search(r"(\{.*\})", resp_text, flags=re.DOTALL)
        json_str = match.group(1) if match else resp_text.strip()
        try:
            class_data = json.loads(json_str)
            food_name = (class_data.get('food_name') or class_data.get('food Name') or '').strip()
            confidence = float(class_data.get('confidence', 0.0))
        except Exception as e:
            logging.error(f"Classification parse error: {e}")
            # fallback: take first alpha word
            words = re.findall(r"[A-Za-z]+", resp_text)
            food_name = words[0] if words else resp_text.strip()
            confidence = 0.5
        # Fetch nutritional info via Gemini with strict JSON only
        nut_prompt = f"""
You are a qualified nutritionist. Given a food item and its weight:
++ Food: {food_name}
++ Weight: {weight_float} grams

Return ONLY a JSON object (no explanation) with numeric keys:
  calories, protein, carbohydrates, fats, fiber, sugars, sodium (in mg)
"""
        nut_resp = gemini_model.generate_content(nut_prompt)
        nut_text = getattr(nut_resp, 'text', '') or str(nut_resp)
        logging.debug(f"Nutrition raw response: {nut_text}")
        # extract JSON part
        match = re.search(r"(\{.*\})", nut_text, flags=re.DOTALL)
        payload = match.group(1) if match else nut_text.strip()
        try:
            nut_data = json.loads(payload)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse nutrition JSON: {e}")
            nut_data = {}
        result = {
            'food_name': food_name,
            'confidence': confidence,
            'calories': float(nut_data.get('calories', 0.0)),
            'protein': float(nut_data.get('protein', 0.0)),
            'carbohydrates': float(nut_data.get('carbohydrates', 0.0)),
            'fats': float(nut_data.get('fats', 0.0)),
            'fiber': float(nut_data.get('fiber', 0.0)),
            'sugars': float(nut_data.get('sugars', 0.0)),
            'sodium': float(nut_data.get('sodium', 0.0)),
        }
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
