import React, { useState, useEffect, useRef } from "react";
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

// Google Colab Base URL
const COLAB_BASE = "https://colab.research.google.com/github/Roshni877/coastal-ai/blob/main/Soil_Erosion_Major_Project_Phase_4_Roshni.ipynb";

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

function EvidenceLab() {
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

  // Keyboard navigation for Presentation Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!presentationMode) return;
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(prev + 1, PRESENTATION_SLIDES.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setPresentationMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentationMode]);

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

          {/* Presentation Mode Button */}
          <div className="presentation-mode-bar">
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

        {/* ========================================================
            RESEARCH RESOURCES ACTION BAR & EXAMINER VIVA BAR
            ======================================================== */}
        <section className="research-resources-action-bar">
          <div className="resources-bar-header">
            <div className="bar-header-left">
              <BookOpen size={18} className="text-pink" />
              <h3>Research Navigation &amp; Interactive Modules</h3>
            </div>
            <button 
              className={`viva-toggle-btn ${vivaGuideOpen ? 'active' : ''}`}
              onClick={() => setVivaGuideOpen(!vivaGuideOpen)}
            >
              <HelpCircle size={15} />
              <span>{vivaGuideOpen ? "Close Viva Defense Bar" : "Open Examiner Viva Defense Bar"}</span>
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
            <button className="btn-resource-rect highlight-pink" onClick={() => scrollTo("section-future")}>
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
                    <ShieldCheck size={16} className="text-pink" />
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
                      <span className="q-tag">Environmental ML</span>
                      <span className="q-text">How does XGBoost predict coastal hazard risk (84.8%)?</span>
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

        {/* ========================================================
            SECTION A: SATELLITE DATA EXPLORER
            ======================================================== */}
        <section id="section-bands" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-emerald">
                <Radio size={15} />
                SECTION A // SATELLITE DATA EXPLORER
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
        </section>

        {/* ========================================================
            SECTION B: INTERACTIVE COLOUR BAND COMBINATIONS
            ======================================================== */}
        <section id="section-composites" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-pink">
                <Sun size={15} />
                SECTION B // INTERACTIVE COLOUR BAND COMBINATIONS
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
        </section>

        {/* ========================================================
            SECTION C: NDWI AND WATER EXTRACTION PIPELINE
            ======================================================== */}
        <section id="section-ndwi" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-cyan">
                <Activity size={15} />
                SECTION C // NDWI &amp; WATER EXTRACTION PIPELINE
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
        </section>

        {/* ========================================================
            SECTION D: ACTUAL MODEL TRAINING DATASET
            ======================================================== */}
        <section id="section-dataset" className="lab-section dataset-hero-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-emerald">
                <Database size={15} />
                SECTION D // ACTUAL MODEL TRAINING DATASET
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
        </section>

        {/* ========================================================
            SECTION E: MODEL ARCHITECTURE VISUALIZATION
            ======================================================== */}
        <section id="section-architecture" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-cyan">
                <Cpu size={15} />
                SECTION E // DEEPLABV3+ ARCHITECTURE
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
        </section>

        {/* ========================================================
            SECTION F: MODEL TRAINING AND VALIDATION
            ======================================================== */}
        <section id="section-performance" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-emerald">
                <BarChart3 size={15} />
                SECTION F // MODEL TRAINING &amp; VALIDATION METRICS
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
              <span className="m-label">Validation Dice Score</span>
              <strong className="m-score text-emerald">0.8548 (85.48%)</strong>
              <p className="m-desc">Measures harmonic boundary overlap between predicted and ground-truth coastline mask.</p>
            </div>

            <div className="metric-box-card">
              <span className="m-label">Mean Intersection over Union</span>
              <strong className="m-score text-cyan">~0.746 (74.6% IoU)</strong>
              <p className="m-desc">Jaccard index measuring area of overlap divided by area of union across all test tiles.</p>
            </div>

            <div className="metric-box-card">
              <span className="m-label">Combined BCE + Dice Loss</span>
              <strong className="m-score text-pink">0.4304</strong>
              <p className="m-desc">Asymptotic minimum achieved after 15 training epochs on PyTorch with Adam optimizer.</p>
            </div>

            <div className="metric-box-card">
              <span className="m-label">Downstream Hazard Model (XGB)</span>
              <strong className="m-score text-amber">84.8% Accuracy</strong>
              <p className="m-desc">Predicts multi-tier coastal vulnerability from wave height, tidal range, and monsoon index.</p>
            </div>
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
        </section>

        {/* ========================================================
            SECTION G: HISTORICAL COASTLINE EVIDENCE (INTERACTIVE TIMELINE)
            ======================================================== */}
        <section id="section-historical" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-pink">
                <Calendar size={15} />
                SECTION G // HISTORICAL COASTLINE TIMELINE (2020–2024 OBSERVED)
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
        </section>

        {/* ========================================================
            SECTION H: QGIS AND GOOGLE EARTH PRO EVIDENCE
            ======================================================== */}
        <section id="section-geospatial" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-cyan">
                <Compass size={15} />
                SECTION H // GEOSPATIAL VERIFICATION
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
        </section>

        {/* ========================================================
            SECTION I: EROSION AND ACCRETION ANALYSIS
            ======================================================== */}
        <section id="section-transects" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-emerald">
                <Layers size={15} />
                SECTION I // TRANSECT KINEMATICS &amp; DSAS ANALYSIS
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
        </section>

        {/* ========================================================
            SECTION J: FUTURE PREDICTIONS (2025–2029 FORECAST)
            ======================================================== */}
        <section id="section-future" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-pink">
                <TrendingUp size={15} />
                SECTION J // FUTURE PREDICTIONS (2025–2029 FORECAST)
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
        </section>

        {/* ========================================================
            SECTION K: CENTRALIZED RESEARCH EVIDENCE LIBRARY
            ======================================================== */}
        <section id="section-library" className="lab-section">
          <div className="lab-section-header">
            <div className="header-left">
              <span className="sec-badge text-emerald">
                <Database size={15} />
                SECTION K // CENTRALIZED RESEARCH EVIDENCE LIBRARY
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
            FULLSCREEN LIGHTBOX MODAL (HIGH RESOLUTION INSPECTION)
            ======================================================== */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              className="evidence-lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div 
                className="evidence-lightbox-modal"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="lightbox-close-btn"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close dialog"
                >
                  <X size={20} />
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
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </PageReveal>
  );
}

export default EvidenceLab;
