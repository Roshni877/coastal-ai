import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Setup aesthetics
sns.set_theme(style="whitegrid")
plt.rcParams.update({
    'font.size': 12,
    'axes.labelsize': 12,
    'axes.titlesize': 14,
    'xtick.labelsize': 11,
    'ytick.labelsize': 11,
})

# Define paths
base_dir = r"G:\My Drive\Coastline_Analysis_New"
objective_2_dir = os.path.join(base_dir, "Objective_2_Outputs")
report_img_dir = r"c:\Users\HP\Desktop\Final Soil\report_images"
os.makedirs(report_img_dir, exist_ok=True)

# Fallback checking
csv_path = os.path.join(objective_2_dir, "coastal_environmental_dataset.csv")
if not os.path.exists(csv_path):
    csv_path = os.path.join(objective_2_dir, "deeplabv3_rates_only.csv")

if not os.path.exists(csv_path):
    print(f"Error: Could not find rates file: {csv_path}")
    sys.exit(1)

df = pd.read_csv(csv_path)

# ------------------------------------------------------------
# Plot 1: Scatter Comparison: GEE Ground Truth vs. DeepLabV3+ Rate
# ------------------------------------------------------------
plt.figure(figsize=(8, 8))
sns.scatterplot(
    data=df,
    x="Rate_GT",
    y="Rate_DLV3",
    alpha=0.6,
    color="darkblue",
    edgecolor="none"
)
# Add diagonal line (1:1 perfect prediction line)
max_val = max(df["Rate_GT"].max(), df["Rate_DLV3"].max())
min_val = min(df["Rate_GT"].min(), df["Rate_DLV3"].min())
plt.plot([min_val, max_val], [min_val, max_val], color="red", linestyle="--", linewidth=1.5, label="Perfect Alignment (1:1)")

# Calculate R-squared and Correlation
corr = df["Rate_GT"].corr(df["Rate_DLV3"])
r2 = corr ** 2

plt.text(
    0.05, 0.90,
    f"Correlation: {corr:.3f}\nR² Score: {r2:.3f}",
    transform=plt.gca().transAxes,
    bbox=dict(facecolor='white', alpha=0.8, boxstyle='round,pad=0.5'),
    fontweight="bold"
)

plt.title("Shoreline Change Rate Comparison: DeepLabV3+ vs. Ground Truth", fontweight="bold")
plt.xlabel("Ground Truth (GEE) Rate (m/year)")
plt.ylabel("Predicted (DeepLabV3+) Rate (m/year)")
plt.legend()
plt.tight_layout()

# Save plot copies
plt.savefig(os.path.join(objective_2_dir, "scatter_rate_comparison.png"), dpi=300)
plt.savefig(os.path.join(report_img_dir, "scatter_rate_comparison.png"), dpi=300)
plt.close()
print("Saved Scatter Rate Comparison Plot.")

# ------------------------------------------------------------
# Plot 2: Change Rate Probability Distribution (KDE)
# ------------------------------------------------------------
plt.figure(figsize=(10, 6))
sns.kdeplot(df["Rate_GT"], label="Ground Truth (GEE)", fill=True, color="black", alpha=0.3, linewidth=2)
sns.kdeplot(df["Rate_DLV3"], label="DeepLabV3+ Model", fill=True, color="magenta", alpha=0.3, linewidth=2)
plt.axvline(0, color="gray", linestyle="--", linewidth=1.2)
plt.title("Probability Density Distribution of Shoreline Change Rates", fontweight="bold")
plt.xlabel("Erosion (-) / Accretion (+) (meters/year)")
plt.ylabel("Density")
plt.legend()
plt.tight_layout()

# Save plot copies
plt.savefig(os.path.join(objective_2_dir, "rate_distribution_density.png"), dpi=300)
plt.savefig(os.path.join(report_img_dir, "rate_distribution_density.png"), dpi=300)
plt.close()
print("Saved Change Rate Probability Distribution Plot.")

# ------------------------------------------------------------
# Plot 3: Longshore Change Rate Profile (Transect ID along Shore)
# ------------------------------------------------------------
plt.figure(figsize=(14, 6))
plt.plot(df["Transect_ID"], df["Rate_DLV3"], color="crimson", linewidth=1, alpha=0.7, label="DeepLabV3+")
# Smooth moving average to show longshore regional trends
df["Rate_DLV3_smoothed"] = df["Rate_DLV3"].rolling(window=50, center=True).mean()
plt.plot(df["Transect_ID"], df["Rate_DLV3_smoothed"], color="darkblue", linewidth=2.5, label="Regional Longshore Trend (50-transect MA)")

plt.axhline(0, color="black", linestyle="--", linewidth=1.0)
plt.title("Longshore Shoreline Change Rate Profile (Udupi Coastline)", fontweight="bold")
plt.xlabel("Transect ID (South to North)")
plt.ylabel("Erosion Rate (m/year)")
plt.legend()
plt.grid(True, alpha=0.2)
plt.tight_layout()

# Save plot copies
plt.savefig(os.path.join(objective_2_dir, "longshore_rate_profile.png"), dpi=300)
plt.savefig(os.path.join(report_img_dir, "longshore_rate_profile.png"), dpi=300)
plt.close()
print("Saved Longshore Change Rate Profile Plot.")

print("=== ADDITIONAL PLOT GENERATION COMPLETED SUCCESSFULLY ===")
