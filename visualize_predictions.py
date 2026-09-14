import os
import glob
import numpy as np
import torch
import segmentation_models_pytorch as smp
import matplotlib.pyplot as plt
import random
import sys

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Define paths
dataset_folder = r"C:\Soil Erosion Major Project\training_dataset"
s2_patch_dir = os.path.join(dataset_folder, "s2_patches")
s1_patch_dir = os.path.join(dataset_folder, "s1_patches")
mask_patch_dir = os.path.join(dataset_folder, "mask_patches")

output_folder = r"G:\My Drive\Coastline_Analysis_New"
plots_dir = os.path.join(output_folder, "plots")
model_path = os.path.join(output_folder, "best_deeplabv3_model.pth")
os.makedirs(plots_dir, exist_ok=True)

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model
model = smp.DeepLabV3Plus(
    encoder_name="resnet34",
    encoder_weights=None,
    in_channels=9,
    classes=1,
    activation="sigmoid"
).to(device)

model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

# Get list of files
s2_files = sorted(glob.glob(os.path.join(s2_patch_dir, "*.npy")))
s1_files = sorted(glob.glob(os.path.join(s1_patch_dir, "*.npy")))
mask_files = sorted(glob.glob(os.path.join(mask_patch_dir, "*.npy")))

# Seed random selection
random.seed(42)
indices = random.sample(range(len(s2_files)), 3)

fig, axes = plt.subplots(3, 3, figsize=(12, 12))

for col_idx, idx in enumerate(indices):
    s2 = np.load(s2_files[idx])  # (7, 256, 256)
    s1 = np.load(s1_files[idx])  # (2, 256, 256)
    mask = np.load(mask_files[idx])  # (256, 256)
    
    # RGB bands (Red, Green, Blue correspond to bands index 2, 1, 0 in Sentinel-2 usually, let's normalize to [0,1])
    # Let's extract Red (index 2), Green (index 1), Blue (index 0) from 7 bands
    rgb = s2[[2, 1, 0], :, :]
    rgb = np.clip(rgb / 3000.0, 0, 1)  # Scale to reflect standard reflectance range
    rgb = np.transpose(rgb, (1, 2, 0))
    
    # Normalize for model
    s2_norm = np.clip(s2 / 10000.0, 0, 1)
    s1_norm = np.clip((s1 + 30.0) / 30.0, 0, 1)
    x = np.concatenate([s2_norm, s1_norm], axis=0)
    
    # Run prediction
    x_tensor = torch.tensor(x, dtype=torch.float32).unsqueeze(0).to(device)
    with torch.no_grad():
        pred_prob = model(x_tensor).squeeze().cpu().numpy()
    pred_mask = (pred_prob > 0.5).astype(np.uint8)
    
    # Column titles
    axes[0, col_idx].imshow(rgb)
    axes[0, col_idx].set_title(f"Sample {col_idx + 1}: Sentinel-2 (RGB)")
    axes[0, col_idx].axis("off")
    
    axes[1, col_idx].imshow(mask, cmap="Blues")
    axes[1, col_idx].set_title(f"Sample {col_idx + 1}: Ground Truth Mask")
    axes[1, col_idx].axis("off")
    
    axes[2, col_idx].imshow(pred_mask, cmap="Blues")
    axes[2, col_idx].set_title(f"Sample {col_idx + 1}: DeepLabV3+ Predicted")
    axes[2, col_idx].axis("off")

plt.suptitle("DeepLabV3+ Segmentation Patch Predictions", fontsize=16, fontweight="bold")
plt.tight_layout()
out_plot_path = os.path.join(plots_dir, "prediction_samples_comparison.png")
plt.savefig(out_plot_path, dpi=300)
plt.close()
print(f"Saved prediction comparison plot to: {out_plot_path}")
