import os
import numpy as np
import rasterio
from rasterio.windows import Window
from rasterio.warp import reproject, Resampling
import sys

# Ensure UTF-8 output print capability
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Define source folders
s2_folder = r"G:\My Drive\Coastline_Analysis_New\gee_exports\sentinel2"
s2_folder_alt = r"G:\My Drive\Coastline_Analysis_New\gee_exports\sentinel2"
s1_folder = r"G:\My Drive\Coastline_Analysis_New\gee_exports\sentinel1"
mask_folder = r"G:\My Drive\Coastline_Analysis_New"

# Define destination folder
dataset_folder = r"G:\My Drive\Coastline_Analysis_New\training_dataset"
s2_patch_dir = os.path.join(dataset_folder, "s2_patches")
s1_patch_dir = os.path.join(dataset_folder, "s1_patches")
mask_patch_dir = os.path.join(dataset_folder, "mask_patches")

# Create directories
os.makedirs(s2_patch_dir, exist_ok=True)
os.makedirs(s1_patch_dir, exist_ok=True)
os.makedirs(mask_patch_dir, exist_ok=True)

# Patch configuration
PATCH_SIZE = 256
STRIDE = 128  # 50% overlap for data augmentation
MAX_NAN_FRACTION = 0.30  # Skip if more than 30% of pixels are NaN or zero

years = [2020, 2021, 2022, 2023, 2024]
total_patches_created = 0

print("=== STARTING ROBUST DATASET PATCH PREPARATION ===")
print(f"Destination: {dataset_folder}")
print()

for year in years:
    print(f"Processing Year {year}...")

    # 1. Resolve file paths
    # Sentinel-2 path (check standard folder first, then alternative folder)
    s2_file = os.path.join(s2_folder, f"S2_Udupi_{year}.tif")
    if not os.path.exists(s2_file):
        s2_file = os.path.join(s2_folder_alt, f"S2_Udupi_{year}.tif")
        
    if not os.path.exists(s2_file):
        print(f"  ⚠️ Sentinel-2 image missing for {year}, skipping.")
        continue

    # Sentinel-1 path (checks for (1) variant first, then standard)
    s1_file = os.path.join(s1_folder, f"S1_SAR_Udupi_{year} (1).tif")
    if not os.path.exists(s1_file):
        s1_file = os.path.join(s1_folder, f"S1_SAR_Udupi_{year}.tif")
    if not os.path.exists(s1_file):
        print(f"  ⚠️ Sentinel-1 image missing for {year}, skipping.")
        continue

    # Water Mask path
    mask_file = os.path.join(mask_folder, f"{year}_WaterMask.tif")
    if not os.path.exists(mask_file):
        print(f"  ⚠️ Water Mask image missing for {year}, skipping.")
        continue

    print(f"  - S2 file: {s2_file}")
    print(f"  - S1 file: {s1_file}")
    print(f"  - Mask file: {mask_file}")

    # 2. Open datasets
    with rasterio.open(s2_file) as src_s2, \
         rasterio.open(s1_file) as src_s1, \
         rasterio.open(mask_file) as src_mask:

        width = src_s2.width
        height = src_s2.height
        s2_crs = src_s2.crs

        print(f"  - Sentinel-2 Grid: {width} x {height} pixels")

        # Loop with sliding window
        year_patches = 0
        total_steps = ((height - PATCH_SIZE) // STRIDE + 1) * ((width - PATCH_SIZE) // STRIDE + 1)
        current_step = 0
        print(f"  - Extracting patches (total possible windows: {total_steps})...")
        for y_offset in range(0, height - PATCH_SIZE + 1, STRIDE):
            for x_offset in range(0, width - PATCH_SIZE + 1, STRIDE):
                current_step += 1
                if current_step % 500 == 0:
                    print(f"    * Processed {current_step}/{total_steps} windows... (Created {year_patches} valid interface patches so far)")
                try:
                    # Define local window on S2 grid
                    window = Window(x_offset, y_offset, PATCH_SIZE, PATCH_SIZE)
                    window_transform = src_s2.window_transform(window)

                    # Read Sentinel-2 data
                    s2_data = src_s2.read(window=window).astype(np.float32)

                    # Calculate fraction of NaN or zero pixels in Sentinel-2 patch
                    nan_mask = np.isnan(s2_data) | (s2_data == 0)
                    nan_fraction = np.sum(nan_mask) / s2_data.size

                    # Skip if patch is mostly empty/NaN
                    if nan_fraction > MAX_NAN_FRACTION:
                        continue

                    # Fill remaining NaNs with 0.0 to prevent training errors
                    s2_data[np.isnan(s2_data)] = 0.0

                    # Read Sentinel-1 and reproject/align to S2 window
                    s1_data = np.zeros((src_s1.count, PATCH_SIZE, PATCH_SIZE), dtype=np.float32)
                    reproject(
                        source=rasterio.band(src_s1, range(1, src_s1.count + 1)),
                        destination=s1_data,
                        src_transform=src_s1.transform,
                        src_crs=src_s1.crs,
                        dst_transform=window_transform,
                        dst_crs=s2_crs,
                        resampling=Resampling.bilinear
                    )

                    # Fill Sentinel-1 NaNs with 0.0
                    s1_data[np.isnan(s1_data)] = 0.0

                    # Read Water Mask and reproject/align to S2 window (using nearest neighbor for labels)
                    mask_data = np.zeros((1, PATCH_SIZE, PATCH_SIZE), dtype=np.uint8)
                    reproject(
                        source=rasterio.band(src_mask, 1),
                        destination=mask_data,
                        src_transform=src_mask.transform,
                        src_crs=src_mask.crs,
                        dst_transform=window_transform,
                        dst_crs=s2_crs,
                        resampling=Resampling.nearest
                    )

                    # Verify that the patch actually contains the shoreline interface
                    # (i.e. contains both land (0) and water (1) pixels)
                    mask_sum = np.sum(mask_data)
                    total_pixels = PATCH_SIZE * PATCH_SIZE

                    # We want boundary patches, so skip if the patch is 100% land or 100% water
                    if mask_sum == 0 or mask_sum == total_pixels:
                        continue

                    # Save patch
                    patch_id = f"{year}_p_{x_offset}_{y_offset}"

                    np.save(os.path.join(s2_patch_dir, f"{patch_id}.npy"), s2_data)
                    np.save(os.path.join(s1_patch_dir, f"{patch_id}.npy"), s1_data)
                    np.save(os.path.join(mask_patch_dir, f"{patch_id}.npy"), mask_data[0])

                    year_patches += 1
                    total_patches_created += 1
                except Exception:
                    # Skip tile read errors silently to process other tiles
                    continue

        print(f"  - Successfully created {year_patches} shoreline patches for {year}")

print()
print("=== PREPARATION COMPLETED ===")
print(f"Total training patches created: {total_patches_created}")
print(f"Patches stored in: {dataset_folder}")
