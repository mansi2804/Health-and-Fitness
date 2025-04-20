import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "your GEMINI_API_KEY"
genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
Provide detailed answers. Maximum 5-6 lines. 
Focus on key information. Such as calories, nutrients, health benefits, gym exercises, etc.
"""

NAVIGATION_ROUTES = {
    "go to home": "/",
    "home": "/",
    "go to login": "/login",
    "login": "/login",
    "go to signup": "/signup",
    "signup": "/signup",
    "go to profile": "/profile-setup",
    "profile setup": "/profile-setup",
    "go to dashboard": "/dashboard",
    "dashboard": "/dashboard",
    "go to food nutrition": "/food-nutrition",
    "food nutrition": "/food-nutrition",
    "go to meal plan": "/meal-plan",
    "meal plan": "/meal-plan",
    "go to workouts": "/workouts",
    "workouts": "/workouts",
    "go to tracking": "/tracking",
    "tracking": "/tracking",
    "go to ask ai": "/ask-ai",
    "ask ai": "/ask-ai",
    "go to settings": "/settings",
    "settings": "/settings",
    "go to notifications": "/notifications",
    "notifications": "/notifications",
    "go to logout": "/logout",
    "logout": "/logout",
}

def get_gemini_response(user_input):
    for key, route in NAVIGATION_ROUTES.items():
        if key in user_input.lower():
            return {"reply": f"Navigating to {route}", "route": route}
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        chat_session = model.start_chat(
            history=[{'role': 'user', 'parts': [SYSTEM_PROMPT]}]
        )
        
        response = chat_session.send_message(user_input)
        cleaned_response = response.text.replace('*', '').strip()
        
        # Ensure response is max 6 lines
        lines = cleaned_response.split('\n')
        cleaned_response = '\n'.join(lines[:6])
        
        return {"reply": cleaned_response}
    
    except Exception as e:
        print(f"Error generating response: {e}")
        return {"reply": "Unable to process request."}

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    bot_reply = get_gemini_response(user_message)
    bot_reply['routes'] = NAVIGATION_ROUTES
    return jsonify(bot_reply)

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
