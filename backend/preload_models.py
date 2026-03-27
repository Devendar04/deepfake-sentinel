from huggingface_hub import hf_hub_download
import os

# Save models next to model.py, not wherever the build runs from
DEST = os.path.dirname(os.path.abspath(__file__))

print("Downloading models...")

hf_hub_download(
    repo_id="Devendra174/deepfake-detection-xception-vit",
    filename="best_model.pth",
    local_dir=DEST
)

hf_hub_download(
    repo_id="Devendra174/deepfake-detection-xception-vit",
    filename="df_model.h5",
    local_dir=DEST
)

print(f"Models saved to: {DEST}")
print("Done.")