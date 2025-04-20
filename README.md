# H & F

## Overview
H & F is a full-stack AI-driven health & fitness web application that empowers users to plan meals, workouts, track progress, and get real-time AI guidance. It combines modern frontend technologies with AI-powered microservices for nutrition analysis, personalized meal/workout plans, and conversational assistance.

## Features
- **User Management**  
  Signup, login, and profile setup using Firebase Authentication and Firestore.
- **Dashboard & Tracking**  
  Log workouts, meals, calories, and nutrients; view progress charts.
- **Food Nutrition Lookup**  
  - Text search: Enter a food name for detailed nutrition facts.  
  - Image upload: AI-based food classification (PyTorch) and nutrition extraction.
- **Personalized Meal Plans**  
  - One-week meal plan on demand.  
  - Progressive multi-week plans (weeks 2–4) with varied menus and alternates.
- **Personalized Workout Plans**  
  - One-week gym plans (3 exercises/day).  
  - Progressive overload for weeks 2–4.  
  - Auto-fetch YouTube demo links for each exercise.
- **AI Chat Assistant**  
  Conversational Q&A and navigation commands via Google Gemini.
- **Notifications & Settings**  
  Manage in-app alerts and user preferences.
- **Tech & Integrations**  
  React, Vite, Tailwind CSS, MUI, React Router, Zustand, FastAPI, Flask, Google Gemini, YouTube Data API, PyTorch.

## Tech Stack
- **Frontend**: Vite, React v19, Tailwind CSS, Material-UI, React Router v7, Zustand, Firebase Auth & Firestore.  
- **Backend**: Python services with Flask (chat) and FastAPI (api, meal, workout).  
- **AI/ML**: Google Gemini LLM, PyTorch & torchvision for image classification.  
- **APIs**: YouTube Data API for exercise videos.  
- **Hosting/Dev**: Vite dev server, Uvicorn, npm, pip.

## Prerequisites
- Node.js (>=16) & npm  
- Python (>=3.8) & pip3  
- API Keys:  
  - Google Gemini (LLM) API key  
  - YouTube Data API key  
  - Firebase project config (apiKey, authDomain, etc.)

## Installation & Setup

1. Clone this repository:
   ```bash
   git clone <repo_url>
   cd H&F
   ```

2. Configure environment variables or replace keys in code (for development):  
   - `python/api.py`, `python/chat.py`, `python/app.py`, `python/main.py`: set `GEMINI_API_KEY` and `YOUTUBE_API_KEY`.  
   - `src/firebaseConfig.js`: set Firebase `apiKey`, `authDomain`, `projectId`, etc.

3. Install dependencies:

   **Frontend**
   ```bash
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`.

   **Backend**
   ```bash
   cd python
   pip3 install -r requirements.txt
   ```
   In separate terminals:

   - Chat service (Flask):
     ```bash
     python3 chat.py
     ```
   - Food image API (FastAPI):
     ```bash
     uvicorn api:app --reload --port 8000
     ```
   - Meal plan API (FastAPI):
     ```bash
     uvicorn app:app --reload --port 8001
     ```
   - Workout plan API (FastAPI):
     ```bash
     uvicorn main:app --reload --port 8002
     ```

## API Reference

### Chat Service
`POST /chat`  
Request body:  
```json
{ "message": "your question or command" }
```  
Response:
```json
{
  "reply": "AI response text",
  "route": "/dashboard",    // optional
  "routes": { ... }         // navigation map
}
```

### Food Image Analyzer
`POST /analyze/`  
Form data:  
- `image`: file  
- `weight`: number (grams)  
Response:
```json
{
  "food_name": "apple",
  "confidence": 0.92,
  "calories": 95.0,
  "protein": 0.5,
  ...
}
```

### Meal Plan Generation
`POST /generate_meal_plan`  
Body: `UserInfo` JSON  
Weekly and multi-week endpoints:  
- `/generate_week2_meal_plan`  
- `/generate_week3_meal_plan`  
- `/generate_week4_meal_plan`

### Workout Plan Generation
Similar to meal endpoints: `/generate_workout_plan`, `/generate_week2_plan`, `/generate_week3_plan`, `/generate_week4_plan`.

## Project Structure
```
H&F/
├── src/               # React frontend
├── public/
├── python/            # Backend microservices
│   ├── api.py
│   ├── chat.py
│   ├── app.py
│   ├── main.py
│   └── requirements.txt
├── Diagrams/
├── Demo.mp4
├── package.json
├── vite.config.js
└── README.md
```

## Contributing
Contributions welcome! Please open issues or PRs for bug fixes and new features.

## License
[MIT License](LICENSE)
