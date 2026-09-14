# Coastal Erosion Detection, Analysis, and Forecasting using ML and Remote Sensing

**Study Area:** Udupi District, Karnataka, India  
**GitHub Repository:** [https://github.com/Roshni877/coastal-ai](https://github.com/Roshni877/coastal-ai)  
**Key Features:** DeepLabV3+ Satellite Segmentation, Coastal Transect Rate Calculation (EPR), XGBoost Environmental Risk Classifier, and Interactive Web-GIS Frontend.

---

## 🌐 Live Deployed Application
> **Full Live Website (Project Expo & Integrated Dashboard):**  
> 🔗 **[https://major-project-coastal-ai.vercel.app/](https://major-project-coastal-ai.vercel.app/)**  
> *(Hosted on Vercel: Includes Home, Synopsis, Methodology, Dataset Guide, Team & Interactive GIS Visualization Dashboard)*

---

## 🚀 How to Run the Frontend Applications

### 1. Run Full Integrated Project Frontend (React Project Expo)
Runs the entire web application including Home, Synopsis, Methodology, Dataset Guide, Team, and the integrated GIS Visualization Dashboard together.

**PowerShell / Terminal Command:**
```powershell
cd "D:\data 5555\Final Soil\REACT PROJECT EXPO"; npm.cmd start
```
*Or from inside the `REACT PROJECT EXPO` folder:*
```powershell
npm.cmd start
```
> **Local URL:** `http://localhost:3000` (or `http://localhost:5173`)

---

### 2. Run Standalone React GIS Analytics Dashboard
Runs only the lightweight standalone React GIS Map & Analytics Dashboard component.

**PowerShell / Terminal Command:**
```powershell
cd "D:\data 5555\Final Soil\dashboard-react"; npm.cmd start
```
*Or from inside the `dashboard-react` folder:*
```powershell
npm.cmd start
```
> **Local URL:** `http://localhost:5173`

---

### 3. Run Static HTML Web-GIS Server
```bash
python -m http.server 8000 --directory dashboard
```
> **Local URL:** `http://localhost:8000`

---

## 🤖 Machine Learning Evaluation & Confusion Matrix

To run the complete **Machine Learning pipeline** (XGBoost classifier, Confusion Matrix, Feature Importance, Risk Quantification, and Plots) in a single command:

### Prerequisites:
```powershell
pip install -r requirements.txt
```

### Single Command to Run ML Scripts:
```powershell
python env_ml_analysis.py; python quantify_erosion.py; python shoreline_movement_plot.py; python additional_plots.py
```

### Generated ML Outputs & Plots:
* 📉 **Confusion Matrix:** `env_ml_confusion_matrix.png`
* 📊 **Feature Importances:** `env_feature_importance.png`
* 🔥 **Correlation Heatmap:** `env_correlation_heatmap.png`
* 🏞️ **Erosion & Land Loss:** `coastal_erosion_quantification.png`
* 📈 **Shoreline Trends:** `shoreline_movement_all_years.png`
* 📋 **Terminal Metrics:** Prints Classification Report (Precision, Recall, F1-Score, Accuracy).

---

## 🐍 Deep Learning & Pipeline Execution Order

```bash
# 1. Deep Learning Shoreline Segmentation (DeepLabV3+)
python prepare_dataset.py
python train_deeplabv3.py
python run_inference.py

# 2. Erosion Rate Calculation & Future Forecasting
python run_calculation.py
python forecast_shoreline.py

# 3. ML Risk Classification & Plot Generation
python env_ml_analysis.py
python quantify_erosion.py
python shoreline_movement_plot.py
python additional_plots.py
```

---

## 📂 Repository Structure

* `REACT PROJECT EXPO/` — Main integrated React application (Home, Synopsis, Methodology, Dataset Guide, Team, Map Dashboard)
* `dashboard-react/` — Standalone React 19 + Vite Web-GIS Dashboard
* `dashboard/` — Static Web-GIS HTML dashboard
* `how to run.md` — Detailed step-by-step pipeline execution guide
* `project_report.md` — Comprehensive project report
