from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client()

response = client.interactions.create(
    model="gemini-3.6-flash",
    input="Explain RAG in two simple sentences for a beginner.",
)

print(response.output_text)