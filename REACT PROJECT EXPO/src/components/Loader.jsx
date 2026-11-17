import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaterSplash from "./WaterSplash";
import WaterDroplets from "./WaterDroplets";
import EarthGlobe from "./EarthGlobe";
import "./Loader.css";

const statusSteps = [
  { threshold: 18, text: "CONNECTING TO SENTINEL-2 & LANDSAT-9 FEEDS..." },
  { threshold: 38, text: "INGESTING MULTISPECTRAL BANDS (NDWI / MNDWI)..." },
  { threshold: 62, text: "RUNNING DEEPLABV3+ RESNET101 SEGMENTATION..." },
  { threshold: 82, text: "CALCULATING TRANSECTS & EROSION HAZARD RATES..." },
  { threshold: 96, text: "SYNTHESIZING PREDICTIVE GEOSPATIAL ARCHIVES..." },
  { threshold: 100, text: "COASTAL ANALYSIS COMPLETE — INITIALIZING SYSTEM..." }
];

const transectPoints = [
  { id: "T-01", x: 90, y: 55, rate: "-1.8m/y", risk: "high" },
  { id: "T-02", x: 160, y: 75, rate: "-2.4m/y", risk: "severe" },
  { id: "T-03", x: 230, y: 110, rate: "-0.6m/y", risk: "moderate" },
  { id: "T-04", x: 310, y: 145, rate: "+0.4m/y", risk: "accretion" },
  { id: "T-05", x: 390, y: 175, rate: "-1.9m/y", risk: "high" },
  { id: "T-06", x: 470, y: 210, rate: "-3.1m/y", risk: "severe" },
  { id: "T-07", x: 550, y: 235, rate: "-0.8m/y", risk: "moderate" },
];

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("analysis"); // analysis -> droplets -> earth -> whiteout -> falling
  const [progress, setProgress] = useState(0);
  const [activeStatus, setActiveStatus] = useState(statusSteps[0].text);
  const [showSplash, setShowSplash] = useState(false);
  const audioRef = useRef(null);

  // Background subtle ocean wave sound
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Smooth progress increment for the computer screen analysis
  useEffect(() => {
    if (phase !== "analysis") return;

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds computer analysis duration

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      const easedProgress = Math.round(
        rawProgress < 80 ? rawProgress * 1.05 : 80 + (rawProgress - 80) * 0.95
      );
      const clamped = Math.min(Math.max(easedProgress, 0), 100);
      setProgress(clamped);

      const matched =
        statusSteps.find((s) => clamped <= s.threshold) ||
        statusSteps[statusSteps.length - 1];
      setActiveStatus(matched.text);

      if (rawProgress >= 100) {
        clearInterval(timer);
        // Automatically transition into the water droplets & Earth globe
        setTimeout(() => {
          advanceToEarth();
        }, 400);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [phase]);

  // Transition from Computer Analysis Screen to Water Droplets and Earth
  const advanceToEarth = () => {
    setPhase("droplets");
    setShowSplash(true);

    // Transition to Earth view
    setTimeout(() => {
      setPhase("earth");
    }, 1800);
  };

  // Keyboard shortcut Esc to skip to earth or skip completely
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (phase === "analysis") {
          advanceToEarth();
        } else if (phase === "earth") {
          handleEarthClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  // Clicking the highlighted area on Earth or the explore button
  const handleEarthClick = () => {
    if (phase === "earth") {
      setPhase("whiteout");

      // Audio fade out
      if (audioRef.current) {
        const fadeOut = setInterval(() => {
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
          }
        }, 100);
      }

      // After whiteout, transition to final falling phase and complete
      setTimeout(() => {
        setPhase("falling");
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }, 1200);
    }
  };

  if (!loading) return null;

  return (
    <div
      className="palace-loader"
      style={{
        backgroundColor: "#000",
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/nature/ocean-wave-1.mp3"
        loop
        preload="auto"
      />

      {/* 0. Whiteout Overlay (Flash effect upon clicking Earth) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "whiteout" || phase === "falling" ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeIn" }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#fff",
          zIndex: 100,
          pointerEvents: "none",
        }}
      />

      {/* 1. Computer Monitor Coastline Analysis & Progress Bar (Instead of Red Curtain) */}
      <AnimatePresence>
        {phase === "analysis" && (
          <motion.div
            key="computer-analysis-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background:
                "radial-gradient(circle at center, #071527 0%, #030811 75%, #010409 100%)",
            }}
          >
            {/* Cyber Grid Background */}
            <div className="terminal-ambient-grid" />
            <div className="terminal-ambient-glow" />

            {/* Skip Button */}
            <button
              type="button"
              className="terminal-skip-btn"
              onClick={advanceToEarth}
              title="Skip directly to Earth Globe"
            >
              <span>SKIP TO GLOBE [ESC]</span>
              <span>→</span>
            </button>

            {/* THE COMPUTER MONITOR */}
            <div className="monitor-container">
              <div className="monitor-frame">
                {/* Top Bezel with camera dot and green LED */}
                <div className="monitor-top-bezel">
                  <span className="monitor-camera-dot" />
                  <span className="monitor-status-led" />
                </div>

                {/* The Computer Display / Screen */}
                <div className="monitor-screen">
                  {/* Header Window Bar */}
                  <div className="screen-header">
                    <div className="window-dots">
                      <span className="window-dot red" />
                      <span className="window-dot yellow" />
                      <span className="window-dot green" />
                    </div>
                    <div className="screen-title">
                      <span>COASTAL_AI // SATELLITE RADAR ANALYZER</span>
                    </div>
                    <div className="screen-badge">
                      <span>● LIVE INGESTION</span>
                    </div>
                  </div>

                  {/* Animated Coastline Viewport */}
                  <div className="screen-viewport">
                    {/* Radar Sweeper Widget */}
                    <div className="radar-blip">
                      <div className="radar-sweep-hand" />
                    </div>

                    {/* SVG Coastline & Transect Analysis */}
                    <svg
                      className="coastal-svg-canvas"
                      viewBox="0 0 640 260"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="oceanGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#031d36" />
                          <stop offset="50%" stopColor="#062e54" />
                          <stop offset="100%" stopColor="#0a467c" />
                        </linearGradient>

                        <linearGradient
                          id="landGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#091b16" />
                          <stop offset="60%" stopColor="#0f2922" />
                          <stop offset="100%" stopColor="#13362c" />
                        </linearGradient>

                        <filter
                          id="cyanGlow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="4"
                            floodColor="#38bdf8"
                            floodOpacity="0.9"
                          />
                        </filter>
                      </defs>

                      {/* Ocean Area */}
                      <rect
                        x="0"
                        y="0"
                        width="640"
                        height="260"
                        fill="url(#oceanGradient)"
                      />

                      {/* Subsurface Bathymetry Depth Lines */}
                      <path
                        d="M -10,30 Q 150,70 320,110 T 650,170"
                        fill="none"
                        stroke="rgba(56, 189, 248, 0.12)"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                      />
                      <path
                        d="M -10,60 Q 170,100 350,140 T 650,210"
                        fill="none"
                        stroke="rgba(56, 189, 248, 0.18)"
                        strokeWidth="1.5"
                        strokeDasharray="6 8"
                      />

                      {/* Landmass Contour (Simulating Coastal Terrain) */}
                      <path
                        d="M -10,260 
                           L -10,50 
                           Q 80,65 140,85 
                           T 280,140 
                           Q 380,170 460,205 
                           T 650,255 
                           L 650,260 Z"
                        fill="url(#landGradient)"
                        stroke="rgba(16, 185, 129, 0.4)"
                        strokeWidth="1"
                      />

                      {/* Topography Elevation Contour Rings on Land */}
                      <path
                        d="M 50,120 Q 120,135 180,160 T 320,220 L 300,260 L 20,260 Z"
                        fill="none"
                        stroke="rgba(52, 211, 153, 0.15)"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />

                      {/* Primary Detected Shoreline Vector (Glowing Cyan) */}
                      <path
                        d="M -10,50 
                           Q 80,65 140,85 
                           T 280,140 
                           Q 380,170 460,205 
                           T 650,255"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        filter="url(#cyanGlow)"
                      />

                      {/* Baseline Comparison (Historic 2020 Shoreline - Dotted Amber) */}
                      <path
                        d="M -10,40 
                           Q 80,55 140,78 
                           T 280,128 
                           Q 380,158 460,195 
                           T 650,242"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                        opacity="0.8"
                      />

                      {/* Perpendicular Shoreline Transect Beams */}
                      {transectPoints.map((pt, idx) => (
                        <g key={pt.id}>
                          <line
                            x1={pt.x - 18}
                            y1={pt.y - 25}
                            x2={pt.x + 22}
                            y2={pt.y + 32}
                            stroke={
                              pt.risk === "severe"
                                ? "#f43f5e"
                                : pt.risk === "accretion"
                                ? "#10b981"
                                : "#38bdf8"
                            }
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                            opacity="0.85"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4"
                            fill={
                              pt.risk === "severe"
                                ? "#f43f5e"
                                : pt.risk === "accretion"
                                ? "#10b981"
                                : "#38bdf8"
                            }
                            className="transect-pulse"
                            style={{ animationDelay: `${idx * 0.25}s` }}
                          />
                          <text
                            x={pt.x + 7}
                            y={pt.y - 8}
                            fill={
                              pt.risk === "severe"
                                ? "#fca5a5"
                                : pt.risk === "accretion"
                                ? "#86efac"
                                : "#7dd3fc"
                            }
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="700"
                          >
                            {pt.id}: {pt.rate}
                          </text>
                        </g>
                      ))}

                      {/* Real-time AI Classification Bounding Box */}
                      <g transform="translate(180, 75)">
                        <rect
                          x="0"
                          y="0"
                          width="150"
                          height="65"
                          fill="rgba(14, 165, 233, 0.08)"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <rect x="-1" y="-1" width="6" height="6" fill="#38bdf8" />
                        <rect x="145" y="-1" width="6" height="6" fill="#38bdf8" />
                        <rect x="-1" y="60" width="6" height="6" fill="#38bdf8" />
                        <rect x="145" y="60" width="6" height="6" fill="#38bdf8" />
                        <text
                          x="8"
                          y="16"
                          fill="#38bdf8"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          [AI DETECT: SHORELINE MASK]
                        </text>
                        <text
                          x="8"
                          y="30"
                          fill="#34d399"
                          fontSize="7.5"
                          fontFamily="monospace"
                        >
                          CLASS: WATER / LAND [99.2%]
                        </text>
                        <text
                          x="8"
                          y="44"
                          fill="#fbbf24"
                          fontSize="7.5"
                          fontFamily="monospace"
                        >
                          EPR: -1.74m/yr (HIGH VULNERABILITY)
                        </text>
                      </g>
                    </svg>

                    {/* Laser Sweeper Bar */}
                    <div className="laser-scan-line">
                      <div className="laser-scan-glow" />
                    </div>

                    {/* Corner HUD Telemetry */}
                    <div className="hud-telemetry hud-top-left">
                      <div>LAT: 13°20'44"N • LNG: 74°44'38"E</div>
                      <div>SECTOR: UDUPI COASTAL BASIN</div>
                      <div>RESOLUTION: 10m SATELLITE PIXEL</div>
                    </div>

                    <div className="hud-telemetry hud-bottom-left">
                      <div className="hud-audio-bars">
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                      </div>
                      <div>DATA STREAM // 320 TRANSECTS ACTIVE</div>
                    </div>

                    <div className="hud-telemetry hud-bottom-right">
                      <div>ARCHITECTURE: DEEPLABV3+ RESNET101</div>
                      <div>VALIDATION ACCURACY: 85.48%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor Stand */}
              <div className="monitor-stand-neck" />
              <div className="monitor-stand-base" />
            </div>

            {/* THE LOADING BAR SECTION */}
            <div className="loader-progress-section">
              <div className="progress-header-row">
                <div className="progress-status-text">
                  <span>{activeStatus}</span>
                  <span className="status-blinking-cursor" />
                </div>
                <div className="progress-percentage">{progress}%</div>
              </div>

              {/* Progress Bar Track */}
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                >
                  <div className="progress-bar-shimmer" />
                </div>
              </div>

              {/* Sub-bar Telemetry Row */}
              <div className="progress-telemetry-row">
                <span className="telemetry-tag">
                  SYSTEM:{" "}
                  <span className="telemetry-highlight">COASTAL-AI CORE</span>
                </span>
                <span className="telemetry-tag">
                  TRANSECTS:{" "}
                  <span className="telemetry-highlight">
                    {Math.min(Math.round((progress / 100) * 320), 320)} / 320
                  </span>
                </span>
                <span className="telemetry-tag">
                  ACCURACY: <span className="telemetry-highlight">85.48%</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Background Water Splash Effect */}
      {showSplash && <WaterSplash />}

      {/* 3. Water Droplets Layer */}
      <motion.div
        className="droplets-layer"
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            phase === "droplets" || phase === "earth" || phase === "falling"
              ? 1
              : 0,
        }}
        transition={{ duration: 1 }}
        style={{ position: "absolute", inset: 0, zIndex: 9 }}
      >
        <WaterDroplets />
      </motion.div>

      {/* 4. 3D Earth Globe with Satellites and India Highlight */}
      <motion.div
        className="earth-layer"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "earth" || phase === "falling" ? 1 : 0,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 10 }}
      >
        <EarthGlobe onExplore={handleEarthClick} phase={phase} />
      </motion.div>

      {/* 5. Click to Explore Button */}
      <AnimatePresence>
        {phase === "earth" && (
          <motion.div
            className="explore-button-container"
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "backOut" }}
            onClick={handleEarthClick}
            style={{ cursor: "pointer" }}
          >
            <button className="explore-btn">
              CLICK THE HIGHLIGHTED AREA
              <br />
              ON THE INDIA'S WESTERN
              <br />
              COASTLINE TO EXPLORE
              <br />
              COASTAL AI
            </button>
            <span className="explore-hint">START</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Loader;
