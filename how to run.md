# HOW TO RUN: Coastal Erosion Detection & Forecasting Pipeline

**Project:** Coastal Erosion Detection, Analysis, and Forecasting using ML and Remote Sensing  
**Study Area:** Udupi District, Karnataka, India  
**Live Deployed Website:** [https://major-project-coastal-ai.vercel.app/](https://major-project-coastal-ai.vercel.app/)  
**Required Data:** Sentinel-1 SAR + Sentinel-2 Optical GeoTIFF files on Google Drive (`G:\My Drive\Coastline_Analysis_New\`)

---

## Prerequisites: Setup Before Running Anything

### 1. Install Python Dependencies
Open a terminal in the project folder and run:

```bash
pip install -r requirements.txt
```

This installs all libraries: `torch`, `rasterio`, `geopandas`, `shapely`, `xgboost`, `scikit-learn`, `opencv-python`, `numpy`, `pandas`, `matplotlib`.

### 2. Required Input Data (on Google Drive)
Make sure the following files exist on your Google Drive (mounted at `G:\My Drive\Coastline_Analysis_New\`):

| File | Description |
|---|---|
| `sentinel2_2020_2024.tif` | Sentinel-2 optical imagery stack (2020–2024) |
| `sentinel1_2020_2024.tif` | Sentinel-1 SAR radar imagery stack (2020–2024) |
| `water_mask_gt.tif` | Ground-truth binary water mask for training |
| `baseline_transects.shp` | 1,944 pre-generated coast transect lines |
| `shorelines_2020.shp` ... `shorelines_2024.shp` | Historical GEE-derived shoreline vectors |

---

## Pipeline Execution Order

Run the scripts **in this exact order**. Each script depends on the output of the one before it.

---

### STEP 1 — Prepare the Training Dataset
**File:** `prepare_dataset.py`

```bash
python prepare_dataset.py
```

**What it does:**
- Opens the Sentinel-2 (optical) and Sentinel-1 (SAR) GeoTIFF files
- Slices them into small 256x256 pixel patches with 50% overlap
- Normalizes all band values to the 0.0–1.0 range
- Saves patches as .npy arrays into the `training_dataset/` folder

**Inputs:**
- `G:\My Drive\Coastline_Analysis_New\sentinel2_2020_2024.tif`
- `G:\My Drive\Coastline_Analysis_New\sentinel1_2020_2024.tif`
- `G:\My Drive\Coastline_Analysis_New\water_mask_gt.tif`

**Outputs:**
- `training_dataset/images/` — image patch .npy files
- `training_dataset/masks/` — ground truth mask .npy files

**Expected time:** 10–30 minutes depending on file size

---

### STEP 2 — Train the DeepLabV3+ Segmentation Model
**File:** `train_deeplabv3.py`

```bash
python train_deeplabv3.py
```

**What it does:**
- Loads the 256x256 patches from `training_dataset/`
- Trains the ResNet-34 + DeepLabV3+ model on 9 input channels (7 optical + 2 SAR)
- Evaluates validation Dice Coefficient after each epoch
- Saves the best weights when validation Dice improves

**Inputs:**
- `training_dataset/images/*.npy` and `training_dataset/masks/*.npy` (from Step 1)

**Outputs:**
- `best_deeplabv3_model.pth` — saved model weights file (the most important output!)

> **IMPORTANT:** You need a CUDA-capable GPU (NVIDIA) for reasonable training speed.
> On CPU, training will be very slow (hours). On GPU, expect 20–40 minutes.

**Expected Validation Dice Score:** ~0.85 (85%)

---

### STEP 3 — Run Inference and Extract 2024 Shoreline
**File:** `run_inference.py`

```bash
python run_inference.py
```

**What it does:**
- Loads the trained model from `best_deeplabv3_model.pth`
- Runs sliding-window inference on 2024 satellite imagery
- Stitches overlapping prediction patches into a full probability map
- Applies morphological filters to clean up noise
- Extracts the water boundary using OpenCV `findContours`
- Exports the predicted shoreline as a GIS Shapefile

**Inputs:**
- `best_deeplabv3_model.pth` (from Step 2)
- `G:\My Drive\Coastline_Analysis_New\sentinel2_2024.tif`
- `G:\My Drive\Coastline_Analysis_New\sentinel1_2024.tif`

**Outputs:**
- `G:\My Drive\Coastline_Analysis_New\Shorelines_DLV3\2024_Predicted_Shoreline_DeepLabV3.shp`

**Expected time:** 15–30 minutes

---

### STEP 4 — Calculate Historical Erosion Rates  ← KEY STEP
**File:** `run_calculation.py`

```bash
python run_calculation.py
```

**What it does:**
- Intersects all historical shoreline vectors (2020–2024) with 1,944 transects
- Applies tidal height correction to normalize shoreline positions to Mean Sea Level
- Computes the End Point Rate (EPR) in meters/year for every transect
- Exports a merged CSV dataset with all distances and rates

**Inputs:**
- `G:\My Drive\Coastline_Analysis_New\baseline_transects.shp`
- Predicted 2024 shoreline Shapefile (from Step 3)
- Historical GEE shorelines 2020–2024

**Outputs:**
- `G:\My Drive\Coastline_Analysis_New\Objective_2_Outputs\coastal_environmental_dataset.csv`

This CSV is the **master data file** used by ALL subsequent steps (5, 6, 7, 8).

**Expected time:** 5–15 minutes

---

### STEP 5 — Forecast Future Shorelines (2027, 2028, 2029)
**File:** `forecast_shoreline.py`

```bash
python forecast_shoreline.py
```

**What it does:**
- Reads the erosion rates from the CSV (from Step 4)
- Projects each transect's shoreline position forward in time using linear extrapolation
- Exports separate Shapefiles for each forecast year

**Inputs:**
- `coastal_environmental_dataset.csv` (from Step 4)
- `baseline_transects.shp`

**Outputs:**
- `Forecasted_Shoreline_2027.shp`
- `Forecasted_Shoreline_2028.shp`
- `Forecasted_Shoreline_2029.shp`

**Expected time:** 2–5 minutes

---

### STEP 6 — Run Environmental ML Analysis (XGBoost)
**File:** `env_ml_analysis.py`

```bash
python env_ml_analysis.py
```

**What it does:**
- Adds wave height, tide range, and monsoon exposure features to each transect
- Trains an XGBoost classifier to predict erosion risk category
- Generates feature importance and confusion matrix plots

**Inputs:**
- `coastal_environmental_dataset.csv` (from Step 4)

**Outputs:**
- `env_feature_importance.png`
- `env_ml_confusion_matrix.png`
- `env_correlation_heatmap.png`

**Expected time:** 1–3 minutes

---

### STEP 7 — Quantify Coastline Erosion and Land Loss
**File:** `quantify_erosion.py`

```bash
python quantify_erosion.py
```

**What it does:**
- Computes total length (km) of coastline under each risk category
- Computes cumulative land loss (Hectares) forecasted by 2029

**Inputs:**
- `coastal_environmental_dataset.csv` (from Step 4 or 6)

**Outputs:**
- `coastal_erosion_quantification.png`
- `coastline_class_comparison.png`

**Expected time:** 1–2 minutes

---

### STEP 8 — Generate Shoreline Movement Plots
**File:** `shoreline_movement_plot.py`

```bash
python shoreline_movement_plot.py
```

**Inputs:**
- `coastal_environmental_dataset.csv` (from Step 4)

**Outputs:**
- `shoreline_movement_all_years.png`
- `shoreline_distance_comparison_by_year.png`
- `hotspot_erosion_predictions_over_time.png`

**Expected time:** 1–2 minutes

---

### STEP 9 (Optional) — Generate Additional Plots
**File:** `additional_plots.py`

```bash
python additional_plots.py
```

Generates extra comparative plots (rate distributions, scatter comparisons, longshore profiles).

---

### ⚡ Single Command: Run All ML Analysis & Generate Confusion Matrix

To run the complete **Machine Learning analysis pipeline** (XGBoost classifier, Confusion Matrix, Feature Importance, Risk Quantification, and Plots) in a **single terminal command**:

**PowerShell:**
```powershell
python env_ml_analysis.py; python quantify_erosion.py; python shoreline_movement_plot.py; python additional_plots.py
```

**Command Prompt (CMD):**
```cmd
python env_ml_analysis.py && python quantify_erosion.py && python shoreline_movement_plot.py && python additional_plots.py
```

**Output Files Generated:**
* `env_ml_confusion_matrix.png` *(Confusion Matrix)*
* `env_feature_importance.png` *(Feature Importances)*
* `env_correlation_heatmap.png` *(Correlation Heatmap)*
* `coastal_erosion_quantification.png` *(Risk & Land Loss)*
* `shoreline_movement_all_years.png` *(Shoreline Trends)*

---

### STEP 10 (Optional) — Visualize Segmentation Patch Predictions
**File:** `visualize_predictions.py`

```bash
python visualize_predictions.py
```

Displays side-by-side comparisons of input satellite patches vs. ground truth mask vs. model prediction.

---

### STEP 11 — Launch Frontends / Web Dashboards

#### Option A: Full Integrated React Project Expo Frontend (Recommended)
**Folder:** `REACT PROJECT EXPO/`  
Runs the entire integrated website (Home, Synopsis, Methodology, Dataset Guide, Team, and Visualization Dashboard).

```bash
# In Windows PowerShell:
npm.cmd --prefix "REACT PROJECT EXPO" start

# Or using cd:
cd "REACT PROJECT EXPO"
npm.cmd start
```
Then open your browser at: **http://localhost:3000**

---

#### Option B: Standalone React Web-GIS Dashboard
**Folder:** `dashboard-react/`  
Runs the modern standalone React GIS Map & Charts interface.

```bash
# In Windows PowerShell:
npm.cmd --prefix dashboard-react run dev

# Or using cd:
cd dashboard-react
npm.cmd run dev
```
Then open your browser at: **http://localhost:5173**

---

#### Option C: Lightweight Static HTML Web-GIS Dashboard
**Folder:** `dashboard/`

```bash
python -m http.server 8000 --directory dashboard
```
Then open your browser at: **http://localhost:8000**

---

## Complete Pipeline at a Glance

```
SETUP
  └── pip install -r requirements.txt

OBJECTIVE 1: Deep Learning Shoreline Segmentation
  Step 1: prepare_dataset.py       →  Creates 256x256 training patches
  Step 2: train_deeplabv3.py       →  Trains DeepLabV3+ model (saves .pth)
  Step 3: run_inference.py         →  Extracts 2024 shoreline Shapefile

OBJECTIVE 2: Erosion Analysis & Forecasting
  Step 4: run_calculation.py       →  Computes erosion rates → KEY CSV FILE
      ├── Step 5: forecast_shoreline.py    →  2027–2029 forecast Shapefiles
      ├── Step 6: env_ml_analysis.py       →  XGBoost erosion risk classifier
      ├── Step 7: quantify_erosion.py      →  km under threat + ha land loss
      └── Step 8: shoreline_movement_plot.py → Trend visualization plots

OPTIONAL
  Step 9:  additional_plots.py
  Step 10: visualize_predictions.py

DEPLOYMENT & FRONTEND RUN COMMANDS
  • Entire React Expo Frontend:   npm.cmd --prefix "REACT PROJECT EXPO" start  (http://localhost:3000)
  • React Web-GIS Dashboard:      npm.cmd --prefix dashboard-react run dev     (http://localhost:5173)
  • Static HTML Dashboard:        python -m http.server 8000 --directory dashboard (http://localhost:8000)
```

> Steps 5, 6, 7, and 8 can be run in any order after Step 4 completes.

---

## Output Folder Reference

| Location | Contents |
|---|---|
| `training_dataset/` | Raw training patch .npy files |
| `best_deeplabv3_model.pth` | Trained model weights |
| `Objective_2_Outputs/` (G Drive) | Rate CSVs, forecast Shapefiles, all plots |
| `dashboard/` | Web-GIS frontend (HTML/CSS/JS) |
| `dashboard/plots/` | PNG charts served in the dashboard |
| `report_images/` | Copies of all graphs for the project report |
| `project_report.md` | Full academic project report |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `FileNotFoundError` on GeoTIFF | Check Google Drive is mounted at `G:\` and files exist |
| `CUDA out of memory` | Reduce `BATCH_SIZE` in `train_deeplabv3.py` from 4 to 2 |
| `No module named rasterio` | Run `pip install -r requirements.txt` |
| Dashboard shows no dots on map | Copy `coastal_environmental_dataset.csv` to `dashboard/` folder |
| Model Dice score very low (below 0.5) | Check patch normalization and verify `training_dataset/` has enough files |
| Shapefile `.shp` not found | Make sure previous step completed without errors and check the output folder |
