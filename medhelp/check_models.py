import os
from dotenv import load_dotenv
load_dotenv()
key = os.getenv("GEMINI_API_KEY")
# This prints the first 5 characters so you can confirm it's the NEW one
print(f"Current Key starts with: {key[:5]}...")