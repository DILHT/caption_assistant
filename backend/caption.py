from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

client = OpenAI(
    api_key=GEMINI_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/"
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-captions")
async def generate_captions(prompt: str = Form(...), tone: str = Form("funny")):
    """
    Generate 5 short, emoji-filled Instagram captions under 20 words, numbered

    The API endpoint is protected by the Gemini API, which may filter out
    certain prompts. If the returned captions are empty, the API may have
    filtered out the prompt.

    Args:
        prompt (str): Photo description
        tone (str, optional): Tone of captions. Defaults to "funny".

    Returns:
        dict:
            captions (list[str]): List of captions
            error (str, optional): Gemini API error message
    """
    # Gemini system prompt
    # https://docs.genie.ai/docs/chat-completion#system-prompt
    system_prompt = f"You are a witty Gen-Z Instagram caption writer. Tone: {tone}."
    # User prompt
    # https://docs.genie.ai/docs/chat-completion#user-prompt
    user_prompt = (
        f"Photo description: {prompt}\n"
        "Write exactly 5 short, emoji-filled Instagram captions under 20 words.\n"
        "Only return the captions, each on a new line, numbered 1-5.\n"
        "Do not include any introductory text or explanations."
    )
    try:
        print(f"Requesting captions from Gemini API: {system_prompt}, {user_prompt}")
        # Request captions from the Gemini API
        resp = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.9,
            max_tokens=200
        )
        print(f"Received response from Gemini API: {resp}")
        # Extract captions from the response
        choices = getattr(resp, "choices", [])
        if not choices or not getattr(choices[0].message, "content", None):
            print("No captions received — it was empty or filtered.")
            return {"error": "No captions received — it was empty or filtered. Try again later."}

        content = choices[0].message.content.strip()
        captions = []
        for line in content.split("\n"):
            line = line.strip()
            if not line:
                continue
            # Remove numbering if present
            if line.startswith(("#", "1.", "2.", "3.", "4.", "5.")):
                line = line.split(".", 1)[-1].strip()
            captions.append(line)
            if len(captions) >= 5:  # Limit to 5 captions
                break
                
        return {"captions": captions}

    except Exception as e:
        print(f"Gemini API error: {e}")
        # Return error message if something went wrong
        return {"error": f"Gemini API error: {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
