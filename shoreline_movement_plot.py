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

# Calculate forecasted positions for 2027, 2028, 2029
df["Dist_2027_DLV3"] = df["Dist_2024_DLV3"] + df["Rate_DLV3"] * 3
df["Dist_2028_DLV3"] = df["Dist_2024_DLV3"] + df["Rate_DLV3"] * 4
df["Dist_2029_DLV3"] = df["Dist_2024_DLV3"] + df["Rate_DLV3"] * 5

# Prepare data in long format for Seaborn plotting
data_long = pd.melt(
    df, 
    id_vars=["Transect_ID"], 
    value_vars=["Dist_2020", "Dist_2024_DLV3", "Dist_2027_DLV3", "Dist_2028_DLV3", "Dist_2029_DLV3"],
    var_name="Year", 
    value_name="Distance"
)

# Map variable names to cleaner year labels
year_map = {
    "Dist_2020": "2020 (GT)",
    "Dist_2024_DLV3": "2024 (DLV3)",
    "Dist_2027_DLV3": "2027 (Forecast)",
    "Dist_2028_DLV3": "2028 (Forecast)",
    "Dist_2029_DLV3": "2029 (Forecast)"
}
data_long["Year"] = data_long["Year"].map(year_map)

# Calculate cumulative net movement relative to 2020 baseline for each year
# Net Movement = Dist_year - Dist_2020
net_movements = {
    "2024 (DLV3)": df["Dist_2024_DLV3"] - df["Dist_2020"],
    "2027 (Forecast)": df["Dist_2027_DLV3"] - df["Dist_2020"],
    "2028 (Forecast)": df["Dist_2028_DLV3"] - df["Dist_2020"],
    "2029 (Forecast)": df["Dist_2029_DLV3"] - df["Dist_2020"]
}
df_net = pd.DataFrame(net_movements)
mean_net_movements = df_net.mean()

# Create the double-panel plot
fig, axes = plt.subplots(1, 2, figsize=(16, 7))

# Plot 1: Boxplot showing distribution of distances per year
sns.boxplot(
    data=data_long, 
    x="Year", 
    y="Distance", 
    ax=axes[0], 
    palette="Blues_r"
)
axes[0].set_title("Distribution of Shoreline Positions by Year", fontweight="bold")
axes[0].set_xlabel("Year / Mode")
axes[0].set_ylabel("Shoreline Distance along Transect (m)")
axes[0].set_xticklabels(axes[0].get_xticklabels(), rotation=15)

# Plot 2: Bar plot showing average net shoreline movement relative to 2020
sns.barplot(
    x=mean_net_movements.index, 
    y=mean_net_movements.values, 
    ax=axes[1], 
    palette="Oranges_r"
)
# Add values on top of bars
for p in axes[1].patches:
    axes[1].annotate(
        f"{p.get_height():+.2f} m", 
        (p.get_x() + p.get_width() / 2., p.get_height()), 
        ha='center', va='center', 
        xytext=(0, 8 if p.get_height() >= 0 else -12), 
        textcoords='offset points',
        fontweight='bold'
    )

axes[1].set_title("Average Net Shoreline Movement (Relative to 2020 Baseline)", fontweight="bold")
axes[1].set_xlabel("Target Year")
axes[1].set_ylabel("Average Cumulative Shift (m)")
axes[1].set_xticklabels(axes[1].get_xticklabels(), rotation=15)
# Add horizontal line at 0 (baseline)
axes[1].axhline(0, color="black", linestyle="--", linewidth=1.2)

plt.suptitle("Shoreline Movement and Position Forecasting across All Years (2020-2029)", fontsize=16, fontweight="bold")
plt.tight_layout()

out_plot_path = os.path.join(objective_2_dir, "shoreline_movement_all_years.png")
plt.savefig(out_plot_path, dpi=300)
plt.close()
print(f"Saved Shoreline Movement Across All Years to: {out_plot_path}")
print("=== SHORELINE MOVEMENT PLOT GENERATION COMPLETED ===")
