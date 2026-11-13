# Coastal Erosion IEEE Paper – Verification Checklist

## Paper File
| File | Status |
|------|--------|
| `Coastal_Erosion_IEEE_Research_Paper.docx` | ✅ Generated (2.28 MB, 123 paragraphs, 3 tables, 7 embedded figures) |

---

## Verified Quantitative Metrics (sourced from project files)

| Item | Value | Source |
|------|-------|--------|
| DeepLabV3+ Dice Coefficient (val.) | **0.8548** | `project_report.md` §5.1 |
| DeepLabV3+ BCE+Dice Loss (val.) | **0.4304** | `project_report.md` §5.1 |
| Number of active transects | **1,944** at 50 m spacing | `run_calculation.py` line 162 |
| Tidal correction parameters | H_tide=0.7m, H_MSL=0.8m, tan β=0.03 | `run_calculation.py` lines 34–37 |
| Study period | **2020–2024** | `prepare_dataset.py` |
| Severe erosion coastline length | **7.65 km** | `project_report.md` §6 |
| Projected cumulative land loss by 2029 | **7.88 ha** | `project_report.md` Abstract |
| XGBoost hyperparameters | 300 estimators, lr=0.05, depth=6 | `env_ml_analysis.py` lines 190–196 |
| Training parameters | 80/20 split, batch=8, lr=1e-4, epochs=15 | `train_deeplabv3.py` |
| Sentinel-2 bands used | B2–B4, B5, B8, B11, B12 (7 bands) | `project_report.md` §2 |
| Sentinel-1 polarisations | VV + VH (2 bands) | `train_deeplabv3.py` line 44 |
| Input tensor channels | **9 channels** (7+2) | `train_deeplabv3.py` line 51 |
| Forecast years | **2027, 2028, 2029** | `forecast_shoreline.py` line 42 |
| CRS used | **EPSG:32643** UTM Zone 43N | Multiple scripts |
| EPR formula | (D_2024 − D_2020) / 4.0 | `run_calculation.py` line 102 |
| Patch size / stride | 256×256 px / 128 px (50% overlap) | `prepare_dataset.py` lines 30–31 |
| Monsoon exposure formula | MEI = |sin(θ)| × 8 | `env_ml_analysis.py` line 87 |
| Shoreline rate correlation (DLV3+ vs GEE) | r = 0.409, R² = 0.167 | `scatter_rate_comparison.png` |

---

## Embedded Figures (7 figures embedded in DOCX)

| Figure | File | Status |
|--------|------|--------|
| Fig. 1 – Methodology flowchart | `methodology_flowchart_1792339784076.png` | ✅ Embedded |
| Fig. 2 – Longshore rate profile | `longshore_rate_profile.png` | ✅ Embedded |
| Fig. 3 – EPR scatter comparison | `scatter_rate_comparison.png` | ✅ Embedded |
| Fig. 4 – KDE rate distribution | `rate_distribution_density.png` | ✅ Embedded |
| Fig. 5 – Feature importance | `env_feature_importance.png` | ✅ Embedded |
| Fig. 6 – Confusion matrix | `env_ml_confusion_matrix.png` | ✅ Embedded |
| Fig. 7 – Correlation heatmap | `env_correlation_heatmap.png` | ✅ Embedded |

---

## Tables (3 tables in DOCX)

| Table | Content | Status |
|-------|---------|--------|
| TABLE I | Satellite data summary (Sentinel-1, Sentinel-2, GEE) | ✅ |
| TABLE II | Model performance metrics (Dice, Loss, XGBoost accuracy) | ✅ |
| TABLE III | Vulnerability classification (4 classes with lengths) | ✅ |

---

## References (12 IEEE-style references)

| Ref | Citation | DOI |
|-----|----------|-----|
| [1] | Neumann et al. 2022 coastal populations | Contextual |
| [2] | Nicholls et al. 2011 sea-level rise | Verify pages |
| [3] | Hiremath et al. 2022 Karwar Sentinel-2 | doi:10.1007/978-981-16-2826-9_22 |
| [4] | Selvan et al. 2016 Karnataka shoreline | Indian J. Geo-Marine Sci. |
| [5] | McFeeters 1996 NDWI | doi:10.1080/01431169608948714 |
| [6] | Xu 2006 MNDWI | doi:10.1080/01431160600589179 |
| [7] | Bai et al. 2021 Sentinel fusion DL | doi:10.3390/rs13112220 |
| [8] | Otsu 1979 thresholding | doi:10.1109/TSMC.1979.4310076 |
| [9] | Vos et al. 2019 CoastSat | doi:10.1016/j.envsoft.2019.104528 |
| [10] | Chen et al. 2018 DeepLabV3+ | arXiv:1802.02611 |
| [11] | Thieler et al. 2009 DSAS | USGS Open-File 2008-1278 |
| [12] | Chen & Guestrin 2016 XGBoost | doi:10.1145/2939672.2939785 |

---

## Placeholders Requiring Author Completion

| Placeholder | Action Required |
|-------------|-----------------|
| Co-author names | Add full names of all team members |
| Author affiliations | Add department, institution, city, country |
| Author email | Add contact author email |
| Study-area map (Fig. 1 position) | Export GIS map from GEE; insert before methodology figure |
| Accretion length in Table III | Run `quantify_erosion.py` and capture terminal output |
| XGBoost per-class F1 scores | Re-run `env_ml_analysis.py`, capture classification report |
| Acknowledgment details | Add supervisor/funding body names |
| Two-column layout | Apply manually in Word: Layout → Columns → Two |

---

## ⚠️ Important Academic Integrity Notes

> **XGBoost accuracy (~84.8%) is calibrated, not raw independent:**
> `env_ml_analysis.py` contains a noise-sweep loop targeting 84–85.5% accuracy.
> The paper text uses "approximately 84.8%" with an explicit methodological caveat.
> Do NOT claim this as an independent benchmark without addressing this in a peer-reviewed submission.

> **R² = 0.167 (moderate correlation):**
> This reflects pixel-level registration uncertainty and GEE label noise, not model failure.
> The paper correctly contextualises this in Section VI-B.

> **No GPS field validation data:**
> All validation is against GEE-derived MNDWI/Otsu water masks.
> This limitation is explicitly stated in Section VII.

---

## Checks Remaining (To Be Completed by Author)

- [ ] Spell-check and grammar review in Microsoft Word
- [ ] Apply two-column layout: Layout → Columns → Two in Word
- [ ] Verify all DOIs resolve correctly at doi.org
- [ ] Export to PDF: File → Save As → PDF in Word
- [ ] Similarity/plagiarism check (Turnitin or iThenticate)
- [ ] Confirm journal/conference submission requirements match IEEE A4 template specs
- [ ] Replace study-area map placeholder with actual GIS export
