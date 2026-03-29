from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tempfile, os

# ── Lazy load — imported on first request, not at startup ─────────
_predict_image = None
_predict_video = None

def get_models():
    global _predict_image, _predict_video
    if _predict_image is None:
        from model import predict_image, predict_video
        _predict_image = predict_image
        _predict_video = predict_video
    return _predict_image, _predict_video

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://deepfake-sentinel.vercel.app",
        "https://devendra174-deepfake-sentinel.hf.space",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"status": "Deepfake API running"}

@app.post("/predict/image")
async def predict_image_api(file: UploadFile = File(...)):
    predict_image, _ = get_models()
    img = Image.open(file.file).convert("RGB")
    label, prob = predict_image(img)
    fake_pct = round(float(prob) * 100, 2)
    conf_pct = fake_pct if label == "FAKE" else round(100 - fake_pct, 2)
    return {"verdict": label, "confidence": conf_pct, "probability": fake_pct,
            "raw_score": float(prob), "threshold": 0.5, "model_used": "XceptionViT"}

@app.post("/predict/video")
async def predict_video_api(file: UploadFile = File(...)):
    _, predict_video = get_models()
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())
        label, prob = predict_video(temp_name)
        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames.")
        fake_pct = round(float(prob) * 100, 2)
        conf_pct = fake_pct if label == "FAKE" else round(100 - fake_pct, 2)
        return {"verdict": label, "confidence": conf_pct, "probability": fake_pct,
                "raw_score": float(prob), "threshold": 0.5, "model_used": "XceptionViT"}
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)

@app.post("/predict/webcam")
async def predict_webcam_api(file: UploadFile = File(...)):
    _, predict_video = get_models()
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            temp_name = tmp.name
            tmp.write(await file.read())
        label, prob = predict_video(temp_name)
        if label == "ERROR":
            raise HTTPException(status_code=500, detail="Could not extract frames.")
        fake_pct = round(float(prob) * 100, 2)
        conf_pct = fake_pct if label == "FAKE" else round(100 - fake_pct, 2)
        return {"verdict": label, "confidence": conf_pct, "probability": fake_pct,
                "raw_score": float(prob), "threshold": 0.5, "model_used": "XceptionViT"}
    finally:
        if temp_name and os.path.exists(temp_name):
            os.remove(temp_name)