import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart2, 
  Layers, 
  Cpu, 
  MapPin, 
  TrendingDown, 
  Maximize2, 
  X, 
  Info,
  CheckCircle,
  Activity,
  Satellite,
  Compass
} from "lucide-react";

export default function Visualization() {
  const [activeCategory, setActiveCategory] = useState("historical"); 
  // 'historical' | 'erosion_accretion' | 'ml_performance' | 'vulnerability'
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: "historical", label: "Historical Coastline Analysis", icon: Satellite },
    { id: "erosion_accretion", label: "Erosion & Accretion Rates", icon: TrendingDown },
    { id: "ml_performance", label: "Machine Learning Performance", icon: Cpu },
    { id: "vulnerability", label: "Coastal Vulnerability & Hotspots", icon: MapPin },
  ];

  return (
    <div className="visualization-page" style={{ maxWidth: "1400px", margin: "0 auto", padding: "90px 24px 60px" }}>
      
      {/* Header */}
      <header style={{ marginBottom: "28px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>
          <Activity size={16} /> SCIENTIFIC RESULTS & ANALYTICAL OUTPUTS
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
          Coastal Analysis & Visualization System
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px", maxWidth: "880px" }}>
          Standardized visual analytics generated from multi-temporal Sentinel-1/2 satellites, DeepLabV3+ semantic segmentation, and Google Earth Engine automated processing pipelines.
        </p>
      </header>

      {/* Standardized Category Selection Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          background: "var(--card-bg, rgba(11, 19, 41, 0.7))",
          padding: "6px",
          borderRadius: "10px",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          marginBottom: "32px"
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: isActive ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          CATEGORY 1: HISTORICAL COASTLINE ANALYSIS
          ======================================================== */}
      {activeCategory === "historical" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: Mean Shoreline Position */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "1px" }}>TIME SERIES 2015–2024</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Mean Shoreline Position per Year (m)
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/shoreline/mean_position.png", title: "Mean Shoreline Position per Year (2015–2024)" })}
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", color: "#38bdf8", padding: "6px", cursor: "pointer" }}
                title="Expand image"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/shoreline/mean_position.png", title: "Mean Shoreline Position per Year (2015–2024)" })}>
              <img src="/shoreline/mean_position.png" alt="Mean shoreline position" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Annual mean cross-shore position across all 3,321 transects. Highlights the steady baseline retreat of approximately 24.34 m/yr in critical sections with seasonal post-monsoon oscillations.
            </p>
          </div>

          {/* Card 2: Google Earth Engine Satellite Workspace */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, letterSpacing: "1px" }}>REMOTE SENSING INGESTION</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Google Earth Engine Processing Engine
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/google_earth_engine_platform.png", title: "Google Earth Engine Automated Preprocessing Pipeline" })}
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px", color: "#10b981", padding: "6px", cursor: "pointer" }}
                title="Expand image"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/google_earth_engine_platform.png", title: "Google Earth Engine Automated Preprocessing Pipeline" })}>
              <img src="/google_earth_engine_platform.png" alt="Google Earth Engine" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Cloud-based ingestion workflow filtering cloud-free Sentinel-2 Level-2A surface reflectance composites. Applies automated Modified Normalized Difference Water Index (MNDWI) thresholding for initial land-water separation.
            </p>
          </div>

          {/* Card 3: Landsat & Sentinel Sensor Multi-Decadal Baselines */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 700, letterSpacing: "1px" }}>CALIBRATION BENCHMARK</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Multi-Sensor Satellite Benchmark
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/sentinel_source.png", title: "Sentinel-1/2 Multispectral & SAR Acquisition Matrix" })}
                style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "6px", color: "#818cf8", padding: "6px", cursor: "pointer" }}
                title="Expand image"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/sentinel_source.png", title: "Sentinel-1/2 Multispectral & SAR Acquisition Matrix" })}>
              <img src="/sentinel_source.png" alt="Sentinel Sensor Benchmark" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              10-meter resolution Sentinel-2 optical bands (B2, B3, B4, B8) fused with dual-polarization Sentinel-1 SAR (VV, VH) backscatter to penetrate monsoon cloud cover.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 2: EROSION & ACCRETION RATES
          ======================================================== */}
      {activeCategory === "erosion_accretion" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: Longshore Rate Profile */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "1px" }}>SPATIAL VARIATION</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Longshore Rate Profile (m/yr)
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/report_images/longshore_rate_profile.png", title: "Longshore Erosion/Accretion Rate Profile along 97.2 km Corridor" })}
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", color: "#38bdf8", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/report_images/longshore_rate_profile.png", title: "Longshore Erosion/Accretion Rate Profile" })}>
              <img src="/report_images/longshore_rate_profile.png" alt="Longshore profile" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Plots transect rates sequentially from Baindur in the north to Ullal in the south. Accretion zones (positive m/yr) cluster around river estuaries, whereas open high-energy barrier beaches exhibit severe negative spikes.
            </p>
          </div>

          {/* Card 2: Rate Distribution Density */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#f59e0b", fontWeight: 700, letterSpacing: "1px" }}>STATISTICAL DENSITY</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Rate Distribution & Frequency Density
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/report_images/rate_distribution_density.png", title: "Kernel Density Estimation of Coastal Movement Rates" })}
                style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "6px", color: "#f59e0b", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/report_images/rate_distribution_density.png", title: "Rate Distribution Density" })}>
              <img src="/report_images/rate_distribution_density.png" alt="Rate density" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Kernel Density Estimation (KDE) comparing observed ground truth versus DeepLabV3+ predicted movement rates. Confirms high modal alignment in the -0.5 m/yr to -2.0 m/yr regional background rate.
            </p>
          </div>

          {/* Card 3: Scatter Rate Comparison */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, letterSpacing: "1px" }}>CORRELATION VALIDATION</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Scatter Rate Comparison (GT vs DLV3)
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/report_images/scatter_rate_comparison.png", title: "Scatter Plot: Ground Truth vs DeepLabV3+ Predicted Rates" })}
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px", color: "#10b981", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/report_images/scatter_rate_comparison.png", title: "Scatter Rate Comparison" })}>
              <img src="/report_images/scatter_rate_comparison.png" alt="Scatter comparison" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Transect-by-transect correlation analysis demonstrating strong agreement (Pearson r = 0.88) with minimal bias along the 1:1 diagonal identity reference line.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 3: MACHINE LEARNING PERFORMANCE
          ======================================================== */}
      {activeCategory === "ml_performance" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: DeepLabV3+ Confusion Matrix */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "1px" }}>DEEPLABV3+ SEGMENTATION</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Confusion Matrix (Land vs Water)
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/env_ml_confusion_matrix_deeplab.png?v=3", title: "DeepLabV3+ Semantic Segmentation Confusion Matrix" })}
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", color: "#38bdf8", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/env_ml_confusion_matrix_deeplab.png?v=3", title: "DeepLabV3+ Semantic Segmentation Confusion Matrix" })}>
              <img src="/env_ml_confusion_matrix_deeplab.png?v=3" alt="DeepLabV3+ Confusion Matrix" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Evaluates pixel classification performance across land and sea classes. Minimal cross-contamination confirms sub-pixel boundary fidelity even under turbid intertidal surf conditions.
            </p>
          </div>

          {/* Card 2: DeepLabV3+ Classification Report */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, letterSpacing: "1px" }}>VALIDATION BENCHMARKS</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Model Accuracy Metrics Report
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/env_ml_report_deeplab.png?v=3", title: "DeepLabV3+ Precision, Recall, F1-Score & Validation Dice Score" })}
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px", color: "#10b981", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/env_ml_report_deeplab.png?v=3", title: "Model Accuracy Metrics Report" })}>
              <img src="/env_ml_report_deeplab.png?v=3" alt="DeepLabV3+ Metrics Report" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Key validation scores: <strong>85.48% Overall Validation Accuracy</strong>, <strong>Dice coefficient: 92.17%</strong>, and <strong>IoU: 85.48%</strong>, proving superior boundary delineation over standard U-Net baselines.
            </p>
          </div>

          {/* Card 3: Environmental Feature Importance */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 700, letterSpacing: "1px" }}>XGBOOST EXPLAINABILITY</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Environmental Feature Importance
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/env_feature_importance.png", title: "XGBoost Environmental Factor Importance" })}
                style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "6px", color: "#818cf8", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/env_feature_importance.png", title: "Environmental Feature Importance" })}>
              <img src="/env_feature_importance.png" alt="Feature Importance" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Quantifies primary drivers of coastal retreat: Significant wave height (Hs), Monsoon Exposure Index (MEI), tidal range, and beach berm slope (tan β) contribute 78% of predictive weight.
            </p>
          </div>

          {/* Card 4: Environmental Correlation Heatmap */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#f43f5e", fontWeight: 700, letterSpacing: "1px" }}>FACTOR MULTIVARIATE ANALYSIS</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Environmental Correlation Heatmap
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/env_correlation_heatmap.png", title: "Pearson Correlation Matrix Across Environmental Parameters" })}
                style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "6px", color: "#f43f5e", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/env_correlation_heatmap.png", title: "Correlation Heatmap" })}>
              <img src="/env_correlation_heatmap.png" alt="Correlation Heatmap" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Multivariate matrix correlating shoreline displacement with bathymetric slope, wave period, coastal curvature, and estuarine proximity along the Udupi study corridor.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 4: COASTAL VULNERABILITY & HOTSPOTS
          ======================================================== */}
      {activeCategory === "vulnerability" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: Multi-Panel Analysis Overview */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "1px" }}>FIELD VERIFICATION</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Corridor 3-Panel Hotspot Composite
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/final_graph_3panel.jpg", title: "Corridor 3-Panel Analysis: Wave Energy, Shoreline Retreat, and Vulnerability" })}
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", color: "#38bdf8", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/final_graph_3panel.jpg", title: "3-Panel Hotspot Composite" })}>
              <img src="/final_graph_3panel.jpg" alt="3-Panel Composite" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Integrates wave energy concentration zones, historical shoreline retreat curves, and critical settlement vulnerability indexes along the 97.2 km monitoring strip.
            </p>
          </div>

          {/* Card 2: NOAA Tidal & Current Calibration */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, letterSpacing: "1px" }}>HYDROGRAPHIC INPUTS</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Tidal Elevation & Current Modeling
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/tides_currents_noaa.png", title: "Hydrographic Tidal Regime & Nearshore Currents" })}
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px", color: "#10b981", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/tides_currents_noaa.png", title: "Tidal Elevation & Current Modeling" })}>
              <img src="/tides_currents_noaa.png" alt="Tides & Currents" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Nearshore hydrodynamic records used to perform equilibrium waterline normalization, removing astronomical tidal elevation bias from satellite imagery acquisitions.
            </p>
          </div>

          {/* Card 3: Final Integrated Vulnerability Model */}
          <div style={{ background: "var(--card-bg, rgba(11, 19, 41, 0.75))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#f59e0b", fontWeight: 700, letterSpacing: "1px" }}>DECISION SUPPORT LAYER</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-main)" }}>
                  Synthesized Coastal Vulnerability Map
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage({ src: "/final_graph.jpg", title: "Synthesized Coastal Vulnerability Index Map" })}
                style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "6px", color: "#f59e0b", padding: "6px", cursor: "pointer" }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div style={{ position: "relative", height: "240px", borderRadius: "8px", overflow: "hidden", background: "#050e1d", marginBottom: "16px", cursor: "pointer" }} onClick={() => setLightboxImage({ src: "/final_graph.jpg", title: "Synthesized Coastal Vulnerability Map" })}>
              <img src="/final_graph.jpg" alt="Final graph" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Classifies transects into 4 distinct risk zones to support local coastal municipal bodies and district disaster response cells in prioritizing coastal protection interventions.
            </p>
          </div>
        </div>
      )}

      {/* 🔍 Scientific Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(3, 7, 18, 0.85)",
              backdropFilter: "blur(10px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px"
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0b1329",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "14px",
                maxWidth: "1100px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)"
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(14, 165, 233, 0.08)"
                }}
              >
                <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#f8fafc", fontWeight: 700 }}>
                  {lightboxImage.title}
                </h4>
                <button
                  onClick={() => setLightboxImage(null)}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "6px" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: "20px", overflowY: "auto", display: "flex", justifyContent: "center", background: "#050e1d" }}>
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  style={{ maxHeight: "72vh", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" }}
                />
              </div>

              <div
                style={{
                  padding: "12px 20px",
                  fontSize: "0.78rem",
                  color: "#94a3b8",
                  background: "rgba(15, 23, 42, 0.95)",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>Udupi Coastal Erosion Analysis Study</span>
                <span>Press ESC or click outside to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
