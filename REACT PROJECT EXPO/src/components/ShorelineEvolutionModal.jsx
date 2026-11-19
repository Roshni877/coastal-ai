import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  Maximize2,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Shoreline evolution epochs definition
export const TIMELINE_EPOCHS = [
  {
    year: 2020,
    label: "2020 Baseline",
    type: "observed",
    statusBadge: "EMPIRICAL SATELLITE BASELINE",
    badgeColor: "cyan",
    image: "/shoreline/2020.png",
    netShift: "0.00 m (Reference)",
    hotspotRetreat: "0.00 m",
    cumulativeLoss: "0.00 Hectares",
    transectsAnalyzed: "1,944 Transects",
    description: "Cloud-masked Sentinel-2 & Sentinel-1 dual-polarization SAR baseline reference epoch across 97.2 km of Udupi coastline.",
    scienceNote: "Baseline established at mean sea level with in-situ tidal correction: Delta X = (H_tide - H_ref) / tan(0.03)."
  },
  {
    year: 2021,
    label: "2021 Observed",
    type: "observed",
    statusBadge: "OBSERVED SATELLITE RETREAT",
    badgeColor: "cyan",
    image: "/shoreline/2021.png",
    netShift: "-1.82 m (Average)",
    hotspotRetreat: "-7.40 m at Bengre Spit",
    cumulativeLoss: "1.77 Hectares",
    transectsAnalyzed: "1,944 Transects",
    description: "Post-monsoon satellite observation reveals acute seasonal retreat along unprotected spit spitheads and river confluences.",
    scienceNote: "DeepLabV3+ semantic segmentation delineated high-water line; confirmed with GEE NDWI thresholding."
  },
  {
    year: 2022,
    label: "2022 Observed",
    type: "observed",
    statusBadge: "OBSERVED SATELLITE RETREAT",
    badgeColor: "cyan",
    image: "/shoreline/2022.png",
    netShift: "-3.15 m (Average)",
    hotspotRetreat: "-13.80 m at Malpe Port Zone",
    cumulativeLoss: "3.06 Hectares",
    transectsAnalyzed: "1,944 Transects",
    description: "Accelerated beach starvation downdrift of hard seawall revetments. Severe localized scouring noted south of Malpe breakwater.",
    scienceNote: "Alongshore sediment transport gradient confirms negative littoral sediment budget."
  },
  {
    year: 2023,
    label: "2023 Observed",
    type: "observed",
    statusBadge: "OBSERVED SATELLITE RETREAT",
    badgeColor: "cyan",
    image: "/shoreline/2023.png",
    netShift: "-4.90 m (Average)",
    hotspotRetreat: "-19.20 m at Bengre",
    cumulativeLoss: "4.76 Hectares",
    transectsAnalyzed: "1,944 Transects",
    description: "High monsoonal swell erosion detected through fused Sentinel-1 C-band SAR backscatter when optical was 100% cloud-obscured.",
    scienceNote: "SAR VV/VH polarization ratio provided continuous coastline continuity during June–September monsoon storms."
  },
  {
    year: 2024,
    label: "2024 Latest Observed",
    type: "observed",
    statusBadge: "FINAL VALIDATED OBSERVATION",
    badgeColor: "emerald",
    image: "/shoreline/2024.png",
    netShift: "-6.24 m Cumulative",
    hotspotRetreat: "-24.00 m at Bengre Sandspit",
    cumulativeLoss: "6.07 Hectares",
    transectsAnalyzed: "1,944 Transects",
    description: "Final empirically validated satellite epoch. Confirms 4-year End Point Rates (EPR) reaching up to -40 m/yr at critical hotspots.",
    scienceNote: "Sub-meter verified against Google Earth Pro aerial ground truth with 85.48% Dice score."
  },
  {
    year: "2025–2026",
    label: "2025–2026 Data Gap",
    type: "gap",
    statusBadge: "VERIFIED DATA GAP // UNOBSERVED WINDOW",
    badgeColor: "amber",
    image: "/shoreline/overall_analysis_new.png",
    netShift: "Uncalculated (Calibration Hold)",
    hotspotRetreat: "Satellite Calibration Interval",
    cumulativeLoss: "Preserved Gap Window",
    transectsAnalyzed: "1,944 Baseline Grid",
    description: "Scientific integrity hold: No empirical satellite imagery processed or fabricated for this window. Prevents artificial interpolation bias before deep learning extrapolation.",
    scienceNote: "Rigorous scientific standard: Only empirical observations (2020–2024) and model predictions (2027–2029) are reported."
  },
  {
    year: 2027,
    label: "2027 Forecast",
    type: "forecast",
    statusBadge: "DEEP LEARNING PROJECTION (DEEPLABV3+ + EPR)",
    badgeColor: "pink",
    image: "/forecast/average_net_shoreline_movement_2020_2029.jpg",
    netShift: "-7.80 m Projected",
    hotspotRetreat: "-28.50 m Projected Hotspot",
    cumulativeLoss: "+4.73 Hectares Projected",
    transectsAnalyzed: "1,944 Transects",
    description: "Machine learning kinematics and End Point Rate extrapolation project continued seaward spit thinning under current wave energy regimes.",
    scienceNote: "Actual measurements unobservable (erosion has not yet occurred). Modeled via DeepLabV3+ + Linear EPR."
  },
  {
    year: 2028,
    label: "2028 Forecast",
    type: "forecast",
    statusBadge: "DEEP LEARNING PROJECTION (DEEPLABV3+ + EPR)",
    badgeColor: "pink",
    image: "/forecast/vulnerability_quantification.jpg",
    netShift: "-9.35 m Projected",
    hotspotRetreat: "-34.20 m Projected Hotspot",
    cumulativeLoss: "+6.30 Hectares Projected",
    transectsAnalyzed: "1,944 Transects",
    description: "XGBoost environmental hazard model predicts 46.8% of the central district coastline in High/Severe Vulnerability tier.",
    scienceNote: "Actual measurements unobservable. Downstream XGBoost hazard classifier achieves 84.8% validation accuracy."
  },
  {
    year: 2029,
    label: "2029 Long-Term Forecast",
    type: "forecast",
    statusBadge: "5-YEAR PREDICTIVE DEFENSE HORIZON",
    badgeColor: "purple",
    image: "/forecast/final_graph_3panel.jpg",
    netShift: "-10.90 m Projected",
    hotspotRetreat: "-40.00 m Projected Peak",
    cumulativeLoss: "+7.88 Hectares Cumulative Loss",
    transectsAnalyzed: "1,944 Transects",
    description: "Final 2029 planning horizon projection. 7.88 hectares of coastal land projected lost along Udupi district without intervention.",
    scienceNote: "Actual data is unobservable because erosion has not yet occurred. Modeled exclusively through AI forecasting."
  }
];

export default function ShorelineEvolutionModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(2500); // 2.5 seconds per step

  const activeEpoch = TIMELINE_EPOCHS[currentIndex];

  // Auto-play animation timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TIMELINE_EPOCHS.length);
    }, playbackSpeed);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, playbackSpeed]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentIndex((p) => Math.min(TIMELINE_EPOCHS.length - 1, p + 1));
      if (e.key === "ArrowLeft") setCurrentIndex((p) => Math.max(0, p - 1));
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="evolution-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="evolution-modal-container"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="evolution-modal-header">
            <div className="header-badge-group">
              <span className="live-pulse-dot" />
              <span className="evolution-tag">INTERACTIVE SHORELINE DYNAMICS // 2020 &rarr; 2029</span>
            </div>
            <button className="evolution-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          {/* Main Visual Display & Stage */}
          <div className="evolution-stage-grid">
            {/* Left: Satellite Vector / Prediction Stage */}
            <div className="evolution-image-pane">
              <div className="evolution-epoch-badge-strip">
                <span className={`status-pill badge-${activeEpoch.badgeColor}`}>
                  {activeEpoch.statusBadge}
                </span>
                <span className="epoch-year-badge">{activeEpoch.year}</span>
              </div>

              <div className="evolution-img-container">
                <img 
                  key={activeEpoch.image}
                  src={activeEpoch.image} 
                  alt={activeEpoch.label} 
                  className="evolution-active-img"
                />
                {activeEpoch.type === "gap" && (
                  <div className="gap-overlay-watermark">
                    <AlertTriangle size={32} className="text-amber" />
                    <strong>VERIFIED DATA GAP (2025–2026)</strong>
                    <p>No synthetic values fabricated. Baseline held uncalculated to preserve experimental validity.</p>
                  </div>
                )}
              </div>

              {/* Science note callout box */}
              <div className="evolution-science-callout">
                <div className="callout-head">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>METHODOLOGY SPECIFICATION</span>
                </div>
                <p>{activeEpoch.scienceNote}</p>
              </div>
            </div>

            {/* Right: Telemetry & Dynamic Metrics HUD */}
            <div className="evolution-telemetry-pane">
              <div className="telemetry-header">
                <h2>{activeEpoch.label}</h2>
                <p className="epoch-desc">{activeEpoch.description}</p>
              </div>

              {/* 4-Box Telemetry Grid */}
              <div className="telemetry-metrics-grid">
                <div className="telemetry-box">
                  <span className="telemetry-label">Net Coastline Shift</span>
                  <strong className={`telemetry-val ${activeEpoch.type === 'gap' ? 'text-amber' : 'text-cyan'}`}>
                    {activeEpoch.netShift}
                  </strong>
                  <span className="telemetry-sub">Across 97.2 km Corridor</span>
                </div>

                <div className="telemetry-box">
                  <span className="telemetry-label">Hotspot Retreat</span>
                  <strong className={`telemetry-val ${activeEpoch.type === 'gap' ? 'text-amber' : 'text-pink'}`}>
                    {activeEpoch.hotspotRetreat}
                  </strong>
                  <span className="telemetry-sub">Critical Spit Formations</span>
                </div>

                <div className="telemetry-box">
                  <span className="telemetry-label">Cumulative Land Loss</span>
                  <strong className={`telemetry-val ${activeEpoch.type === 'gap' ? 'text-amber' : 'text-purple'}`}>
                    {activeEpoch.cumulativeLoss}
                  </strong>
                  <span className="telemetry-sub">Alongshore Integral</span>
                </div>

                <div className="telemetry-box">
                  <span className="telemetry-label">Spatial Baseline</span>
                  <strong className="telemetry-val text-emerald">
                    {activeEpoch.transectsAnalyzed}
                  </strong>
                  <span className="telemetry-sub">50 m Orthogonal Spacing</span>
                </div>
              </div>

              {/* Interactive Timeline Stepper Buttons */}
              <div className="evolution-stepper-track">
                <span className="stepper-title">Direct Jump to Timeline Horizon:</span>
                <div className="stepper-buttons-row">
                  {TIMELINE_EPOCHS.map((epoch, idx) => (
                    <button
                      key={epoch.year}
                      className={`stepper-node-btn ${currentIndex === idx ? 'active' : ''} ${epoch.type}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPlaying(false);
                      }}
                    >
                      <span className="node-yr">{epoch.year}</span>
                      <span className="node-type">
                        {epoch.type === "observed" ? "Observed" : epoch.type === "gap" ? "Data Gap" : "DL Forecast"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deep Link to Research Portals */}
              <div className="evolution-deep-links">
                <NavLink 
                  to="/evidence-lab#section-historical" 
                  className="deep-link-btn"
                  onClick={onClose}
                >
                  <Compass size={14} />
                  <span>Inspect Satellite Vectors in Evidence Lab</span>
                  <ChevronRight size={14} />
                </NavLink>
                <NavLink 
                  to="/comparison" 
                  className="deep-link-btn"
                  onClick={onClose}
                >
                  <Layers size={14} />
                  <span>View DL Prediction Tables</span>
                  <ChevronRight size={14} />
                </NavLink>
              </div>
            </div>
          </div>

          {/* Bottom Playback & Scrubber Controls */}
          <div className="evolution-controls-bar">
            {/* Play / Step Buttons */}
            <div className="playback-btn-group">
              <button 
                className="ctrl-btn" 
                onClick={() => {
                  setCurrentIndex((p) => Math.max(0, p - 1));
                  setIsPlaying(false);
                }}
                title="Previous Year (Left Arrow)"
              >
                <SkipBack size={16} />
              </button>

              <button 
                className="ctrl-btn play-pause-btn" 
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlaying ? "Pause Time-Lapse" : "Play Evolution"}</span>
              </button>

              <button 
                className="ctrl-btn" 
                onClick={() => {
                  setCurrentIndex((p) => Math.min(TIMELINE_EPOCHS.length - 1, p + 1));
                  setIsPlaying(false);
                }}
                title="Next Year (Right Arrow)"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Scrubber Range Slider */}
            <div className="evolution-scrubber-wrapper">
              <span className="scrubber-year-tag">{activeEpoch.year}</span>
              <input 
                type="range" 
                min={0} 
                max={TIMELINE_EPOCHS.length - 1} 
                value={currentIndex}
                onChange={(e) => {
                  setCurrentIndex(parseInt(e.target.value, 10));
                  setIsPlaying(false);
                }}
                className="evolution-scrubber-input"
              />
              <span className="scrubber-total-tag">2029 Horizon</span>
            </div>

            {/* Speed Selector */}
            <div className="evolution-speed-group">
              <span className="speed-lbl">Speed:</span>
              {[3500, 2500, 1500].map((speed, i) => (
                <button
                  key={speed}
                  className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(speed)}
                >
                  {i === 0 ? "0.75×" : i === 1 ? "1.0×" : "1.75×"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
