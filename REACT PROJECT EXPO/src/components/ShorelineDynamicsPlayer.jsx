import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  ExternalLink, 
  Radio, 
  Activity, 
  Layers, 
  RotateCcw,
  Sparkles,
  Compass
} from "lucide-react";

export const SHORELINE_YEARS = [
  {
    year: 2020,
    label: "2020 Baseline",
    badge: "BASELINE EPOCH",
    badgeColor: "#38bdf8",
    image: "/shoreline/anim_frame_2020.png",
    fallbackImage: "/shoreline/2020.png",
    netShift: "0.00 m (Ref)",
    hotspotRetreat: "0.00 m (Reference)",
    cumulativeLoss: "0.00 Hectares",
    transects: "1,944 Baseline Grid",
    description: "Sentinel-2 & Sentinel-1 SAR baseline reference epoch across 97.2 km of Udupi coastline."
  },
  {
    year: 2021,
    label: "2021 Observed",
    badge: "OBSERVED RETREAT",
    badgeColor: "#0ea5e9",
    image: "/shoreline/anim_frame_2021.png",
    fallbackImage: "/shoreline/2021.png",
    netShift: "-1.82 m (Average)",
    hotspotRetreat: "-7.40 m at Bengre Spit",
    cumulativeLoss: "1.77 Hectares",
    transects: "1,944 Transects",
    description: "Post-monsoon satellite observation reveals acute seasonal retreat along unprotected spitheads."
  },
  {
    year: 2022,
    label: "2022 Observed",
    badge: "OBSERVED RETREAT",
    badgeColor: "#f59e0b",
    image: "/shoreline/anim_frame_2022.png",
    fallbackImage: "/shoreline/2022.png",
    netShift: "-3.15 m (Average)",
    hotspotRetreat: "-13.80 m at Malpe Port Zone",
    cumulativeLoss: "3.06 Hectares",
    transects: "1,944 Transects",
    description: "Accelerated beach starvation downdrift of hard seawall revetments south of Malpe breakwater."
  },
  {
    year: 2023,
    label: "2023 Observed",
    badge: "OBSERVED RETREAT",
    badgeColor: "#ec4899",
    image: "/shoreline/anim_frame_2023.png",
    fallbackImage: "/shoreline/2023.png",
    netShift: "-4.90 m (Average)",
    hotspotRetreat: "-19.20 m at Bengre",
    cumulativeLoss: "4.76 Hectares",
    transects: "1,944 Transects",
    description: "Monsoonal swell erosion detected through fused Sentinel-1 SAR backscatter during cloudy monsoon."
  },
  {
    year: 2024,
    label: "2024 Validated",
    badge: "FINAL VALIDATED",
    badgeColor: "#10b981",
    image: "/shoreline/anim_frame_2024.png",
    fallbackImage: "/shoreline/2024.png",
    netShift: "-6.24 m Cumulative",
    hotspotRetreat: "-24.00 m at Bengre Sandspit",
    cumulativeLoss: "6.07 Hectares",
    transects: "1,944 Transects",
    description: "Final empirically validated satellite epoch. 4-year End Point Rates (EPR) reaching up to -40 m/yr."
  }
];

export default function ShorelineDynamicsPlayer({ 
  onExpandFullscreen, 
  isModal = false,
  showTitle = true 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMs, setSpeedMs] = useState(1250); // 1.25s per frame
  const [viewMode, setViewMode] = useState("stepper"); // 'stepper' or 'gif'
  const timerRef = useRef(null);

  // Preload all frames on mount
  useEffect(() => {
    SHORELINE_YEARS.forEach((ep) => {
      const img1 = new Image();
      img1.src = ep.image;
      const img2 = new Image();
      img2.src = ep.fallbackImage;
    });
    const gif = new Image();
    gif.src = "/shoreline_animation.gif";
  }, []);

  const activeEpoch = SHORELINE_YEARS[currentIndex];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || viewMode === "gif") return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHORELINE_YEARS.length);
    }, speedMs);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speedMs, viewMode]);

  return (
    <div className={`shoreline-dynamics-player ${isModal ? "player-modal-mode" : "player-inline-mode"}`}>
      {/* Header Bar */}
      {showTitle && (
        <div className="sdp-header">
          <div className="sdp-header-left">
            <span className="sdp-badge">
              <Radio size={13} className="sdp-live-icon" />
              MULTI-TEMPORAL SHORELINE DYNAMICS // 2020 &rarr; 2024
            </span>
            <h3 className="sdp-title">Coastline Change Dynamics Animation</h3>
            <p className="sdp-sub">
              Sequential satellite shoreline vectors extracted along 97.2 km of Udupi coastline via 9-channel DeepLabV3+.
            </p>
          </div>

          <div className="sdp-header-actions">
            {/* Mode switch */}
            <div className="sdp-mode-pill-group">
              <button
                type="button"
                className={`sdp-mode-btn ${viewMode === "stepper" ? "active" : ""}`}
                onClick={() => setViewMode("stepper")}
                title="Interactive frame stepper with telemetry"
              >
                Interactive Player
              </button>
              <button
                type="button"
                className={`sdp-mode-btn ${viewMode === "gif" ? "active" : ""}`}
                onClick={() => setViewMode("gif")}
                title="Continuous looping raster animation"
              >
                Continuous Loop GIF
              </button>
            </div>

            {onExpandFullscreen && !isModal && (
              <button
                type="button"
                className="sdp-fullscreen-btn"
                onClick={onExpandFullscreen}
                title="Expand Fullscreen Animation"
              >
                <Maximize2 size={15} />
                <span>Fullscreen</span>
              </button>
            )}

            <a
              href="https://drive.google.com/file/d/1H3Cv-Yw_3O4bzLczOT-6JY5CZeQ9yuU4/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="sdp-drive-btn"
              title="Verified Google Drive file source"
            >
              <ExternalLink size={14} />
              <span>Drive Source</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Visual Display Stage */}
      <div className="sdp-stage-container">
        {viewMode === "gif" ? (
          <div className="sdp-image-frame gif-mode">
            <img
              src="/shoreline_animation.gif"
              alt="Multi-temporal Shoreline Dynamics Animation (Continuous Loop)"
              className="sdp-main-img"
              loading="eager"
            />
            <div className="sdp-gif-watermark">
              <span className="sdp-pulse-dot" />
              <span>CONTINUOUS SATELLITE RASTER LOOP (2020–2024)</span>
            </div>
          </div>
        ) : (
          <div className="sdp-image-frame stepper-mode">
            <AnimatePresence initial={false}>
              <motion.img
                key={activeEpoch.year}
                src={activeEpoch.image}
                alt={activeEpoch.label}
                className="sdp-main-img"
                loading="eager"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.85 }}
                transition={{ duration: 0.15 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = activeEpoch.fallbackImage;
                }}
              />
            </AnimatePresence>

            {/* In-Frame Live Year Pill */}
            <div className="sdp-inframe-badge">
              <span className="sdp-pulse-dot" />
              <span className="sdp-year-lbl">{activeEpoch.year}</span>
              <span 
                className="sdp-epoch-tag" 
                style={{ backgroundColor: `${activeEpoch.badgeColor}22`, color: activeEpoch.badgeColor, borderColor: `${activeEpoch.badgeColor}55` }}
              >
                {activeEpoch.badge}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar (Available in stepper mode) */}
      {viewMode === "stepper" && (
        <div className="sdp-controls-bar">
          {/* Play/Pause & Step Buttons */}
          <div className="sdp-playback-btns">
            <button
              type="button"
              className="sdp-ctrl-btn"
              onClick={() => {
                setCurrentIndex((p) => (p === 0 ? SHORELINE_YEARS.length - 1 : p - 1));
                setIsPlaying(false);
              }}
              title="Previous Year"
            >
              <SkipBack size={16} />
            </button>

            <button
              type="button"
              className={`sdp-ctrl-btn sdp-play-btn ${isPlaying ? "playing" : ""}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Animation" : "Play Animation"}
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              type="button"
              className="sdp-ctrl-btn"
              onClick={() => {
                setCurrentIndex((p) => (p + 1) % SHORELINE_YEARS.length);
                setIsPlaying(false);
              }}
              title="Next Year"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Year Node Buttons */}
          <div className="sdp-year-nodes-row">
            {SHORELINE_YEARS.map((epoch, idx) => (
              <button
                key={epoch.year}
                type="button"
                className={`sdp-node-btn ${currentIndex === idx ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                style={currentIndex === idx ? { borderColor: epoch.badgeColor, color: epoch.badgeColor } : {}}
              >
                <span className="node-yr">{epoch.year}</span>
              </button>
            ))}
          </div>

          {/* Timeline Scrubber */}
          <div className="sdp-scrubber-box">
            <span className="sdp-scrub-lbl">2020</span>
            <input
              type="range"
              min={0}
              max={SHORELINE_YEARS.length - 1}
              value={currentIndex}
              onChange={(e) => {
                setCurrentIndex(parseInt(e.target.value, 10));
                setIsPlaying(false);
              }}
              className="sdp-scrub-slider"
            />
            <span className="sdp-scrub-lbl">2024</span>
          </div>

          {/* Speed Selector */}
          <div className="sdp-speed-selector">
            <span className="sdp-speed-txt">Speed:</span>
            {[
              { label: "0.75×", ms: 1750 },
              { label: "1.0×", ms: 1250 },
              { label: "1.5×", ms: 750 }
            ].map((spd) => (
              <button
                key={spd.label}
                type="button"
                className={`sdp-spd-btn ${speedMs === spd.ms ? "active" : ""}`}
                onClick={() => setSpeedMs(spd.ms)}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Telemetry Metrics HUD */}
      <div className="sdp-telemetry-hud">
        <div className="sdp-telemetry-item">
          <span className="sdp-t-label">Active Epoch</span>
          <strong className="sdp-t-val" style={{ color: activeEpoch.badgeColor }}>
            {activeEpoch.label}
          </strong>
          <span className="sdp-t-sub">{activeEpoch.badge}</span>
        </div>

        <div className="sdp-telemetry-item">
          <span className="sdp-t-label">Net Coastline Shift</span>
          <strong className="sdp-t-val text-cyan">
            {activeEpoch.netShift}
          </strong>
          <span className="sdp-t-sub">97.2 km Corridor Mean</span>
        </div>

        <div className="sdp-telemetry-item">
          <span className="sdp-t-label">Critical Hotspot Retreat</span>
          <strong className="sdp-t-val text-pink">
            {activeEpoch.hotspotRetreat}
          </strong>
          <span className="sdp-t-sub">Bengre Barrier Spit</span>
        </div>

        <div className="sdp-telemetry-item">
          <span className="sdp-t-label">Cumulative Loss</span>
          <strong className="sdp-t-val text-amber">
            {activeEpoch.cumulativeLoss}
          </strong>
          <span className="sdp-t-sub">{activeEpoch.transects}</span>
        </div>
      </div>
    </div>
  );
}
