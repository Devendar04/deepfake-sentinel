from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tempfile
import os
import io

# Import your ML functions
try:
    from .model import predict_video, predict_image
except ImportError:
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

    label, prob = predict_image(img)   # prob is 0–1 fake probability

    fake_prob_percent = round(float(prob) * 100, 2)

    # Confidence in predicted class
    if label == "FAKE":
        confidence_percent = fake_prob_percent
    else:
        confidence_percent = round(100 - fake_prob_percent, 2)

    return {
        "verdict": label,
        "confidence": confidence_percent,   # confidence in verdict
        "probability": fake_prob_percent,   # always fake probability
        "raw_score": float(prob),           # 0–1 raw model output
        "threshold": 0.5,
        "model_used": "XceptionViT"
    }


# ============================
# VIDEO PREDICTION (UPLOAD + WEBCAM)
# ============================
@app.post("/predict/video")
async def predict_video_api(file: UploadFile = File(...)):
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video(temp_name)

        return {
            "verdict": label,
            "confidence": round(prob * 100, 2),
            "probability": round(prob * 100, 2),
            "raw_score": float(prob),
            "threshold": 0.5,
            "model_used": "XceptionViT",
        }


    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)

# ============================
# WEBCAM VIDEO (5 sec capture)
# ============================
@app.post("/predict/webcam")
async def predict_webcam_api(file: UploadFile = File(...)):
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video(temp_name)

        return {
            "verdict": label,
            "confidence": round(prob * 100, 2),
            "probability": round(prob * 100, 2),
            "raw_score": float(prob),
            "threshold": 0.5,
            "model_used": "XceptionViT",
        }


    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)
