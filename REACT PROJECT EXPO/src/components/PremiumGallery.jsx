import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiChevronLeft, FiChevronRight, FiMaximize2, FiFilter } from "react-icons/fi";

export const ARCHIVE_IMAGES = [
  // --- STAGE 01: SENSOR DATA INGESTION (Came 1st) ---
  {
    id: 1,
    stage: "01. Data Ingestion",
    stageNum: 1,
    badgeColor: "#0284c7",
    src: "/google_earth_engine_platform.png",
    alt: "Google Earth Engine Platform & Cloud API",
    title: "Google Earth Engine Platform",
    caption: "Cloud-native geospatial computing workspace orchestrating petabyte-scale Sentinel and Landsat multi-spectral data pipelines for the Udupi coastal corridor."
  },
  {
    id: 2,
    stage: "01. Data Ingestion",
    stageNum: 1,
    badgeColor: "#0284c7",
    src: "/sentinel_source.png",
    alt: "Sentinel-2 Multi-Spectral Imagery Source",
    title: "Sentinel-2 Optical (10m MSI)",
    caption: "High-resolution 10-meter optical surface reflectance granules (Bands B2, B3, B4, B8) captured across pre-monsoon and post-monsoon tidal datums."
  },
  {
    id: 3,
    stage: "01. Data Ingestion",
    stageNum: 1,
    badgeColor: "#0284c7",
    src: "/landsat_source.png",
    alt: "Landsat Satellite Archive Source",
    title: "Landsat Decadal Archives",
    caption: "Multi-decadal calibrated tier-1 surface reflectance imagery providing multi-temporal geomorphic baseline context for long-term shoreline migration."
  },
  {
    id: 4,
    stage: "01. Data Ingestion",
    stageNum: 1,
    badgeColor: "#0284c7",
    src: "/tides_currents_noaa.png",
    alt: "NOAA Oceanographic & Tidal Hydrodynamics",
    title: "Oceanographic Hydrodynamics & Tides",
    caption: "Tidal station observations and hydrodynamic wave climate telemetry used to apply Mean High Water (MHW) vertical datum corrections."
  },

  // --- STAGE 02: MODEL TRAINING & BENCHMARK VALIDATION (Came 2nd) ---
  {
    id: 5,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_confusion_matrix_deeplab.png?v=3",
    alt: "DeepLabV3+ Confusion Matrix",
    title: "DeepLabV3+ Segmentation Confusion Matrix",
    caption: "Pixel-level land/water segmentation confusion matrix demonstrating the primary DeepLabV3+ network's precision across coastal boundaries."
  },
  {
    id: 6,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_report_deeplab.png?v=3",
    alt: "DeepLabV3+ Classification Report (85.48% Accuracy)",
    title: "DeepLabV3+ Validation Report (85.48%)",
    caption: "Comprehensive pixel classification metrics confirming an outstanding 85.48% validation accuracy (92.17% Dice coefficient) for deep boundary extraction."
  },
  {
    id: 7,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/confusion-matrix.jpg?v=3",
    alt: "Random Forest Confusion Matrix",
    title: "Random Forest Baseline Confusion Matrix",
    caption: "Comparative ensemble decision tree confusion matrix evaluating multi-spectral land/water classification performance."
  },
  {
    id: 8,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/model-metrics.jpg?v=3",
    alt: "Random Forest Performance Metrics",
    title: "Random Forest Performance Metrics",
    caption: "Precision, recall, and F1-score evaluation metrics for the Random Forest baseline classifier (51% overall accuracy)."
  },
  {
    id: 9,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_confusion_matrix_svm.png?v=3",
    alt: "SVM Confusion Matrix",
    title: "Support Vector Machine (SVM) Matrix",
    caption: "Confusion matrix for the Support Vector Classifier with RBF kernel across environmental coastal risk classes."
  },
  {
    id: 10,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_report_svm.png?v=3",
    alt: "SVM Classification Report",
    title: "SVM Classification Report",
    caption: "Empirical precision, recall, and class-weighted accuracy metrics for the Support Vector Machine classifier benchmark."
  },
  {
    id: 11,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_confusion_matrix_xgb.png?v=3",
    alt: "XGBoost Confusion Matrix",
    title: "XGBoost Gradient Boosting Matrix",
    caption: "Confusion matrix evaluating Extreme Gradient Boosting on non-linear coastal environmental driving factors."
  },
  {
    id: 12,
    stage: "02. Model Training",
    stageNum: 2,
    badgeColor: "#6366f1",
    src: "/env_ml_report_xgb.png?v=3",
    alt: "XGBoost Classification Report",
    title: "XGBoost Performance Report",
    caption: "Multi-class precision and recall metrics for the gradient-boosted decision tree algorithm across coastal stability zones."
  },

  // --- STAGE 03: ANNUAL SHORELINE EXTRACTIONS 2020-2024 (Came 3rd) ---
  {
    id: 13,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/2020.png",
    alt: "Shoreline Detection 2020",
    title: "Shoreline Detection 2020 (Baseline)",
    caption: "High-precision baseline sub-pixel vector line extracted from 2020 satellite imagery along the 97.2 km Udupi coastline."
  },
  {
    id: 14,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/2021.png",
    alt: "Shoreline Detection 2021",
    title: "Shoreline Detection 2021",
    caption: "Delineated 2021 shoreline position tracking initial post-monsoon beach recovery and regional storm scarping."
  },
  {
    id: 15,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/2022.png",
    alt: "Shoreline Detection 2022",
    title: "Shoreline Detection 2022",
    caption: "Automated vector boundary extracted for 2022, capturing significant sediment displacement along the southern river mouths."
  },
  {
    id: 16,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/2023.png",
    alt: "Shoreline Detection 2023",
    title: "Shoreline Detection 2023",
    caption: "2023 shoreline vector delineation mapping intensifying coastal erosion hotspots adjacent to seawall breakwaters."
  },
  {
    id: 17,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/2024.png",
    alt: "Shoreline Detection 2024",
    title: "Shoreline Detection 2024 (Present Horizon)",
    caption: "Latest validated 2024 shoreline position completing the 5-year empirical observation baseline prior to machine learning forecasting."
  },
  {
    id: 18,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/mean_position.png",
    alt: "Mean Shoreline Position per Year (2020-2024)",
    title: "Mean Shoreline Position Trends",
    caption: "Annual mean shoreline cross-shore displacement trajectory showing the systemic secular retreat of Udupi coastal sands."
  },
  {
    id: 19,
    stage: "03. Shorelines 2020-2024",
    stageNum: 3,
    badgeColor: "#059669",
    src: "/shoreline/overall_analysis_new.png",
    alt: "Overall Shoreline Analysis Map Overlay",
    title: "Overall Multi-Year Shoreline Boundary Map",
    caption: "Integrated spatial overlay of historical (2020-2024) and projected shoreline boundaries delineating the net landward envelope."
  },

  // --- STAGE 04: TRANSECT KINEMATICS & CHANGE RATES (Came 4th) ---
  {
    id: 20,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/analysis/shoreline_position_time.png",
    alt: "Shoreline Position Over Time Across Transects",
    title: "Shoreline Position Over Time Series",
    caption: "Linear regression time-series tracking cross-shore distance variations across sample transects along the Udupi corridor."
  },
  {
    id: 21,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/analysis/transect_rate_scatter.png",
    alt: "Transect-by-Transect Shoreline Change Rate",
    title: "Transect Change Rate Scatter Profile",
    caption: "Individual End Point Rate (EPR) values computed across all 1,944 shore-normal transects identifying localized retreat clusters."
  },
  {
    id: 22,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/analysis/annual_change_rate.png",
    alt: "Annual Shoreline Change Rate Distribution",
    title: "Annual Shoreline Change Rate Histogram",
    caption: "Frequency distribution of annualized shoreline migration rates illustrating erosion skewness during monsoon cycles."
  },
  {
    id: 23,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/analysis/alongshore_heatmap.png",
    alt: "Alongshore Erosion & Accretion Heatmap",
    title: "Alongshore Spatial Erosion Heatmap",
    caption: "Two-dimensional space-time raster heatmap mapping alongshore transect IDs against observation years to pinpoint persistent erosion zones."
  },
  {
    id: 24,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/report_images/longshore_rate_profile.png",
    alt: "Longshore Erosion Rate Profile (EPR)",
    title: "Longshore Erosion Rate Profile",
    caption: "Continuous alongshore rate envelope displaying meters/year retreat and advance from northern Kundapura to southern Mulki."
  },
  {
    id: 25,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/report_images/rate_distribution_density.png",
    alt: "Erosion Rate Distribution Density (KDE)",
    title: "Rate Distribution Density Curve",
    caption: "Non-parametric Kernel Density Estimate (KDE) demonstrating negative erosion tail behavior and extreme retreat outlier frequencies."
  },
  {
    id: 26,
    stage: "04. Transect Kinematics",
    stageNum: 4,
    badgeColor: "#d97706",
    src: "/report_images/scatter_rate_comparison.png",
    alt: "Scatter Rate Comparison: AI Model vs GEE Ground Truth",
    title: "Model vs GEE Ground Truth Agreement",
    caption: "Validation scatter plot showing 1:1 line concordance between DeepLabV3+ automated transect rates and Google Earth Engine ground truth."
  },

  // --- STAGE 05: ENVIRONMENTAL DRIVERS & ML ATTRIBUTION (Came 5th) ---
  {
    id: 27,
    stage: "05. Environmental Drivers",
    stageNum: 5,
    badgeColor: "#e11d48",
    src: "/env_correlation_heatmap.png",
    alt: "Environmental Parameters Correlation Heatmap",
    title: "Environmental Correlation Matrix",
    caption: "Pearson cross-correlation matrix linking wave height (Hs), peak wave period, monsoon wind direction, and tidal ranges with coastal retreat."
  },
  {
    id: 28,
    stage: "05. Environmental Drivers",
    stageNum: 5,
    badgeColor: "#e11d48",
    src: "/env_feature_importance.png",
    alt: "XGBoost Environmental Feature Importance",
    title: "XGBoost Feature Importance Estimator",
    caption: "Normalized Gini feature weight breakdown proving southwest monsoon wind orientation and significant wave height drive over 60% of erosion variance."
  },

  // --- STAGE 06: FUTURE PREDICTIONS & VULNERABILITY (2025-2029) (Came 6th / Future) ---
  {
    id: 29,
    stage: "06. Future Predictions 2025-2029",
    stageNum: 6,
    badgeColor: "#8b5cf6",
    src: "/forecast/average_net_shoreline_movement_2020_2029.jpg",
    alt: "Average Net Shoreline Movement (2020-2029)",
    title: "Average Net Shoreline Movement (2020–2029)",
    caption: "Complete decadal trajectory tracing cumulative shoreline movement from historical baseline (2020) through the 2029 future forecast horizon."
  },
  {
    id: 30,
    stage: "06. Future Predictions 2025-2029",
    stageNum: 6,
    badgeColor: "#8b5cf6",
    src: "/forecast/forecasted_cumulative_land_loss_2024_2029.jpg",
    alt: "Forecasted Cumulative Coastal Land Loss (2024-2029)",
    title: "Forecasted Cumulative Land Loss (2024–2029)",
    caption: "Predictive forward trajectory projecting coastal land loss expanding to +7.88 hectares across Udupi's vulnerable coastal corridor by 2029."
  },
  {
    id: 31,
    stage: "06. Future Predictions 2025-2029",
    stageNum: 6,
    badgeColor: "#8b5cf6",
    src: "/forecast/vulnerability_quantification.jpg",
    alt: "Coastal Vulnerability Length Quantification (km)",
    title: "Coastal Vulnerability Length Extent (km)",
    caption: "Categorical coastal vulnerability classification quantifying 7.65 km of Severe erosion, 5.76 km of Moderate erosion, and 83.79 km of Stable shoreline."
  },
  {
    id: 32,
    stage: "06. Future Predictions 2025-2029",
    stageNum: 6,
    badgeColor: "#8b5cf6",
    src: "/forecast/final_graph.jpg",
    alt: "Dual-Panel Integrated Coastal Forecast (Vulnerability & Cumulative Land Loss)",
    title: "Dual-Panel Integrated Coastal Forecast",
    caption: "High-resolution dual-panel synthesis linking spatial vulnerability risk classification (km) with forecasted cumulative land loss (hectares) through 2029."
  },
  {
    id: 33,
    stage: "06. Future Predictions 2025-2029",
    stageNum: 6,
    badgeColor: "#8b5cf6",
    src: "/forecast/final_graph_3panel.jpg",
    alt: "Comprehensive 3-Panel Decadal Forecast (Vulnerability + Land Loss + Net Movement)",
    title: "Publication 3-Panel Decadal Forecast",
    caption: "Master 3-panel publication visual integrating coastal vulnerability length, forecasted cumulative land loss (2024–2029), and average net shoreline movement (2020–2029)."
  }
];

const STAGE_FILTERS = [
  { id: "all", label: "All Visuals (33)" },
  { id: "01. Data Ingestion", label: "01. Ingestion (4)" },
  { id: "02. Model Training", label: "02. Models (8)" },
  { id: "03. Shorelines 2020-2024", label: "03. Shorelines (7)" },
  { id: "04. Transect Kinematics", label: "04. Transect Rates (7)" },
  { id: "05. Environmental Drivers", label: "05. Environmental (2)" },
  { id: "06. Future Predictions 2025-2029", label: "06. Predictions 2025–29 (5)" }
];

function PremiumGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [activeStage, setActiveStage] = useState("all");

  const filteredImages = useMemo(() => {
    if (activeStage === "all") return ARCHIVE_IMAGES;
    return ARCHIVE_IMAGES.filter((img) => img.stage === activeStage);
  }, [activeStage]);

  const doorTransition = { duration: 1.5, ease: [0.76, 0, 0.24, 1] };
  const closeLightbox = () => setSelectedImage(null);

  const navigateLightbox = (direction, e) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = ARCHIVE_IMAGES.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = ARCHIVE_IMAGES.length - 1;
    if (newIndex >= ARCHIVE_IMAGES.length) newIndex = 0;
    setSelectedImage(ARCHIVE_IMAGES[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight") {
        if (selectedImage) {
          const currentIndex = ARCHIVE_IMAGES.findIndex((img) => img.id === selectedImage.id);
          const next = (currentIndex + 1) % ARCHIVE_IMAGES.length;
          setSelectedImage(ARCHIVE_IMAGES[next]);
        }
      } else if (event.key === "ArrowLeft") {
        if (selectedImage) {
          const currentIndex = ARCHIVE_IMAGES.findIndex((img) => img.id === selectedImage.id);
          const prev = (currentIndex - 1 + ARCHIVE_IMAGES.length) % ARCHIVE_IMAGES.length;
          setSelectedImage(ARCHIVE_IMAGES[prev]);
        }
      }
    };

    document.body.classList.toggle("lightbox-open", Boolean(selectedImage));
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <div className="premium-gallery-wrapper">
      {/* 🚪 GATEWAY DOORS */}
      <motion.div 
        className="gateway-door gateway-left"
        initial={false}
        animate={{ x: isGatewayOpen ? "-100%" : "0%" }}
        transition={doorTransition}
      >
        <div className="door-content">
          <span className="door-text">VISUAL</span>
        </div>
      </motion.div>

      <motion.div 
        className="gateway-door gateway-right"
        initial={false}
        animate={{ x: isGatewayOpen ? "100%" : "0%" }}
        transition={doorTransition}
      >
        <div className="door-content">
          <span className="door-text">ARCHIVE</span>
        </div>
      </motion.div>

      {/* 🔒 UNLOCK BUTTON */}
      <AnimatePresence>
        {!isGatewayOpen && (
          <motion.div 
            className="gateway-center-lock"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <button className="btn-gateway" onClick={() => setIsGatewayOpen(true)}>
              <FiLock className="gateway-icon" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖼️ ACTUAL GALLERY CONTENT */}
      <div className="premium-gallery-container">
        <div className="gallery-header" style={{ flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div>
            <span className="tech-meta">CHRONOLOGICAL PIPELINE // COMPLETE ARCHIVE</span>
            <h2 className="gallery-title" style={{ margin: '5px 0' }}>COASTAL ARCHIVE VAULT</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              All 33 research images ordered sequentially from raw sensor ingestion to 2025–2029 future machine learning predictions.
            </p>
          </div>
          <motion.button 
            className="btn-gateway-close" 
            onClick={() => setIsGatewayOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLock className="gateway-icon" />
            <span>LOCK VAULT</span>
          </motion.button>
        </div>

        {/* 🏷️ STAGE FILTER PILLS */}
        <div 
          className="gallery-stage-filters"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            margin: '25px 0 35px 0',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700, marginRight: '6px' }}>
            <FiFilter /> FILTER PIPELINE:
          </div>
          {STAGE_FILTERS.map((filter) => {
            const isActive = activeStage === filter.id;
            return (
              <motion.button
                key={filter.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveStage(filter.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, var(--teal), #0284c7)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#fff' : 'var(--text-main)',
                  border: isActive ? '1px solid var(--teal)' : '1px solid var(--card-border)',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(0, 212, 255, 0.3)' : 'none'
                }}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </div>

        {/* 🗃️ GRID OF CHRONOLOGICAL CARDS */}
        <div className="premium-gallery-grid">
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              className="gallery-card"
              layoutId={`gallery-image-${img.id}`}
              onClick={() => setSelectedImage(img)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              style={{ position: 'relative' }}
            >
              {/* Top Index Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  border: `1px solid ${img.badgeColor || 'var(--teal)'}`,
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ color: img.badgeColor || 'var(--teal)' }}>#{String(img.id).padStart(2, '0')}</span>
                <span>{img.stage.split('.')[1]?.trim() || img.stage}</span>
              </div>

              <div className="gallery-card-inner" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="gallery-img" 
                  loading="lazy"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div className="gallery-hover-overlay">
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: '0.7rem', 
                    color: img.badgeColor || 'var(--teal)', 
                    fontWeight: 800, 
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}>
                    {img.stage}
                  </span>
                  <div className="gallery-card-title">{img.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔍 LIGHTBOX MODAL WITH FULL CONTROLS & DESCRIPTIONS */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <motion.div
              layoutId={`gallery-image-${selectedImage.id}`}
              className="lightbox-content pro-lightbox"
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
                      background: selectedImage.badgeColor || 'var(--teal)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Item #{String(selectedImage.id).padStart(2, '0')} of {ARCHIVE_IMAGES.length}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {selectedImage.stage}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => navigateLightbox(-1, e)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Previous visual (Left Arrow)"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => navigateLightbox(1, e)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Next visual (Right Arrow)"
                  >
                    <FiChevronRight size={20} />
                  </button>
                  <button
                    type="button"
                    className="lightbox-close-pro"
                    aria-label="Close image preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeLightbox();
                    }}
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
                  src={selectedImage.src} 
                  alt={selectedImage.alt} 
                  className="lightbox-img" 
                  style={{ maxHeight: '58vh', maxWidth: '100%', objectFit: 'contain' }}
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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#fff' }}>{selectedImage.title}</h3>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                  {selectedImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PremiumGallery;
