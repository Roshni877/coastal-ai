import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sys

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

objective_2_dir = r"G:\My Drive\Coastline_Analysis_New\Objective_2_Outputs"
csv_path = os.path.join(objective_2_dir, "deeplabv3_rates_only.csv")

if not os.path.exists(csv_path):
    print(f"Error: Could not find rates file: {csv_path}")
    sys.exit(1)

df = pd.read_csv(csv_path)

# Parameters
TRANSECT_SPACING = 50.0  # spacing between transects in meters

# 1. Quantify Coastline Length under Erosion/Stable/Accretion
# We classify transects based on rates:
# Severe Erosion: < -2.0 m/year
# Moderate Erosion: -2.0 to -0.5 m/year
# Stable: -0.5 to 0.5 m/year
# Accretion: > 0.5 m/year
def categorize_vulnerability(rate):
    if rate < -2.0:
        return "Severe Erosion"
    elif rate < -0.5:
        return "Moderate Erosion"
    elif rate <= 0.5:
        return "Stable / No Change"
    else:
        return "Accretion / Land Gain"

df["Vulnerability"] = df["Rate_DLV3"].apply(categorize_vulnerability)

# Count transects and convert to kilometers
vulnerability_counts = df["Vulnerability"].value_counts()
vulnerability_km = (vulnerability_counts * TRANSECT_SPACING) / 1000.0  # convert meters to km

# 2. Quantify Land Area Lost (in Hectares)
# For eroding transects, Land Loss (m2) = -Rate (m/year) * spacing (m) * time (years)
# We calculate forecasted cumulative land loss relative to 2024 baseline
eroding_mask = df["Rate_DLV3"] < 0
eroding_df = df[eroding_mask]

# Annual land loss rate in square meters
annual_loss_m2 = -eroding_df["Rate_DLV3"] * TRANSECT_SPACING
total_annual_loss_ha = annual_loss_m2.sum() / 10000.0  # 1 Hectare = 10,000 m2

forecast_years = [2025, 2026, 2027, 2028, 2029]
cumulative_loss_ha = [total_annual_loss_ha * (y - 2024) for y in forecast_years]

# Create double-panel plot
fig, axes = plt.subplots(1, 2, figsize=(16, 7))

# Plot 1: Length of Coastline under Vulnerability categories
colors = ["#d95f02", "#fdae61", "#abd9e9", "#2c7bb6"]
vulnerability_order = ["Severe Erosion", "Moderate Erosion", "Stable / No Change", "Accretion / Land Gain"]
km_values = vulnerability_km.reindex(vulnerability_order).fillna(0)

sns.barplot(
    x=km_values.index, 
    y=km_values.values, 
    ax=axes[0], 
    palette=colors
)
for p in axes[0].patches:
    axes[0].annotate(
        f"{p.get_height():.2f} km", 
        (p.get_x() + p.get_width() / 2., p.get_height()), 
        ha='center', va='center', 
        xytext=(0, 8), 
        textcoords='offset points',
        fontweight='bold'
    )

axes[0].set_title("Vulnerability of Udupi Coastline (in Kilometers)", fontweight="bold")
axes[0].set_xlabel("Vulnerability Class")
axes[0].set_ylabel("Coastline Length (km)")
axes[0].set_xticklabels(axes[0].get_xticklabels(), rotation=15)

# Plot 2: Forecasted Cumulative Land Loss over Time
axes[1].plot(forecast_years, cumulative_loss_ha, marker='s', color="#d95f02", linewidth=2.5, markersize=8)
for i, txt in enumerate(cumulative_loss_ha):
    axes[1].annotate(
        f"{txt:.2f} ha", 
        (forecast_years[i], cumulative_loss_ha[i]), 
        textcoords="offset points", 
        xytext=(-10,12), 
        ha='center',
        fontweight='bold',
        color="#d95f02"
    )

axes[1].set_title("Forecasted Cumulative Land Loss due to Erosion (2024 - 2029)", fontweight="bold")
axes[1].set_xlabel("Forecast Year")
axes[1].set_ylabel("Total Land Area Lost (Hectares)")
axes[1].set_xticks(forecast_years)
axes[1].grid(True, alpha=0.3)

plt.suptitle("Quantitative Coastal Erosion & Vulnerability Assessment along Udupi Coastline", fontsize=16, fontweight="bold")
plt.tight_layout()

out_plot_path = os.path.join(objective_2_dir, "coastal_erosion_quantification.png")
plt.savefig(out_plot_path, dpi=300)
plt.close()
print(f"Saved Quantitative Erosion Assessment to: {out_plot_path}")
print("=== QUANTIFICATION PLOT GENERATION COMPLETED ===")
