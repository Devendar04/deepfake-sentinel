from huggingface_hub import hf_hub_download

print("Downloading models...")

hf_hub_download(
    repo_id="Devendra174/deepfake-detection-xception-vit",
    filename="best_model.pth",
    local_dir="."
)

hf_hub_download(
    repo_id="Devendra174/deepfake-detection-xception-vit",
    filename="df_model.h5",
    local_dir="."
)

print("Done.")