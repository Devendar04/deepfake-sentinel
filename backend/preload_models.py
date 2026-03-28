from huggingface_hub import hf_hub_download
import os

DEST = os.path.dirname(os.path.abspath(__file__))
REPO = "Devendra174/deepfake-detection-xception-vit"

print("Downloading best_model.pth (285 MB)...")
hf_hub_download(repo_id=REPO, filename="best_model.pth", local_dir=DEST)

print("Downloading df_model.h5 (134 MB)...")
hf_hub_download(repo_id=REPO, filename="df_model.h5", local_dir=DEST)

print("Done. Both models saved to:", DEST)