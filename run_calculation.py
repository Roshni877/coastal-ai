import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.geometry import Point, LineString
import sys

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_calculation():
    print("=== STARTING DEEPLABV3+ SHORELINE RATE CALCULATION ===")

    # Paths
    base_dir = r"G:\My Drive\Coastline_Analysis_New"
    output_dir = os.path.join(base_dir, "Shoreline_Change_Outputs")

    transects_path = os.path.join(output_dir, "transects.shp")
    s2024_dlv3_path = os.path.join(base_dir, "2024_Predicted_Shoreline_DeepLabV3.shp")
    
    # Objective 2 Outputs Directory
    objective_2_dir = r"G:\My Drive\Coastline_Analysis_New\Objective_2_Outputs"
    os.makedirs(objective_2_dir, exist_ok=True)
    
    # Fallback to shoreline_distances.csv if shoreline_distances_corrected.csv does not exist
    csv_path = os.path.join(output_dir, "shoreline_distances_corrected.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(output_dir, "shoreline_distances.csv")
        print(f"Corrected CSV not found. Falling back to: {csv_path}")

    # Parameters
    tan_beta = 0.03
    H_mean = 0.8
    tide_height_2024 = 0.7
    delta_x_2024 = (tide_height_2024 - H_mean) / tan_beta

    # Verify inputs
    for name, p in [("Transects", transects_path), ("2024 DeepLabV3+", s2024_dlv3_path), ("GT CSV", csv_path)]:
        if not os.path.exists(p):
            print(f"Error: Required file missing: {name} at {p}")
            sys.exit(1)

    print("Loading datasets...")
    transects = gpd.read_file(transects_path).to_crs("EPSG:32643")
    df_gt = pd.read_csv(csv_path)

    # Extract 2020 and 2024 GT
    df_gt_2020 = df_gt[df_gt["Year"] == 2020].set_index("Transect_ID")["Distance"]
    df_gt_2024 = df_gt[df_gt["Year"] == 2024].set_index("Transect_ID")["Distance"]

    # Load predictions
    dlv3_gdf = gpd.read_file(s2024_dlv3_path).to_crs("EPSG:32643")
    dlv3_geom = dlv3_gdf.union_all()
    if dlv3_geom.geom_type in ["Polygon", "MultiPolygon"]:
        print("  Converting prediction water polygon to boundary line geometry...")
        dlv3_geom = dlv3_geom.boundary

    dlv3_distances = {}

    print("Computing intersections and correcting distances...")
    for idx, t in transects.iterrows():
        transect_line = t.geometry

        # Intersect with full DeepLabV3+ shoreline
        inter_d = transect_line.intersection(dlv3_geom)
        if not inter_d.is_empty:
            candidate_points = []
            if inter_d.geom_type == "Point":
                candidate_points = [inter_d]
            elif inter_d.geom_type == "MultiPoint":
                candidate_points = list(inter_d.geoms)

            if candidate_points:
                nearest = min(candidate_points, key=lambda p: transect_line.project(p))
                d_meas = transect_line.project(nearest)
                d_corr = d_meas + delta_x_2024
                d_corr = max(0.0, min(d_corr, transect_line.length))
                dlv3_distances[idx] = d_corr

    # Build dataframe
    results = []
    for idx in transects.index:
        if idx in df_gt_2020.index and idx in df_gt_2024.index:
            d2020 = df_gt_2020.loc[idx]
            d2024_gt = df_gt_2024.loc[idx]
            d2024_d = dlv3_distances.get(idx, None)

            results.append({
                "Transect_ID": idx,
                "Dist_2020": d2020,
                "Dist_2024_GT": d2024_gt,
                "Dist_2024_DLV3": d2024_d
            })

    df = pd.DataFrame(results).dropna()
    print(f"Active transects after dropping NaNs: {len(df)}")

    # Calculate erosion rates (m/year) over 4 years
    df["Rate_GT"] = (df["Dist_2024_GT"] - df["Dist_2020"]) / 4.0
    df["Rate_DLV3"] = (df["Dist_2024_DLV3"] - df["Dist_2020"]) / 4.0

    # Stats comparison
    mae_dlv3 = np.mean(np.abs(df["Rate_DLV3"] - df["Rate_GT"]))
    corr_dlv3 = df["Rate_DLV3"].corr(df["Rate_GT"])

    print("\n=== DEEPLABV3+ METRICS ===")
    print(f"DeepLabV3+ vs. Ground Truth Rate MAE: {mae_dlv3:.4f} m/year")
    print(f"DeepLabV3+ Rate Correlation with GT: {corr_dlv3:.4f}")

    # Plot rate comparison
    plt.figure(figsize=(14, 7))
    plt.plot(df["Transect_ID"], df["Rate_GT"], label="Ground Truth (GEE)", color="black", linewidth=1.5, alpha=0.8)
    plt.plot(df["Transect_ID"], df["Rate_DLV3"], label=f"DeepLabV3+ (MAE={mae_dlv3:.3f}m/y)", color="magenta", linewidth=1.0, alpha=0.7)

    plt.axhline(0, color="gray", linestyle="--", linewidth=0.8)
    plt.title("DeepLabV3+ Shoreline Change Rate vs. Ground Truth (2020-2024)", fontsize=14, fontweight="bold")
    plt.xlabel("Transect ID (along Udupi coast)", fontsize=12)
    plt.ylabel("Erosion (-) / Accretion (+) (m/year)", fontsize=12)
    plt.legend()
    plt.grid(True, alpha=0.3)

    plot_path = os.path.join(objective_2_dir, "deeplabv3_rates_only_comparison.png")
    plt.savefig(plot_path, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"Saved rate comparison plot to: {plot_path}")

    # Save CSV output
    output_path = os.path.join(objective_2_dir, "deeplabv3_rates_only.csv")
    df.to_csv(output_path, index=False)
    print(f"DeepLabV3+ rate results saved to: {output_path}")

    # Export GIS GeoJSON data for Static Dashboard Map
    try:
        dashboard_dir = r"c:\Users\HP\Desktop\Final Soil\dashboard"
        os.makedirs(dashboard_dir, exist_ok=True)
        
        # 1. Export Transects (Downsampled)
        print("Exporting transects GeoJSON to dashboard...")
        transects_4326 = transects.to_crs(epsg=4326)
        if len(transects_4326) > 0:
            transects_4326 = transects_4326.iloc[::20]
        transects_4326.to_file(os.path.join(dashboard_dir, "transects.geojson"), driver="GeoJSON")
        
        # 2. Export 2020 Shoreline
        shp_2020 = os.path.join(base_dir, "2020_Shoreline.shp")
        if os.path.exists(shp_2020):
            print("Exporting 2020 shoreline GeoJSON to dashboard...")
            gpd.read_file(shp_2020).to_crs(epsg=4326).to_file(os.path.join(dashboard_dir, "shoreline_2020.geojson"), driver="GeoJSON")
            
        # 3. Export 2024 Shoreline
        shp_2024 = os.path.join(base_dir, "2024_Shoreline.shp")
        if os.path.exists(shp_2024):
            print("Exporting 2024 shoreline GeoJSON to dashboard...")
            gpd.read_file(shp_2024).to_crs(epsg=4326).to_file(os.path.join(dashboard_dir, "shoreline_2024.geojson"), driver="GeoJSON")
    except Exception as e:
        print(f"⚠️ Warning: Failed to export GeoJSON layers for dashboard: {e}")

if __name__ == "__main__":
    run_calculation()
