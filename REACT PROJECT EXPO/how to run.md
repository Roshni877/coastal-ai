# HOW TO RUN: Coastal Erosion Detection & Forecasting Pipeline

**Project:** Coastal Erosion Detection, Analysis, and Forecasting using ML and Remote Sensing  
**Study Area:** Udupi District, Karnataka, India  
**Live Deployed Website:** [https://major-project-coastal-ai.vercel.app/](https://major-project-coastal-ai.vercel.app/)  
**GitHub Repository:** [https://github.com/Roshni877/coastal-ai](https://github.com/Roshni877/coastal-ai)  
**Required Data:** Sentinel-1 SAR + Sentinel-2 Optical GeoTIFF files on Google Drive (`G:\My Drive\Coastline_Analysis_New\`)

---

## Prerequisites: Setup Before Running Anything

### 1. Install Python Dependencies
Open a terminal in the project folder and run:

```bash
pip install -r requirements.txt
```

---

## ⚡ Quick Start: Frontend Run Commands

| Component | Description | Command (PowerShell / Terminal) | Port |
| --- | --- | --- | --- |
| **🌐 Full React Project Expo** | Entire integrated website (Home, Synopsis, Methodology, Dataset Guide, Team & Dashboard) | `cd "REACT PROJECT EXPO"; npm.cmd start` | `http://localhost:3000` |
| **📊 React GIS Dashboard** | Standalone React Map & Analytics Dashboard | `cd dashboard-react; npm.cmd run dev` | `http://localhost:5173` |
| **🌐 Static HTML Dashboard** | Simple lightweight HTML GIS server | `python -m http.server 8000 --directory dashboard` | `http://localhost:8000` |

---

## ⚡ Single Command: Run All ML Analysis & Generate Confusion Matrix

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

## Pipeline Execution Order

### STEP 1 — Prepare the Training Dataset
```bash
python prepare_dataset.py
```

### STEP 2 — Train the DeepLabV3+ Segmentation Model
```bash
python train_deeplabv3.py
```

### STEP 3 — Run Inference and Extract 2024 Shoreline
```bash
python run_inference.py
```

### STEP 4 — Calculate Historical Erosion Rates
```bash
python run_calculation.py
```

### STEP 5 — Forecast Future Shorelines (2027, 2028, 2029)
```bash
python forecast_shoreline.py
```

### STEP 6 — Run Environmental ML Analysis (XGBoost)
```bash
python env_ml_analysis.py
```

### STEP 7 — Quantify Coastline Erosion and Land Loss
```bash
python quantify_erosion.py
```

### STEP 8 — Generate Shoreline Movement Plots
```bash
python shoreline_movement_plot.py
```
