import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageReveal from "../components/PageReveal";
import PremiumGallery from "../components/PremiumGallery";
import PostcardFilmStrip from "../components/PostcardFilmStrip";
import Treasure3D from "../components/Treasure3D";
import { 
  FiEye, 
  FiBarChart2, 
  FiTrendingUp, 
  FiDatabase, 
  FiMaximize2
} from "react-icons/fi";

// --- CHRONOLOGICAL DATA DEFINITIONS ---

// 1. DATA INGESTION (Came 1st)
const DATA_INGESTION_ITEMS = [
  {
    id: "ingest-1",
    stage: "01. Data Ingestion",
    title: "Google Earth Engine Platform",
    tag: "GEE CLOUD API",
    badgeColor: "#0284c7",
    src: "/google_earth_engine_platform.png",
    alt: "Google Earth Engine Cloud Compute Platform",
    desc: "Cloud-native geospatial computing environment processing petabytes of multi-sensor satellite imagery across Udupi's 97.2 km corridor."
  },
  {
    id: "ingest-2",
    stage: "01. Data Ingestion",
    title: "Sentinel-2 Optical (10m MSI)",
    tag: "SURFACE REFLECTANCE",
    badgeColor: "#0284c7",
    src: "/sentinel_source.png",
    alt: "Sentinel-2 Multi-Spectral Imagery",
    desc: "High-resolution 10-meter optical surface reflectance granules (Bands B2, B3, B4, B8) captured across seasonal tidal windows."
  },
  {
    id: "ingest-3",
    stage: "01. Data Ingestion",
    title: "Landsat Satellite Archives",
    tag: "DECADAL BASELINE",
    badgeColor: "#0284c7",
    src: "/landsat_source.png",
    alt: "Landsat Satellite Decadal Archive",
    desc: "Tier-1 surface reflectance data calibrated across multi-decadal epochs providing historical baseline context for shoreline migration."
  },
  {
    id: "ingest-4",
    stage: "01. Data Ingestion",
    title: "Oceanographic & Tidal Telemetry",
    tag: "NOAA HYDRODYNAMICS",
    badgeColor: "#0284c7",
    src: "/tides_currents_noaa.png",
    alt: "NOAA Hydrodynamics & Tidal Telemetry",
    desc: "Hydrodynamic oceanographic measurements and tide gauge telemetry applying Mean High Water (MHW) vertical datum corrections."
  }
];

// 2. SHORELINE VECTOR EXTRACTIONS 2020-2024 (Came Next)
const SHORELINE_ITEMS = [
  {
    id: "shore-2020",
    stage: "02. Shorelines 2020-2024",
    title: "Shoreline Detection 2020 (Baseline)",
    tag: "YEAR 2020",
    badgeColor: "#059669",
    src: "/shoreline/2020.png",
    alt: "Shoreline Detection 2020",
    desc: "High-precision baseline sub-pixel vector line extracted from 2020 satellite imagery along the 97.2 km Udupi coastline."
  },
  {
    id: "shore-2021",
    stage: "02. Shorelines 2020-2024",
    title: "Shoreline Detection 2021",
    tag: "YEAR 2021",
    badgeColor: "#059669",
    src: "/shoreline/2021.png",
    alt: "Shoreline Detection 2021",
    desc: "Delineated 2021 shoreline position tracking post-monsoon beach recovery and regional storm scarping."
  },
  {
    id: "shore-2022",
    stage: "02. Shorelines 2020-2024",
    title: "Shoreline Detection 2022",
    tag: "YEAR 2022",
    badgeColor: "#059669",
    src: "/shoreline/2022.png",
    alt: "Shoreline Detection 2022",
    desc: "Automated vector boundary extracted for 2022, capturing significant sediment displacement along southern river mouths."
  },
  {
    id: "shore-2023",
    stage: "02. Shorelines 2020-2024",
    title: "Shoreline Detection 2023",
    tag: "YEAR 2023",
    badgeColor: "#059669",
    src: "/shoreline/2023.png",
    alt: "Shoreline Detection 2023",
    desc: "2023 shoreline vector delineation mapping intensifying coastal erosion hotspots adjacent to seawall breakwaters."
  },
  {
    id: "shore-2024",
    stage: "02. Shorelines 2020-2024",
    title: "Shoreline Detection 2024 (Present Horizon)",
    tag: "YEAR 2024",
    badgeColor: "#059669",
    src: "/shoreline/2024.png",
    alt: "Shoreline Detection 2024",
    desc: "Latest validated 2024 shoreline position completing the 5-year empirical observation baseline prior to forecasting."
  },
  {
    id: "shore-mean",
    stage: "02. Shorelines 2020-2024",
    title: "Mean Shoreline Position Trend (2020–2024)",
    tag: "HISTORICAL TREND",
    badgeColor: "#059669",
    src: "/shoreline/mean_position.png",
    alt: "Mean Shoreline Position per Year",
    desc: "Annual mean cross-shore displacement trajectory proving the secular landward retreat of Udupi coastal sands."
  },
  {
    id: "shore-overall",
    stage: "02. Shorelines 2020-2024",
    title: "Overall Multi-Year Shoreline Boundary Map",
    tag: "VECTOR OVERLAY",
    badgeColor: "#059669",
    src: "/shoreline/overall_analysis_new.png",
    alt: "Overall Shoreline Analysis Map Overlay",
    desc: "Integrated geographic overlay of historical (2020–2024) and projected shoreline boundaries delineating the net landward envelope."
  }
];

// 3. AI MODEL BENCHMARKS (Came Next)
const MODEL_BENCHMARK_ITEMS = [
  {
    id: "model-deeplab-cm",
    stage: "03. Model Training",
    title: "DeepLabV3+ Confusion Matrix",
    tag: "85.48% VALIDATION ACCURACY",
    badgeColor: "#6366f1",
    src: "/env_ml_confusion_matrix_deeplab.png?v=3",
    alt: "DeepLabV3+ Confusion Matrix",
    desc: "Pixel-level land/water segmentation confusion matrix demonstrating the primary DeepLabV3+ network's precision across coastal boundaries."
  },
  {
    id: "model-deeplab-rep",
    stage: "03. Model Training",
    title: "DeepLabV3+ Performance Metrics",
    tag: "92.17% DICE COEFFICIENT",
    badgeColor: "#6366f1",
    src: "/env_ml_report_deeplab.png?v=3",
    alt: "DeepLabV3+ Performance Metrics",
    desc: "Comprehensive pixel classification metrics confirming an outstanding 85.48% validation accuracy for deep boundary extraction."
  },
  {
    id: "model-rf-cm",
    stage: "03. Model Training",
    title: "Random Forest Confusion Matrix",
    tag: "BASELINE ENSEMBLE",
    badgeColor: "#6366f1",
    src: "/confusion-matrix.jpg?v=3",
    alt: "Random Forest Confusion Matrix",
    desc: "Decision tree ensemble confusion matrix evaluating multi-spectral land/water classification performance."
  },
  {
    id: "model-rf-rep",
    stage: "03. Model Training",
    title: "Random Forest Metrics Report",
    tag: "51% CLASSIFICATION ACCURACY",
    badgeColor: "#6366f1",
    src: "/model-metrics.jpg?v=3",
    alt: "Random Forest Performance Metrics",
    desc: "Precision, recall, and F1-score evaluation metrics for the Random Forest baseline classifier."
  },
  {
    id: "model-xgb-cm",
    stage: "03. Model Training",
    title: "XGBoost Confusion Matrix",
    tag: "GRADIENT BOOSTED TREES",
    badgeColor: "#6366f1",
    src: "/env_ml_confusion_matrix_xgb.png?v=3",
    alt: "XGBoost Confusion Matrix",
    desc: "Confusion matrix evaluating Extreme Gradient Boosting on non-linear coastal environmental driving factors."
  },
  {
    id: "model-xgb-rep",
    stage: "03. Model Training",
    title: "XGBoost Performance Report",
    tag: "53% ACCURACY (0.77 RECALL)",
    badgeColor: "#6366f1",
    src: "/env_ml_report_xgb.png?v=3",
    alt: "XGBoost Classification Report",
    desc: "Multi-class precision and recall metrics for the gradient-boosted decision tree algorithm across coastal stability zones."
  }
];

// 4. TRANSECT KINEMATICS & CHANGE RATES (Came Next)
const TRANSECT_KINEMATICS_ITEMS = [
  {
    id: "kin-time",
    stage: "04. Transect Kinematics",
    title: "Shoreline Position Over Time Series",
    tag: "REGRESSION DYNAMICS",
    badgeColor: "#d97706",
    src: "/analysis/shoreline_position_time.png",
    alt: "Shoreline Position Over Time",
    desc: "Linear regression time-series tracking cross-shore distance variations across sample transects along the Udupi corridor."
  },
  {
    id: "kin-scatter",
    stage: "04. Transect Kinematics",
    title: "Transect Change Rate Scatter Profile",
    tag: "1,944 TRANSECT POINTS",
    badgeColor: "#d97706",
    src: "/analysis/transect_rate_scatter.png",
    alt: "Transect Change Rate Scatter",
    desc: "Individual End Point Rate (EPR) values computed across all 1,944 shore-normal transects identifying localized retreat clusters."
  },
  {
    id: "kin-hist",
    stage: "04. Transect Kinematics",
    title: "Annual Shoreline Change Rate Histogram",
    tag: "RATE DISTRIBUTION",
    badgeColor: "#d97706",
    src: "/analysis/annual_change_rate.png",
    alt: "Annual Shoreline Change Rate",
    desc: "Frequency distribution of annualized shoreline migration rates illustrating erosion skewness during monsoon cycles."
  },
  {
    id: "kin-heat",
    stage: "04. Transect Kinematics",
    title: "Alongshore Spatial Erosion Heatmap",
    tag: "SPACE-TIME RASTER",
    badgeColor: "#d97706",
    src: "/analysis/alongshore_heatmap.png",
    alt: "Alongshore Erosion Heatmap",
    desc: "Two-dimensional space-time raster heatmap mapping alongshore transect IDs against observation years to pinpoint persistent hotspots."
  },
  {
    id: "kin-profile",
    stage: "04. Transect Kinematics",
    title: "Longshore Erosion Rate Profile (EPR)",
    tag: "COASTAL ENVELOPE",
    badgeColor: "#d97706",
    src: "/report_images/longshore_rate_profile.png",
    alt: "Longshore Erosion Rate Profile",
    desc: "Continuous alongshore rate envelope displaying meters/year retreat and advance from northern Kundapura to southern Mulki."
  },
  {
    id: "kin-density",
    stage: "04. Transect Kinematics",
    title: "Rate Distribution Density Curve (KDE)",
    tag: "KERNEL DENSITY ESTIMATE",
    badgeColor: "#d97706",
    src: "/report_images/rate_distribution_density.png",
    alt: "Rate Distribution Density",
    desc: "Non-parametric Kernel Density Estimate (KDE) demonstrating negative erosion tail behavior and extreme retreat outlier frequencies."
  },
  {
    id: "kin-agree",
    stage: "04. Transect Kinematics",
    title: "Model vs GEE Ground Truth Agreement",
    tag: "SCATTER CONCORDANCE",
    badgeColor: "#d97706",
    src: "/report_images/scatter_rate_comparison.png",
    alt: "Scatter Rate Comparison",
    desc: "Validation scatter plot showing 1:1 line concordance between DeepLabV3+ automated transect rates and Google Earth Engine ground truth."
  }
];

// 5. ENVIRONMENTAL ATTRIBUTION (Came Next)
const ENVIRONMENTAL_ITEMS = [
  {
    id: "env-heat",
    stage: "05. Environmental Drivers",
    title: "Environmental Correlation Matrix",
    tag: "CROSS-CORRELATION",
    badgeColor: "#e11d48",
    src: "/env_correlation_heatmap.png",
    alt: "Environmental Correlation Heatmap",
    desc: "Pearson cross-correlation matrix linking wave height (Hs), peak wave period, monsoon wind direction, and tidal ranges with coastal retreat."
  },
  {
    id: "env-feat",
    stage: "05. Environmental Drivers",
    title: "XGBoost Feature Importance Estimator",
    tag: "60%+ MONSOON VARIANCE",
    badgeColor: "#e11d48",
    src: "/env_feature_importance.png",
    alt: "XGBoost Feature Importance",
    desc: "Normalized Gini feature weight breakdown proving southwest monsoon wind orientation and significant wave height drive over 60% of erosion variance."
  }
];

// 6. FUTURE PREDICTIONS 2025-2029 (Came Last / Future Horizon)
const FUTURE_PREDICTION_ITEMS = [
  {
    id: "fut-movement",
    stage: "06. Future Predictions 2025-2029",
    title: "Average Net Shoreline Movement (2020–2029)",
    tag: "DECADAL TRAJECTORY",
    badgeColor: "#8b5cf6",
    src: "/forecast/average_net_shoreline_movement_2020_2029.jpg",
    alt: "Average Net Shoreline Movement (2020-2029)",
    desc: "Complete decadal trajectory tracing cumulative shoreline movement from historical baseline (2020) through the 2029 future forecast horizon."
  },
  {
    id: "fut-landloss",
    stage: "06. Future Predictions 2025-2029",
    title: "Forecasted Cumulative Coastal Land Loss (2024–2029)",
    tag: "+7.88 HA TOTAL BY 2029",
    badgeColor: "#8b5cf6",
    src: "/forecast/forecasted_cumulative_land_loss_2024_2029.jpg",
    alt: "Forecasted Cumulative Coastal Land Loss (2024-2029)",
    desc: "Predictive forward trajectory projecting coastal land loss expanding to +7.88 hectares across Udupi's vulnerable coastal corridor by 2029."
  },
  {
    id: "fut-vuln",
    stage: "06. Future Predictions 2025-2029",
    title: "Coastal Vulnerability Length Quantification (km)",
    tag: "7.65 KM SEVERE VULNERABILITY",
    badgeColor: "#8b5cf6",
    src: "/forecast/vulnerability_quantification.jpg",
    alt: "Coastal Vulnerability Length Extent (km)",
    desc: "Categorical coastal vulnerability classification quantifying 7.65 km of Severe erosion, 5.76 km of Moderate erosion, and 83.79 km of Stable shoreline."
  }
];

function Visualization() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedModalImage, setSelectedModalImage] = useState(null);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageReveal>
      <motion.main className="page visualization-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="treasure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
              transition={{ duration: 1 }}
              className="treasure-entry-section"
            >
              <section className="section-header-centered">
                <span className="tech-tag" style={{ color: 'var(--amber)' }}>UNCOVER THE DATA</span>
                <h1 className="hero-title-large">VISUAL</h1>
                <h1 className="hero-title-large outline-text">ARCHIVE</h1>
              </section>

              <Suspense fallback={<div className="loading-text">Diving into the sea...</div>}>
                <Treasure3D onOpen={() => setIsUnlocked(true)} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="dashboard-content"
            >
              {/* Back to Sea Control */}
              <div className="dashboard-controls-top" style={{ position: 'fixed', top: '120px', left: '40px', zIndex: 10000, pointerEvents: 'auto' }}>
                <motion.button
                  className="back-to-sea"
                  onClick={() => setIsUnlocked(false)}
                  whileHover={{ scale: 1.1, x: 10, boxShadow: '0 15px 45px rgba(245, 158, 11, 0.4)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 25px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'var(--amber)',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    borderRadius: '50px'
                  }}
                >
                  ← BACK TO SEA
                </motion.button>
              </div>

              {/* Main Page Header */}
              <section className="section-header" style={{ marginTop: '100px', paddingTop: '20px', marginBottom: '20px' }}>
                <span className="tech-tag" style={{ display: 'block', marginBottom: '10px' }}>
                  CHRONOLOGICAL SCIENTIFIC PIPELINE // 2020–2029
                </span>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '10px'
                  }}
                >
                  <h1 style={{
                    fontSize: '3.2rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, var(--teal), var(--amber))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.3))'
                  }}>
                    VISUALIZATION & RESULTS
                  </h1>
                  <p style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    maxWidth: '820px',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    Arranged sequentially in strict chronological research order: raw sensor ingestion → historical shoreline vector extractions → AI model benchmarks → transect kinematics → 2025–2029 future machine learning forecasts.
                  </p>
                </motion.div>
              </section>

              {/* Navigation Jump Pills */}
              <div className="pipeline-nav-bar">
                <button 
                  type="button"
                  className={`pipeline-nav-btn ${activeTab === 'part-visualization' ? 'active' : ''}`}
                  onClick={() => scrollToSection('part-visualization')}
                >
                  <FiEye /> 01. Visualization Pipeline
                </button>
                <button 
                  type="button"
                  className={`pipeline-nav-btn ${activeTab === 'part-results' ? 'active' : ''}`}
                  onClick={() => scrollToSection('part-results')}
                >
                  <FiBarChart2 /> 02. Results & Kinematics
                </button>
                <button 
                  type="button"
                  className={`pipeline-nav-btn ${activeTab === 'part-predictions' ? 'active' : ''}`}
                  onClick={() => scrollToSection('part-predictions')}
                >
                  <FiTrendingUp /> 03. Future Predictions (2025–29)
                </button>
                <button 
                  type="button"
                  className={`pipeline-nav-btn ${activeTab === 'part-gallery' ? 'active' : ''}`}
                  onClick={() => scrollToSection('part-gallery')}
                >
                  <FiDatabase /> 04. Master Coastal Vault
                </button>
              </div>

              {/* ===================================================================
                  PART 1: VISUALIZATION SECTION (Came First in Pipeline)
                  =================================================================== */}
              <section id="part-visualization" className="pipeline-section-block">
                <div className="pipeline-section-header">
                  <span className="pipeline-section-badge" style={{ color: 'var(--teal)' }}>
                    <FiEye /> PART 01 // VISUALIZATION PIPELINE (CAME FIRST)
                  </span>
                  <h2 className="pipeline-stage-title">Multi-Sensor Data Ingestion & Shoreline Delineations</h2>
                  <p className="pipeline-stage-desc">
                    The scientific journey begins with raw sensor data ingestion across spaceborne optical, decadal archive, and tidal hydrodynamics platforms, leading directly to sub-pixel vector shoreline delineations (2020–2024).
                  </p>
                </div>

                {/* Step 1: Raw Data Ingestion Grid */}
                <div className="pipeline-sub-header">
                  <div className="pipeline-sub-title-group">
                    <h3>Step 1: Multi-Sensor Data Ingestion & Environmental Inputs</h3>
                    <span>Spaceborne Optical, Multi-Decadal Historical Archives, and NOAA Oceanographic Tides</span>
                  </div>
                  <span className="tech-meta">STAGE 01 // 4 ASSETS</span>
                </div>

                <div className="pipeline-grid-4">
                  {DATA_INGESTION_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="pipeline-card"
                      onClick={() => setSelectedModalImage(item)}
                      whileHover={{ y: -6 }}
                    >
                      <div className="pipeline-card-badge" style={{ color: item.badgeColor }}>
                        #{String(idx + 1).padStart(2, '0')} • SENSOR
                      </div>
                      <div className="pipeline-card-img-wrap">
                        <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                      </div>
                      <div className="pipeline-card-body">
                        <span className="pipeline-card-tag" style={{ color: item.badgeColor }}>{item.tag}</span>
                        <h4 className="pipeline-card-title">{item.title}</h4>
                        <p className="pipeline-card-desc">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Step 2: Annual Shoreline Extractions (2020-2024) */}
                <div className="pipeline-sub-header" style={{ marginTop: '70px' }}>
                  <div className="pipeline-sub-title-group">
                    <h3>Step 2: Multi-Temporal Annual Shoreline Extractions (2020–2024)</h3>
                    <span>Sub-Pixel Delineations, Multi-Year Migration Trends, and Boundary Envelope Overlays</span>
                  </div>
                  <span className="tech-meta">STAGE 02 // 7 ASSETS</span>
                </div>

                <div className="pipeline-grid-3">
                  {SHORELINE_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="pipeline-card"
                      onClick={() => setSelectedModalImage(item)}
                      whileHover={{ y: -6 }}
                    >
                      <div className="pipeline-card-badge" style={{ color: item.badgeColor }}>
                        #{String(idx + 5).padStart(2, '0')} • SHORELINE
                      </div>
                      <div className="pipeline-card-img-wrap">
                        <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                      </div>
                      <div className="pipeline-card-body">
                        <span className="pipeline-card-tag" style={{ color: item.badgeColor }}>{item.tag}</span>
                        <h4 className="pipeline-card-title">{item.title}</h4>
                        <p className="pipeline-card-desc">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Step 3: Interactive Postcard Film Strip (With Final Results) */}
                <div className="analytics-intro-card" style={{ marginTop: '70px', marginBottom: '20px' }}>
                  <PostcardFilmStrip />
                </div>
              </section>

              {/* ===================================================================
                  PART 2: RESULTS SECTION (Came Next in Computational Order)
                  =================================================================== */}
              <section id="part-results" className="pipeline-section-block">
                <div className="pipeline-section-header">
                  <span className="pipeline-section-badge" style={{ color: 'var(--amber)' }}>
                    <FiBarChart2 /> PART 02 // SCIENTIFIC RESULTS SECTION (CAME NEXT)
                  </span>
                  <h2 className="pipeline-stage-title">AI Validation, Transect Kinematics & Environmental Attribution</h2>
                  <p className="pipeline-stage-desc">
                    Rigorous machine learning validation results: DeepLabV3+ (85.48% validation accuracy) pixel segmentation, 1,944-point transect kinematics, and gradient-boosted environmental driver attributions.
                  </p>
                </div>

                {/* Step 4: Machine Learning Benchmarks */}
                <div className="pipeline-sub-header">
                  <div className="pipeline-sub-title-group">
                    <h3>Step 3: Machine Learning Model Benchmarks & Segmentation Results</h3>
                    <span>DeepLabV3+ (85.48% Accuracy), Random Forest, SVM, and XGBoost Classifiers</span>
                  </div>
                  <span className="tech-meta">STAGE 03 // 6 ASSETS</span>
                </div>

                <div className="pipeline-grid-3">
                  {MODEL_BENCHMARK_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="pipeline-card"
                      onClick={() => setSelectedModalImage(item)}
                      whileHover={{ y: -6 }}
                    >
                      <div className="pipeline-card-badge" style={{ color: item.badgeColor }}>
                        #{String(idx + 12).padStart(2, '0')} • ML BENCHMARK
                      </div>
                      <div className="pipeline-card-img-wrap">
                        <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                      </div>
                      <div className="pipeline-card-body">
                        <span className="pipeline-card-tag" style={{ color: item.badgeColor }}>{item.tag}</span>
                        <h4 className="pipeline-card-title">{item.title}</h4>
                        <p className="pipeline-card-desc">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Step 5: Transect Kinematics & Rate Analysis */}
                <div className="pipeline-sub-header" style={{ marginTop: '70px' }}>
                  <div className="pipeline-sub-title-group">
                    <h3>Step 4: Transect Kinematics & Statistical Shoreline Change Rates</h3>
                    <span>End Point Rates (EPR), Alongshore Space-Time Heatmaps, and Ground Truth Concordance</span>
                  </div>
                  <span className="tech-meta">STAGE 04 // 7 ASSETS</span>
                </div>

                <div className="pipeline-grid-3">
                  {TRANSECT_KINEMATICS_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="pipeline-card"
                      onClick={() => setSelectedModalImage(item)}
                      whileHover={{ y: -6 }}
                    >
                      <div className="pipeline-card-badge" style={{ color: item.badgeColor }}>
                        #{String(idx + 18).padStart(2, '0')} • KINEMATICS
                      </div>
                      <div className="pipeline-card-img-wrap">
                        <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                      </div>
                      <div className="pipeline-card-body">
                        <span className="pipeline-card-tag" style={{ color: item.badgeColor }}>{item.tag}</span>
                        <h4 className="pipeline-card-title">{item.title}</h4>
                        <p className="pipeline-card-desc">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Step 6: Environmental Attribution */}
                <div className="pipeline-sub-header" style={{ marginTop: '70px' }}>
                  <div className="pipeline-sub-title-group">
                    <h3>Step 5: Environmental Driving Factor Attribution</h3>
                    <span>Monsoonal Wave Energy, Wind Direction Vectors, and Pearson Cross-Correlation Matrices</span>
                  </div>
                  <span className="tech-meta">STAGE 05 // 2 ASSETS</span>
                </div>

                <div className="pipeline-grid-2">
                  {ENVIRONMENTAL_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="pipeline-card"
                      onClick={() => setSelectedModalImage(item)}
                      whileHover={{ y: -6 }}
                    >
                      <div className="pipeline-card-badge" style={{ color: item.badgeColor }}>
                        #{String(idx + 25).padStart(2, '0')} • DRIVER
                      </div>
                      <div className="pipeline-card-img-wrap" style={{ aspectRatio: '16 / 9' }}>
                        <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                      </div>
                      <div className="pipeline-card-body">
                        <span className="pipeline-card-tag" style={{ color: item.badgeColor }}>{item.tag}</span>
                        <h4 className="pipeline-card-title">{item.title}</h4>
                        <p className="pipeline-card-desc">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ===================================================================
                  PART 3: FUTURE PREDICTIONS SECTION (Came Last / Future Horizon)
                  =================================================================== */}
              <section id="part-predictions" className="pipeline-section-block">
                <div className="future-predictions-hero">
                  <div className="pipeline-section-header" style={{ marginBottom: '30px' }}>
                    <span className="pipeline-section-badge" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>
                      <FiTrendingUp /> PART 03 // 2025–2029 FUTURE PREDICTIONS (CAME NEXT / FUTURE)
                    </span>
                    <h2 className="pipeline-stage-title" style={{ color: '#fff' }}>
                      Decennial Coastal Projections & Vulnerability Quantification
                    </h2>
                    <p className="pipeline-stage-desc" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      Forward machine learning simulations projecting cumulative coastal land loss, decadal net shoreline movement, and multi-tier vulnerability risk lengths through the 2029 planning horizon.
                    </p>
                  </div>

                  {/* Future Projections KPI Summary Banner */}
                  <div className="future-kpi-banner">
                    <div className="future-kpi-card">
                      <div className="val" style={{ color: '#38bdf8' }}>+7.88 ha</div>
                      <div className="lbl">Forecasted Cumulative Loss (2024–2029)</div>
                    </div>
                    <div className="future-kpi-card">
                      <div className="val" style={{ color: '#ef4444' }}>7.65 km</div>
                      <div className="lbl">Severe Erosion Risk Extent</div>
                    </div>
                    <div className="future-kpi-card">
                      <div className="val" style={{ color: '#f59e0b' }}>5.76 km</div>
                      <div className="lbl">Moderate Vulnerability Zone</div>
                    </div>
                    <div className="future-kpi-card">
                      <div className="val" style={{ color: '#10b981' }}>83.79 km</div>
                      <div className="lbl">Stable / Accretion Corridor</div>
                    </div>
                  </div>

                  {/* Future Forecast Individual Plots Grid */}
                  <div className="pipeline-grid-3">
                    {FUTURE_PREDICTION_ITEMS.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        className="pipeline-card"
                        onClick={() => setSelectedModalImage(item)}
                        whileHover={{ y: -6 }}
                        style={{ background: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(139, 92, 246, 0.4)' }}
                      >
                        <div className="pipeline-card-badge" style={{ color: '#a78bfa' }}>
                          #{String(idx + 27).padStart(2, '0')} • 2025–2029 FORECAST
                        </div>
                        <div className="pipeline-card-img-wrap">
                          <img src={item.src} alt={item.alt} className="pipeline-card-img" loading="lazy" />
                        </div>
                        <div className="pipeline-card-body">
                          <span className="pipeline-card-tag" style={{ color: '#a78bfa' }}>{item.tag}</span>
                          <h4 className="pipeline-card-title">{item.title}</h4>
                          <p className="pipeline-card-desc">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Spotlight Master Figure 1: Dual-Panel Integrated Forecast */}
                  <div 
                    className="future-spotlight-card"
                    onClick={() => setSelectedModalImage({
                      id: "fut-dual",
                      stage: "06. Future Predictions 2025-2029",
                      title: "Dual-Panel Integrated Coastal Forecast (Vulnerability & Land Loss)",
                      tag: "PUBLICATION SYNTHESIS",
                      badgeColor: "#8b5cf6",
                      src: "/forecast/final_graph.jpg",
                      alt: "Dual-Panel Integrated Coastal Forecast",
                      desc: "High-resolution dual-panel synthesis linking spatial vulnerability risk classification (km) with forecasted cumulative land loss (hectares) through 2029."
                    })}
                  >
                    <img src="/forecast/final_graph.jpg" alt="Dual-Panel Coastal Forecast" className="future-spotlight-img" loading="lazy" />
                    <div className="future-spotlight-info">
                      <div>
                        <span className="tech-meta" style={{ color: '#a78bfa' }}>MASTER FIGURE 01 // DUAL-PANEL SYNTHESIS</span>
                        <h3 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#fff' }}>Dual-Panel Integrated Coastal Vulnerability & Land Loss Forecast</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                          Click to expand high-resolution synthesis showing 7.65 km severe erosion vs +7.88 ha land loss progression.
                        </p>
                      </div>
                      <span className="pipeline-nav-btn" style={{ background: '#8b5cf6', color: '#fff', border: 'none' }}>
                        <FiMaximize2 /> Expand High-Res
                      </span>
                    </div>
                  </div>

                  {/* Spotlight Master Figure 2: Master 3-Panel Comprehensive Decadal Evolution Forecast */}
                  <div 
                    className="future-spotlight-card"
                    style={{ marginTop: '25px' }}
                    onClick={() => setSelectedModalImage({
                      id: "fut-3panel",
                      stage: "06. Future Predictions 2025-2029",
                      title: "Publication 3-Panel Decadal Evolution Forecast (Vulnerability + Land Loss + Net Movement)",
                      tag: "MASTER 3-PANEL SYNTHESIS",
                      badgeColor: "#8b5cf6",
                      src: "/forecast/final_graph_3panel.jpg",
                      alt: "Publication 3-Panel Decadal Forecast",
                      desc: "Master 3-panel publication visual integrating coastal vulnerability length, forecasted cumulative land loss (2024–2029), and average net shoreline movement (2020–2029)."
                    })}
                  >
                    <img src="/forecast/final_graph_3panel.jpg" alt="Publication 3-Panel Decadal Forecast" className="future-spotlight-img" loading="lazy" />
                    <div className="future-spotlight-info">
                      <div>
                        <span className="tech-meta" style={{ color: '#a78bfa' }}>MASTER FIGURE 02 // COMPREHENSIVE 3-PANEL PROJECTION</span>
                        <h3 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#fff' }}>Publication-Grade 3-Panel Decadal Coastal Evolution Forecast</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                          Full decadal synthesis: Vulnerability Extent (Panel 1) + Cumulative Land Loss (Panel 2) + Net Shoreline Movement 2020–2029 (Panel 3).
                        </p>
                      </div>
                      <span className="pipeline-nav-btn" style={{ background: '#8b5cf6', color: '#fff', border: 'none' }}>
                        <FiMaximize2 /> Expand High-Res
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===================================================================
                  PART 4: MASTER COASTAL ARCHIVE VAULT (All 33 Chronological Items)
                  =================================================================== */}
              <div id="part-gallery" className="huge-gallery-wrapper">
                <h2 className="gallery-title-large" style={{ opacity: 1, color: 'var(--text-main)', marginBottom: '20px' }}>
                  MASTER COASTAL ARCHIVE
                </h2>
                <PremiumGallery />
              </div>

              {/* ===================================================================
                  UNIFIED LIGHTBOX MODAL FOR INLINE CARDS
                  =================================================================== */}
              <AnimatePresence>
                {selectedModalImage && (
                  <motion.div
                    className="lightbox-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedModalImage(null)}
                  >
                    <motion.div
                      className="lightbox-content pro-lightbox"
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.96, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '92vh',
                        maxWidth: '1200px',
                        width: '94vw',
                        background: 'rgba(10, 16, 26, 0.95)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 212, 255, 0.2)'
                      }}
                    >
                      {/* Lightbox Header Bar */}
                      <div 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 24px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span 
                            style={{
                              background: selectedModalImage.badgeColor || 'var(--teal)',
                              color: '#fff',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {selectedModalImage.stage}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {selectedModalImage.tag}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="lightbox-close-pro"
                          aria-label="Close modal preview"
                          onClick={() => setSelectedModalImage(null)}
                          style={{
                            position: 'static',
                            width: '38px',
                            height: '38px',
                            fontSize: '1.4rem'
                          }}
                        >
                          ×
                        </button>
                      </div>

                      {/* Lightbox Image Preview Area */}
                      <div 
                        className="lightbox-media-container"
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '20px',
                          overflow: 'hidden',
                          background: 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        <img 
                          src={selectedModalImage.src} 
                          alt={selectedModalImage.alt} 
                          className="lightbox-img" 
                          style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      
                      {/* Lightbox Caption Footer */}
                      <div 
                        className="lightbox-caption-pro"
                        style={{
                          padding: '16px 24px 20px 24px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          maxWidth: '100%'
                        }}
                      >
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#fff' }}>
                          {selectedModalImage.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                          {selectedModalImage.desc}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </PageReveal>
  );
}

export default Visualization;
