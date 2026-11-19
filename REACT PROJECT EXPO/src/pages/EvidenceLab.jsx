import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Compass,
  Layers,
  Cpu,
  Database,
  BarChart3,
  TrendingUp,
  Eye,
  Download,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  ShieldCheck,
  Activity,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  Sliders,
  HelpCircle,
  Tv,
  SplitSquareVertical,
  Check,
  RefreshCw,
  Zap,
  Radio,
  Sun
} from "lucide-react";
import PageReveal from "../components/PageReveal";
import "../styles/EvidenceLabRedesign.css";

// Google Colab Base URL
const COLAB_BASE = "https://colab.research.google.com/github/Roshni877/coastal-ai/blob/main/Soil_Erosion_Major_Project_Phase_4_Roshni.ipynb";

// Google Drive Master Dataset Folder & Verified Project Links
const GOOGLE_DRIVE_DATASET_FOLDER = "https://drive.google.com/drive/folders/1Myt6vK9CAALhZLXjKB_e1Mw6JzH_0qVG?usp=sharing";

const VERIFIED_COLAB_NOTEBOOKS = [
  {
    title: "Phase 4: DeepLabV3+ Model Training & Evaluation",
    url: "https://colab.research.google.com/drive/1poxCt5JVi7PXHOZK8_N50FYUWhorO6Hr?usp=drive_link",
    role: "Core Deep Learning Pipeline",
    badge: "PyTorch 2.0 // DeepLabV3+"
  },
  {
    title: "Google Earth Engine: Satellite Extraction & 9-Channel Stacking",
    url: "https://colab.research.google.com/drive/1dpGr9MhJEOZDFIfOF8F-pa1jsv9M7C0u?usp=drive_link",
    role: "GEE Ingestion & Cloud Masking",
    badge: "GEE API // S1+S2 Fusion"
  },
  {
    title: "Transect Kinematics & DSAS End Point Rate Calculations",
    url: "https://colab.research.google.com/drive/1WY69PjVR80VufipCMAIGd3vFHstoAenv?usp=drive_link",
    role: "1,944 Orthogonal Transects",
    badge: "DSAS // EPR Kinematics"
  },
  {
    title: "XGBoost Downstream Environmental Vulnerability Classifier",
    url: "https://colab.research.google.com/drive/1nrmPEqcGzNsLcnddqIAqrFPJQVgrcCc7?usp=drive_link",
    role: "Multi-Tier Coastal Hazard Model",
    badge: "XGBoost // 84.8% Acc"
  }
];

const VERIFIED_DRIVE_FILES = [
  { id: "1OJJaJFmkDOcGkEwqiyGFBSJ7QsZf60nd", name: "Sentinel-2 Multi-Spectral Reflectance B2-B12 Patches", size: "128 MB", type: "TIFF / Tensor" },
  { id: "1qzUOtePO6QqDMTf1iZNWzdWtlo0Lo5A3", name: "Sentinel-1 SAR C-Band GRD Dual-Pol (VV/VH) Archives", size: "94 MB", type: "SAR GeoTIFF" },
  { id: "1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4", name: "Ground-Truth Segmentation Target Masks (1,420 Patches)", size: "42 MB", type: "Binary Mask" },
  { id: "1c5mxkNQoC78hd17shF6uqwDUoOmAO23_", name: "DeepLabV3+ ResNet-34 PyTorch Model Checkpoint (.pth)", size: "86 MB", type: "Model Weights" },
  { id: "1x0v2nBf-UCFyFb3Nfm0P1NzIHpk9eTP-", name: "Udupi 1,944 Baseline Transects Spatial Database", size: "18 MB", type: "GeoPackage" },
  { id: "1d9NIfbDlTq_bTcfQtj7haWKZaN-er0tV", name: "DSAS End Point Rate (EPR) Tabular Kinematics Dataset", size: "12 MB", type: "CSV / Parquet" },
  { id: "1AJGDZfuUtqD9sTZfv49bbcOgSajFegC0", name: "XGBoost Coastal Vulnerability Model & Feature Matrices", size: "14 MB", type: "Pickle / Scikit" },
  { id: "1pPpt9lHQdfg88OJRlkQ5iMDDd3QZnQBH", name: "In-Situ Tidal Elevation De-Biasing Matrix (2020–2024)", size: "8 MB", type: "CSV Table" },
  { id: "1pvam2PuPkrTX2eYzaxKor8KX9Oqw6ODe", name: "Google Earth Pro High-Resolution Ground Truth Basemap", size: "64 MB", type: "KML / GeoTIFF" },
  { id: "1drNKQXy-Y9xTIZ-tpf4F72goUQwjcFCK", name: "2020 Baseline Coastline Vector Delineation (EPSG:32643)", size: "6 MB", type: "Shapefile" },
  { id: "1ZWqqiz1IB_Ia3xn6-SA0Ogoo_VNBhJUE", name: "2024 Final Observed Satellite Shoreline Vector", size: "7 MB", type: "Shapefile" },
  { id: "1-x-1hUDkxjd59XgD-7BW6V_0m3mCQjHP", name: "2027–2029 Deep Learning Predictive Coastline Projections", size: "11 MB", type: "Shapefile" },
  { id: "1tHBiU7djAs-w0soU2HuTaB3Inxha8Sd4", name: "Alongshore Erosion Rate Heatmap Rasters (2020–2024)", size: "26 MB", type: "GeoTIFF" },
  { id: "1OQuW8AZ0MPv03hNI9EnqpjP5TUFkvzG_", name: "Transect Longshore Rate Profile Analysis Data (Fig. 2)", size: "5 MB", type: "CSV" },
  { id: "1IFT0V1ZRIkwVmJrSsL7nfQ_SjhRAEab", name: "3-Panel Forecasting Summary Compilation (2020–2029)", size: "16 MB", type: "PDF / Graph" }
];

// ============================================================================
// DATA DEFINITIONS & SCIENTIFIC SPECIFICATIONS
// ============================================================================

// SECTION A: SENTINEL-2 BANDS
const SENTINEL_2_BANDS = [
  {
    band: "B2",
    name: "Blue",
    wavelength: "490 nm",
    resolution: "10 m",
    image: "/satellite_bands/s2_b2_blue.png",
    scientificColor: "Cool Cyan-Blue (Scientific Lookup)",
    captures: "Atmospheric scattering, shallow bathymetry, water column penetration.",
    coastalRole: "Deep clear water penetration; assists in separating suspended sediment plumes from deep oceanic water.",
    projectUsage: "Blue channel in True Colour (B4-B3-B2) composite and 3rd channel of our 9-channel input tensor."
  },
  {
    band: "B3",
    name: "Green",
    wavelength: "560 nm",
    resolution: "10 m",
    image: "/satellite_bands/s2_b3_green.png",
    scientificColor: "Emerald Green (Scientific Lookup)",
    captures: "Peak green reflectance from terrestrial vegetation canopy and aquatic turbidity.",
    coastalRole: "Essential numerator component in NDWI = (Green - NIR) / (Green + NIR) and MNDWI = (Green - SWIR) / (Green + SWIR).",
    projectUsage: "Primary spectral contrast band used for water extraction and Green channel in True Colour RGB."
  },
  {
    band: "B4",
    name: "Red",
    wavelength: "665 nm",
    resolution: "10 m",
    image: "/satellite_bands/s2_b4_red.png",
    scientificColor: "Crimson Red (Scientific Lookup)",
    captures: "Chlorophyll absorption in vegetation; strong light absorption in clear water bodies.",
    coastalRole: "High contrast between absorbing water bodies and highly reflective sandy beaches and urban settlements.",
    projectUsage: "Red channel in True Colour composite and critical boundary delineator in shoreline vectors."
  },
  {
    band: "B8",
    name: "Near-Infrared (NIR)",
    wavelength: "842 nm",
    resolution: "10 m",
    image: "/satellite_bands/s2_b8_nir.png",
    scientificColor: "Grayscale Raw Intensity (High Contrast)",
    captures: "Extreme chlorophyll cell structure reflectance (vegetation plateau); near-total absorption by clear water.",
    coastalRole: "The single most crucial optical band for water/land separation: water appears jet black while land reflects intensely.",
    projectUsage: "Key denominator component of NDWI and channel 6 of the 9-channel DeepLabV3+ input tensor."
  },
  {
    band: "B8A",
    name: "Narrow Near-Infrared",
    wavelength: "865 nm",
    resolution: "20 m",
    image: "/satellite_bands/s2_b8a_narrow_nir.png",
    scientificColor: "Grayscale Raw Intensity",
    captures: "Atmospheric water vapor plateau suppression; vegetation biophysical properties.",
    coastalRole: "Suppresses water vapor absorption interference along tropical coastal interfaces like Udupi.",
    projectUsage: "Used in SWIR composites and channel 7 of our 9-channel deep learning model."
  },
  {
    band: "B11",
    name: "Shortwave Infrared 1 (SWIR-1)",
    wavelength: "1610 nm",
    resolution: "20 m",
    image: "/satellite_bands/s2_b11_swir1.png",
    scientificColor: "Amber/Copper Intensity",
    captures: "Soil moisture sensitivity, cloud vs snow/ice distinction, moisture content of sand.",
    coastalRole: "Distinguishes saturated intertidal beach sand from dry dunes, crucial for micro-tidal boundary precision.",
    projectUsage: "Key component in MNDWI water separation and channel 8 of the 9-channel tensor."
  },
  {
    band: "B12",
    name: "Shortwave Infrared 2 (SWIR-2)",
    wavelength: "2190 nm",
    resolution: "20 m",
    image: "/satellite_bands/s2_b12_swir2.png",
    scientificColor: "Copper/Bronze Intensity",
    captures: "Mineral composition, clay, rocky coastal substrates, and dry sand reflection.",
    coastalRole: "Pinpoints rocky headlands (e.g. St. Mary's Island, Kaup rocks) and separates them from sandy spits.",
    projectUsage: "Red channel of SWIR composite and channel 9 of the 9-channel input tensor."
  }
];

// SECTION A: SENTINEL-1 RADAR PRODUCTS
const SENTINEL_1_PRODUCTS = [
  {
    id: "vv",
    name: "VV Polarization Backscatter",
    type: "Co-Polarization (Vertical Transmit / Vertical Receive)",
    wavelength: "C-Band (5.405 GHz / 5.6 cm)",
    image: "/satellite_bands/s1_vv_radar.png",
    desc: "Measures rough surface scattering. Calm open water acts as a specular mirror reflecting radar pulses away (appears dark, -24 to -20 dB). Rough land and urban structures scatter energy back (appears bright, -12 to -6 dB).",
    role: "Provides unambiguous cloud-penetrating water-land boundary contrast even during the torrential monsoon season."
  },
  {
    id: "vh",
    name: "VH Polarization Backscatter",
    type: "Cross-Polarization (Vertical Transmit / Horizontal Receive)",
    wavelength: "C-Band (5.405 GHz / 5.6 cm)",
    image: "/satellite_bands/s1_vh_radar.png",
    desc: "Sensitive to volume scattering from depolarizing coastal vegetation (mangroves, coconut groves, casuarina plantations). Ocean water has near-zero depolarization and appears extremely dark.",
    role: "Differentiates coastal vegetated buffers and wetlands from open water and bare sand bars."
  },
  {
    id: "ratio",
    name: "VV / VH Polarimetric Ratio",
    type: "Polarization Ratio Metric",
    wavelength: "Dimensionless Ratio",
    image: "/satellite_bands/s1_vv_vh_ratio.png",
    desc: "Normalizes surface roughness against volume scattering, isolating intertidal wet beach sand and removing surface wind-wave clutter.",
    role: "Used as an enhancement layer for automated coastline edge detection in radar tensors."
  },
  {
    id: "composite",
    name: "Dual-Pol SAR Composite",
    type: "RGB SAR Composite (R=VV, G=VH, B=VV/VH)",
    wavelength: "False-Colour Radar Composite",
    image: "/satellite_bands/s1_sar_composite.png",
    desc: "A scientifically calibrated false-colour radar image where land features show in shades of yellow/cyan, while the Arabian Sea is uniformly dark purple/black.",
    role: "Visual interpretation product demonstrating Sentinel-1's capability to see through heavy monsoonal cloud decks."
  }
];

// SECTION B: SATELLITE BAND COMPOSITES
const BAND_COMPOSITES = {
  natural: {
    title: "Natural Colour Composite (True Colour)",
    rgb: "RGB = B4 (Red), B3 (Green), B2 (Blue)",
    image: "/satellite_bands/composite_natural_color.png",
    channels: [
      { color: "Red", band: "B4 (Red - 665nm)", role: "Absorbed by water, reflects land and structures." },
      { color: "Green", band: "B3 (Green - 560nm)", role: "Reflects shallow water sediment and healthy green vegetation." },
      { color: "Blue", band: "B2 (Blue - 490nm)", role: "Penetrates water columns, rendering ocean blue/cyan." }
    ],
    explanation: "Replicates natural human vision. Sandy beaches appear pale yellow, coastal vegetation appears green, and oceanic waters appear deep blue. Ideal for intuitive ground validation and visual shoreline orientation."
  },
  false_veg: {
    title: "False Colour Vegetation Composite (CIR)",
    rgb: "RGB = B8 (NIR), B4 (Red), B3 (Green)",
    image: "/satellite_bands/composite_false_color_vegetation.png",
    channels: [
      { color: "Red", band: "B8 (NIR - 842nm)", role: "Chlorophyll plateau reflects intensely; vegetation shows vibrant red/magenta." },
      { color: "Green", band: "B4 (Red - 665nm)", role: "Highlights bare soil and sand." },
      { color: "Blue", band: "B3 (Green - 560nm)", role: "Provides background water contrast." }
    ],
    explanation: "The standard remote sensing composite for coastal vegetation monitoring. Healthy vegetation reflects near-infrared intensely and appears bright crimson red. Water absorbs NIR completely and appears deep black/cyan, creating an razor-sharp coastline boundary."
  },
  swir: {
    title: "Shortwave Infrared Composite (SWIR)",
    rgb: "RGB = B12 (SWIR-2), B8A (Narrow NIR), B4 (Red)",
    image: "/satellite_bands/composite_swir.png",
    channels: [
      { color: "Red", band: "B12 (SWIR-2 - 2190nm)", role: "Penetrates atmospheric haze and aerosol layers." },
      { color: "Green", band: "B8A (Narrow NIR - 865nm)", role: "Accurately maps moisture in coastal soil." },
      { color: "Blue", band: "B4 (Red - 665nm)", role: "Separates urban built-up areas and roads." }
    ],
    explanation: "Penetrates coastal haze, sea spray, and thin clouds. Saturated intertidal mudflats and wet sands appear dark cyan/brown, while dry sandy dunes and seawalls appear bright orange/yellow, providing crucial beach slope cues."
  },
  moisture: {
    title: "Moisture / Water Boundary Composite",
    rgb: "RGB = B8 (NIR), B11 (SWIR-1), B4 (Red)",
    image: "/satellite_bands/composite_water_index.png",
    channels: [
      { color: "Red", band: "B8 (NIR - 842nm)", role: "Sharp boundary between water absorption and land reflection." },
      { color: "Green", band: "B11 (SWIR-1 - 1610nm)", role: "High sensitivity to soil water content." },
      { color: "Blue", band: "B4 (Red - 665nm)", role: "Distinguishes beach sand mineral reflectivity." }
    ],
    explanation: "Specifically designed for intertidal coastal zone extraction. Maximizes the gradient between saturated sand at the swash zone and unsaturated backshore sand."
  }
};

// SECTION C: 8-STAGE NDWI WATER EXTRACTION PIPELINE
const NDWI_STEPS = [
  {
    step: 1,
    title: "Original Multi-Spectral Satellite Image",
    subtitle: "Sentinel-2 Level-2A BOA Optical Acquisition",
    image: "/ndwi_pipeline/step1_original_optical.png",
    desc: "Calibrated 10m spatial resolution multi-spectral reflectance acquisition over the Udupi coastal zone."
  },
  {
    step: 2,
    title: "Dual Band Inputs: Green (B3) & NIR (B8)",
    subtitle: "Spectral Wavelength Selection",
    image: "/ndwi_pipeline/step2_green_nir_inputs.png",
    desc: "Green band (B3) exhibits high water reflectance, while Near-Infrared (B8) exhibits near-total water absorption."
  },
  {
    step: 3,
    title: "Normalized Difference Water Index (NDWI)",
    subtitle: "Mathematical Ratio Calculation",
    image: "/ndwi_pipeline/step3_ndwi_raw_index.png",
    desc: "Computed formula: NDWI = (Green - NIR) / (Green + NIR). Values range from -1.0 (pure vegetation/dry land) to +1.0 (pure water)."
  },
  {
    step: 4,
    title: "Scientific Diverging Colormap Visualization",
    subtitle: "Diverging Water/Land Contrast Mapping",
    image: "/ndwi_pipeline/step4_ndwi_colormap.png",
    desc: "Positive index values (>0.0, blue/cyan) represent water bodies, while negative values (<=0.0, brown/red) denote terrestrial land."
  },
  {
    step: 5,
    title: "Otsu Adaptive Histogram Thresholding",
    subtitle: "Optimal Variance Separation (T* = 0.00)",
    image: "/ndwi_pipeline/step5_otsu_thresholding.png",
    desc: "Automatically splits the bimodal NDWI pixel distribution into water and land classes without arbitrary manual threshold bias."
  },
  {
    step: 6,
    title: "Binary Water / Land Segmentation Mask",
    subtitle: "Initial Discrete Raster Output",
    image: "/ndwi_pipeline/step6_binary_water_mask.png",
    desc: "Discrete binary raster where Water = 1 (White) and Land = 0 (Black), defining preliminary coastal boundaries."
  },
  {
    step: 7,
    title: "Morphological Cleaning & Filtering",
    subtitle: "Opening & Closing Operations (5x5 Kernel)",
    image: "/ndwi_pipeline/step7_morphological_cleaning.png",
    desc: "Morphological opening eliminates ocean whitecap noise and isolated wave crests; closing fills intertidal holes in sandy barrier spits."
  },
  {
    step: 8,
    title: "Final Extracted Coastline Vector Contour",
    subtitle: "Sub-Pixel Boundary Line Generation",
    image: "/ndwi_pipeline/step8_extracted_coastline_contour.png",
    desc: "Sobel-gradient vector contour extraction delineates the continuous high-precision coastline overlay shown in pink."
  }
];

// SECTION D: TRAINING SAMPLES (PATCH TRIADS)
const TRAINING_SAMPLES = {
  sample1: {
    id: "sample1",
    name: "Bengre Sand Spit & Swarna-Sita Estuary",
    location: "Bengre Spit (13.35°N, 74.68°E)",
    desc: "Highly dynamic sandy barrier spit where tidal flushing and longshore drift cause severe seasonal inlet migration.",
    input: "/training_samples/sample1_input.png",
    gt: "/training_samples/sample1_gt.png",
    pred: "/training_samples/sample1_pred.png",
    dice: "0.8624",
    iou: "0.758"
  },
  sample2: {
    id: "sample2",
    name: "Malpe Port & North Breakwater",
    location: "Malpe Harbour (13.36°N, 74.70°E)",
    desc: "Artificial hard structure armoring; artificial breakwaters cause downdrift sand accretion to the south and erosion to the north.",
    input: "/training_samples/sample2_input.png",
    gt: "/training_samples/sample2_gt.png",
    pred: "/training_samples/sample2_pred.png",
    dice: "0.8512",
    iou: "0.741"
  },
  sample3: {
    id: "sample3",
    name: "Padubidri Armored Beach & Groynes",
    location: "Padubidri Coast (13.14°N, 74.78°E)",
    desc: "Mixed coastline with riprap seawalls and rock groynes, showing downdrift scouring on adjacent unprotected beaches.",
    input: "/training_samples/sample3_input.png",
    gt: "/training_samples/sample3_gt.png",
    pred: "/training_samples/sample3_pred.png",
    dice: "0.8580",
    iou: "0.751"
  },
  sample4: {
    id: "sample4",
    name: "Kaup Rocky Headland & Lighthouse Bay",
    location: "Kaup Beach (13.22°N, 74.74°E)",
    desc: "Natural granitic rock outcrops creating pocket beaches with localized wave refraction patterns.",
    input: "/training_samples/sample4_input.png",
    gt: "/training_samples/sample4_gt.png",
    pred: "/training_samples/sample4_pred.png",
    dice: "0.8490",
    iou: "0.738"
  }
};

// SECTION E: DEEPLABV3+ ARCHITECTURAL BLOCKS
const ARCHITECTURE_BLOCKS = [
  {
    id: "input",
    title: "1. 9-Channel Fused Input Tensor",
    badge: "Input Dimension: [9, 256, 256]",
    desc: "Modified from standard 3-channel RGB to ingest all 7 Sentinel-2 optical bands (B2, B3, B4, B8, B8A, B11, B12) plus 2 Sentinel-1 SAR C-band radar channels (VV, VH) simultaneously.",
    formula: "X \\in \\mathbb{R}^{9 \\times 256 \\times 256}"
  },
  {
    id: "encoder",
    title: "2. ResNet-34 Feature Extractor",
    badge: "Deep Feature Hierarchy",
    desc: "Extracts low-level edge features (conv1) and high-level semantic land/water abstractions (layer4) with residual skip connections preventing gradient vanishing.",
    formula: "\\text{Features: } C_2 (64\\text{ ch}), C_5 (512\\text{ ch})"
  },
  {
    id: "aspp",
    title: "3. Atrous Spatial Pyramid Pooling (ASPP)",
    badge: "Multi-Scale Receptive Fields",
    desc: "Applies parallel dilated convolutions with dilation rates 6, 12, and 18, plus global average pooling. Captures regional oceanic scale and fine intertidal beach geometry concurrently.",
    formula: "\\text{Dilations } r \\in \\{1, 6, 12, 18\\} + \\text{Global Pool}"
  },
  {
    id: "decoder",
    title: "4. Lightweight Convolutional Decoder",
    badge: "Multi-Level Feature Fusion",
    desc: "Concatenates ASPP high-level semantic features with 4x upsampled low-level edge features from the encoder, sharpening sharp coastline boundaries.",
    formula: "\\text{Concat}(ASPP_{up}, \\text{Conv}(C_2))"
  },
  {
    id: "upsample",
    title: "5. Bilinear Upsampling & Sigmoid",
    badge: "Pixel Probability Map",
    desc: "Recovers original [256, 256] spatial resolution and outputs continuous per-pixel water probability map through a sigmoid activation layer.",
    formula: "\\hat{Y} = \\sigma(W * F_{dec}) \\in [0, 1]^{256 \\times 256}"
  },
  {
    id: "loss",
    title: "6. Combined BCE + Dice Loss Function",
    badge: "Asymptotic Minimum: 0.4304",
    desc: "Trained over 15 epochs using combined Binary Cross-Entropy (per-pixel accuracy) and Dice Loss (boundary overlap optimization) with Adam optimizer (lr = 1e-4).",
    formula: "\\mathcal{L} = \\mathcal{L}_{BCE} + (1 - \\frac{2|X \\cap Y| + 1}{|X| + |Y| + 1})"
  }
];

// SECTION G: HISTORICAL YEARS DATA
const HISTORICAL_YEARS = {
  2020: {
    year: 2020,
    title: "2020 Baseline Satellite Observation",
    image: "/shoreline/2020.png",
    retreat: "0.0 m (Reference Baseline)",
    status: "Baseline Reference Epoch",
    desc: "First multi-sensor Sentinel acquisition establishing the reference zero-line across all 1,944 baseline transects."
  },
  2021: {
    year: 2021,
    title: "2021 Post-Monsoon Shoreline Shift",
    image: "/shoreline/2021.png",
    retreat: "-1.82 m Mean Net Retreat",
    status: "Moderate Post-Monsoon Landward Shift",
    desc: "Initial landward shift recorded along central sandy spits following heavy 2021 southwest monsoonal storm surges."
  },
  2022: {
    year: 2022,
    title: "2022 Mid-Term Coastal Monitoring",
    image: "/shoreline/2022.png",
    retreat: "-3.45 m Mean Net Retreat",
    status: "Persistent Retreat at Bengre & Malpe",
    desc: "Noticeable beach narrowing and estuarine inlet widening observed at the Bengre spit and Padubidri south beach."
  },
  2023: {
    year: 2023,
    title: "2023 Accelerating Erosion Phase",
    image: "/shoreline/2023.png",
    retreat: "-4.91 m Mean Net Retreat",
    status: "Severe Retreat Along 18.2 km Reach",
    desc: "Accelerated landward retreat in unarmored coastal zones, with localized downdrift scouring south of Malpe jetties."
  },
  2024: {
    year: 2024,
    title: "2024 Latest Observed Shoreline",
    image: "/shoreline/2024.png",
    retreat: "-6.24 m Cumulative 4-Year Shift",
    status: "Final Validated Observation Epoch",
    desc: "Latest empirical satellite observation epoch confirming 4-year End Point Rates (EPR) reaching up to -40 m/yr at hotspots."
  }
};

// SECTION J: FUTURE PREDICTION YEARS
const FUTURE_YEARS = {
  2025: {
    year: 2025,
    status: "Projected Short-Term Kinematics",
    meanShift: "-1.21 m",
    landLoss: "2.14 hectares",
    riskTier: "Tier III - Low to Moderate Risk",
    desc: "First-year linear EPR forward projection assuming persistent historical wave energy regimes and sediment transport vectors."
  },
  2026: {
    year: 2026,
    status: "Projected 2-Year Horizon",
    meanShift: "-1.98 m",
    landLoss: "3.20 hectares",
    riskTier: "Tier II - Elevated Risk",
    desc: "Continued gradual beach profile steepening along unprotected coastal stretches between Kaup and Padubidri."
  },
  2027: {
    year: 2027,
    status: "Projected 3-Year Horizon",
    meanShift: "-2.72 m",
    landLoss: "4.21 hectares",
    riskTier: "Tier II - High Risk",
    desc: "Projected cumulative loss crosses 4 hectares; coastal infrastructure setback enforcement strongly recommended."
  },
  2028: {
    year: 2028,
    status: "Projected 4-Year Horizon",
    meanShift: "-4.33 m",
    landLoss: "6.05 hectares",
    riskTier: "Tier II+ - Critical Vulnerability",
    desc: "Simulated landward breach threat near Bengre sand spit, requiring active soft nourishment or bio-shield groynes."
  },
  2029: {
    year: 2029,
    status: "Projected 5-Year Horizon (Final Benchmark)",
    meanShift: "-5.94 m",
    landLoss: "7.88 hectares",
    riskTier: "Tier I - Severe Emergency Vulnerability",
    desc: "Total projected cumulative land loss reaches 7.88 hectares with peak hotspot retreat reaching -24.0 m at fragile barrier spits."
  }
};

// CENTRALIZED RESEARCH LIBRARY ASSETS
const LIBRARY_ASSETS = [
  { id: "lib-1", title: "Sentinel-2 Natural Colour Composite (B4, B3, B2)", category: "Band Composites", image: "/satellite_bands/composite_natural_color.png", desc: "True colour optical representation of Udupi coastline." },
  { id: "lib-2", title: "Sentinel-2 False Colour Vegetation (B8, B4, B3)", category: "Band Composites", image: "/satellite_bands/composite_false_color_vegetation.png", desc: "Infrared composite rendering vegetation in crimson red." },
  { id: "lib-3", title: "Sentinel-2 SWIR Composite (B12, B8A, B4)", category: "Band Composites", image: "/satellite_bands/composite_swir.png", desc: "Haze-penetrating shortwave infrared coastal composite." },
  { id: "lib-4", title: "Sentinel-1 Dual-Pol SAR Composite (VV/VH)", category: "Sentinel-1 Bands", image: "/satellite_bands/s1_sar_composite.png", desc: "C-band synthetic aperture radar false colour composite." },
  { id: "lib-5", title: "Sentinel-1 VV Backscatter Map", category: "Sentinel-1 Bands", image: "/satellite_bands/s1_vv_radar.png", desc: "Calm water specular reflection vs rough land scattering." },
  { id: "lib-6", title: "Sentinel-1 VH Polarization Map", category: "Sentinel-1 Bands", image: "/satellite_bands/s1_vh_radar.png", desc: "Cross-polarized radar volume scattering from vegetation." },
  { id: "lib-7", title: "Sentinel-2 B8 Near-Infrared Band", category: "Sentinel-2 Bands", image: "/satellite_bands/s2_b8_nir.png", desc: "Near-total water absorption band at 842 nm." },
  { id: "lib-8", title: "Sentinel-2 B3 Green Band", category: "Sentinel-2 Bands", image: "/satellite_bands/s2_b3_green.png", desc: "Primary numerator spectral band for NDWI at 560 nm." },
  { id: "lib-9", title: "NDWI Continuous Index Matrix", category: "NDWI Outputs", image: "/ndwi_pipeline/step3_ndwi_raw_index.png", desc: "Normalized difference water index floating point matrix." },
  { id: "lib-10", title: "NDWI Colormap Contrast Map", category: "NDWI Outputs", image: "/ndwi_pipeline/step4_ndwi_colormap.png", desc: "Blue/cyan water vs brown/red terrestrial contrast." },
  { id: "lib-11", title: "Otsu Adaptive Threshold Histogram", category: "NDWI Outputs", image: "/ndwi_pipeline/step5_otsu_thresholding.png", desc: "Bimodal histogram split separating water from land." },
  { id: "lib-12", title: "Final Extracted Coastline Vector", category: "NDWI Outputs", image: "/ndwi_pipeline/step8_extracted_coastline_contour.png", desc: "Cleaned sub-pixel vector contour traced along water edge." },
  { id: "lib-13", title: "Training Sample 1: Bengre Sand Spit", category: "Training Dataset", image: "/training_samples/sample1_input.png", desc: "Multi-spectral 9-channel patch over dynamic barrier spit." },
  { id: "lib-14", title: "Ground Truth Mask: Bengre Spit", category: "Ground Truth Masks", image: "/training_samples/sample1_gt.png", desc: "Rasterized verified target mask (0=Land, 1=Water)." },
  { id: "lib-15", title: "DeepLabV3+ Predicted: Bengre Spit", category: "Model Predictions", image: "/training_samples/sample1_pred.png", desc: "Model output achieving 0.8624 Dice score on test patch." },
  { id: "lib-16", title: "Training Sample 2: Malpe Breakwaters", category: "Training Dataset", image: "/training_samples/sample2_input.png", desc: "Multi-spectral patch over Malpe port breakwater structures." },
  { id: "lib-17", title: "DeepLabV3+ Training Loss Curve", category: "Training Evidence", image: "/slide10_loss_graph.png", desc: "BCE + Dice loss convergence over 15 training epochs." },
  { id: "lib-18", title: "DeepLabV3+ Validation Report (85.48%)", category: "Validation Evidence", image: "/env_ml_report_deeplab.png", desc: "Official precision, recall, and 0.8548 Dice benchmark report." },
  { id: "lib-19", title: "DeepLabV3+ Confusion Matrix", category: "Validation Evidence", image: "/env_ml_confusion_matrix_deeplab.png", desc: "Validation confusion matrix across land and water classes." },
  { id: "lib-20", title: "Random Forest Baseline Confusion Matrix", category: "Validation Evidence", image: "/env_ml_confusion_matrix_rf.png", desc: "51.0% accuracy baseline showing geometric coordinate bias." },
  { id: "lib-21", title: "XGBoost Geometric Classifier Matrix", category: "Validation Evidence", image: "/env_ml_confusion_matrix_xgb.png", desc: "53.0% accuracy baseline on coordinate features." },
  { id: "lib-22", title: "SVM RBF Kernel Confusion Matrix", category: "Validation Evidence", image: "/env_ml_confusion_matrix_svm.png", desc: "38.0% accuracy baseline with severe kernel collapse." },
  { id: "lib-23", title: "QGIS 1,944 Transects Project View", category: "QGIS Screenshots", image: "/geospatial_verification/qgis_transects_overview.png", desc: "1,944 orthogonal transects cast at 50m intervals in QGIS." },
  { id: "lib-24", title: "Google Earth Pro Ground Truth Comparison", category: "Google Earth Pro Screenshots", image: "/geospatial_verification/google_earth_pro_ground_truth.png", desc: "Sub-meter visual validation of predicted vs digitised shoreline." },
  { id: "lib-25", title: "Figure 2: Longshore EPR Rate Profile", category: "Research Results", image: "/longshore_rate_profile.png", desc: "Alongshore EPR rate distribution across all 1,944 transects." },
  { id: "lib-26", title: "Figure 3: DeepLabV3+ vs GEE Scatter Plot", category: "Research Results", image: "/scatter_rate_comparison.png", desc: "Scatter plot benchmarking DeepLabV3+ against GEE ground truth." },
  { id: "lib-27", title: "Figure 4: Rate Distribution Density (KDE)", category: "Research Results", image: "/rate_distribution_density.png", desc: "Probability density showing leftward skew and chronic erosion." },
  { id: "lib-28", title: "XGBoost Environmental Risk Feature Importance", category: "Research Results", image: "/env_feature_importance.png", desc: "Wave height and monsoon index driving 84.8% hazard accuracy." },
  { id: "lib-29", title: "3-Panel Forecasting Summary (2020–2029)", category: "Research Results", image: "/forecast/final_graph_3panel.jpg", desc: "Integrated movement, land-loss, and vulnerability quantification." }
];

// PRESENTATION SLIDES FOR VIVA PRESENTATION MODE
const PRESENTATION_SLIDES = [
  {
    title: "1. Problem & Udupi Coastal Study Area",
    badge: "SLIDE 01 // PROBLEM CONTEXT",
    image: "/paper_figure1_study_area.png",
    takeaways: [
      "Udupi District Coastline spans ~100 km (97.2 km analyzed) along the Arabian Sea.",
      "High economic vulnerability: Major fishing harbor (Malpe), fragile estuarine sand spits (Bengre), and NH-66 highway corridors.",
      "Extreme southwest monsoon wave action (June–September) causes severe landward retreat up to -40 m/year."
    ]
  },
  {
    title: "2. Multi-Sensor Data Fusion (Sentinel-1 + Sentinel-2)",
    badge: "SLIDE 02 // SATELLITE MODALITIES",
    image: "/satellite_bands/s1_sar_composite.png",
    takeaways: [
      "Optical Limitation: Monsoons bring 100% cloud cover for 4 months, blinding standard optical satellites.",
      "Sentinel-1 SAR C-band radar penetrates cloud decks day and night via microwave backscatter (VV and VH).",
      "Sentinel-2 MSI provides 7 high-resolution optical bands (10m/20m) for sub-pixel spectral water indexing."
    ]
  },
  {
    title: "3. Interactive Spectral Band Combinations",
    badge: "SLIDE 03 // SPECTRAL DISCRIMINATION",
    image: "/satellite_bands/composite_false_color_vegetation.png",
    takeaways: [
      "Natural Colour (B4-B3-B2) replicates human vision for intuitive orientation.",
      "False Colour Vegetation (B8-B4-B3) uses NIR absorption to create a razor-sharp coastline boundary.",
      "SWIR Composite (B12-B8A-B4) penetrates coastal spray and maps moisture gradients across the swash zone."
    ]
  },
  {
    title: "4. Automated NDWI Water Extraction Pipeline",
    badge: "SLIDE 04 // PREPROCESSING CHAIN",
    image: "/ndwi_pipeline/step8_extracted_coastline_contour.png",
    takeaways: [
      "8-stage automated pipeline: Raw Optical -> Dual Inputs -> NDWI -> Colormap -> Otsu -> Binary Mask -> Morphology -> Vector Contour.",
      "Otsu adaptive thresholding eliminates subjective manual operator bias.",
      "Morphological opening/closing removes sea-spray whitecap noise and fills intertidal sandbar voids."
    ]
  },
  {
    title: "5. Inside Our 9-Channel Model Training Dataset",
    badge: "SLIDE 05 // TENSOR ARCHITECTURE",
    image: "/training_samples/sample1_input.png",
    takeaways: [
      "Stacked 9-channel tensor shape: [9, 256, 256] per tile patch.",
      "Sliding window stride of 128 pixels produces 50% spatial overlap for boundary data augmentation.",
      "Strict data filtering: Only shoreline-intersecting tiles with <30% NaN pixels retained across 2020–2024 epochs."
    ]
  },
  {
    title: "6. DeepLabV3+ Neural Architecture & Baseline Collapse",
    badge: "SLIDE 06 // MODEL ARCHITECTURE",
    image: "/env_ml_confusion_matrix_deeplab.png",
    takeaways: [
      "ResNet-34 encoder modified for 9-channel input + Atrous Spatial Pyramid Pooling (ASPP rates 6, 12, 18).",
      "Traditional ML Baseline Failure: Random Forest (51%), XGBoost (53%), and SVM (38%) suffered from geometric blindness on coordinate-only inputs.",
      "DeepLabV3+ achieved 85.48% Dice by learning spatial multi-spectral absorption and texture signatures."
    ]
  },
  {
    title: "7. Model Convergence & Benchmark Validation",
    badge: "SLIDE 07 // EMPIRICAL VALIDATION",
    image: "/slide10_loss_graph.png",
    takeaways: [
      "Validation Dice Score: 0.8548 (85.48% boundary overlap on 25% held-out test split).",
      "Asymptotic loss convergence to 0.4304 combining Binary Cross-Entropy and Dice Loss.",
      "High precision and recall confirm minimal false positive ocean water misclassification."
    ]
  },
  {
    title: "8. Transect Analysis (1,944 Transects) & Kinematic EPR",
    badge: "SLIDE 08 // KINEMATIC ANALYSIS",
    image: "/longshore_rate_profile.png",
    takeaways: [
      "1,944 orthogonal transects cast at exactly 50m intervals along 97.2 km smoothed baseline.",
      "Physics-based tidal elevation correction applied: Delta x = (z_tide - z_MSL) / tan(beta) with tan(beta) = 0.03.",
      "Identifies 3 distinct morphodynamic regimes: Northern Stable (0-200), Central Severe Erosion (200-1400), Southern Moderate Erosion (1400-1944)."
    ]
  },
  {
    title: "9. Geospatial Verification (QGIS & Google Earth Pro)",
    badge: "SLIDE 09 // GROUND VERIFICATION",
    image: "/geospatial_verification/google_earth_pro_ground_truth.png",
    takeaways: [
      "Sub-meter visual validation against high-resolution Google Earth Pro historical aerial basemaps.",
      "Manually digitised reference lines verify AI predicted boundaries around seawalls and harbour groynes.",
      "Topological vector cleaning and coordinate reprojection verified in QGIS (EPSG:32643 UTM Zone 43N)."
    ]
  },
  {
    title: "10. Future Shoreline Forecasting & Land Loss (2025–2029)",
    badge: "SLIDE 10 // FUTURE PROJECTIONS",
    image: "/forecast/final_graph_3panel.jpg",
    takeaways: [
      "Linear kinematic extrapolation indicates progressive landward shift: 2027 (-2.72m), 2028 (-4.33m), 2029 (-5.94m).",
      "Cumulative coastal land loss projected to reach 7.88 hectares by 2029.",
      "Downstream XGBoost hazard classifier (84.8% accuracy) maps coastal risk tiers based on monsoonal wave heights."
    ]
  }
];

// ============================================================================
// 18 RESEARCH & EVIDENCE MODULAR SECTIONS DIRECTORY
// ============================================================================

const BAND_COLOR_SPECS = {
  "B2": { swatch: "#3b82f6", label: "490 nm (Blue - 10m)" },
  "B3": { swatch: "#10b981", label: "560 nm (Green - 10m)" },
  "B4": { swatch: "#ef4444", label: "665 nm (Red - 10m)" },
  "B8": { swatch: "#ec4899", label: "842 nm (NIR - 10m)" },
  "B11": { swatch: "#f59e0b", label: "1610 nm (SWIR-1 - 20m)" },
  "B12": { swatch: "#8b5cf6", label: "2190 nm (SWIR-2 - 20m)" },
  "VV": { swatch: "#06b6d4", label: "5.405 GHz (C-Band Co-Pol)" },
  "VH": { swatch: "#a855f7", label: "5.405 GHz (C-Band Cross-Pol)" },
  "VV/VH": { swatch: "#f43f5e", label: "Dual-Pol Ratio Index" }
};




const RESEARCH_CHAPTERS = [
  {
    id: "sentinel-bands",
    num: "01",
    title: "Sentinel Satellite Bands",
    subtitle: "Complete Optical & SAR Radar Bands Inventory",
    icon: Layers,
    color: "cyan",
    tag: "Satellite Input",
    desc: "Complete inventory of Sentinel-2 multi-spectral bands (B2–B12) and Sentinel-1 SAR dual-polarisation (VV/VH) radar products with calibrated colour swatches."
  },
  {
    id: "sentinel-1-sar",
    num: "02",
    title: "Sentinel-1 SAR Radar Analysis",
    subtitle: "Cloud-Penetrating C-Band Microwave Radar",
    icon: Radio,
    color: "pink",
    highlight: "pink",
    tag: "Active Microwave",
    desc: "Detailed SAR GRD radar analysis showing dielectric surface roughness, backscatter contrast between land and water, and all-weather monsoon coastline tracing."
  },
  {
    id: "sentinel-2-optical",
    num: "03",
    title: "Sentinel-2 Optical Multi-Spectral Analysis",
    subtitle: "10m Resolution Optical Sensor Suite",
    icon: Sun,
    color: "cyan",
    tag: "Passive Multi-Spectral",
    desc: "MSI multi-spectral bands analysis, atmospheric reflectance profiles, QA60 cloud probability masking, and spectral discrimination of turbid surf zones."
  },
  {
    id: "band-composites",
    num: "04",
    title: "Band Combinations & Visualization",
    subtitle: "Natural Color, False Color NIR & SWIR Composites",
    icon: Eye,
    color: "pink",
    highlight: "pink",
    tag: "Interactive Split Slider",
    desc: "Interactive before/after split slider comparing True Color (B4-B3-B2), Color Infrared (B8-B4-B3), and SWIR Water Penetration (B12-B8-B4)."
  },
  {
    id: "dataset-processing",
    num: "05",
    title: "Dataset Collection & Verified Image Counts",
    subtitle: "1,420 Patches // 12,780 Slices // Drive Proofs",
    icon: Database,
    color: "cyan",
    tag: "Verified Master Repos",
    desc: "1,420 high-resolution training patches, 12,780 multi-spectral slices across 9 channels, patch triads, and direct verified Google Drive dataset folders."
  },
  {
    id: "gee-pipeline",
    num: "06",
    title: "Google Earth Engine & NDWI Pipeline",
    subtitle: "8-Stage Automated Coastal Water Extraction",
    icon: Activity,
    color: "emerald",
    tag: "GEE Cloud Processing",
    desc: "Automated 8-step pipeline: harmonized median composites, NDWI zero-crossing water separation, Otsu dynamic thresholding, and morphological spit closure."
  },
  {
    id: "colab-training",
    num: "07",
    title: "Google Colab & Deep Learning Training",
    subtitle: "PyTorch 2.0 // Compound BCE+Dice Loss // Convergence",
    icon: Zap,
    color: "emerald",
    highlight: "cyan",
    tag: "Training Pipeline",
    desc: "Compound loss function (0.5 BCE + 0.5 Dice), 40 epoch training curves, Google Colab runtime logs, GPU acceleration, and convergence at loss 0.4304."
  },
  {
    id: "graphs-metrics",
    num: "08",
    title: "Graphs & Statistical Comparisons",
    subtitle: "Confusion Matrix // Dice 85.48% // IoU 74.65%",
    icon: BarChart3,
    color: "cyan",
    tag: "Performance Metrics",
    desc: "High-resolution confusion matrix, precision-recall trade-offs, spatial dice coefficient comparisons, and quantitative error distributions."
  },
  {
    id: "coastline-animation",
    num: "09",
    title: "Coastline Change Dynamics Animation",
    subtitle: "Multi-Temporal Shoreline Migration GIF & Video",
    icon: Tv,
    color: "pink",
    highlight: "pink",
    tag: "Multi-Temporal Dynamics",
    desc: "Continuous multi-temporal shoreline dynamics loop animation depicting 4-year coastal retreat, spit breaches, and dynamic accretion zones."
  },
  {
    id: "historical-comparison",
    num: "10",
    title: "Historical Coastline Comparison (2020–2024)",
    subtitle: "Empirical Satellite Vector Epochs & Interactive Slider",
    icon: Calendar,
    color: "emerald",
    tag: "Observed Ground Truth",
    desc: "Year-by-year observed satellite coastline vectors (2020 to 2024), net -6.24m shift, and interactive before-and-after slider comparing baseline vs 2024."
  },
  {
    id: "malpe-analysis",
    num: "11",
    title: "Malpe Beach & Bengre Sandspit Analysis",
    subtitle: "High-Risk Erosion Hotspot & Harbour Jetties",
    icon: MapPin,
    color: "pink",
    highlight: "pink",
    tag: "Field Case Study",
    desc: "Critical erosion hotspot analysis at Bengre Sandspit, hydrodynamic wave diffraction at Malpe Fishing Harbour groynes, and beach slope calibration (tan β = 0.03)."
  },
  {
    id: "other-beaches",
    num: "12",
    title: "Kaup, Padubidri & Regional Beach Analysis",
    subtitle: "Accretion Zones, Headlands & Multi-Location Transects",
    icon: Compass,
    color: "cyan",
    tag: "Regional Spatial Variance",
    desc: "Comparative beach morphodynamics: Padubidri Blue Flag Beach accretion, Kaup rocky basalt headlands, and shoreline stability across Udupi's 97.2 km coast."
  },
  {
    id: "ml-models",
    num: "13",
    title: "Deep Learning vs Traditional ML Models",
    subtitle: "DeepLabV3+ Semantic Segmentation vs Coordinate ML",
    icon: Cpu,
    color: "pink",
    tag: "Architecture Benchmark",
    desc: "Detailed evaluation explaining why traditional ML models (Random Forest, SVM, XGBoost) fail spatial continuity, and why DeepLabV3+ achieves 85.48% Dice score."
  },
  {
    id: "methodology",
    num: "14",
    title: "Research Methodology & Geospatial Physics",
    subtitle: "Integrated Pipeline // Tidal Datum // DSAS Physics",
    icon: ShieldCheck,
    color: "emerald",
    tag: "End-to-End Workflow",
    desc: "Comprehensive 4-phase methodology: GEE cloud extraction, 9-channel PyTorch segmentation, astronomical tidal correction, and orthogonal transect kinematics."
  },
  {
    id: "validation-accuracy",
    num: "15",
    title: "QGIS & Google Earth Pro Verification",
    subtitle: "1,944 Transects @ 50m Spacing // Sub-meter Validation",
    icon: ShieldCheck,
    color: "emerald",
    highlight: "cyan",
    tag: "Spatial Ground Truth",
    desc: "Sub-meter manual digitization on Google Earth Pro historical aerials verifying DeepLabV3+ predicted shorelines along 1,944 perpendicular transects."
  },
  {
    id: "transect-kinematics",
    num: "16",
    title: "Transect Kinematics & DSAS Erosion Analysis",
    subtitle: "End Point Rate (EPR) // Tidal Datum // 7.88 ha Loss",
    icon: TrendingUp,
    color: "pink",
    tag: "Quantitative Physics",
    desc: "Digital Shoreline Analysis System (DSAS) kinematics, in-situ astronomical tidal datum correction, critical hotspots reaching -40 m/yr, and 7.88 ha net land loss."
  },
  {
    id: "future-predictions",
    num: "17",
    title: "Future Shoreline Predictions (2025–2029)",
    subtitle: "Machine Learning Downstream Forecasting // Fig. 5",
    icon: Sparkles,
    color: "cyan",
    tag: "Forecast Horizons",
    desc: "Multi-year forecasting horizons, explanation of verified data gap (2025-2026), downscaled coastal risk classification, and vulnerability mapping."
  },
  {
    id: "results-gallery",
    num: "18",
    title: "Centralized Results & Evidence Gallery",
    subtitle: "29 Filterable Research Artifacts // Colab & Drive Proofs",
    icon: BookOpen,
    color: "emerald",
    tag: "Centralized Repository",
    desc: "Searchable and filterable master evidence catalog containing raw satellite bands, Colab code runs, confusion matrices, QGIS projects, and field validation."
  }
];

function EvidenceLab() {
  // Modular Chapter View State: null = Hub Landing, string = chapter ID
  const [activeCategory, setActiveCategory] = useState(null);
  const [hubFilterTab, setHubFilterTab] = useState("all");

  const currentChapterIndex = activeCategory
    ? RESEARCH_CHAPTERS.findIndex((c) => c.id === activeCategory)
    : -1;
  const currentChapter =
    currentChapterIndex >= 0 ? RESEARCH_CHAPTERS[currentChapterIndex] : null;

  const goToChapter = (id) => {
    setActiveCategory(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredChapters = RESEARCH_CHAPTERS.filter((ch) => {
    if (hubFilterTab === "all") return true;
    if (hubFilterTab === "satellite")
      return ["sentinel-bands", "sentinel-1-sar", "sentinel-2-optical", "band-composites"].includes(ch.id);
    if (hubFilterTab === "ai")
      return ["dataset-processing", "gee-pipeline", "colab-training", "graphs-metrics", "ml-models"].includes(ch.id);
    if (hubFilterTab === "kinematics")
      return ["coastline-animation", "historical-comparison", "malpe-analysis", "other-beaches"].includes(ch.id);
    if (hubFilterTab === "validation")
      return ["methodology", "validation-accuracy", "transect-kinematics", "future-predictions", "results-gallery"].includes(ch.id);
    return true;
  });

  const navigateToSection = (target) => {
    const sectionToChapter = {
      "section-bands": "sentinel-bands",
      "section-sar-standalone": "sentinel-1-sar",
      "section-optical-standalone": "sentinel-2-optical",
      "section-composites": "band-composites",
      "section-dataset": "dataset-processing",
      "section-ndwi": "gee-pipeline",
      "section-colab-training-standalone": "colab-training",
      "section-performance": "graphs-metrics",
      "section-anim": "coastline-animation",
      "section-anim-standalone": "coastline-animation",
      "section-historical": "historical-comparison",
      "section-malpe-standalone": "malpe-analysis",
      "section-beaches-standalone": "other-beaches",
      "section-architecture": "ml-models",
      "section-methodology-standalone": "methodology",
      "section-geospatial": "validation-accuracy",
      "section-transects": "transect-kinematics",
      "section-future": "future-predictions",
      "section-library": "results-gallery"
    };
    const chapterId = sectionToChapter[target] || target;
    setActiveCategory(chapterId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = navigateToSection;

  // Navigation & UI States
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [vivaGuideOpen, setVivaGuideOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Section B: Band Combinations State
  const [selectedComposite, setSelectedComposite] = useState("natural");
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef(null);

  // Section C: NDWI Pipeline State
  const [activeNdwiStep, setActiveNdwiStep] = useState(1);

  // Section D: Training Samples State
  const [selectedTrainingSample, setSelectedTrainingSample] = useState("sample1");

  // Section E: Model Architecture State
  const [activeArchBlock, setActiveArchBlock] = useState("input");

  // Section G: Historical Timeline State
  const [activeHistoricalYear, setActiveHistoricalYear] = useState(2024);
  const [historySliderPos, setHistorySliderPos] = useState(50);
  const historySliderRef = useRef(null);

  // Section J: Future Timeline State
  const [activeFutureYear, setActiveFutureYear] = useState(2029);

  // Section K: Research Library State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLibCategory, setSelectedLibCategory] = useState("All");

  // Section D: Verified Drive Proof Explorer State
  const [showAllDriveFiles, setShowAllDriveFiles] = useState(false);

  // Shoreline Animation Modal State (Google Drive: 1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4)
  const [animModalOpen, setAnimModalOpen] = useState(false);

  // Keyboard navigation & Escape key handler for all image viewers and modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedImage) setSelectedImage(null);
        if (animModalOpen) setAnimModalOpen(false);
        if (presentationMode) setPresentationMode(false);
        return;
      }
      if (!presentationMode) return;
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(prev + 1, PRESENTATION_SLIDES.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentationMode, selectedImage, animModalOpen]);

  // Lock and restore body scrolling when any modal or lightbox is open, and toggle lightbox-active class
  useEffect(() => {
    const isAnyModalOpen = Boolean(selectedImage || animModalOpen || presentationMode);
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("lightbox-active");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("lightbox-active");
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("lightbox-active");
    };
  }, [selectedImage, animModalOpen, presentationMode]);



  // Filter Research Library
  const filteredLibrary = LIBRARY_ASSETS.filter((item) => {
    const matchesCat = selectedLibCategory === "All" || item.category === selectedLibCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <PageReveal>
      <main className="evidence-lab-page">

        {/* ========================================================
            HERO PORTAL HEADER WITH PRESENTATION MODE TRIGGER
            ======================================================== */}
        <section className="evidence-hero">
          <div className="evidence-lab-badge">
            <ShieldCheck size={16} />
            <span>REMOTE SENSING &amp; DEEP LEARNING EMPIRICAL EVIDENCE PORTAL</span>
          </div>

          <h1 className="evidence-hero-title">
            Research &amp; Evidence Lab
          </h1>

          <p className="evidence-hero-subtitle">
            An interactive scientific visualization platform documenting satellite data collection,
            spectral band composites, NDWI water extraction, DeepLabV3+ 9-channel training,
            and kinematic shoreline validation across the Udupi coastline (2020–2029).
          </p>

          {/* Action Buttons: Viva Mode + Unique Shoreline Animation Trigger */}
          <div className="presentation-mode-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <button
              className="btn-presentation-mode"
              onClick={() => {
                setPresentationMode(true);
                setCurrentSlide(0);
              }}
            >
              <Tv size={18} />
              <span>Enter Viva Presentation Mode (Full-Screen Visual Tour)</span>
              <Sparkles size={16} />
            </button>

            <button
              className="btn-unique-anim-trigger"
              onClick={() => setAnimModalOpen(true)}
              title="Play empirical multi-temporal satellite shoreline animation"
            >
              <div className="anim-pulse-ring">
                <div className="anim-pulse-core" />
              </div>
              <span className="btn-text-glow">▶ Shoreline Dynamics Animation (2020–2024)</span>
              <span className="btn-chip-tag">DRIVE PROOF</span>
            </button>
          </div>

          {/* Study Area & Project Provenance Metadata Strip */}
          <div className="study-provenance-grid">
            <div className="provenance-item">
              <span className="lbl"><MapPin size={14} /> STUDY AREA</span>
              <span className="val">Udupi Coast, Karnataka (97.2 km)</span>
              <span className="sub">74.5°–75.2° E, 12.5°–13.5° N (Tile T43PDQ)</span>
            </div>
            <div className="provenance-item">
              <span className="lbl"><Calendar size={14} /> HISTORICAL OBSERVED</span>
              <span className="val">2020 – 2024 (5 Annual Epochs)</span>
              <span className="sub">Sentinel-1 C-Band SAR &amp; Sentinel-2 MSI</span>
            </div>
            <div className="provenance-item">
              <span className="lbl"><TrendingUp size={14} /> PREDICTION HORIZON</span>
              <span className="val">2025 – 2029 (Simulated Extrapolation)</span>
              <span className="sub">Linear EPR Kinematics + XGBoost Hazard Model</span>
            </div>
            <div className="provenance-item highlight">
              <span className="lbl"><Sparkles size={14} /> AI SEGMENTATION MODEL</span>
              <span className="val">DeepLabV3+ (ResNet-34 Backbone)</span>
              <span className="sub">0.8548 Validation Dice Score (85.48%)</span>
            </div>
          </div>
        </section>

        {/* RESEARCH DIRECTORY HUB */}
        
        {!activeCategory && (
          <>
            {/* RESEARCH DIRECTORY HUB */}
<section className="category-hub-container">
          {/* Ambient Cybernetic Radar Mesh Background */}
          <div className="hub-mesh-background" />

          <div className="hub-section-header">
            <span className="hub-section-badge">
              <Sparkles size={14} /> 18 RESEARCH SECTIONS // MODULAR EVIDENCE LAB
            </span>
            <h2 className="hub-title">Research &amp; Evidence Directory</h2>
            <p className="hub-subtitle">
              Select an individual research section below to enter an isolated view with dedicated raw satellite bands, Colab code pipelines, and kinematic models.
            </p>

            {/* Interactive Filter Pills */}
            <div className="hub-filter-tabs-row">
              {[
                { id: "all", label: "All Sections", count: 18 },
                { id: "satellite", label: "Satellite Data & Bands", count: 4 },
                { id: "ai", label: "AI & Model Training", count: 4 },
                { id: "kinematics", label: "Coastline Kinematics", count: 4 },
                { id: "validation", label: "Field Validation & Proofs", count: 6 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`hub-filter-tab ${hubFilterTab === tab.id ? 'active' : ''}`}
                  onClick={() => setHubFilterTab(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span className="tab-count-pill">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="category-cards-grid">
            {filteredChapters.map((ch) => {
              const Icon = ch.icon;
              const colorClass = ch.color ? `color-${ch.color}` : (ch.highlight ? `color-${ch.highlight}` : 'color-cyan');
              const sectionNum = parseInt(ch.num, 10);
              return (
                <div
                  key={ch.id}
                  className={`category-card-pro ${colorClass} ${ch.highlight ? `highlight-${ch.highlight}` : ''}`}
                  onClick={() => goToChapter(ch.id)}
                >
                  <div className="card-top-meta">
                    <span className="chapter-number-pill">{sectionNum}.</span>
                    <div className="category-icon-wrapper">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="category-title">{ch.title}</h3>

                  {ch.subtitle && (
                    <div className="category-subtitle">
                      <span className="subtitle-pulse-dot" />
                      <span>{ch.subtitle}</span>
                    </div>
                  )}

                  <p className="category-desc">{ch.desc}</p>

                  <div className="category-card-footer">
                    <span className="card-tag-badge">
                      <span className="tag-live-dot" />
                      <span>{ch.tag}</span>
                    </span>
                    <span className="explore-chapter-cta">
                      <span>Open Section</span>
                      <ArrowRight size={15} className="cta-arrow" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

            {/* RESEARCH ACTION BAR */}
<section className="research-resources-action-bar">
          <div className="resources-bar-header">
            <div className="bar-header-left">
              <BookOpen size={18} className="text-emerald" />
              <h3>Research Navigation &amp; Interactive Modules</h3>
            </div>
            <button
              className={`viva-toggle-btn ${vivaGuideOpen ? 'active' : ''}`}
              onClick={() => setVivaGuideOpen(!vivaGuideOpen)}
            >
              <HelpCircle size={15} />
              <span>{vivaGuideOpen ? "Close Examiner Defense Bar" : "Open Examiner Defense Bar"}</span>
            </button>
          </div>

          {/* Quick Rounded Rectangular Action Buttons */}
          <div className="resources-buttons-row">
            <button className="btn-resource-rect" onClick={() => scrollTo("section-bands")}>
              <Radio size={15} />
              <span>Explore Sentinel Bands</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-composites")}>
              <Sun size={15} />
              <span>Band Combinations</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-ndwi")}>
              <Activity size={15} />
              <span>NDWI Extraction</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-dataset")}>
              <Database size={15} />
              <span>Training Dataset</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-architecture")}>
              <Cpu size={15} />
              <span>Model Architecture</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-performance")}>
              <BarChart3 size={15} />
              <span>Model Performance</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-historical")}>
              <Calendar size={15} />
              <span>Historical Coastlines</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-geospatial")}>
              <Compass size={15} />
              <span>Geospatial Verification</span>
            </button>
            <button className="btn-resource-rect" onClick={() => scrollTo("section-transects")}>
              <Layers size={15} />
              <span>Transects &amp; EPR</span>
            </button>
            <button className="btn-resource-rect highlight-green" onClick={() => scrollTo("section-future")}>
              <TrendingUp size={15} />
              <span>Future Predictions</span>
            </button>
          </div>

          {/* Collapsible Viva Questions Drawer */}
          <AnimatePresence>
            {vivaGuideOpen && (
              <motion.div
                className="viva-questions-drawer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="viva-drawer-inner">
                  <div className="viva-drawer-title">
                    <ShieldCheck size={16} className="text-emerald" />
                    <strong>Examiner Defense Jump Bar:</strong> Click any question below to immediately jump to its technical proof and Colab notebook anchor.
                  </div>
                  <div className="viva-questions-grid">
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-performance")}>
                      <span className="q-tag">DeepLabV3+ Proof</span>
                      <span className="q-text">How did you calculate the 85.48% Dice score?</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-performance")}>
                      <span className="q-tag">Baseline Models</span>
                      <span className="q-text">Why did Random Forest get only 51%–54% accuracy?</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-dataset")}>
                      <span className="q-tag">Tensor Structure</span>
                      <span className="q-text">Show me the 9-channel fused satellite tensor</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-transects")}>
                      <span className="q-tag">DSAS Transects</span>
                      <span className="q-text">Where are the 1,944 coastal transects?</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-transects")}>
                      <span className="q-tag">Tidal Formula</span>
                      <span className="q-text">Show the tidal correction formula and calculations</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-future")}>
                      <span className="q-tag">Hazard Model</span>
                      <span className="q-text">How does XGBoost predict coastal hazard risk (84.8% accuracy)?</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                    <button className="viva-jump-btn" onClick={() => scrollTo("section-future")}>
                      <span className="q-tag">Future Projections</span>
                      <span className="q-text">What are the 2025–2029 forecasted land loss figures?</span>
                      <ArrowRight size={14} className="q-arrow" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
          </>
        )}

        {activeCategory && currentChapter && (
          <div className="chapter-view-container">
            {/* CHAPTER DETAIL TOP NAVIGATION BAR */}
            <div className="chapter-nav-top-bar">
              <button
                className="btn-back-to-hub"
                onClick={() => {
                  setActiveCategory(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ChevronLeft size={18} />
                <span>← Back to Research Lab Hub</span>
              </button>

              <div className="chapter-breadcrumbs-wrap">
                <span
                  className="crumb-link"
                  onClick={() => {
                    setActiveCategory(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Research Hub
                </span>
                <span className="crumb-separator">/</span>
                <span className="crumb-current">
                  {parseInt(currentChapter.num, 10)}. {currentChapter.title}
                </span>
              </div>

              <div className="chapter-step-buttons">
                <button
                  className="btn-chapter-step"
                  disabled={currentChapterIndex <= 0}
                  onClick={() =>
                    goToChapter(RESEARCH_CHAPTERS[currentChapterIndex - 1].id)
                  }
                  title="Previous section"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  className="btn-chapter-step"
                  disabled={currentChapterIndex >= RESEARCH_CHAPTERS.length - 1}
                  onClick={() =>
                    goToChapter(RESEARCH_CHAPTERS[currentChapterIndex + 1].id)
                  }
                  title="Next section"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ========================================================
                ISOLATED SECTION CONTENT: ONLY THE SELECTED SECTION RENDERS
                ======================================================== */}

            {activeCategory === "sentinel-bands" && (
<section id="section-bands" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-emerald">
                      <Radio size={15} />
                      1. SATELLITE DATA EXPLORER
                    </span>
                    <h2 className="sec-title">Satellite Data Explorer</h2>
                    <p className="sec-desc">
                      Visualizing individual satellite bands from Sentinel-2 Optical and Sentinel-1 SAR Radar.
                      Individual bands are naturally raw grayscale intensity images representing solar reflectance or radar backscatter.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=9nFtib5zWJwu`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View GEE Ingestion in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Part A1: Sentinel-2 Optical Bands */}
                <div className="sub-module-block">
                  <div className="sub-module-title">
                    <Sun size={18} className="text-emerald" />
                    <div>
                      <h3>A.1 Sentinel-2 MultiSpectral Optical Bands (10m &amp; 20m)</h3>
                      <p>7 spectral bands utilized in our 9-channel tensor. Each visual card shows the calibrated single-band intensity with scientific false-colour lookup.</p>
                    </div>
                  </div>

                  <div className="bands-grid">
                    {SENTINEL_2_BANDS.map((b) => (
                      <div
                        key={b.band}
                        className="band-card clickable"
                        onClick={() => setSelectedImage({
                          src: b.image,
                          title: `Sentinel-2 ${b.band} (${b.name}) - ${b.wavelength}`,
                          category: "Sentinel-2 Optical Band",
                          date: "2020–2024",
                          metric: `Resolution: ${b.resolution}`,
                          desc: `${b.captures} Coastal Role: ${b.coastalRole}`,
                          source: `Copernicus Sentinel-2 Level-2A BOA`
                        })}
                      >
                        <div className="band-img-wrap">
                          <img src={b.image} alt={b.name} loading="lazy" />
                          <span className="band-tag-badge">{b.band}</span>
                          <span className="band-wavelength-badge">{b.wavelength}</span>
                        </div>
                        <div className="band-card-details">
                          <h4>{b.name} <small>({b.resolution})</small></h4>
                          <p className="band-color-note"><strong>Rendering:</strong> {b.scientificColor}</p>
                          <p className="band-captures-text">{b.captures}</p>
                          <div className="band-usage-box">
                            <strong>Project Usage:</strong> {b.projectUsage}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part A2: Sentinel-1 Radar Imagery */}
                <div className="sub-module-block" style={{ marginTop: '40px' }}>
                  <div className="sub-module-title">
                    <Radio size={18} className="text-cyan" />
                    <div>
                      <h3>A.2 Sentinel-1 Synthetic Aperture Radar (SAR) Products</h3>
                      <p>C-Band (5.405 GHz) microwave backscatter measurements penetrating cloud cover and monsoon precipitation.</p>
                    </div>
                  </div>

                  <div className="radar-grid">
                    {SENTINEL_1_PRODUCTS.map((r) => (
                      <div
                        key={r.id}
                        className="radar-card clickable"
                        onClick={() => setSelectedImage({
                          src: r.image,
                          title: r.name,
                          category: "Sentinel-1 SAR Radar",
                          date: "2020–2024",
                          metric: r.type,
                          desc: `${r.desc} Role: ${r.role}`,
                          source: "Copernicus Sentinel-1 IW GRD"
                        })}
                      >
                        <div className="radar-img-wrap">
                          <img src={r.image} alt={r.name} loading="lazy" />
                          <span className="radar-badge">{r.type}</span>
                        </div>
                        <div className="radar-card-details">
                          <h4>{r.name}</h4>
                          <p className="radar-desc">{r.desc}</p>
                          <div className="radar-role-box">
                            <strong>Coastal Role:</strong> {r.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION A FIELD NOTES */}
                <div className="research-notebook-strip">
                  <div className="sticky-note-card yellow">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // SENSOR COMPOSITING</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>MICROWAVE RADAR</span>
                    </div>
                    <h4 className="sticky-note-title">SAR Cloud Penetration</h4>
                    <div className="sticky-formula-box">
                      σ°_ratio = σ°_VV / σ°_VH
                    </div>
                    <p className="sticky-note-text">
                      Sentinel-1 C-band (5.405 GHz) microwave backscatter penetrates dense monsoon cloud decks that blind optical sensors across Karnataka from June to September.
                    </p>
                  </div>

                  <div className="sticky-note-card cyan">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // SPECTRAL SENSING</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>OPTICAL BAND B11</span>
                    </div>
                    <h4 className="sticky-note-title">SWIR-1 Moisture Attenuation</h4>
                    <div className="sticky-formula-box">
                      ρ_1610nm ∝ 1 / (Soil Moisture + ε)
                    </div>
                    <p className="sticky-note-text">
                      Shortwave infrared absorbs strongly in wet intertidal sand, separating saturated high-water beach zones from dry foredunes with sub-pixel precision.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "sentinel-1-sar" && (
<section id="section-sar-standalone" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-tag-badge">
                2. SENTINEL-1 C-BAND SAR RADAR ANALYSIS
              </span>
              <h2 className="sec-title">Sentinel-1 SAR Radar Analysis</h2>
              <p className="sec-desc">
                Active microwave radar backscatter analysis in dual polarisation (VV and VH channels).
                Radar pulses at 5.405 GHz penetrate heavy monsoonal cloud decks, measuring surface roughness to cleanly isolate seawater from terrestrial land.
              </p>
            </div>
            <div className="colab-btn-group">
              <a
                href={`${COLAB_BASE}#scrollTo=9nFtib5zWJwu`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pink-colab"
              >
                <FileCode size={16} />
                <span>View Radar Pre-Processing in Colab</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

              <div className="sentinel-bands-grid-pro">
                {SENTINEL_1_PRODUCTS.map((r) => {
                  const spec = BAND_COLOR_SPECS[r.id] || { swatch: "#06b6d4", label: r.wavelength };
                  return (
                    <div
                      key={r.id}
                      className="sentinel-card-pro clickable"
                      onClick={() => setSelectedImage({
                        src: r.image,
                        title: r.name,
                        category: "Sentinel-1 SAR Radar",
                        date: "2020–2024",
                        metric: r.type,
                        desc: `${r.desc} Coastal Role: ${r.role}`,
                        source: `Copernicus Sentinel-1 GRD C-Band SAR`
                      })}
                    >
                      <div className="sentinel-card-img-wrap">
                        <img src={r.image} alt={r.name} loading="lazy" />
                        <span className="band-top-tag">{r.id.toUpperCase()}</span>
                        <span className="band-res-tag">SAR GRD</span>
                      </div>
                      <div className="sentinel-card-body">
                        <div className="band-header-title-row">
                          <h4 className="band-name-title">{r.name}</h4>
                          <span className="band-wavelength-tag">{r.wavelength}</span>
                        </div>
                        <div className="band-spectrum-bar">
                          <span className="spectrum-dot" style={{ backgroundColor: spec.swatch, color: spec.swatch }} />
                          <span className="spectrum-label">{spec.label}</span>
                        </div>
                        <div className="band-capture-box">
                          <strong>Radar Backscatter:</strong> {r.desc}
                        </div>
                        <div className="band-project-role-box">
                          <strong>Coastal AI Role:</strong> {r.role}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="research-notebook-strip">
                <div className="sticky-note-card mint">
                  <div className="pin-head" />
                  <div className="note-topic-tag">FIELD NOTE 02 // RADAR BACKSCATTER</div>
                  <div className="note-sub-tag">SPECULAR WATER VS DIELECTRIC LAND</div>
                  <h4>Cloud-Penetrating C-Band Radar Mechanics</h4>
                  <p>Calm oceanic water acts as a specular reflector bouncing radar energy away from the sensor (-24 dB to -20 dB), whereas rough vegetated land produces strong diffuse return (-12 dB to -6 dB). This steep 14 dB contrast guarantees unbroken shoreline boundary detection during heavy monsoon cloud cover.</p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "sentinel-2-optical" && (
<section id="section-optical-standalone" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-tag-badge">
                      3. SENTINEL-2 OPTICAL MULTI-SPECTRAL SUITE
                    </span>
                    <h2 className="sec-title">Sentinel-2 Optical Multi-Spectral Analysis</h2>
                    <p className="sec-desc">
                      7 calibrated multi-spectral bands (B2 to B12) at 10m and 20m spatial resolutions.
                      Multi-spectral reflectance separates suspended sediment plumes, sandy beaches, vegetation buffers, and deep water.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=9nFtib5zWJwu`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>Inspect Multi-Spectral Bands in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="sentinel-bands-grid-pro">
                  {SENTINEL_2_BANDS.map((b) => {
                    const spec = BAND_COLOR_SPECS[b.band] || { swatch: "#38bdf8", label: b.wavelength };
                    return (
                      <div
                        key={b.band}
                        className="sentinel-card-pro clickable"
                        onClick={() => setSelectedImage({
                          src: b.image,
                          title: `Sentinel-2 ${b.band} (${b.name}) - ${b.wavelength}`,
                          category: "Sentinel-2 Optical Band",
                          date: "2020–2024",
                          metric: `Resolution: ${b.resolution} | Central: ${b.wavelength}`,
                          desc: `${b.captures} Coastal Role: ${b.coastalRole}`,
                          source: `Copernicus Sentinel-2 Level-2A BOA`
                        })}
                      >
                        <div className="sentinel-card-img-wrap">
                          <img src={b.image} alt={b.name} loading="lazy" />
                          <span className="band-top-tag">{b.band}</span>
                          <span className="band-res-tag">{b.resolution}</span>
                        </div>
                        <div className="sentinel-card-body">
                          <div className="band-header-title-row">
                            <h4 className="band-name-title">{b.name}</h4>
                            <span className="band-wavelength-tag">{b.wavelength}</span>
                          </div>
                          <div className="band-spectrum-bar">
                            <span className="spectrum-dot" style={{ backgroundColor: spec.swatch, color: spec.swatch }} />
                            <span className="spectrum-label">{spec.label}</span>
                          </div>
                          <div className="band-capture-box">
                            <strong>Captures:</strong> {b.captures}
                          </div>
                          <div className="band-project-role-box">
                            <strong>Coastal AI Role:</strong> {b.coastalRole}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="research-notebook-strip">
                  <div className="sticky-note-card cyan">
                    <div className="pin-head" />
                    <div className="note-topic-tag">FIELD NOTE 03 // SPECTRAL REFLECTANCE</div>
                    <div className="note-sub-tag">NEAR-INFRARED WATER ABSORPTION</div>
                    <h4>10m Band 8 (NIR) Water-Land Contrast</h4>
                    <p>Water has near-zero reflectance in the Near-Infrared (Band 8, 842 nm) due to molecular absorption, whereas terrestrial vegetation and quartz beach sands reflect intensely. This spectral step provides the primary physical basis for automated NDWI thresholding.</p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "band-composites" && (
<section id="section-composites" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-pink">
                      <Sun size={15} />
                      4. INTERACTIVE COLOUR BAND COMBINATIONS
                    </span>
                    <h2 className="sec-title">Explore Satellite Band Combinations</h2>
                    <p className="sec-desc">
                      Discover how different spectral bands are mapped into Red, Green, and Blue colour channels to reveal
                      ocean boundaries, terrestrial vegetation vigor, and intertidal beach moisture.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=PZW1lX8VWWW-`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View Tensor Fusion in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Interactive Composite Selector Tabs */}
                <div className="composite-tabs-row">
                  {Object.keys(BAND_COMPOSITES).map((key) => (
                    <button
                      key={key}
                      className={`composite-select-btn ${selectedComposite === key ? 'active' : ''}`}
                      onClick={() => setSelectedComposite(key)}
                    >
                      {BAND_COMPOSITES[key].title}
                    </button>
                  ))}
                </div>

                {/* Composite Display & Channel Assignment */}
                <div className="composite-interactive-display">
                  <div className="composite-image-stage">
                    <img
                      src={BAND_COMPOSITES[selectedComposite].image}
                      alt={BAND_COMPOSITES[selectedComposite].title}
                      className="composite-main-img"
                    />
                    <div className="composite-img-overlay-tag">
                      {BAND_COMPOSITES[selectedComposite].rgb}
                    </div>
                  </div>

                  <div className="composite-details-stage">
                    <h3>{BAND_COMPOSITES[selectedComposite].title}</h3>
                    <div className="composite-rgb-formula">
                      <code>{BAND_COMPOSITES[selectedComposite].rgb}</code>
                    </div>

                    <p className="composite-explanation">
                      {BAND_COMPOSITES[selectedComposite].explanation}
                    </p>

                    <h4>RGB Colour Channel Assignments:</h4>
                    <div className="channel-assignments-list">
                      {BAND_COMPOSITES[selectedComposite].channels.map((ch, idx) => (
                        <div key={idx} className="channel-assign-row">
                          <span className={`channel-pill ${ch.color.toLowerCase()}`}>{ch.color} Channel</span>
                          <div className="channel-assign-info">
                            <strong>{ch.band}</strong>
                            <span>{ch.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Comparison Slider: Natural Colour vs False Colour Vegetation */}
                <div className="comparison-slider-module">
                  <div className="slider-header-block">
                    <div className="slider-header-left">
                      <SplitSquareVertical size={18} className="text-pink" />
                      <h3>Interactive Comparison Slider: True Colour (B4-3-2) vs False Colour Vegetation (B8-4-3)</h3>
                    </div>
                    <span className="slider-hint">Drag the slider horizontally to compare surface reflectance response</span>
                  </div>

                  <div
                    className="slider-stage-container"
                    ref={sliderContainerRef}
                    onMouseMove={(e) => {
                      if (!sliderContainerRef.current) return;
                      const rect = sliderContainerRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      setSliderPosition(pct);
                    }}
                  >
                    {/* Bottom Layer: False Colour Vegetation */}
                    <img
                      src="/satellite_bands/composite_false_color_vegetation.png"
                      alt="False Colour Vegetation"
                      className="slider-img-layer bottom"
                    />
                    <span className="slider-layer-label right">FALSE COLOUR (B8-B4-B3)</span>

                    {/* Top Layer: Natural Colour (Clipped with pixel-perfect clip-path) */}
                    <img
                      src="/satellite_bands/composite_natural_color.png"
                      alt="Natural Colour"
                      className="slider-img-layer top"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    />
                    <span className="slider-layer-label left">NATURAL COLOUR (B4-B3-B2)</span>

                    {/* Divider Line & Handle */}
                    <div
                      className="slider-divider-line"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="slider-handle-pill">
                        <ChevronLeft size={12} />
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION B FIELD NOTES */}
                <div className="research-notebook-strip">
                  <div className="sticky-note-card amber">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // FALSE COLOUR INDICES</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>CONTRAST ENHANCEMENT</span>
                    </div>
                    <h4 className="sticky-note-title">MNDWI vs NDWI Formulation</h4>
                    <div className="sticky-formula-box">
                      MNDWI = (Green - SWIR) / (Green + SWIR)
                    </div>
                    <p className="sticky-note-text">
                      Substituting SWIR for NIR suppresses noise over coastal aquaculture ponds, wet beach sands, and port revetments, boosting shoreline contour sharpness.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "dataset-processing" && (
<section id="section-dataset" className="lab-section dataset-hero-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-badge text-emerald">
                    <Database size={15} />
                    5. ACTUAL MODEL TRAINING DATASET &amp; PROCESSED PATCHES
                  </span>
                  <h2 className="sec-title">Inside Our Training Dataset</h2>
                  <p className="sec-desc">
                    Examine actual training tiles, multi-spectral input tensors, and corresponding ground-truth segmentation masks.
                    Original Input &rarr; Ground Truth Mask &rarr; DeepLabV3+ Prediction.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href={`${COLAB_BASE}#scrollTo=PZW1lX8VWWW-`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>View prepare_dataset.py in Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* VERIFIED TRAINING CORPUS SHOWCASE & EXACT IMAGE COUNTS */}
              <div className="dataset-verification-hero">
                <div className="dataset-headline-row">
                  <div>
                    <span className="verification-tag-pill">
                      <ShieldCheck size={14} />
                      VERIFIED TRAINING CORPUS // GOOGLE DRIVE &amp; SENTINEL ARCHIVES
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', margin: '8px 0 4px 0' }}>
                      1,420 Multi-Spectral Patches · 12,780 Single-Band Slices
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0, maxWidth: '780px' }}>
                      Every training sample was created using a 256×256 sliding window with 50% spatial overlap (128-pixel stride)
                      along the 97.2 km Udupi coastline across 5 observed years (2020–2024). Verified against Google Earth Engine &amp; QGIS transects.
                    </p>
                  </div>

                  <a
                    href={GOOGLE_DRIVE_DATASET_FOLDER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-drive-main"
                  >
                    <Database size={17} />
                    <span>Open Google Drive Dataset</span>
                    <ExternalLink size={15} />
                  </a>
                </div>

                {/* 5-Item Exact Count Banner */}
                <div className="dataset-counts-grid">
                  <div className="count-card highlight">
                    <span className="count-val">1,420</span>
                    <span className="count-lbl">Multi-Spectral Patches</span>
                    <span className="count-sub">256 × 256 pixels @ 10m GSD (2.56 km² footprint per patch)</span>
                  </div>

                  <div className="count-card">
                    <span className="count-val">1,136</span>
                    <span className="count-lbl">Training Patches (80%)</span>
                    <span className="count-sub">Random seed 42 with zero spatial overlap to held-out test split</span>
                  </div>

                  <div className="count-card">
                    <span className="count-val">284</span>
                    <span className="count-lbl">Validation Patches (20%)</span>
                    <span className="count-sub">Rigorous unseen hold-out achieving 85.48% benchmark Dice score</span>
                  </div>

                  <div className="count-card highlight">
                    <span className="count-val">12,780</span>
                    <span className="count-lbl">Single-Band Image Slices</span>
                    <span className="count-sub">9 sensor channels × 1,420 patches (7 Sentinel-2 + 2 Sentinel-1 SAR)</span>
                  </div>

                  <div className="count-card">
                    <span className="count-val">1,420</span>
                    <span className="count-lbl">Ground Truth Masks</span>
                    <span className="count-sub">Binary water (1) / land (0) masks verified via GEE &amp; QGIS</span>
                  </div>
                </div>

                {/* 4 Colab Notebooks Quick Action Row */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    VERIFIED GOOGLE COLAB EXPERIMENT NOTEBOOKS (LIVE EVIDENCE):
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {VERIFIED_COLAB_NOTEBOOKS.map((nb, i) => (
                      <a
                        key={i}
                        href={nb.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-drive-file"
                        style={{ justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f1f5f9' }}>{nb.title}</span>
                          <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{nb.badge}</span>
                        </div>
                        <ExternalLink size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Individual Google Drive Assets Proof Drawer */}
                <div className="drive-proof-actions-row">
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} className="text-emerald" />
                    Verified Drive Assets ({showAllDriveFiles ? '15 of 15 Files Visible' : 'Showing 6 Sample Files'}):
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
                    {(showAllDriveFiles ? VERIFIED_DRIVE_FILES : VERIFIED_DRIVE_FILES.slice(0, 6)).map((file) => (
                      <a
                        key={file.id}
                        href={`https://drive.google.com/file/d/${file.id}/view?usp=drive_link`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-drive-file"
                        title={`Google Drive Asset ID: ${file.id}`}
                      >
                        <FileCode size={13} className="text-cyan" />
                        <span>{file.name}</span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: '4px' }}>({file.size})</span>
                        <ExternalLink size={11} style={{ opacity: 0.6 }} />
                      </a>
                    ))}
                  </div>

                  <button
                    className="btn-link"
                    onClick={() => setShowAllDriveFiles(!showAllDriveFiles)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '4px 0',
                      marginTop: '4px'
                    }}
                  >
                    {showAllDriveFiles ? "Show Fewer Drive Files ▲" : `+ View All 15 Verified Drive Project Files (${VERIFIED_DRIVE_FILES.length - 6} more) ▼`}
                  </button>
                </div>
              </div>

              {/* Location Selector Chips */}
              <div className="training-sample-selector-bar">
                <span className="selector-label">Select Coastal Training Sample:</span>
                {Object.keys(TRAINING_SAMPLES).map((key) => (
                  <button
                    key={key}
                    className={`sample-select-chip ${selectedTrainingSample === key ? 'active' : ''}`}
                    onClick={() => setSelectedTrainingSample(key)}
                  >
                    {TRAINING_SAMPLES[key].name}
                  </button>
                ))}
              </div>

              {/* 3-Panel Side-by-Side: Input -> GT -> Pred */}
              <div className="triad-comparison-container">
                <div className="triad-meta-top">
                  <h4>{TRAINING_SAMPLES[selectedTrainingSample].name}</h4>
                  <span className="triad-loc-tag"><MapPin size={12} /> {TRAINING_SAMPLES[selectedTrainingSample].location}</span>
                  <p>{TRAINING_SAMPLES[selectedTrainingSample].desc}</p>
                </div>

                <div className="triad-three-panel-grid">
                  {/* Panel 1: Original Image */}
                  <div
                    className="triad-panel-card clickable"
                    onClick={() => setSelectedImage({
                      src: TRAINING_SAMPLES[selectedTrainingSample].input,
                      title: `${TRAINING_SAMPLES[selectedTrainingSample].name} - Input Tensor`,
                      category: "Model Input",
                      date: "2020–2024",
                      metric: "9 Channels [9, 256, 256]",
                      desc: "Normalized 9-channel tensor patch (7 Sentinel-2 optical + 2 Sentinel-1 SAR).",
                      source: "Soil_Erosion_Major_Project_Phase_4_Roshni.ipynb (Cell 35)"
                    })}
                  >
                    <div className="triad-badge-top input">1. ORIGINAL SATELLITE IMAGE</div>
                    <div className="triad-img-box">
                      <img src={TRAINING_SAMPLES[selectedTrainingSample].input} alt="Original Satellite Input" />
                    </div>
                    <div className="triad-panel-foot">
                      <span>Input Tensor: 9 Bands Stacked</span>
                      <code>256 × 256 px (10m)</code>
                    </div>
                  </div>

                  {/* Panel 2: Ground Truth Mask */}
                  <div
                    className="triad-panel-card clickable"
                    onClick={() => setSelectedImage({
                      src: TRAINING_SAMPLES[selectedTrainingSample].gt,
                      title: `${TRAINING_SAMPLES[selectedTrainingSample].name} - Ground Truth Mask`,
                      category: "Ground Truth",
                      date: "Target Label",
                      metric: "Binary (0=Land, 1=Water)",
                      desc: "Ground-truth target mask generated via GEE thresholding and manual morphological verification.",
                      source: "Ground Truth Annotation"
                    })}
                  >
                    <div className="triad-badge-top gt">2. GROUND-TRUTH MASK</div>
                    <div className="triad-img-box">
                      <img src={TRAINING_SAMPLES[selectedTrainingSample].gt} alt="Ground Truth Mask" />
                    </div>
                    <div className="triad-panel-foot">
                      <span>Raster Label: Land (0) / Water (1)</span>
                      <code>Verified GEE Target</code>
                    </div>
                  </div>

                  {/* Panel 3: Model Prediction */}
                  <div
                    className="triad-panel-card clickable"
                    onClick={() => setSelectedImage({
                      src: TRAINING_SAMPLES[selectedTrainingSample].pred,
                      title: `${TRAINING_SAMPLES[selectedTrainingSample].name} - DeepLabV3+ Prediction`,
                      category: "Model Output",
                      date: "Test Set Inference",
                      metric: `Dice Score: ${TRAINING_SAMPLES[selectedTrainingSample].dice}`,
                      desc: "Output predicted coastline segmentation mask generated by DeepLabV3+ with ResNet-34 encoder.",
                      source: "DeepLabV3+ Model Inference"
                    })}
                  >
                    <div className="triad-badge-top pred">3. DEEPLABV3+ PREDICTION</div>
                    <div className="triad-img-box">
                      <img src={TRAINING_SAMPLES[selectedTrainingSample].pred} alt="DeepLabV3+ Prediction" />
                    </div>
                    <div className="triad-panel-foot">
                      <span>Dice Score: <strong>{TRAINING_SAMPLES[selectedTrainingSample].dice}</strong></span>
                      <code>IoU: {TRAINING_SAMPLES[selectedTrainingSample].iou}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifiable Dataset Specifications Cards */}
              <div className="dataset-specs-grid-redesigned">
                <div className="spec-item-card">
                  <span className="spec-lbl">Study Coastline Length</span>
                  <strong className="spec-val">97.2 km (Udupi District)</strong>
                  <span className="spec-sub">From Shiroor in north to Hejamadi in south</span>
                </div>
                <div className="spec-item-card">
                  <span className="spec-lbl">Tile Patch Dimensions</span>
                  <strong className="spec-val">256 × 256 Pixels</strong>
                  <span className="spec-sub">Spatial footprint: 2.56 km × 2.56 km per tile</span>
                </div>
                <div className="spec-item-card">
                  <span className="spec-lbl">Ground Sampling Distance</span>
                  <strong className="spec-val">10 m / Pixel</strong>
                  <span className="spec-sub">Co-registered to EPSG:32643 (UTM Zone 43N)</span>
                </div>
                <div className="spec-item-card">
                  <span className="spec-lbl">Sliding Window Stride</span>
                  <strong className="spec-val">128 Pixels (50% Overlap)</strong>
                  <span className="spec-sub">Spatial augmentation along shoreline interface</span>
                </div>
                <div className="spec-item-card">
                  <span className="spec-lbl">Input Sensor Modalities</span>
                  <strong className="spec-val">9 Channels Stacked</strong>
                  <span className="spec-sub">7 Sentinel-2 Optical + 2 Sentinel-1 SAR</span>
                </div>
                <div className="spec-item-card">
                  <span className="spec-lbl">Train / Validation Split</span>
                  <strong className="spec-val">75% Train / 25% Held-Out</strong>
                  <span className="spec-sub">Random seed 42, zero spatial leakage</span>
                </div>
              </div>

              {/* SECTION D FIELD NOTES */}
              <div className="research-notebook-strip">
                <div className="sticky-note-card mint">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE // SPATIAL SAMPLING</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>DATASET CORPUS</span>
                  </div>
                  <h4 className="sticky-note-title">Sliding-Window Augmentation</h4>
                  <div className="sticky-formula-box">
                    Stride = 128 px  (50% Spatial Overlap)
                  </div>
                  <p className="sticky-note-text">
                    Generates 1,420 multi-spectral 9-channel patches (12,780 single-band slices) along the 97.2 km coast, ensuring rigorous boundary sample density with zero test leakage.
                  </p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "gee-pipeline" && (
<section id="section-ndwi" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-badge text-cyan">
                    <Activity size={15} />
                    6. GOOGLE EARTH ENGINE &amp; NDWI WATER EXTRACTION PIPELINE
                  </span>
                  <h2 className="sec-title">How We Distinguished Water and Land</h2>
                  <p className="sec-desc">
                    Step-by-step 8-stage image processing pipeline that isolates the Arabian Sea interface using
                    Normalized Difference Water Indexing (NDWI), Otsu thresholding, and morphological filtering.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href={`${COLAB_BASE}#scrollTo=p_TShZRIVLLE`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>View NDWI Script in Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Step Selector Horizontal Bar */}
              <div className="ndwi-steps-nav">
                {NDWI_STEPS.map((s) => (
                  <button
                    key={s.step}
                    className={`ndwi-step-nav-btn ${activeNdwiStep === s.step ? 'active' : ''}`}
                    onClick={() => setActiveNdwiStep(s.step)}
                  >
                    <span className="step-nav-num">Stage 0{s.step}</span>
                    <span className="step-nav-title">{s.title.split(":")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Feature Display */}
              <div className="active-ndwi-step-display">
                <div
                  className="ndwi-stage-image-container clickable"
                  onClick={() => setSelectedImage({
                    src: NDWI_STEPS[activeNdwiStep - 1].image,
                    title: NDWI_STEPS[activeNdwiStep - 1].title,
                    category: "NDWI Processing Pipeline",
                    date: "2020–2024",
                    metric: NDWI_STEPS[activeNdwiStep - 1].subtitle,
                    desc: NDWI_STEPS[activeNdwiStep - 1].desc,
                    source: "QGIS / OpenCV Image Processing Chain"
                  })}
                >
                  <img
                    src={NDWI_STEPS[activeNdwiStep - 1].image}
                    alt={NDWI_STEPS[activeNdwiStep - 1].title}
                  />
                  <div className="ndwi-img-badge">
                    STAGE 0{activeNdwiStep} // {NDWI_STEPS[activeNdwiStep - 1].subtitle}
                  </div>
                  <div className="ndwi-zoom-hint">
                    <Maximize2 size={16} />
                    <span>Click to Enlarge</span>
                  </div>
                </div>

                <div className="ndwi-stage-text-container">
                  <div className="stage-step-tag">STEP {activeNdwiStep} OF 8</div>
                  <h3>{NDWI_STEPS[activeNdwiStep - 1].title}</h3>
                  <div className="stage-subtitle-badge">{NDWI_STEPS[activeNdwiStep - 1].subtitle}</div>

                  <p className="stage-description-text">
                    {NDWI_STEPS[activeNdwiStep - 1].desc}
                  </p>

                  {/* Technical notes based on active step */}
                  {activeNdwiStep === 3 && (
                    <div className="technical-formula-box">
                      <strong>NDWI Mathematical Formulation:</strong>
                      <code>NDWI = (Green - NIR) / (Green + NIR)</code>
                      <span>Where Green = Band 3 (560 nm) and NIR = Band 8 (842 nm). Water exhibits high reflectance in Green and intense absorption in NIR, producing positive values.</span>
                    </div>
                  )}

                  {activeNdwiStep === 5 && (
                    <div className="technical-formula-box">
                      <strong>Otsu Criterion Optimization:</strong>
                      <code>sigma_w^2(T) = w_0(T) * sigma_0^2(T) + w_1(T) * sigma_1^2(T)</code>
                      <span>Finds threshold T* that minimizes intra-class variance between the water peak and the land peak in the bimodal histogram.</span>
                    </div>
                  )}

                  {activeNdwiStep === 7 && (
                    <div className="technical-formula-box">
                      <strong>Morphological Kernel Operators:</strong>
                      <code>Opening: (A (-) B) (+) B  |  Closing: (A (+) B) (-) B</code>
                      <span>Opening deletes small specks of surf/wave whitecaps in the ocean. Closing bridges artificial micro-gaps on sandspits.</span>
                    </div>
                  )}

                  <div className="step-arrow-nav-buttons">
                    <button
                      className="btn-step-prev"
                      disabled={activeNdwiStep === 1}
                      onClick={() => setActiveNdwiStep((prev) => Math.max(1, prev - 1))}
                    >
                      <ChevronLeft size={16} /> Previous Stage
                    </button>
                    <button
                      className="btn-step-next"
                      disabled={activeNdwiStep === 8}
                      onClick={() => setActiveNdwiStep((prev) => Math.min(8, prev + 1))}
                    >
                      Next Stage <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION C FIELD NOTES */}
              <div className="research-notebook-strip">
                <div className="sticky-note-card yellow">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE 01 // SPECTRAL INDEX</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>GEE PIPELINE</span>
                  </div>
                  <h4 className="sticky-note-title">NDWI Water Separation</h4>
                  <div className="sticky-formula-box">
                    NDWI = (Green - NIR) / (Green + NIR)
                  </div>
                  <p className="sticky-note-text">
                    Exploits near-total NIR absorption by water alongside high green reflectance. Zero-crossing acts as the baseline boundary between ocean and beach.
                  </p>
                </div>

                <div className="sticky-note-card mint">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE // ADAPTIVE THRESHOLD</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>OTSU ALGORITHM</span>
                  </div>
                  <h4 className="sticky-note-title">Otsu Bimodal Variance</h4>
                  <div className="sticky-formula-box">
                    σ_B²(t) = ω₀(t)·ω₁(t)·[μ₀(t) - μ₁(t)]²
                  </div>
                  <p className="sticky-note-text">
                    Maximizes inter-class pixel variance to find optimal threshold t* dynamically across varying sun glint and seafoam conditions.
                  </p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "colab-training" && (
<section id="section-colab-training-standalone" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-tag-badge">
                    7. GOOGLE COLAB & MODEL TRAINING PIPELINE
                  </span>
                  <h2 className="sec-title">Google Colab &amp; Deep Learning Training</h2>
                  <p className="sec-desc">
                    Complete cloud execution suite: 4 verified Google Colab notebooks orchestrating Google Earth Engine extraction,
                    PyTorch 2.0 DeepLabV3+ segmentation, compound loss optimization, and DSAS transect kinematics.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href="https://colab.research.google.com/drive/1poxCt5JVi7PXHOZK8_N50FYUWhorO6Hr?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>Launch Phase 4 PyTorch Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="training-triad-grid" style={{ marginBottom: '28px' }}>
                {VERIFIED_COLAB_NOTEBOOKS.map((nb, i) => (
                  <div key={i} className="training-summary-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="card-tag-badge">{nb.badge}</span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>VERIFIED</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>{nb.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>{nb.role}</p>
                    </div>
                    <a
                      href={nb.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <FileCode size={14} />
                      <span>Open Colab Notebook</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>

              <div className="architecture-layout-grid">
                <div className="arch-visual-panel">
                  <div className="arch-diagram-card clickable" onClick={() => setSelectedImage({
                    src: "/slide10_loss_graph.png",
                    title: "DeepLabV3+ Compound Loss Convergence (BCE + Dice)",
                    category: "Model Training Evidence",
                    date: "40 Epochs",
                    metric: "Final Loss: 0.4304 | Dice: 85.48%",
                    desc: "Balanced BCE and Dice compound loss optimization across 1,420 multi-spectral 9-channel training patches.",
                    source: "Google Colab Phase 4 Execution Run"
                  })} style={{ padding: '16px', background: '#020617', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src="/slide10_loss_graph.png" alt="DeepLabV3+ Compound Loss Convergence" style={{ width: '100%', borderRadius: '10px' }} />
                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: '10px' }}>
                      Click to inspect full-resolution BCE + Dice loss convergence curve (Loss 0.892 → 0.4304).
                    </p>
                  </div>
                </div>

                <div className="arch-inspector-panel">
                  <div className="arch-detail-card">
                    <span className="arch-stage-badge">PYTORCH 2.0 TRAINING DETAILS</span>
                    <h3>DeepLabV3+ Loss Objective &amp; Convergence</h3>
                    <p>
                      Training deep convolutional networks on coastal boundaries faces severe class imbalance between vast oceanic expanses and narrow linear barrier spits.
                      Standard Cross-Entropy produces over-smoothed boundaries. We implement a compound objective:
                    </p>
                    <div className="formula-block" style={{ margin: '14px 0' }}>
                      <code style={{ fontSize: '0.95rem', color: '#38bdf8' }}>L_total = 0.5 · L_BCE + 0.5 · L_Dice</code>
                    </div>
                    <div className="spec-table-container">
                      <table className="mini-spec-table">
                        <tbody>
                          <tr>
                            <td className="lbl">Base Framework</td>
                            <td className="val">PyTorch 2.0.1 + CUDA 11.8 (Tesla T4 GPU)</td>
                          </tr>
                          <tr>
                            <td className="lbl">Optimizer</td>
                            <td className="val">AdamW (lr=1e-4, weight_decay=1e-2)</td>
                          </tr>
                          <tr>
                            <td className="lbl">Learning Rate Scheduler</td>
                            <td className="val">CosineAnnealingLR (T_max=40, eta_min=1e-6)</td>
                          </tr>
                          <tr>
                            <td className="lbl">Batch Size &amp; Patches</td>
                            <td className="val">16 per batch // 1,420 patches [9 × 256 × 256]</td>
                          </tr>
                          <tr>
                            <td className="lbl">Validation Dice Score</td>
                            <td className="val text-emerald"><strong>0.8548 (85.48%)</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="research-notebook-strip">
                <div className="sticky-note-card mint">
                  <div className="pin-head" />
                  <div className="note-topic-tag">FIELD NOTE 07 // DEEP LEARNING CONVERGENCE</div>
                  <div className="note-sub-tag">COMPOUND BCE + DICE LOSS</div>
                  <h4>Why Compound Loss Stabilized Training at 0.4304</h4>
                  <p>Binary Cross-Entropy establishes smooth, globally calibrated pixel probabilities, while the Dice Loss term actively penalizes boundary overlap errors along narrow barrier spits. This equal 50:50 weighting prevented gradient vanishing and stabilized training convergence at loss 0.4304.</p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "graphs-metrics" && (
<section id="section-performance" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-emerald">
                      <BarChart3 size={15} />
                      8. MODEL TRAINING &amp; VALIDATION METRICS
                    </span>
                    <h2 className="sec-title">Model Training &amp; Performance</h2>
                    <p className="sec-desc">
                      Validation loss curves, confusion matrices, and benchmark scores.
                      Validation Dice coefficient: 0.8548 (85.48% boundary overlap).
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=LtIcf4Twtpi_`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View Validation Cell in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Metrics Triad & Metric Definitions */}
                <div className="metrics-dashboard-grid">
                  <div className="metric-box-card">
                    <span className="m-label">DeepLabV3+ Validation Dice</span>
                    <strong className="m-score text-emerald">0.8548 (85.48%)</strong>
                    <p className="m-desc">Harmonic boundary overlap for semantic segmentation of land-water interface.</p>
                  </div>

                  <div className="metric-box-card">
                    <span className="m-label">Mean Intersection over Union (IoU)</span>
                    <strong className="m-score text-cyan">~0.746 (74.6% IoU)</strong>
                    <p className="m-desc">Jaccard index measuring area of overlap divided by area of union across all test tiles.</p>
                  </div>

                  <div className="metric-box-card">
                    <span className="m-label">Combined BCE + Dice Loss</span>
                    <strong className="m-score text-pink">0.4304</strong>
                    <p className="m-desc">Asymptotic minimum achieved after 15 training epochs on PyTorch with Adam optimizer.</p>
                  </div>

                  <div className="metric-box-card">
                    <span className="m-label">Downstream Hazard Model (XGBoost)</span>
                    <strong className="m-score text-amber">84.8% Accuracy</strong>
                    <p className="m-desc">Independent 4-class coastal hazard classifier driven by wave height, tidal range &amp; monsoon exposure.</p>
                  </div>
                </div>

                {/* Scientific Model Distinction Callout */}
                <div className="stat-card" style={{ marginTop: '16px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={16} className="text-amber" />
                  <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <strong>Scientific Distinction:</strong> <span style={{ color: '#34d399' }}>DeepLabV3+</span> achieves <strong style={{ color: '#34d399' }}>0.8548 (85.48%) Dice Score</strong> for pixel-level shoreline boundary segmentation. The downstream <span style={{ color: '#fbbf24' }}>XGBoost Classifier</span> achieves <strong style={{ color: '#fbbf24' }}>84.8% Classification Accuracy</strong> for 4-tier categorical coastal vulnerability forecasting along 1,944 transects.
                  </span>
                </div>

                {/* Loss Curve Plot & DeepLabV3+ Confusion Matrix */}
                <div className="tab-two-col-grid" style={{ marginTop: '28px' }}>
                  <div
                    className="pane-image-block clickable"
                    onClick={() => setSelectedImage({
                      src: "/slide10_loss_graph.png",
                      title: "DeepLabV3+ Training & Validation Loss Curve",
                      category: "Training Evidence",
                      date: "15 Epochs",
                      metric: "Loss: 0.4304",
                      desc: "Convergence curve combining Binary Cross-Entropy and Dice loss functions over 15 training epochs.",
                      source: "PyTorch Training Run Checkpoint"
                    })}
                  >
                    <img src="/slide10_loss_graph.png" alt="Training Loss Curve" />
                    <div className="img-caption-bar">
                      <span>Training Loss Convergence (BCE + Dice)</span>
                      <Maximize2 size={14} />
                    </div>
                  </div>

                  <div
                    className="pane-image-block clickable"
                    onClick={() => setSelectedImage({
                      src: "/env_ml_confusion_matrix_deeplab.png",
                      title: "DeepLabV3+ Confusion Matrix",
                      category: "Validation Evidence",
                      date: "Held-Out Test Set",
                      metric: "0.8548 Dice Score",
                      desc: "High true positive rate for water and land semantic classes with minimal false negative edge bleeding.",
                      source: "Soil_Erosion_Major_Project_Phase_4_Roshni.ipynb (Cell 37)"
                    })}
                  >
                    <img src="/env_ml_confusion_matrix_deeplab.png" alt="DeepLabV3+ Confusion Matrix" />
                    <div className="img-caption-bar">
                      <span>DeepLabV3+ Confusion Matrix (85.48% Dice)</span>
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </div>

                {/* SECTION F FIELD NOTES */}
                <div className="research-notebook-strip">
                  {/* Note 1: DeepLabV3+ Compound Loss Objective */}
                  <div className="sticky-note-card yellow">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE 02 // DEEP LEARNING</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>PYTORCH 2.0</span>
                    </div>
                    <h4 className="sticky-note-title">Compound Loss Objective</h4>
                    <div className="sticky-formula-box">
                      L_total = 0.5·L_BCE + 0.5·L_Dice
                    </div>
                    <p className="sticky-note-text">
                      Combined BCE and Dice loss prevents class imbalance skewing along narrow spit boundaries, stabilizing convergence at loss 0.4304.
                    </p>
                  </div>

                  {/* Note 2: Harmonic Dice Score */}
                  <div className="sticky-note-card mint">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // VALIDATION METRIC</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>HELD-OUT TEST SET</span>
                    </div>
                    <h4 className="sticky-note-title">Dice Overlap Coefficient</h4>
                    <div className="sticky-formula-box">
                      Dice = 2|A ∩ B| / (|A| + |B|) = 0.8548
                    </div>
                    <p className="sticky-note-text">
                      Harmonic overlap of 85.48% on 284 held-out multi-spectral validation tiles confirms high boundary fidelity against GEE ground truth masks.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "coastline-animation" && (
<section id="section-anim-standalone" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-tag-badge">
                    9. MULTI-TEMPORAL SHORELINE DYNAMICS ANIMATION
                  </span>
                  <h2 className="sec-title">Coastline Change Dynamics Animation</h2>
                  <p className="sec-desc">
                    Continuous empirical satellite raster dynamics documenting 4-year cumulative retreat,
                    barrier spit breach morphodynamics, and estuarine sediment transport along the Udupi coastline (2020–2024).
                  </p>
                </div>
                <div className="colab-btn-group">
                  <button
                    className="btn-unique-anim-trigger"
                    onClick={() => setAnimModalOpen(true)}
                    title="Expand full-size multi-temporal shoreline animation"
                  >
                    <div className="anim-pulse-ring">
                      <div className="anim-pulse-core" />
                    </div>
                    <span className="btn-text-glow">▶ Fullscreen Animation Modal</span>
                    <span className="btn-chip-tag">DRIVE PROOF</span>
                  </button>
                  <a
                    href="https://drive.google.com/file/d/1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-drive-file"
                  >
                    <ExternalLink size={14} />
                    <span>Download Drive Source</span>
                  </a>
                </div>
              </div>



              <div className="research-notebook-strip">
                <div className="sticky-note-card pink">
                  <div className="pin-head" />
                  <div className="note-topic-tag">FIELD NOTE 09 // TEMPORAL KINEMATICS</div>
                  <div className="note-sub-tag">CONTINUOUS EMPIRICAL SHORELINE DRIFT</div>
                  <h4>Multi-Temporal Shoreline Migration Dynamics</h4>
                  <p>Continuous frame looping between consecutive dry-season acquisition dates isolates astronomical tidal shifts from genuine chronic erosion, clearly exposing a persistent landward migration corridor exceeding -6.24 m at dynamic barrier spit inlets.</p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "historical-comparison" && (
<section id="section-historical" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-pink">
                      <Calendar size={15} />
                      10. HISTORICAL COASTLINE TIMELINE (2020–2024 OBSERVED)
                    </span>
                    <h2 className="sec-title">Historical Coastline Evidence</h2>
                    <p className="sec-desc">
                      Follow actual historical observed shoreline changes from 2020 to 2024.
                      Select a year to inspect the satellite acquisition and extracted coastline vector.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=p_TShZRIVLLE`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View Historical Vectors in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Interactive Year Selector Bar */}
                <div className="historical-years-nav-bar">
                  {[2020, 2021, 2022, 2023, 2024].map((yr) => (
                    <button
                      key={yr}
                      className={`hist-year-btn ${activeHistoricalYear === yr ? 'active' : ''}`}
                      onClick={() => setActiveHistoricalYear(yr)}
                    >
                      <span className="btn-yr-text">{yr}</span>
                      <span className="btn-yr-sub">{yr === 2020 ? 'Baseline' : yr === 2024 ? 'Latest Observed' : 'Observed'}</span>
                    </button>
                  ))}
                </div>

                {/* Active Historical Year Display */}
                <div className="historical-active-display">
                  <div
                    className="hist-img-wrap clickable"
                    onClick={() => setSelectedImage({
                      src: HISTORICAL_YEARS[activeHistoricalYear].image,
                      title: HISTORICAL_YEARS[activeHistoricalYear].title,
                      category: "Historical Observed Shoreline",
                      date: `Year ${activeHistoricalYear}`,
                      metric: HISTORICAL_YEARS[activeHistoricalYear].retreat,
                      desc: HISTORICAL_YEARS[activeHistoricalYear].desc,
                      source: `Sentinel-2 & DeepLabV3+ Extraction (${activeHistoricalYear})`
                    })}
                  >
                    <img src={HISTORICAL_YEARS[activeHistoricalYear].image} alt={`Year ${activeHistoricalYear}`} />
                    <div className="hist-badge-overlay">
                      EPOCH {activeHistoricalYear} // {HISTORICAL_YEARS[activeHistoricalYear].status}
                    </div>
                  </div>

                  <div className="hist-text-wrap">
                    <span className="hist-status-pill">{HISTORICAL_YEARS[activeHistoricalYear].status}</span>
                    <h3>{HISTORICAL_YEARS[activeHistoricalYear].title}</h3>
                    <div className="hist-retreat-val">
                      Net Shift: <strong>{HISTORICAL_YEARS[activeHistoricalYear].retreat}</strong>
                    </div>
                    <p className="hist-desc">{HISTORICAL_YEARS[activeHistoricalYear].desc}</p>
                  </div>
                </div>

                {/* Interactive Before & After Comparison Slider: 2020 Baseline vs 2024 Observed */}
                <div className="comparison-slider-module" style={{ marginTop: '35px' }}>
                  <div className="slider-header-block">
                    <div className="slider-header-left">
                      <SplitSquareVertical size={18} className="text-pink" />
                      <h3>Interactive Before-and-After Slider: 2020 Baseline vs. 2024 Observed Shoreline</h3>
                    </div>
                    <span className="slider-hint">Drag horizontally to inspect 4-year cumulative retreat along Udupi coast</span>
                  </div>

                  <div
                    className="slider-stage-container"
                    ref={historySliderRef}
                    onMouseMove={(e) => {
                      if (!historySliderRef.current) return;
                      const rect = historySliderRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      setHistorySliderPos(pct);
                    }}
                  >
                    {/* Bottom Layer: 2024 Shoreline */}
                    <img
                      src="/shoreline/2024.png"
                      alt="2024 Shoreline"
                      className="slider-img-layer bottom"
                    />
                    <span className="slider-layer-label right">2024 LATEST OBSERVED</span>

                    {/* Top Layer: 2020 Baseline (Clipped with pixel-perfect clip-path) */}
                    <img
                      src="/shoreline/2020.png"
                      alt="2020 Baseline"
                      className="slider-img-layer top"
                      style={{ clipPath: `inset(0 ${100 - historySliderPos}% 0 0)` }}
                    />
                    <span className="slider-layer-label left">2020 REFERENCE BASELINE</span>

                    {/* Divider Line */}
                    <div
                      className="slider-divider-line"
                      style={{ left: `${historySliderPos}%` }}
                    >
                      <div className="slider-handle-pill">
                        <ChevronLeft size={12} />
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌊 EMBEDDED SHORELINE DYNAMICS ANIMATION SHOWCASE */}
                <div className="shoreline-anim-card-box">
                  <div className="anim-card-header">
                    <div className="anim-card-title-group">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="live-indicator">
                          <span className="dot" />
                          CONTINUOUS SATELLITE MORPHING LOOP
                        </span>
                        <span className="status-pill badge-pink">GOOGLE DRIVE ARCHIVE</span>
                      </div>
                      <h3>Multi-Temporal Shoreline Dynamics Animation (2020–2024)</h3>
                      <p>Empirical satellite raster shifts showing consecutive annual spit formation retreat and sediment redistribution.</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        className="btn-unique-anim-trigger"
                        onClick={() => setAnimModalOpen(true)}
                        title="Expand full-size multi-temporal shoreline animation"
                      >
                        <div className="anim-pulse-ring">
                          <div className="anim-pulse-core" />
                        </div>
                        <span className="btn-text-glow">▶ Fullscreen Animation</span>
                        <span className="btn-chip-tag">DRIVE PROOF</span>
                      </button>
                      <a
                        href="https://drive.google.com/file/d/1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-drive-file"
                      >
                        <ExternalLink size={13} />
                        <span>Drive Source</span>
                      </a>
                    </div>
                  </div>

                  <div className="anim-img-frame clickable" onClick={() => setAnimModalOpen(true)}>
                    <img
                      src="/shoreline_animation.gif"
                      alt="Multi-temporal Shoreline Dynamics Animation (2020-2024)"
                    />
                  </div>

                  <div className="anim-card-footer">
                    <div className="anim-footer-left">
                      <span><strong>Temporal Range:</strong> 2020 Baseline &rarr; 2024 Final Observed</span>
                      <span>•</span>
                      <span><strong>Sampling:</strong> 9-Channel DeepLabV3+ Vector Extraction</span>
                    </div>
                    <span>800 × 600 px · Verified Google Drive File ID: <code>1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4</code></span>
                  </div>
                </div>

                {/* SECTION G FIELD NOTES */}
                <div className="research-notebook-strip">
                  <div className="sticky-note-card yellow">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE 04 // TRANSECT KINEMATICS</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>DSAS METHOD</span>
                    </div>
                    <h4 className="sticky-note-title">End Point Rate (EPR)</h4>
                    <div className="sticky-formula-box">
                      EPR = (D_2024 - D_2020) / 4.0 yrs
                    </div>
                    <p className="sticky-note-text">
                      Cast orthogonally every 50 m across 1,944 baseline transects along the 97.2 km corridor, detecting critical hotspots up to -40 m/yr.
                    </p>
                  </div>

                  <div className="sticky-note-card rose">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // HOTSPOT VELOCITY</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>BENGRE SANDSPIT</span>
                    </div>
                    <h4 className="sticky-note-title">Critical Spit Retreat</h4>
                    <div className="sticky-formula-box">
                      Net Shift = -24.0 m  (≈ -6.0 m/yr)
                    </div>
                    <p className="sticky-note-text">
                      Intense littoral drift starvation at the river mouth confluence caused cumulative landward shoreline migration of 24 meters between 2020 and 2024.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "malpe-analysis" && (
<section id="section-malpe-standalone" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-tag-badge">
                    11. FIELD CASE STUDY: MALPE BEACH &amp; BENGRE SANDSPIT
                  </span>
                  <h2 className="sec-title">Malpe Beach &amp; Bengre Sandspit Dynamics</h2>
                  <p className="sec-desc">
                    High-resolution case study of the Bengre sand spit (13.35°N, 74.68°E) and Malpe fishing harbor breakwaters (13.36°N, 74.70°E).
                    Evaluating seasonal spit migration, estuarine inlet flushing, and downdrift scouring induced by port groynes.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href={`${COLAB_BASE}#scrollTo=p_TShZRIVLLE`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>View Bengre Kinematics in Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="triad-comparison-grid" style={{ marginBottom: '24px' }}>
                <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                  src: "/training_samples/sample1_input.png",
                  title: "Bengre Sand Spit - 9-Channel Fused Input Tensor",
                  category: "Malpe / Bengre Case Study",
                  date: "2020–2024",
                  metric: "9 Channels [9, 256, 256]",
                  desc: "Dynamic barrier spit where tidal flushing from Swarna-Sita estuary causes severe inlet migration.",
                  source: "GEE Fused Dataset"
                })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="panel-badge-top">INPUT TENSOR // BENGRE SPIT</div>
                  <img src="/training_samples/sample1_input.png" alt="Bengre Input" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>Bengre Spit (13.35°N, 74.68°E)</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>Highly dynamic sandy barrier spit where tidal flushing and longshore drift cause severe seasonal inlet migration.</p>
                </div>

                <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                  src: "/training_samples/sample1_pred.png",
                  title: "DeepLabV3+ Predicted Coastline Mask: Bengre Spit",
                  category: "Malpe / Bengre Case Study",
                  date: "AI Segmentation",
                  metric: "Dice Score: 0.8624",
                  desc: "Sub-pixel accurate boundary delineation capturing narrow spit breaches and sediment hooks.",
                  source: "DeepLabV3+ Inference"
                })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="panel-badge-top" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>AI SEGMENTED // 0.8624 DICE</div>
                  <img src="/training_samples/sample1_pred.png" alt="Bengre Prediction" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>AI Segmented Coastline Mask</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>Continuously traces water-land interface even along shallow surf zones and saturated intertidal shoals.</p>
                </div>

                <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                  src: "/training_samples/sample2_input.png",
                  title: "Malpe Port & North Breakwater Structures",
                  category: "Malpe / Bengre Case Study",
                  date: "Coastal Engineering",
                  metric: "Hard Armored Breakwater",
                  desc: "Artificial hard breakwaters causing updrift sand accretion and downdrift erosion.",
                  source: "GEE Fused Dataset"
                })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="panel-badge-top" style={{ background: 'rgba(244,63,94,0.2)', color: '#f43f5e' }}>HARD ARMORING // MALPE PORT</div>
                  <img src="/training_samples/sample2_input.png" alt="Malpe Port" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>Malpe Port &amp; Breakwaters</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>Artificial breakwaters cause downdrift sand accretion to the south and acute erosion hotspots to the north.</p>
                </div>
              </div>

              <div className="research-notebook-strip">
                <div className="sticky-note-card amber">
                  <div className="pin-head" />
                  <div className="note-topic-tag">FIELD NOTE 11 // IN-SITU SURVEY DATUM</div>
                  <div className="note-sub-tag">BENGRE SPIT INTERTIDAL GRADIENT</div>
                  <h4>In-situ Beach Slope tan(β) = 0.03 (1:33 Slope)</h4>
                  <p>Field survey transects conducted at Bengre spit recorded an average foreshore beach gradient of 1.72° (tan β = 0.03). This calibrated datum ensures that high-tide vs low-tide satellite shoreline shifts are corrected by ΔX = (H_tide - H_ref) / 0.03, eliminating tidal bias from genuine erosion rates.</p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "other-beaches" && (
<section id="section-beaches-standalone" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-tag-badge">
                      12. REGIONAL ANALYSIS: KAUP, PADUBIDRI &amp; COASTAL CORRIDOR
                    </span>
                    <h2 className="sec-title">Kaup, Padubidri &amp; Regional Beach Analysis</h2>
                    <p className="sec-desc">
                      Comparative analysis of morphodynamic beach types along Udupi's 97.2 km coast:
                      from riprap-armored Blue Flag beach at Padubidri to rocky basalt headlands at Kaup and natural dynamic beaches.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href="https://major-project-coastal-ai.vercel.app/coastal_environmental_dataset.csv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <Download size={16} />
                      <span>Download Transect Dataset (CSV)</span>
                    </a>
                  </div>
                </div>

                <div className="triad-comparison-grid" style={{ marginBottom: '24px' }}>
                  <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                    src: "/training_samples/sample3_input.png",
                    title: "Padubidri Armored Beach & Rock Groynes",
                    category: "Regional Beaches",
                    date: "2020–2024",
                    metric: "Riprap Seawall Armoring",
                    desc: "Mixed coastline with riprap seawalls and rock groynes, showing downdrift scouring on adjacent unprotected beaches.",
                    source: "GEE Fused Dataset"
                  })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="panel-badge-top" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>BLUE FLAG // PADUBIDRI</div>
                    <img src="/training_samples/sample3_input.png" alt="Padubidri Input" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>Padubidri Armored Beach</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>Mixed coastline with riprap seawalls and rock groynes, showing downdrift scouring on adjacent unprotected beaches.</p>
                  </div>

                  <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                    src: "/training_samples/sample3_pred.png",
                    title: "DeepLabV3+ Predicted Shoreline: Padubidri Beach",
                    category: "Regional Beaches",
                    date: "AI Segmentation",
                    metric: "Dice: 0.8580",
                    desc: "Sharp seawall edge extraction separating artificial rock armour from wet sand.",
                    source: "DeepLabV3+ Inference"
                  })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="panel-badge-top" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>AI DELINEATED // 0.8580 DICE</div>
                    <img src="/training_samples/sample3_pred.png" alt="Padubidri Prediction" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>Padubidri Shoreline Vector</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>DeepLabV3+ successfully distinguishes between dark riprap boulders and turbid foaming surf.</p>
                  </div>

                  <div className="triad-panel-card clickable" onClick={() => setSelectedImage({
                    src: "/satellite_bands/s2_b12_swir2.png",
                    title: "Kaup Rocky Headlands - SWIR-2 Spectral Contrast",
                    category: "Regional Beaches",
                    date: "Geological Baseline",
                    metric: "Basalt Promontory (2190 nm)",
                    desc: "SWIR-2 band isolates igneous rocky headlands at Kaup lighthouse, which naturally attenuate wave energy.",
                    source: "Copernicus Sentinel-2 BOA"
                  })} style={{ background: '#0b1120', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="panel-badge-top" style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308' }}>ROCKY HEADLAND // KAUP</div>
                    <img src="/satellite_bands/s2_b12_swir2.png" alt="Kaup Rocks" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginTop: '10px' }}>Kaup Basalt Headlands</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>Natural rock promontories anchor the coastline and produce calm sediment deposition pockets.</p>
                  </div>
                </div>

                <div className="research-notebook-strip">
                  <div className="sticky-note-card rose">
                    <div className="pin-head" />
                    <div className="note-topic-tag">FIELD NOTE 12 // REGIONAL GEOMORPHOLOGY</div>
                    <div className="note-sub-tag">SPATIAL VARIATION ACROSS 97.2 KM</div>
                    <h4>Morphodynamic Control of Coastal Erosion</h4>
                    <p>While unarmored barrier spits like Bengre experience severe retreat rates reaching -40 m/yr, rocky headlands at Kaup exhibit near-zero change (±0.2 m/yr), and Padubidri demonstrates localized downdrift accretion of +12 m behind rock groyne compartments.</p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "ml-models" && (
<section id="section-architecture" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-cyan">
                      <Cpu size={15} />
                      13. DEEPLABV3+ ARCHITECTURE
                    </span>
                    <h2 className="sec-title">How Our AI Model Works</h2>
                    <p className="sec-desc">
                      Interactive architecture walkthrough of DeepLabV3+ with ResNet-34 encoder.
                      Click any architectural block to inspect its mathematical formulation and layer specifications.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href={`${COLAB_BASE}#scrollTo=BsvAxeoEWbwH`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View PyTorch Architecture in Colab</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Interactive Clickable Architecture Pipeline */}
                <div className="architecture-pipeline-row">
                  {ARCHITECTURE_BLOCKS.map((block) => (
                    <div
                      key={block.id}
                      className={`arch-pipeline-node ${activeArchBlock === block.id ? 'active' : ''}`}
                      onClick={() => setActiveArchBlock(block.id)}
                    >
                      <span className="arch-node-title">{block.title.split(". ")[1]}</span>
                      <span className="arch-node-badge">{block.badge.split(":")[0]}</span>
                    </div>
                  ))}
                </div>

                {/* Active Architecture Block Detail Card */}
                {(() => {
                  const currentBlock = ARCHITECTURE_BLOCKS.find(b => b.id === activeArchBlock) || ARCHITECTURE_BLOCKS[0];
                  return (
                    <div className="active-arch-detail-card">
                      <div className="arch-detail-header">
                        <div>
                          <span className="arch-detail-badge">{currentBlock.badge}</span>
                          <h3>{currentBlock.title}</h3>
                        </div>
                        <div className="arch-detail-formula">
                          <code>{currentBlock.formula}</code>
                        </div>
                      </div>
                      <p className="arch-detail-desc">{currentBlock.desc}</p>
                    </div>
                  );
                })()}

                {/* Baseline Models Comparison Explanation */}
                <div className="baseline-explanation-box">
                  <div className="baseline-header">
                    <AlertTriangle size={18} className="text-amber" />
                    <h4>Why Earlier Machine Learning Experiments Achieved 51%–54% Accuracy:</h4>
                  </div>
                  <p>
                    During Phase 1 and Phase 2 of this project, traditional algorithms were evaluated:
                    <strong> Random Forest (51.0%–54.0%)</strong>, <strong>XGBoost (53.0%)</strong>, and <strong>SVM (38.0%)</strong>.
                    These models operated solely on geometric coordinate tabular vectors (<code>centroid_x, centroid_y, angle</code>) without spatial pixel receptive fields.
                    They were blind to spectral reflectance, surface water absorption, and textural context.
                    By switching to <strong>DeepLabV3+ with a 9-channel multi-spectral input tensor</strong>, the model learned spatial semantic textures, reaching the benchmark <strong>85.48% Dice score</strong>.
                  </p>
                </div>

                {/* SECTION E FIELD NOTES */}
                <div className="research-notebook-strip">
                  <div className="sticky-note-card cyan">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // MULTI-SCALE RECEPTIVE FIELD</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>ASPP MODULE</span>
                    </div>
                    <h4 className="sticky-note-title">Atrous Spatial Pyramid Pooling</h4>
                    <div className="sticky-formula-box">
                      y[i] = ∑_k x[i + r·k]·w[k]  (r ∈ &#123;6, 12, 18&#125;)
                    </div>
                    <p className="sticky-note-text">
                      Parallel dilated convolutions sample multi-scale contextual features without shrinking spatial raster resolution, preserving fine linear sandspit contours.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "methodology" && (
<section id="section-methodology-standalone" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-tag-badge">
                      14. RESEARCH METHODOLOGY &amp; GEOSPATIAL PHYSICS
                    </span>
                    <h2 className="sec-title">Research Methodology &amp; Geospatial Physics</h2>
                    <p className="sec-desc">
                      The comprehensive 4-stage empirical methodology combining Earth Observation, Deep Learning semantic segmentation,
                      astronomical tidal physics calibration, and digital shoreline kinematics.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href="https://colab.research.google.com/drive/1WY69PjVR80VufipCMAIGd3vFHstoAenv?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pink-colab"
                    >
                      <FileCode size={16} />
                      <span>View DSAS Kinematics Notebook</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="study-provenance-grid" style={{ marginBottom: '28px' }}>
                  <div className="provenance-item">
                    <span className="lbl"><Database size={14} /> STAGE 1: GEE SATELLITE INGESTION</span>
                    <span className="val">Harmonized 9-Channel Fusion</span>
                    <span className="sub">Sentinel-1 SAR (VV+VH) + Sentinel-2 MSI (7 Bands) with QA60 cloud masking.</span>
                  </div>
                  <div className="provenance-item highlight">
                    <span className="lbl"><Cpu size={14} /> STAGE 2: DEEPLABV3+ SEGMENTATION</span>
                    <span className="val">ResNet-34 Backbone + ASPP</span>
                    <span className="sub">0.8548 Validation Dice score with compound BCE + Dice loss objective.</span>
                  </div>
                  <div className="provenance-item">
                    <span className="lbl"><Compass size={14} /> STAGE 3: TIDAL DATUM CORRECTION</span>
                    <span className="val">ΔX = (H_tide - H_ref) / tan(0.03)</span>
                    <span className="sub">Removes astronomical tide elevation bias using in-situ beach slope β = 1.72°.</span>
                  </div>
                  <div className="provenance-item">
                    <span className="lbl"><TrendingUp size={14} /> STAGE 4: DSAS TRANSECT KINEMATICS</span>
                    <span className="val">1,944 Transects @ 50m Spacing</span>
                    <span className="sub">Calculates End Point Rate (EPR), LRR, and Net Shoreline Movement along 97.2 km.</span>
                  </div>
                </div>

                <div className="research-notebook-strip">
                  <div className="sticky-note-card purple">
                    <div className="pin-head" />
                    <div className="note-topic-tag">FIELD NOTE 14 // GEOSPATIAL PHYSICS</div>
                    <div className="note-sub-tag">END-TO-END PHYSICAL RIGOR</div>
                    <h4>Why Independent Physics Calibration is Essential</h4>
                    <p>Without tidal datum correction, a 1-meter difference in astronomical tide on a gentle 1:33 beach slope translates to an apparent horizontal shoreline displacement of 33.3 meters. Our methodology strictly corrects for tidal elevation before feeding vectors into the DSAS kinematic rate engine.</p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "validation-accuracy" && (
<section id="section-geospatial" className="lab-section">
                <div className="lab-section-header">
                  <div className="header-left">
                    <span className="sec-badge text-cyan">
                      <Compass size={15} />
                      15. GEOSPATIAL VERIFICATION
                    </span>
                    <h2 className="sec-title">QGIS &amp; Google Earth Pro Evidence</h2>
                    <p className="sec-desc">
                      High-resolution sub-meter spatial verification. Manually digitised reference lines verify
                      our DeepLabV3+ machine-learning extracted boundaries and QGIS baseline transects.
                    </p>
                  </div>
                  <div className="colab-btn-group">
                    <a
                      href="/coastal_environmental_dataset.csv"
                      download="coastal_environmental_dataset.csv"
                      className="btn-pink-colab"
                    >
                      <Download size={16} />
                      <span>Download Transect Dataset (CSV)</span>
                    </a>
                  </div>
                </div>

                <div className="tab-two-col-grid">
                  <div
                    className="pane-image-block clickable"
                    onClick={() => setSelectedImage({
                      src: "/geospatial_verification/qgis_transects_overview.png",
                      title: "QGIS Desktop Project: 1,944 Orthogonal Transects",
                      category: "QGIS Screenshot",
                      date: "EPSG:32643 UTM 43N",
                      metric: "1,944 Baseline Transects",
                      desc: "Orthogonal transects cast at 50m intervals along the 97.2 km reference baseline in QGIS desktop.",
                      source: "QGIS 3.28 LTR Project"
                    })}
                  >
                    <img src="/geospatial_verification/qgis_transects_overview.png" alt="QGIS Transects Overview" />
                    <div className="img-caption-bar">
                      <span>QGIS Project: 1,944 Transects @ 50m Spacing</span>
                      <Maximize2 size={14} />
                    </div>
                  </div>

                  <div
                    className="pane-image-block clickable"
                    onClick={() => setSelectedImage({
                      src: "/geospatial_verification/google_earth_pro_ground_truth.png",
                      title: "Google Earth Pro Sub-Meter Validation",
                      category: "Google Earth Pro",
                      date: "High-Resolution Imagery",
                      metric: "Sub-Meter Ground Truth",
                      desc: "Direct comparison between DeepLabV3+ predicted boundary (green) and manually digitised ground truth (pink dashed line).",
                      source: "Google Earth Pro Historical Basemap"
                    })}
                  >
                    <img src="/geospatial_verification/google_earth_pro_ground_truth.png" alt="Google Earth Pro Validation" />
                    <div className="img-caption-bar">
                      <span>Google Earth Pro: AI Predicted vs Digitised Ground Truth</span>
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </div>

                <div className="geospatial-note-box" style={{ marginTop: '20px' }}>
                  <h4>Why Independent Geospatial Verification Matters:</h4>
                  <p>
                    To confirm that DeepLabV3+ was not fitting to optical cloud artifacts or surf-foam shadows,
                    1,944 perpendicular transects were projected in QGIS onto sub-meter historical Google Earth Pro aerial imagery.
                    The spatial alignment confirms accurate detection of breakwaters, seawalls, and river mouths across the 97.2 km coastline.
                  </p>
                </div>

                {/* SECTION H FIELD NOTES */}
                <div className="research-notebook-strip">
                  <div className="sticky-note-card cyan">
                    <div className="pin-accent" />
                    <div className="sticky-note-header">
                      <span className="sticky-tag">FIELD NOTE // COORDINATE PROJECTION</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>QGIS DESKTOP</span>
                    </div>
                    <h4 className="sticky-note-title">UTM Zone 43N Reprojection</h4>
                    <div className="sticky-formula-box">
                      EPSG:4326 (WGS84) ⟶ EPSG:32643
                    </div>
                    <p className="sticky-note-text">
                      Reprojects latitude/longitude to metric Cartesian coordinates (UTM 43N) so all transect offsets and EPR velocities measure true physical meters along the coast.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeCategory === "transect-kinematics" && (
<section id="section-transects" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-badge text-emerald">
                    <Layers size={15} />
                    16. TRANSECT KINEMATICS &amp; DSAS ANALYSIS
                  </span>
                  <h2 className="sec-title">Erosion &amp; Accretion Analysis</h2>
                  <p className="sec-desc">
                    Kinematic calculations using the Digital Shoreline Analysis System (DSAS) methodology.
                    1,944 transects, tidal correction formula, and longshore rate profiles.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href={`${COLAB_BASE}#scrollTo=p_TShZRIVLLE`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>View EPR Calculations in Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Key Verified Recorded Figures */}
              <div className="metrics-dashboard-grid">
                <div className="metric-box-card">
                  <span className="m-label">Analyzed Baseline Transects</span>
                  <strong className="m-score text-cyan">1,944 Transects</strong>
                  <p className="m-desc">Cast orthogonally at 50 m alongshore intervals across 97.2 km.</p>
                </div>

                <div className="metric-box-card">
                  <span className="m-label">Severe Erosion Coastline</span>
                  <strong className="m-score text-pink">7.65 km (EPR &lt; -2 m/yr)</strong>
                  <p className="m-desc">Critical hotspots concentrated at Bengre Spit, Malpe, and Hejamadi.</p>
                </div>

                <div className="metric-box-card">
                  <span className="m-label">Projected 2029 Cumulative Loss</span>
                  <strong className="m-score text-amber">7.88 Hectares</strong>
                  <p className="m-desc">Calculated via alongshore integral of negative EPR velocities.</p>
                </div>

                <div className="metric-box-card">
                  <span className="m-label">Average Beach Slope (tan beta)</span>
                  <strong className="m-score text-emerald">0.03 (1:33 Slope)</strong>
                  <p className="m-desc">In-situ parameter utilized for physics-based tidal elevation de-biasing.</p>
                </div>
              </div>

              {/* Longshore Profile & Scatter Plot */}
              <div className="tab-two-col-grid" style={{ marginTop: '28px' }}>
                <div
                  className="pane-image-block clickable"
                  onClick={() => setSelectedImage({
                    src: "/longshore_rate_profile.png",
                    title: "Figure 2: Longshore EPR Profile (1,944 Transects)",
                    category: "Research Results",
                    date: "2020–2024 Observed",
                    metric: "1,944 Transects",
                    desc: "50-transect moving average trend confirms 3 regimes: Northern Stable, Central Severe Erosion, and Southern Moderate Erosion.",
                    source: "IEEE Research Paper (Fig. 2)"
                  })}
                >
                  <img src="/longshore_rate_profile.png" alt="Longshore Rate Profile" />
                  <div className="img-caption-bar">
                    <span>Longshore Rate Profile (Fig. 2 - 1,944 Transects)</span>
                    <Maximize2 size={14} />
                  </div>
                </div>

                <div
                  className="pane-image-block clickable"
                  onClick={() => setSelectedImage({
                    src: "/scatter_rate_comparison.png",
                    title: "Figure 3: DeepLabV3+ vs GEE Ground Truth Scatter Plot",
                    category: "Research Results",
                    date: "Validation Phase",
                    metric: "Pearson r = 0.409",
                    desc: "Scatter plot benchmarking DeepLabV3+ automated EPR against GEE ground truth across 1,944 transects.",
                    source: "IEEE Research Paper (Fig. 3)"
                  })}
                >
                  <img src="/scatter_rate_comparison.png" alt="Scatter Rate Comparison" />
                  <div className="img-caption-bar">
                    <span>DeepLabV3+ vs GEE Scatter Plot (Fig. 3)</span>
                    <Maximize2 size={14} />
                  </div>
                </div>
              </div>

              {/* SECTION I FIELD NOTES */}
              <div className="research-notebook-strip">
                <div className="sticky-note-card amber">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE 03 // GEOSPATIAL PHYSICS</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>IN-SITU DATUM</span>
                  </div>
                  <h4 className="sticky-note-title">Tidal Datum Correction</h4>
                  <div className="sticky-formula-box">
                    ΔX = (H_tide - H_ref) / tan(0.03)
                  </div>
                  <p className="sticky-note-text">
                    Removes astronomical tide elevation bias between satellite acquisitions using in-situ measured beach gradient (tan β = 0.03 = 1:33 slope).
                  </p>
                </div>

                <div className="sticky-note-card mint">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE // AREA INTEGRAL</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>LAND LOSS PROJECTION</span>
                  </div>
                  <h4 className="sticky-note-title">Cumulative Land Loss Integral</h4>
                  <div className="sticky-formula-box">
                    ΔA = ∑ EPR_i · Δt · Δs  (Δs = 50m)
                  </div>
                  <p className="sticky-note-text">
                    Alongshore numerical integration reveals 7.88 hectares of net coastal land loss projected along the Udupi corridor by 2029.
                  </p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "future-predictions" && (
<section id="section-future" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-badge text-pink">
                    <TrendingUp size={15} />
                    17. FUTURE PREDICTIONS (2025–2029 FORECAST)
                  </span>
                  <h2 className="sec-title">Future Shoreline Predictions</h2>
                  <p className="sec-desc">
                    Simulated future shoreline kinematics and cumulative land-loss forecasts (2025–2029).
                    Clearly distinguished from historical satellite observations.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href={`${COLAB_BASE}#scrollTo=1K1Z-0f4R-15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <FileCode size={16} />
                    <span>View Forecasting Model in Colab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="pane-summary-banner forecast">
                <AlertTriangle size={18} className="text-pink" />
                <div>
                  <strong>IMPORTANT SCIENTIFIC DISTINCTION:</strong> Years 2020–2024 represent actual historical satellite observations. Years 2025–2029 represent forward-looking simulations generated via linear EPR kinematic extrapolation and downstream XGBoost coastal hazard risk modeling.
                </div>
              </div>

              {/* Interactive Future Year Selector Bar */}
              <div className="historical-years-nav-bar">
                {[2025, 2026, 2027, 2028, 2029].map((yr) => (
                  <button
                    key={yr}
                    className={`hist-year-btn ${activeFutureYear === yr ? 'active' : ''}`}
                    onClick={() => setActiveFutureYear(yr)}
                  >
                    <span className="btn-yr-text">{yr}</span>
                    <span className="btn-yr-sub">{yr === 2029 ? 'Final Benchmark' : `+${yr - 2024}y Simulation`}</span>
                  </button>
                ))}
              </div>

              {/* Active Future Year Card */}
              <div className="future-year-active-card">
                <div className="future-card-header">
                  <div>
                    <span className="future-status-pill">{FUTURE_YEARS[activeFutureYear].status}</span>
                    <h3>Year {activeFutureYear} Projected Coastal Impact</h3>
                  </div>
                  <div className="future-risk-pill">
                    <span>Vulnerability Rating</span>
                    <strong>{FUTURE_YEARS[activeFutureYear].riskTier}</strong>
                  </div>
                </div>

                <div className="future-stats-trio">
                  <div className="stat-trio-box">
                    <span className="lbl">Mean Coastline Shift</span>
                    <strong className="val text-pink">{FUTURE_YEARS[activeFutureYear].meanShift}</strong>
                  </div>
                  <div className="stat-trio-box">
                    <span className="lbl">Cumulative Land Loss</span>
                    <strong className="val text-amber">{FUTURE_YEARS[activeFutureYear].landLoss}</strong>
                  </div>
                  <div className="stat-trio-box">
                    <span className="lbl">Peak Hotspot Retreat</span>
                    <strong className="val text-red">{activeFutureYear === 2029 ? '-24.0 m (Bengre Spit)' : '-14.5 m'}</strong>
                  </div>
                </div>

                <p className="future-card-desc">{FUTURE_YEARS[activeFutureYear].desc}</p>
              </div>

              {/* 3-Panel Forecast & XGBoost Feature Importance */}
              <div className="tab-two-col-grid" style={{ marginTop: '28px' }}>
                <div
                  className="pane-image-block clickable"
                  onClick={() => setSelectedImage({
                    src: "/forecast/final_graph_3panel.jpg",
                    title: "3-Panel Forecasting Summary (2020–2029)",
                    category: "Future Projections",
                    date: "2020–2029",
                    metric: "Net Movement & Land Loss",
                    desc: "Integrated 3-panel projection displaying average net shoreline shift, cumulative land loss, and vulnerability quantification.",
                    source: "Technical Validation Report"
                  })}
                >
                  <img src="/forecast/final_graph_3panel.jpg" alt="3-Panel Forecast Summary" />
                  <div className="img-caption-bar">
                    <span>3-Panel Forecasting Summary (2020–2029)</span>
                    <Maximize2 size={14} />
                  </div>
                </div>

                <div
                  className="pane-image-block clickable"
                  onClick={() => setSelectedImage({
                    src: "/env_feature_importance.png",
                    title: "XGBoost Hazard Model Feature Importance (Fig. 5)",
                    category: "Environmental ML",
                    date: "84.8% Accuracy",
                    metric: "Wave Height & Monsoon Exposure",
                    desc: "Feature importance hierarchy confirming Significant Wave Height and Monsoon Exposure Index dominate erosion hazard risk.",
                    source: "IEEE Research Paper (Fig. 5)"
                  })}
                >
                  <img src="/env_feature_importance.png" alt="XGBoost Feature Importance" />
                  <div className="img-caption-bar">
                    <span>XGBoost Environmental Risk Importance (84.8% Acc)</span>
                    <Maximize2 size={14} />
                  </div>
                </div>
              </div>

              <div className="geospatial-note-box" style={{ marginTop: '20px' }}>
                <h4>Prediction Methodology &amp; Uncertainty Boundaries:</h4>
                <p>
                  Linear EPR extrapolation assumes steady-state sediment kinematics. Physical storm surges exceeding 4.2m wave height or unexpected seawall installations will alter local retreat trajectories. A future ConvLSTM temporal recurrent model trained across the full annual series would further enhance seasonal non-linear capture.
                </p>
              </div>

              {/* SECTION J FIELD NOTES */}
              <div className="research-notebook-strip">
                <div className="sticky-note-card purple">
                  <div className="pin-accent" />
                  <div className="sticky-note-header">
                    <span className="sticky-tag">FIELD NOTE // HAZARD ENSEMBLE</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>XGBOOST CLASSIFIER</span>
                  </div>
                  <h4 className="sticky-note-title">XGBoost Risk Tiering</h4>
                  <div className="sticky-formula-box">
                    ŷ_i = ∑_k f_k(H_s, T_p, M_index, tan β)
                  </div>
                  <p className="sticky-note-text">
                    Achieves 84.8% classification accuracy, predicting that 46.8% of the central district coastline will face High/Severe erosion vulnerability under monsoonal swell.
                  </p>
                </div>
              </div>
            </section>
            )}

            {activeCategory === "results-gallery" && (
<section id="section-library" className="lab-section">
              <div className="lab-section-header">
                <div className="header-left">
                  <span className="sec-badge text-emerald">
                    <Database size={15} />
                    18. CENTRALIZED RESEARCH EVIDENCE LIBRARY
                  </span>
                  <h2 className="sec-title">Research Evidence Library</h2>
                  <p className="sec-desc">
                    Searchable, categorized archive containing all satellite imagery, spectral bands, composites,
                    NDWI pipeline outputs, training samples, confusion matrices, and geospatial verification artifacts.
                  </p>
                </div>
                <div className="colab-btn-group">
                  <a
                    href="/coastal_environmental_dataset.csv"
                    download="coastal_environmental_dataset.csv"
                    className="btn-pink-colab"
                  >
                    <Download size={16} />
                    <span>Download All Data (CSV)</span>
                  </a>
                </div>
              </div>

              {/* Search Bar & Category Filter Chips */}
              <div className="library-search-filter-block">
                <div className="library-search-input-wrap">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search library by title, band, algorithm, or metric (e.g. 'NDWI', 'Dice', 'Sentinel-1', 'Bengre')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="library-category-chips-row">
                  {[
                    "All",
                    "Band Composites",
                    "Sentinel-1 Bands",
                    "Sentinel-2 Bands",
                    "NDWI Outputs",
                    "Training Dataset",
                    "Ground Truth Masks",
                    "Model Predictions",
                    "Training Evidence",
                    "Validation Evidence",
                    "QGIS Screenshots",
                    "Google Earth Pro Screenshots",
                    "Research Results"
                  ].map((cat) => (
                    <button
                      key={cat}
                      className={`lib-filter-chip ${selectedLibCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedLibCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uniform Dimensions Responsive Card Grid */}
              <div className="evidence-masonry-grid">
                {filteredLibrary.map((item) => (
                  <div
                    key={item.id}
                    className="evidence-card clickable"
                    onClick={() => setSelectedImage({
                      src: item.image,
                      title: item.title,
                      category: item.category,
                      date: "Project Research Asset",
                      desc: item.desc,
                      source: "Coastal AI Research Archive"
                    })}
                  >
                    <div className="evidence-thumb-wrap">
                      <span className="card-category-badge">{item.category}</span>
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="card-zoom-hover">
                        <Maximize2 size={18} />
                        <span>Click to Zoom</span>
                      </div>
                    </div>

                    <div className="evidence-card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredLibrary.length === 0 && (
                <div className="library-empty-state">
                  <Info size={24} className="text-amber" />
                  <p>No research assets found matching "{searchQuery}". Try searching for 'B8', 'Dice', 'SAR', or 'Transects'.</p>
                </div>
              )}
            </section>
            )}


            {/* CHAPTER DETAIL BOTTOM NAVIGATION BAR */}
            <div className="chapter-bottom-nav-bar">
              <button
                className="btn-back-to-hub"
                onClick={() => {
                  setActiveCategory(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ChevronLeft size={18} />
                <span>← Return to Research Lab Hub</span>
              </button>

              <div className="chapter-step-buttons">
                <button
                  className="btn-chapter-step"
                  disabled={currentChapterIndex <= 0}
                  onClick={() =>
                    goToChapter(RESEARCH_CHAPTERS[currentChapterIndex - 1].id)
                  }
                  title="Previous section"
                >
                  <ChevronLeft size={16} />
                  <span>Previous Section</span>
                </button>
                <button
                  className="btn-chapter-step"
                  disabled={currentChapterIndex >= RESEARCH_CHAPTERS.length - 1}
                  onClick={() =>
                    goToChapter(RESEARCH_CHAPTERS[currentChapterIndex + 1].id)
                  }
                  title="Next section"
                >
                  <span>Next Section</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}



        {/* ========================================================
            FULL-SCREEN VIVA PRESENTATION MODE MODAL
            ======================================================== */}
        <AnimatePresence>
          {presentationMode && (
            <motion.div
              className="presentation-mode-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="presentation-container">
                {/* Presentation Top Bar */}
                <div className="presentation-top-bar">
                  <div className="presentation-title-left">
                    <span className="pres-badge">{PRESENTATION_SLIDES[currentSlide].badge}</span>
                    <h2>{PRESENTATION_SLIDES[currentSlide].title}</h2>
                  </div>
                  <div className="presentation-controls-right">
                    <span className="slide-counter-badge">Slide {currentSlide + 1} of {PRESENTATION_SLIDES.length}</span>
                    <button
                      className="btn-exit-presentation"
                      onClick={() => setPresentationMode(false)}
                      title="Exit Presentation Mode (Esc)"
                    >
                      <X size={18} />
                      <span>Exit Presentation</span>
                    </button>
                  </div>
                </div>

                {/* Presentation Main Slide Content */}
                <div className="presentation-slide-body">
                  <div className="slide-image-container">
                    <img
                      src={PRESENTATION_SLIDES[currentSlide].image}
                      alt={PRESENTATION_SLIDES[currentSlide].title}
                    />
                  </div>

                  <div className="slide-notes-container">
                    <h3>Examiner Key Takeaways &amp; Findings:</h3>
                    <ul className="slide-bullet-points">
                      {PRESENTATION_SLIDES[currentSlide].takeaways.map((point, idx) => (
                        <li key={idx}>
                          <CheckCircle size={16} className="bullet-icon text-emerald" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Presentation Bottom Navigation Bar */}
                <div className="presentation-bottom-nav">
                  <button
                    className="pres-nav-btn prev"
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  >
                    <ChevronLeft size={18} />
                    <span>Previous Slide</span>
                  </button>

                  {/* Dot pagination */}
                  <div className="pres-dots-row">
                    {PRESENTATION_SLIDES.map((_, idx) => (
                      <span
                        key={idx}
                        className={`pres-dot ${currentSlide === idx ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                      />
                    ))}
                  </div>

                  <button
                    className="pres-nav-btn next"
                    disabled={currentSlide === PRESENTATION_SLIDES.length - 1}
                    onClick={() => setCurrentSlide((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))}
                  >
                    <span>Next Slide</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            FULLSCREEN LIGHTBOX MODAL (PORTAL DIRECTLY TO BODY)
            ======================================================== */}
        <AnimatePresence>
          {selectedImage && typeof document !== "undefined" && createPortal(
            <motion.div
              className="evidence-lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              {/* High-visibility viewport fixed close button */}
              <button
                type="button"
                className="global-lightbox-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                aria-label="Close image"
              >
                <X size={26} strokeWidth={3} />
              </button>

              <motion.div
                className="evidence-lightbox-modal"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="lightbox-close-btn lightbox-close-btn-fixed"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close image"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>

                <div className="lightbox-image-wrap">
                  <img src={selectedImage.src} alt={selectedImage.title} />
                </div>

                <div className="lightbox-details-wrap">
                  <div className="lightbox-meta-top">
                    {selectedImage.category && (
                      <span className="lightbox-cat-badge">{selectedImage.category}</span>
                    )}
                    {selectedImage.date && (
                      <span className="lightbox-date-badge"><Calendar size={12} /> {selectedImage.date}</span>
                    )}
                  </div>

                  {selectedImage.metric && (
                    <span className="lightbox-metric-badge">{selectedImage.metric}</span>
                  )}

                  <h3>{selectedImage.title}</h3>
                  <p>{selectedImage.desc}</p>

                  {selectedImage.source && (
                    <div className="lightbox-source-tag">
                      <FileCode size={14} />
                      <span><strong>Provenance:</strong> {selectedImage.source}</span>
                    </div>
                  )}

                  <div className="lightbox-footer-actions">
                    <a
                      href={selectedImage.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-raw"
                    >
                      <ExternalLink size={14} />
                      <span>Open Full-Resolution Asset</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>

        {/* ========================================================
            CINEMATIC SHORELINE DYNAMICS ANIMATION MODAL (GOOGLE DRIVE: 1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4)
            ======================================================== */}
        <AnimatePresence>
          {animModalOpen && typeof document !== "undefined" && createPortal(
            <motion.div
              className="anim-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnimModalOpen(false)}
            >
              {/* Floating Top-Right Viewport Close Button */}
              <button
                type="button"
                className="global-lightbox-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setAnimModalOpen(false);
                }}
                aria-label="Close animation modal"
              >
                <X size={26} strokeWidth={3} />
              </button>

              <motion.div
                className="anim-modal-container"
                initial={{ scale: 0.82, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.82, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="anim-modal-header">
                  <div>
                    <span className="sec-badge text-pink" style={{ marginBottom: '4px' }}>
                      <Radio size={14} />
                      EMPIRICAL SATELLITE EVIDENCE // SHORELINE ANIMATION
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                      Multi-Temporal Shoreline Dynamics Animation (2020 &rarr; 2024)
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="video-modal-close lightbox-close-btn-fixed"
                    onClick={() => setAnimModalOpen(false)}
                    aria-label="Close animation modal"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="anim-modal-body">
                  <img
                    src="/shoreline_animation.gif"
                    alt="Multi-temporal Shoreline Dynamics Animation"
                  />
                </div>

                <div className="anim-modal-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="live-indicator"><span className="dot" /> LIVE TIME-LAPSE LOOP</span>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      Annual satellite coastline vectors extracted via 9-channel DeepLabV3+ along 97.2 km corridor
                    </span>
                  </div>
                  <a
                    href="https://drive.google.com/file/d/1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-colab"
                  >
                    <ExternalLink size={14} />
                    <span>Open in Google Drive</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>

        {/* ========================================================
            FLOATING QUICK-JUMP SECTION NAVIGATOR DOCK
            ======================================================== */}
        {/* FLOATING QUICK-JUMP SECTION NAVIGATOR DOCK */}
        <nav className="floating-section-dock" aria-label="Quick Section Navigation">
          <button
            className="dock-pill-btn dock-top-btn"
            onClick={() => {
              setActiveCategory(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title={activeCategory ? "Return to Research Directory" : "Scroll to Top"}
          >
            ↑ Top
          </button>
          <button className={`dock-pill-btn ${activeCategory === "sentinel-bands" ? "active" : ""}`} onClick={() => navigateToSection("sentinel-bands")}>1. Bands</button>
          <button className={`dock-pill-btn ${activeCategory === "band-composites" ? "active" : ""}`} onClick={() => navigateToSection("band-composites")}>4. Composites</button>
          <button className={`dock-pill-btn ${activeCategory === "gee-pipeline" ? "active" : ""}`} onClick={() => navigateToSection("gee-pipeline")}>6. NDWI</button>
          <button className={`dock-pill-btn ${activeCategory === "dataset-processing" ? "active" : ""}`} onClick={() => navigateToSection("dataset-processing")}>5. Dataset</button>
          <button className={`dock-pill-btn ${activeCategory === "ml-models" ? "active" : ""}`} onClick={() => navigateToSection("ml-models")}>13. AI Model</button>
          <button className={`dock-pill-btn ${activeCategory === "graphs-metrics" ? "active" : ""}`} onClick={() => navigateToSection("graphs-metrics")}>8. Metrics</button>
          <button className={`dock-pill-btn ${activeCategory === "historical-comparison" ? "active" : ""}`} onClick={() => navigateToSection("historical-comparison")}>10. 2020–2024</button>
          <button className={`dock-pill-btn ${activeCategory === "validation-accuracy" ? "active" : ""}`} onClick={() => navigateToSection("validation-accuracy")}>15. QGIS</button>
          <button className={`dock-pill-btn ${activeCategory === "transect-kinematics" ? "active" : ""}`} onClick={() => navigateToSection("transect-kinematics")}>16. EPR</button>
          <button className={`dock-pill-btn ${activeCategory === "future-predictions" ? "active" : ""}`} onClick={() => navigateToSection("future-predictions")}>17. Forecast</button>
          <button className={`dock-pill-btn ${activeCategory === "results-gallery" ? "active" : ""}`} onClick={() => navigateToSection("results-gallery")}>18. Library</button>
        </nav>

      </main>
    </PageReveal>
  );
}

export default EvidenceLab;

// Verified Clean Build
