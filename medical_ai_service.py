import os
import time
from dotenv import load_dotenv
from openai import OpenAI

# Load API key
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    # Fallback to the key provided in the conversation if .env is missing it
    OPENROUTER_API_KEY = "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"

# Initialize Client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# ✅ Using Free Models from OpenRouter
PRIMARY_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free"
FALLBACK_MODEL = "google/gemini-flash-1.5:free"

SYSTEM_INSTRUCTION = """You are a strict, factual clinical AI for the 'medhelp' platform. 

CRITICAL RULES:
1. INDIA-FIRST CONTEXT:
   - Use Indian terms (Paracetamol, Dolo-650, Crocin)
   - Consider Dengue, Malaria, Typhoid, Vitamin deficiencies
   - Suggest Indian foods (e.g., Khichdi, Coconut water for hydration)

2. DOMAIN RESTRICTION:
   - Only medical topics.
   - Otherwise say: "I am a specialized medical assistant for India and can only answer health-related questions."

3. RAG-LIKE OUTPUT:
   - Bullet points only.
   - No filler text, no "Hello", no "I'm sorry".

4. EMERGENCY:
   - Suggest calling 108 / 112 if serious.
   - Always include doctor disclaimer at the end.

5. LANGUAGE:
   - Reply in Hindi if user uses Hindi (even Hinglish).
"""

def query_medical_ai(user_prompt):
    """
    Queries OpenRouter with retry + fallback + India-focused medical rules.
    """
    
    models_to_try = [PRIMARY_MODEL, FALLBACK_MODEL]

    for model_id in models_to_try:
        for attempt in range(3):
            try:
                response = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": SYSTEM_INSTRUCTION},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.0,
                    extra_headers={
                        "HTTP-Referer": "https://medhelp.ai", # Optional, for OpenRouter analytics
                        "X-Title": "MedHelp AI", # Optional
                    }
                )

                return response.choices[0].message.content

            except Exception as e:
                error_msg = str(e)
                print(f"⚠️ Error with model {model_id} (Attempt {attempt+1}): {error_msg}")

                # 🔁 Retry for server/load issues (429 or 503 equivalent)
                if ("429" in error_msg or "503" in error_msg or "rate limit" in error_msg.lower()) and attempt < 2:
                    time.sleep(2 ** attempt)
                    continue

                # 🔄 If model not found or other terminal error, try fallback
                break

    return "⚠️ All models failed. Please check your OpenRouter API key or try again later."


if __name__ == "__main__":
    print(f"Testing MedHelp AI via OpenRouter ({PRIMARY_MODEL})...")

    test_prompt = "i have a fracture on my right leg, dard bohot ho raha hai"

    print("\nAsking:", test_prompt)
    print("-" * 40)

    answer = query_medical_ai(test_prompt)
    print(answer)