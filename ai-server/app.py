from fastapi import FastAPI, UploadFile, File
from PIL import Image
import numpy as np
import traceback

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        img = np.array(image)

        # simple heuristic: detect strong red presence (blood-like areas)
        red_channel = img[:, :, 0]
        red_intensity = red_channel.mean()

        if red_intensity > 120:
            result = "Homicide suspected"
        elif red_intensity > 90:
            result = "Accidental death"
        else:
            result = "Unclear - further investigation required"

        return {
            "message": "Analysis complete",
            "result": result
        }

    except Exception as e:
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }