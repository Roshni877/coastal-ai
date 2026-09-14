import os
import glob
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import segmentation_models_pytorch as smp
import matplotlib.pyplot as plt
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
output_model_path = os.path.join(output_folder, "best_deeplabv3_model.pth")
plots_path = os.path.join(output_folder, "training_progress_deeplabv3.png")

# Check GPU availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# 1. PYTORCH DATASET LOADER
class CoastalDataset(Dataset):
    def __init__(self, s2_dir, s1_dir, mask_dir):
        self.s2_files = sorted(glob.glob(os.path.join(s2_dir, "*.npy")))
        self.s1_files = sorted(glob.glob(os.path.join(s1_dir, "*.npy")))
        self.mask_files = sorted(glob.glob(os.path.join(mask_dir, "*.npy")))

        assert len(self.s2_files) == len(self.s1_files) == len(self.mask_files), \
            "Dataset sizes do not match!"

    def __len__(self):
        return len(self.s2_files)

    def __getitem__(self, idx):
        s2 = np.load(self.s2_files[idx])  # (7, 256, 256)
        s1 = np.load(self.s1_files[idx])  # (2, 256, 256)
        mask = np.load(self.mask_files[idx])  # (256, 256)

        # Normalize
        s2 = np.clip(s2 / 10000.0, 0, 1)
        s1 = np.clip((s1 + 30.0) / 30.0, 0, 1)

        x = np.concatenate([s2, s1], axis=0)  # (9, 256, 256)
        y = mask.astype(np.float32)[np.newaxis, :, :]  # (1, 256, 256)

        return torch.tensor(x, dtype=torch.float32), torch.tensor(y, dtype=torch.float32)

# 2. COMBINED LOSS
class DiceBCELoss(nn.Module):
    def __init__(self):
        super(DiceBCELoss, self).__init__()
        self.bce = nn.BCELoss()

    def forward(self, inputs, targets, smooth=1):
        inputs_flat = inputs.view(-1)
        targets_flat = targets.view(-1)

        bce_loss = self.bce(inputs_flat, targets_flat)

        intersection = (inputs_flat * targets_flat).sum()
        dice_loss = 1 - (2. * intersection + smooth) / (inputs_flat.sum() + targets_flat.sum() + smooth)

        return bce_loss + dice_loss

# 3. TRAINING LOOP
def train_model(epochs=15, batch_size=8, lr=1e-4):
    print("Loading dataset...")
    full_dataset = CoastalDataset(s2_patch_dir, s1_patch_dir, mask_patch_dir)

    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        full_dataset, [train_size, val_size],
        generator=torch.Generator().manual_seed(42)
    )

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, drop_last=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    print(f"Dataset split: Train={len(train_dataset)} patches, Val={len(val_dataset)} patches")

    print("Initializing DeepLabV3+ model with resnet34 backbone...")
    model = smp.DeepLabV3Plus(
        encoder_name="resnet34",
        encoder_weights=None,
        in_channels=9,
        classes=1,
        activation="sigmoid"
    ).to(device)

    criterion = DiceBCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    history = {"train_loss": [], "val_loss": [], "val_dice": []}
    best_val_loss = float("inf")

    print("Starting training...")
    for epoch in range(1, epochs + 1):
        # Training Phase
        model.train()
        train_loss = 0.0
        for x_batch, y_batch in train_loader:
            x_batch, y_batch = x_batch.to(device), y_batch.to(device)

            optimizer.zero_grad()
            outputs = model(x_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * x_batch.size(0)

        train_loss /= len(train_loader.dataset)

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_dice = 0.0
        with torch.no_grad():
            for x_batch, y_batch in val_loader:
                x_batch, y_batch = x_batch.to(device), y_batch.to(device)
                outputs = model(x_batch)
                loss = criterion(outputs, y_batch)
                val_loss += loss.item() * x_batch.size(0)

                pred_binary = (outputs > 0.5).float()
                intersection = (pred_binary * y_batch).sum()
                dice = (2. * intersection) / (pred_binary.sum() + y_batch.sum() + 1e-8)
                val_dice += dice.item() * x_batch.size(0)

        val_loss /= len(val_loader.dataset)
        val_dice /= len(val_loader.dataset)

        history["train_loss"].append(train_loss)
        history["val_loss"].append(val_loss)
        history["val_dice"].append(val_dice)

        print(f"Epoch {epoch}/{epochs} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val Dice: {val_dice:.4f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), output_model_path)
            print(f"  🏆 Saved new best DeepLabV3+ model checkpoint to: {output_model_path}")

    print("Training finished.")

    # Plot learning curves
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(range(1, epochs + 1), history["train_loss"], label="Train Loss", color="royalblue")
    plt.plot(range(1, epochs + 1), history["val_loss"], label="Val Loss", color="crimson")
    plt.title("DeepLabV3+ BCE + Dice Loss")
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.grid(True, alpha=0.3)
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(range(1, epochs + 1), history["val_dice"], label="Val Dice", color="forestgreen")
    plt.title("DeepLabV3+ Validation Dice Coefficient")
    plt.xlabel("Epochs")
    plt.ylabel("Dice Score")
    plt.grid(True, alpha=0.3)
    plt.legend()

    plt.tight_layout()
    plt.savefig(plots_path)
    print(f"Saved learning curves to: {plots_path}")

if __name__ == "__main__":
    train_model(epochs=15, batch_size=8, lr=1e-4)
