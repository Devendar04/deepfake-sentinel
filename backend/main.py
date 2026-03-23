from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from PIL import Image
import tempfile
import os

# Don't import model at top level — load it after server binds port
predict_image_fn = None
predict_video_fn = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs AFTER port is bound — safe to do slow work here
    global predict_image_fn, predict_video_fn
    from model import predict_image, predict_video
    predict_image_fn = predict_image
    predict_video_fn = predict_video
    print("Models loaded.")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://deepfake-sentinel.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Deepfake API running"}

@app.post("/predict/image")
async def predict_image_api(file: UploadFile = File(...)):
    if predict_image_fn is None:
        raise HTTPException(status_code=503, detail="Model still loading, try again in a moment")
    
    img = Image.open(file.file).convert("RGB")
    label, prob = predict_image_fn(img)
    fake_prob_percent = round(float(prob) * 100, 2)
    confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

    return {
        "verdict": label,
        "confidence": confidence_percent,
        "probability": fake_prob_percent,
        "raw_score": float(prob),
        "threshold": 0.5,
        "model_used": "XceptionViT"
    }

@app.post("/predict/video")
async def predict_video_api(file: UploadFile = File(...)):
    if predict_video_fn is None:
        raise HTTPException(status_code=503, detail="Model still loading, try again in a moment")

    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video_fn(temp_name)

        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames from video")

        fake_prob_percent = round(float(prob) * 100, 2)
        confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

        return {
            "verdict": label,
            "confidence": confidence_percent,
            "probability": fake_prob_percent,
            "raw_score": float(prob),
            "threshold": 0.5,
            "model_used": "XceptionViT",
        }
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)

@app.post("/predict/webcam")
async def predict_webcam_api(file: UploadFile = File(...)):
    if predict_video_fn is None:
        raise HTTPException(status_code=503, detail="Model still loading, try again in a moment")

    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video_fn(temp_name)

        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames from webcam video")

        fake_prob_percent = round(float(prob) * 100, 2)
        confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

        return {
            "verdict": label,
            "confidence": confidence_percent,
            "probability": fake_prob_percent,
            "raw_score": float(prob),
            "threshold": 0.5,
            "model_used": "XceptionViT",
        }
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)