from fastapi import FastAPI, UploadFile, File
from PIL import Image
import traceback

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)

        # Dummy AI logic (replace with your model)
        return {
            "message": "Analysis complete",
            "result": "Object detected"
        }

    except Exception as e:
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }