from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import base64
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenRouter configuration
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

SYSTEM_PROMPT = """You are Alzmind, an advanced AI clinical assistant specializing in brain MRI analysis for Alzheimer's disease and cognitive decline detection. You combine multimodal vision analysis with deep clinical reasoning.

When analyzing MRI images and patient data, you provide structured, evidence-based reports that assist neurologists and radiologists. Your analysis is thorough, precise, and clinically grounded.

Always structure your response in the following JSON format:
{
  "risk_level": "Low|Moderate|High",
  "confidence": "Low|Moderate|High",
  "imaging_findings": "detailed paragraph about what you see in the MRI",
  "biomarkers": ["biomarker 1", "biomarker 2", "biomarker 3"],
  "cognitive_assessment": "detailed paragraph on cognitive risk assessment",
  "differential_diagnosis": ["diagnosis 1", "diagnosis 2", "diagnosis 3"],
  "next_steps": ["step 1", "step 2", "step 3", "step 4"],
  "summary": "2-3 sentence executive summary"
}

Return ONLY valid JSON, no markdown, no extra text."""

@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        image_base64 = data.get("image")
        media_type = data.get("media_type", "image/jpeg")
        patient = data.get("patient", {})

        if not image_base64:
            return jsonify({"error": "No image provided"}), 400

        patient_context = f"""
Patient Information:
- Age: {patient.get('age', 'Not provided')}
- Biological Sex: {patient.get('sex', 'Not provided')}
- MMSE Score: {patient.get('mmse', 'Not provided')}
- Family History of Alzheimer's: {patient.get('family_history', 'Unknown')}
- Symptoms / Clinical Notes: {patient.get('symptoms', 'None provided')}
- Duration of Symptoms: {patient.get('duration', 'Not specified')}
"""

        print(f"DEBUG: Analyzing image with model openai/gpt-4o-mini...")
        response = client.chat.completions.create(
            # Using GPT-4o-mini for professional stability and guaranteed availability
            model="openai/gpt-4o-mini",
            max_tokens=1500,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Analyze this brain MRI scan thoroughly.\n\n{patient_context}\n\nProvide your complete clinical analysis in the specified JSON format."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{media_type};base64,{image_base64}"
                            }
                        }
                    ],
                }
            ],
            response_format={"type": "json_object"}
        )

        response_text = response.choices[0].message.content.strip()

        import json
        report = json.loads(response_text)
        return jsonify({"success": True, "report": report})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "Alzmind v1.0 (OpenRouter)"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
