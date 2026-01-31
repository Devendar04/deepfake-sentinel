from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tempfile
import os
import io

# Import your ML functions
from model import predict_video, predict_image

app = FastAPI()

# ============================
# CORS CONFIG
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# HEALTH CHECK
# ============================
@app.get("/")
def root():
    return {"status": "Deepfake API running"}

# ============================
# IMAGE PREDICTION
# ============================
@app.post("/predict/image")
async def predict_image_api(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")

    label, prob = predict_image(img)

    return {
        "label": label,
        "confidence": round(prob * 100, 2)
    }

# ============================
# VIDEO PREDICTION (UPLOAD + WEBCAM)
# ============================
@app.post("/predict/video")
async def predict_video_api(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video(temp_name)

        return {
            "label": label,
            "confidence": round(prob * 100, 2)
        }

    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

# ============================
# WEBCAM VIDEO (5 sec capture)
# ============================
@app.post("/predict/webcam")
async def predict_webcam_api(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video(temp_name)

        return {
            "label": label,
            "confidence": round(prob * 100, 2)
        }

    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)
