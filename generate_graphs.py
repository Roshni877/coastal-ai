# ============================================================
#   MULTI-YEAR SHORELINE CHANGE
#   For WaterMask (GeoTIFF) + Shoreline (SHP)
#   CRS = EPSG:32643 (UTM Zone 43N)
# ============================================================

import os
import sys
import geopandas as gpd
import rasterio
from rasterio.features import shapes
import numpy as np
from shapely.geometry import shape, LineString, Point, MultiPoint, MultiLineString
import pandas as pd
import matplotlib.pyplot as plt

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# ------------------------------------------------------------
# 1. USER PATHS
# ------------------------------------------------------------
base = r"G:\My Drive\Coastline_Analysis_New"
watermask_paths = {
    2020: f"{base}/2020_WaterMask.tif",
    2021: f"{base}/2021_WaterMask.tif",
    2022: f"{base}/2022_WaterMask.tif",
    2023: f"{base}/2023_WaterMask.tif",
    2024: f"{base}/2024_WaterMask.tif",
}

shoreline_paths = {
    2020: f"{base}/2020_Shoreline.shp",
    2021: f"{base}/2021_Shoreline.shp",
    2022: f"{base}/2022_Shoreline.shp",
    2023: f"{base}/2023_Shoreline.shp",
    2024: f"{base}/2024_Shoreline.shp",
}

out_dir = f"{base}/Shoreline_Change_Outputs"
os.makedirs(out_dir, exist_ok=True)

# Verify directories
if not os.path.exists(base):
    print(f"Error: Coastline Analysis folder not found on G Drive: {base}")
    print("Please make sure Google Drive is connected and mounted at G:\\")
    sys.exit(1)

# ------------------------------------------------------------
# 2. EXTRACT SHORELINE FROM RASTER (WATERMASK TIFF)
# ------------------------------------------------------------
def shoreline_from_mask(tif_path):
    if not os.path.exists(tif_path):
        print(f"  ⚠️ Mask file not found: {tif_path}")
        return None
        
    try:
        src = rasterio.open(tif_path)
        mask = src.read(1).astype(np.uint8)

        # Extract shapes where mask == 1 (Water)
        results = (
            {"properties": {"val": int(v)}, "geometry": s}
            for s, v in shapes(mask, mask=mask == 1, transform=src.transform)
        )
        polys = list(results)

        if len(polys) == 0:
            return None

        gdf = gpd.GeoDataFrame.from_features(polys, crs=src.crs)

        # Convert polygons to boundary lines
        gdf["geometry"] = gdf.geometry.boundary

        # Merge all lines into one geometry
        merged = gdf.union_all()
        return gpd.GeoDataFrame({"geometry": [merged]}, crs=src.crs)
    except Exception as e:
        print(f"  ❌ Error processing raster mask {tif_path}: {e}")
        return None

# ------------------------------------------------------------
# 3. GEOMETRY CLEANER -> FORCE SINGLE LINESTRING
# ------------------------------------------------------------
def clean_to_single_linestring(gdf):
    """Dissolves geometry and extracts the longest continuous coastline."""
    geom = gdf.union_all()

    # If it's a polygon (or collection of them), get the boundary
    if geom.geom_type in ["Polygon", "MultiPolygon", "GeometryCollection"]:
        geom = geom.boundary

    # Case A: Single LineString (Ideal)
    if geom.geom_type == "LineString":
        return geom

    # Case B: MultiLineString -> Take the longest segment
    if geom.geom_type == "MultiLineString":
        return max(list(geom.geoms), key=lambda g: g.length)

    # Case C: GeometryCollection (Mix of types)
    if geom.geom_type == "GeometryCollection":
        lines = []
        for g in geom.geoms:
            if g.geom_type == "LineString":
                lines.append(g)
            elif g.geom_type == "MultiLineString":
                lines.extend(list(g.geoms))

        if len(lines) == 0:
            raise ValueError("No valid line geometry found in collection.")

        return max(lines, key=lambda g: g.length)

    raise ValueError(f"Unsupported geometry type: {geom.geom_type}")

# ------------------------------------------------------------
# 4. LOAD SHORELINE VECTORS
# ------------------------------------------------------------
def load_clean_shorelines():
    shorelines = {}
    for year, path in shoreline_paths.items():
        if not os.path.exists(path):
            print(f"  ⚠️ Shoreline Shapefile missing: {path}")
            continue
        try:
            gdf = gpd.read_file(path).to_crs("EPSG:32643")
            main_line = clean_to_single_linestring(gdf)
            shorelines[year] = gpd.GeoDataFrame({"geometry": [main_line]}, crs="EPSG:32643")
            print(f"  Loaded clean coastline for {year}")
        except Exception as e:
            print(f"  ❌ Error loading shoreline vector for {year}: {e}")
    return shorelines

# ------------------------------------------------------------
# 5. GENERATE TRANSECTS FROM BASELINE (2020)
# ------------------------------------------------------------
def generate_transects(shoreline, spacing=200, length=1000):
    line = shoreline.iloc[0].geometry
    dists = np.arange(0, line.length, spacing)
    transects = []

    for d in dists:
        pt = line.interpolate(d)

        # Calculate perpendicular vector
        if d + 1 < line.length:
            n = line.interpolate(d + 1).coords[0]
            p = pt.coords[0]
            dx = n[0] - p[0]
            dy = n[1] - p[1]
        else:
            p = pt.coords[0]
            prev = line.interpolate(d - 1).coords[0]
            dx = p[0] - prev[0]
            dy = p[1] - prev[1]

        vx, vy = -dy, dx
        norm = np.sqrt(vx**2 + vy**2)
        if norm == 0: continue
        vx /= norm
        vy /= norm

        p1 = (p[0] - vx * length/2, p[1] - vy * length/2)
        p2 = (p[0] + vx * length/2, p[1] + vy * length/2)

        transects.append(LineString([p1, p2]))

    return gpd.GeoDataFrame({"geometry": transects}, crs="EPSG:32643")

# ------------------------------------------------------------
# 6. COMPUTE TRANSECT SHORELINE INTERSECTIONS
# ------------------------------------------------------------
def compute_distances(transects, shorelines):
    data = []

    for year, sh in shorelines.items():
        shore = sh.iloc[0].geometry

        for idx, t in transects.iterrows():
            line = t.geometry
            intersection = line.intersection(shore)

            if intersection.is_empty:
                continue

            candidate_points = []

            if intersection.geom_type == "Point":
                candidate_points = [intersection]
            elif intersection.geom_type == "MultiPoint":
                candidate_points = list(intersection.geoms)
            elif "Line" in intersection.geom_type:
                if intersection.geom_type == "LineString":
                    candidate_points = [Point(c) for c in intersection.coords]
                elif intersection.geom_type == "MultiLineString":
                    for geom in intersection.geoms:
                        candidate_points.extend([Point(c) for c in geom.coords])
            elif intersection.geom_type == "GeometryCollection":
                for geom in intersection.geoms:
                    if geom.geom_type == "Point":
                        candidate_points.append(geom)
                    elif geom.geom_type == "MultiPoint":
                        candidate_points.extend(list(geom.geoms))

            if not candidate_points:
                continue

            nearest = min(candidate_points, key=lambda p: line.project(p))
            dist = line.project(nearest)

            data.append({
                "Year": year,
                "Transect_ID": idx,
                "Distance": dist
            })

    return pd.DataFrame(data)

def main():
    print("=== RUNNING MULTI-YEAR GEOMETRIC ANALYSIS ===")
    
    # Extract raster shorelines
    print("\n[Step 1] Extracting shorelines from WaterMask GeoTIFFs...")
    raster_shorelines = {}
    for year, path in watermask_paths.items():
        if os.path.exists(path):
            print(f"Extracting raster shoreline for {year}...")
            shoreline = shoreline_from_mask(path)
            if shoreline is not None:
                raster_shorelines[year] = shoreline
                
    # Load Shapefiles
    print("\n[Step 2] Loading GEE shoreline Shapefiles...")
    shorelines = load_clean_shorelines()
    
    if 2020 not in shorelines:
        print("Error: 2020 Baseline shoreline vector is missing! Cannot proceed.")
        sys.exit(1)
        
    # Generate baseline transects
    print("\n[Step 3] Generating perpendicular transects from 2020 baseline...")
    transects = generate_transects(shorelines[2020])
    transects_out_path = f"{out_dir}/transects.shp"
    transects.to_file(transects_out_path)
    print(f"Generated {len(transects)} transects and saved to {transects_out_path}")

    # Compute distances
    print("\n[Step 4] Computing shoreline distances along transects...")
    df = compute_distances(transects, shorelines)
    distances_out_path = f"{out_dir}/shoreline_distances.csv"
    df.to_csv(distances_out_path, index=False)
    print(f"Shoreline distances saved to: {distances_out_path}")

    # Calculate change rates
    print("\n[Step 5] Calculating shoreline rate of change (2020-2024)...")
    df_pivot = df.pivot(index="Transect_ID", columns="Year", values="Distance")
    
    if 2020 in df_pivot.columns and 2024 in df_pivot.columns:
        df_pivot["Change_2020_2024"] = df_pivot[2024] - df_pivot[2020]
        df_pivot["Rate_m_per_year"] = df_pivot["Change_2020_2024"] / 4.0

        rates_out_path = f"{out_dir}/shoreline_change_rates.csv"
        df_pivot.to_csv(rates_out_path)
        print(f"Change rates calculated and saved to: {rates_out_path}")
        print(df_pivot[["Change_2020_2024", "Rate_m_per_year"]].head())

        # Plot rates histogram
        plt.figure(figsize=(10,6))
        plt.hist(df_pivot["Rate_m_per_year"].dropna(), bins=30, color='skyblue', edgecolor='black')
        plt.title("Annual Shoreline Change Rate (2020-2024)")
        plt.xlabel("Erosion (-) / Accretion (+) (m/year)")
        plt.ylabel("Number of Transects")
        plt.grid(True, alpha=0.3)
        plt.axvline(0, color='red', linestyle='--', linewidth=1)
        
        hist_out_path = os.path.join(out_dir, "historical_rates_histogram.png")
        plt.savefig(hist_out_path, dpi=300)
        plt.close()
        print(f"Saved change rate histogram plot to: {hist_out_path}")
    else:
        print("⚠️ Warning: 2020 or 2024 data missing. Check input shapefiles.")
        
    print("\n=== MULTI-YEAR GEOMETRIC ANALYSIS COMPLETED ===")

if __name__ == "__main__":
    main()
