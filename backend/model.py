import os
import cv2
import torch
import numpy as np
import timm
import torch.nn as nn
from facenet_pytorch import MTCNN
from PIL import Image
import tensorflow as tf
from huggingface_hub import hf_hub_download

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

# ── Device ────────────────────────────────────────────────────────
DEVICE           = "cuda" if torch.cuda.is_available() else "cpu"
IMG_SIZE         = 224
FRAMES_PER_VIDEO = 5
HF_REPO_ID       = "Devendra174/deepfake-detection-xception-vit"
BASE_DIR         = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")
IMAGE_MODEL_PATH = os.path.join(BASE_DIR, "df_model.h5")

# HARD FAIL if missing (important)
if not os.path.exists(MODEL_PATH):
    raise RuntimeError("best_model.pth not found in backend folder")

if not os.path.exists(IMAGE_MODEL_PATH):
    raise RuntimeError("df_model.h5 not found in backend folder")
print(f"  best_model.pth  -> {MODEL_PATH}")
print(f"  df_model.h5     -> {IMAGE_MODEL_PATH}")

# ── Keras image model ─────────────────────────────────────────────
image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH)

# ── MTCNN face detector ───────────────────────────────────────────
mtcnn = MTCNN(
    image_size=IMG_SIZE,
    margin=20,
    keep_all=False,
    post_process=False,
    device="cpu"
)


# ── XceptionViT model definition ──────────────────────────────────
class XceptionViT(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn = timm.create_model("legacy_xception", pretrained=False, num_classes=0)
        feature_dim = self.cnn.num_features

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=feature_dim, nhead=8, batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)
        self.classifier  = nn.Linear(feature_dim, 1)

    def forward(self, x):
        B, T, C, H, W = x.shape
        x     = x.view(B * T, C, H, W)
        feats = self.cnn(x)
        feats = feats.view(B, T, -1)
        feats = self.transformer(feats)
        feats = feats.mean(dim=1)
        return self.classifier(feats).squeeze(1)


# ── Load weights ──────────────────────────────────────────────────
model = XceptionViT().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()
print("Models ready.")


# ── Helpers ───────────────────────────────────────────────────────
def sample_frames(video_path, n_frames=FRAMES_PER_VIDEO):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    frames = []
    total  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    idxs   = np.linspace(0, total - 1, n_frames).astype(int)

    for i in range(total):
        ret, frame = cap.read()
        if not ret:
            break
        if i in idxs:
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    cap.release()
    return frames


# ── Prediction functions ──────────────────────────────────────────
def predict_video(video_path, threshold=0.5):
    frames = sample_frames(video_path)
    if not frames:
        return "ERROR", 0.0

    faces = []
    for frame in frames:
        face = mtcnn(frame)
        if face is None:
            face = torch.zeros(3, IMG_SIZE, IMG_SIZE)
        faces.append(face)

    faces = torch.stack(faces).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        prob = torch.sigmoid(model(faces)).item()

    label = "FAKE" if prob >= threshold else "REAL"
    return label, prob


def predict_image(img: Image.Image, threshold=0.5):
    img_array = np.expand_dims(
        np.array(img.resize((IMG_SIZE, IMG_SIZE))) / 255.0,
        axis=0
    )
    prob  = float(image_model.predict(img_array)[0][0])
    label = "FAKE" if prob > threshold else "REAL"
    return label, prob