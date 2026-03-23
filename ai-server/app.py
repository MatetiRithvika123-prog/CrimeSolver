from fastapi import FastAPI, UploadFile, File
from PIL import Image
import traceback
import random

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)

        # 🔥 Simulated forensic classification
        outcomes = [
            "Homicide suspected",
            "Accidental death",
            "Natural cause",
            "Unclear - further investigation required"
        ]

        result = random.choice(outcomes)

        return {
            "message": "Analysis complete",
            "result": result
        }

    except Exception as e:
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }