import os
import sys
import pandas as pd
import geopandas as gpd
from shapely.geometry import LineString, Point
import numpy as np

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Define paths
base_dir = r"G:\My Drive\Coastline_Analysis_New"
objective_2_dir = os.path.join(base_dir, "Objective_2_Outputs")
output_dir = os.path.join(base_dir, "Shoreline_Change_Outputs")

# Fallback checking
csv_path = os.path.join(objective_2_dir, "deeplabv3_rates_only.csv")
if not os.path.exists(csv_path):
    csv_path = os.path.join(objective_2_dir, "coastal_environmental_dataset.csv")

transects_path = os.path.join(output_dir, "transects.shp")
if not os.path.exists(transects_path):
    transects_path = os.path.join(base_dir, "baseline_transects.shp")

if not os.path.exists(csv_path) or not os.path.exists(transects_path):
    print(f"Error: Required rate CSV or baseline transect shapefile not found!")
    print(f"Looked for CSV at: {csv_path}")
    print(f"Looked for Transects at: {transects_path}")
    sys.exit(1)

print(f"Loading rates from: {csv_path}")
df = pd.read_csv(csv_path)

print(f"Loading transects from: {transects_path}")
transects = gpd.read_file(transects_path).to_crs("EPSG:32643")

# Ensure index matches Transect_ID
if "Transect_ID" in df.columns:
    df = df.set_index("Transect_ID")

for year in [2027, 2028, 2029]:
    print(f"\nForecasting shoreline for {year}...")
    forecast_points = []
    
    # We loop in order of transect index to keep the shoreline sequential
    for idx in sorted(df.index):
        if idx not in transects.index:
            continue
            
        t_line = transects.loc[idx].geometry
        dist_2024 = df.loc[idx, "Dist_2024_DLV3"]
        rate = df.loc[idx, "Rate_DLV3"]
        
        # Project forward
        years_diff = year - 2024
        dist_forecast = dist_2024 + rate * years_diff
        
        # Keep distance within line boundaries
        dist_forecast = max(0.0, min(dist_forecast, t_line.length))
        
        pt = t_line.interpolate(dist_forecast)
        forecast_points.append(pt)
        
    if len(forecast_points) < 2:
        print(f"Error: Not enough points to construct a shoreline for {year}!")
        continue
        
    # Join points to form a shoreline line
    shoreline_coords = [pt.coords[0] for pt in forecast_points]
    shoreline_geom = LineString(shoreline_coords)
    
    # Save shapefile
    gdf_forecast = gpd.GeoDataFrame(geometry=[shoreline_geom], crs=transects.crs)
    out_shp_name = f"Forecasted_Shoreline_{year}.shp"
    out_shp_path = os.path.join(objective_2_dir, out_shp_name)
    
    print(f"Saving forecasted shoreline shapefile to: {out_shp_path}")
    gdf_forecast.to_file(out_shp_path)
    
print("\n=== FORECASTING COMPLETED SUCCESSFULLY ===")
