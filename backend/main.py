from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from PIL import Image
import tempfile
import os
import threading

# ── Global model functions (set after background load) ────────────
predict_image_fn = None
predict_video_fn = None


import time

def load_models_background():
    start = time.time()
    print("Downloading models from HuggingFace...")

    try:
        from model import predict_image, predict_video
        ...
        print(f"Models ready in {time.time() - start:.2f}s")
    except Exception as e:
        print(f"ERROR loading models: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Kick off model loading in background — port binds immediately
    t = threading.Thread(target=load_models_background, daemon=True)
    t.start()
    yield  # server is live here, models load in background


# ── App ───────────────────────────────────────────────────────────
app = FastAPI(lifespan=lifespan)

# ── CORS ──────────────────────────────────────────────────────────
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


# ── Health check ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "Deepfake API running",
        "models_ready": predict_image_fn is not None,
    }


# ── Image prediction ──────────────────────────────────────────────
@app.post("/predict/image")
async def predict_image_api(file: UploadFile = File(...)):
    if predict_image_fn is None:
        raise HTTPException(
            status_code=503,
            detail="Models still loading, please try again in a moment."
        )

    img = Image.open(file.file).convert("RGB")
    label, prob = predict_image_fn(img)

    fake_prob_percent  = round(float(prob) * 100, 2)
    confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

    return {
        "verdict":    label,
        "confidence": confidence_percent,
        "probability": fake_prob_percent,
        "raw_score":  float(prob),
        "threshold":  0.5,
        "model_used": "XceptionViT",
    }


# ── Video prediction ──────────────────────────────────────────────
@app.post("/predict/video")
async def predict_video_api(file: UploadFile = File(...)):
    if predict_video_fn is None:
        raise HTTPException(
            status_code=503,
            detail="Models still loading, please try again in a moment."
        )

    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video_fn(temp_name)

        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames from video.")

        fake_prob_percent  = round(float(prob) * 100, 2)
        confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

        return {
            "verdict":    label,
            "confidence": confidence_percent,
            "probability": fake_prob_percent,
            "raw_score":  float(prob),
            "threshold":  0.5,
            "model_used": "XceptionViT",
        }
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)


# ── Webcam prediction ─────────────────────────────────────────────
@app.post("/predict/webcam")
async def predict_webcam_api(file: UploadFile = File(...)):
    if predict_video_fn is None:
        raise HTTPException(
            status_code=503,
            detail="Models still loading, please try again in a moment."
        )

    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())

        label, prob = predict_video_fn(temp_name)

        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames from webcam video.")

        fake_prob_percent  = round(float(prob) * 100, 2)
        confidence_percent = fake_prob_percent if label == "FAKE" else round(100 - fake_prob_percent, 2)

        return {
            "verdict":    label,
            "confidence": confidence_percent,
            "probability": fake_prob_percent,
            "raw_score":  float(prob),
            "threshold":  0.5,
            "model_used": "XceptionViT",
        }
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)