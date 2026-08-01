Command to run :  npm run dev --prefix dashboard-react

# Coastal Erosion Detection, Analysis, and Forecasting using Remote Sensing and ML

An end-to-end, multi-sensor remote sensing and machine learning pipeline to detect, analyze, and forecast shoreline change patterns along the Udupi district coastline in Karnataka, India.

---

## 📌 Project Overview
This project integrates satellite remote sensing with Deep Learning and Machine Learning to monitor shoreline geomorphology, quantify historical erosion rates, classify risk areas, and project future coastal retreat.

### 🎯 Core Objectives
1. **Deep Learning Shoreline Segmentation:** Fusion of **Sentinel-1 SAR** (radar backscatter) and **Sentinel-2 Multispectral** (optical) imagery bands (9 channels total) to train a ResNet-34 backed **DeepLabV3+** semantic segmentation model. Automated contour mapping and sub-pixel edge detection extract the shoreline vector.
2. **Erosion Analysis & Forecasting:** Correction of shoreline vectors for tidal variations using localised beach slopes. Calculation of **End Point Rate (EPR)** across 1,944 active transects spaced at 50m intervals. An **XGBoost Classifier** predicts future erosion vulnerability based on marine environmental features (wave height, tide range, monsoon exposure). Linear extrapolation projects shoreline coordinates forward for **2027, 2028, and 2029**.

---

## 🗺️ Study Area: Udupi District, Karnataka, India
* **Location:** SW coast of India, dynamic estuarine zones (e.g., Swarna and Sita rivers merging near Bengre spit).
* **Climate Hazard:** High-energy South-West monsoon winds and waves (June–September) driving rapid coastal erosion.

---

## 🛠️ System Pipeline Architecture

```mermaid
graph TD
    subgraph Input Data (Google Drive)
        S1[Sentinel-1 SAR stack]
        S2[Sentinel-2 Optical stack]
        GT[Water Mask Ground Truth]
        TR[Baseline Transects .shp]
    end

    subgraph Phase 1: Deep Learning Shoreline Segmentation
        P1[prepare_dataset.py] -->|Slice & Normalise 256x256 patches| P_Data[(training_dataset/)]
        P_Data --> P2[train_deeplabv3.py] -->|Train ResNet34-DeepLabV3+| Model[best_deeplabv3_model.pth]
        Model --> P3[run_inference.py] -->|Sliding-window Inference + Morphological Filter| SL24[2024 Predicted Shoreline .shp]
    end

    subgraph Phase 2: Coastal Erosion & Vulnerability Analysis
        SL24 & TR --> P4[run_calculation.py] -->|Tidal Correction + EPR Calculation| CSV[(coastal_environmental_dataset.csv)]
        CSV --> P5[forecast_shoreline.py] -->|Linear Extrapolation| Forec[2027-2029 Forecast .shp]
        CSV --> P6[env_ml_analysis.py] -->|Train XGBoost Classifier| Risk[Feature Importance & Confusion Matrix]
        CSV --> P7[quantify_erosion.py] -->|Quantify land loss and risk km| Quant[Erosion Quantification Plots]
        CSV --> P8[shoreline_movement_plot.py] -->|Movement trends over time| Visuals[Shoreline Movement Charts]
    end

    subgraph Phase 3: Visualisation & GIS Dashboard
        CSV & Forec & Visuals --> Dash[dashboard/ Web-GIS Map Viewer]
    end
```

---

## 📂 Project Directory Structure

* 📁 `dashboard/` - HTML/CSS/JS interactive Web-GIS dashboard for shoreline visualisation.
* 📁 `dashboard-react/` - React/Vite/HMR development version of the client dashboard.
* 📁 `REACT PROJECT EXPO/` - Compiled / build assets for dashboard deployment.
* 📄 [prepare_dataset.py](file:///c:/Users/HP/Desktop/Final%20Soil/prepare_dataset.py) - Tiles GeoTIFF files into NumPy patches.
* 📄 [train_deeplabv3.py](file:///c:/Users/HP/Desktop/Final%20Soil/train_deeplabv3.py) - Implements and trains the deep learning segmentation model.
* 📄 [run_inference.py](file:///c:/Users/HP/Desktop/Final%20Soil/run_inference.py) - Generates shoreline predictions on new satellite scenes.
* 📄 [run_calculation.py](file:///c:/Users/HP/Desktop/Final%20Soil/run_calculation.py) - Computes tide-corrected shoreline change rates (EPR).
* 📄 [forecast_shoreline.py](file:///c:/Users/HP/Desktop/Final%20Soil/forecast_shoreline.py) - Projects shoreline positions for 2027, 2028, and 2029.
* 📄 [env_ml_analysis.py](file:///c:/Users/HP/Desktop/Final%20Soil/env_ml_analysis.py) - Environmental vulnerability analysis using XGBoost.
* 📄 [quantify_erosion.py](file:///c:/Users/HP/Desktop/Final%20Soil/quantify_erosion.py) - Calculates land loss (hectares) and affected km.
* 📄 [shoreline_movement_plot.py](file:///c:/Users/HP/Desktop/Final%20Soil/shoreline_movement_plot.py) - Plots historical changes per transect.
* 📄 [project_report.md](file:///c:/Users/HP/Desktop/Final%20Soil/project_report.md) - Full academic report with literature review, methodology, and equations.
* 📄 [how to run.md](file:///c:/Users/HP/Desktop/Final%20Soil/how%20to%20run.md) - Detailed guide for executing the scripts.

---

## ⚡ Prerequisites & Installation

### 1. Python Environment Setup
Install the necessary geospatial and machine learning dependencies:
```bash
pip install -r requirements.txt
```

### 2. Input Data Configuration
Ensure input data files are located in your target directory (default: `G:\My Drive\Coastline_Analysis_New\`):
* **Satellite GeoTIFFs:** `sentinel2_2020_2024.tif`, `sentinel1_2020_2024.tif`
* **GIS Shapes:** `baseline_transects.shp` and GEE-derived historical shoreline vectors (`shorelines_2020.shp` ... `shorelines_2024.shp`)
* **Ground Truth:** `water_mask_gt.tif`

---

## 🚀 Execution Workflow
Run the pipeline scripts in the exact sequence below:

```bash
# 1. Tile satellite imagery and create dataset patches
python prepare_dataset.py

# 2. Train the DeepLabV3+ segmentation model
python train_deeplabv3.py

# 3. Extract the 2024 shoreline using the trained model
python run_inference.py

# 4. Correct for tides and calculate EPR erosion rates (produces coastal_environmental_dataset.csv)
python run_calculation.py

# 5. Forecast shoreline coordinates for 2027-2029
python forecast_shoreline.py

# 6. Run vulnerability analysis and extract feature importances
python env_ml_analysis.py

# 7. Quantify risk areas and compile cumulative land loss charts
python quantify_erosion.py

# 8. Plot shoreline movements and historical profiles
python shoreline_movement_plot.py
```

---

## 📊 Key Results & Metrics
* **Deep Learning Model Accuracy:** Val Dice Coefficient of **`0.8548`** (85.48%) using combined optical + radar sensor features.
* **Vulnerability Drivers:** XGBoost classification confirms **monsoon wind and wave exposure** as the primary physical drivers of coastline retreat.
* **Projections (by 2029):**
  * **7.65 km** of Udupi coastline categorized as undergoing severe erosion.
  * **7.88 hectares** of cumulative land loss forecasted by 2029.

---

## 🖥️ Deploying the GIS Dashboard
Launch a local development server to explore the visualised transects, erosion categories, and forecasts:
```bash
python -m http.server 8000 --directory dashboard
```
Then visit **[http://localhost:8000](http://localhost:8000)** in your web browser. 

*Alternatively, the React dashboard workspace can be accessed and run from the `dashboard-react/` folder:*
```bash
cd dashboard-react
npm install
npm run dev
```

---

## ❓ Troubleshooting
* **CUDA out of memory:** Decrease `BATCH_SIZE` (e.g., to 2) in `train_deeplabv3.py`.
* **Missing packages:** Re-run `pip install -r requirements.txt` to verify all geospatial libraries (`rasterio`, `geopandas`, `shapely`) are installed.
* **Map markers not appearing:** Ensure `coastal_environmental_dataset.csv` has been copied to the `dashboard/` directory.
