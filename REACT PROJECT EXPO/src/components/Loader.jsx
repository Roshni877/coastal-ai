import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerrainRadarCanvas from "./TerrainRadarCanvas";
import WaterSplash from "./WaterSplash";
import WaterDroplets from "./WaterDroplets";
import EarthGlobe from "./EarthGlobe";
import CoastalFrameSequence from "./CoastalFrameSequence";
import "./Loader.css";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("analysis"); // analysis -> droplets -> earth -> whiteout -> sequence
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [coords, setCoords] = useState({
    c1: "-2.38238",
    c2: "18.58539",
    c3: "21.95838",
  });
  const audioRef = useRef(null);

  // Subtle ocean wave audio sound
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Micro-jitter for live GPS satellite coordinates
  useEffect(() => {
    if (phase !== "analysis") return;
    const interval = setInterval(() => {
      setCoords({
        c1: (-2.38238 + (Math.random() - 0.5) * 0.0006).toFixed(5),
        c2: (18.58539 + (Math.random() - 0.5) * 0.0006).toFixed(5),
        c3: (21.95838 + (Math.random() - 0.5) * 0.0006).toFixed(5),
      });
    }, 450);
    return () => clearInterval(interval);
  }, [phase]);

  // Smooth progress increment for the initialization screen
  useEffect(() => {
    if (phase !== "analysis") return;

    const startTime = Date.now();
    const duration = 3400; // 3.4 seconds total duration

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      const easedProgress = Math.round(
        rawProgress < 75 ? rawProgress * 1.05 : 75 + (rawProgress - 75) * 0.95
      );
      const clamped = Math.min(Math.max(easedProgress, 0), 100);
      setProgress(clamped);

      // Advance active task step based on percentage
      if (clamped > 66) {
        setActiveTaskIndex(2);
      } else if (clamped > 33) {
        setActiveTaskIndex(1);
      } else {
        setActiveTaskIndex(0);
      }

      if (rawProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          advanceToEarth();
        }, 350);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [phase]);

  // Transition from Computer Analysis Screen to Water Droplets and Earth Globe
  const advanceToEarth = () => {
    setPhase("droplets");
    setShowSplash(true);

    setTimeout(() => {
      setPhase("earth");
    }, 1800);
  };

  // Keyboard shortcut Esc to skip to earth or explore directly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (phase === "analysis") {
          advanceToEarth();
        } else if (phase === "earth" || phase === "sequence") {
          handleDirectHomepage();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  // Direct to homepage handler (skips animations directly to website)
  const handleDirectHomepage = () => {
    setLoading(false);
  };

  // Clicking the highlighted area on Earth or the explore button
  const handleEarthClick = () => {
    if (phase === "earth") {
      setPhase("whiteout");

      if (audioRef.current) {
        const fadeOut = setInterval(() => {
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
          }
        }, 100);
      }

      setTimeout(() => {
        setPhase("sequence");
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
          opacity: phase === "whiteout" ? 1 : 0,
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

      {/* 1. Exact Recreation of User's Sample Monitor Screen */}
      <AnimatePresence>
        {phase === "analysis" && (
          <motion.div
            key="sample-monitor-screen"
            className="coastal-sample-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(14px)" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Skip Button */}
            <button
              type="button"
              className="sample-skip-btn"
              onClick={advanceToEarth}
              title="Skip directly to Earth Globe [ESC]"
            >
              <span>SKIP TO GLOBE [ESC]</span>
              <span>→</span>
            </button>

            {/* UPPER SPLIT SECTION */}
            <div className="loader-body-split">
              {/* LEFT TELEMETRY COLUMN */}
              <div className="loader-telemetry-col">
                {/* Heading matching sample image */}
                <div className="sample-main-title">
                  <div className="title-line-brand">
                    <span>COASTAL AI</span>
                    <span className="brand-slashes">//</span>
                  </div>
                  <div className="title-line-sub">SYSTEM</div>
                  <div className="title-line-sub">INITIALIZATION</div>
                </div>

                {/* Subtitle & Model Information in Amber */}
                <div className="sample-model-info">
                  <div className="model-analyzing-line">
                    ANALYZING SATELLITE RADAR...
                  </div>
                  <div className="model-name-line">
                    MODEL: DEEPLABV3+ RESNET101
                  </div>
                </div>

                {/* Live GPS Coordinates & Ingestion Log List */}
                <div className="sample-log-list">
                  <div className="coord-row">COORDINATS: {coords.c1}</div>
                  <div className="coord-row">COORDINATS: {coords.c2}</div>
                  <div className="coord-row">COORDINATS: {coords.c3}</div>
                  <div
                    className={`task-row ${
                      activeTaskIndex === 0 ? "active" : ""
                    }`}
                  >
                    <span>INGESTING SAR DATA...</span>
                    {activeTaskIndex === 0 && (
                      <span className="blinking-cursor" />
                    )}
                  </div>
                  <div
                    className={`task-row ${
                      activeTaskIndex === 1 ? "active" : ""
                    }`}
                  >
                    <span>MAPPING SHORELINE TRISAS...</span>
                    {activeTaskIndex === 1 && (
                      <span className="blinking-cursor" />
                    )}
                  </div>
                  <div
                    className={`task-row ${
                      activeTaskIndex === 2 ? "active" : ""
                    }`}
                  >
                    <span>MAPPING SHORELINE TRANSECTS</span>
                    {activeTaskIndex === 2 && (
                      <span className="blinking-cursor" />
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 3D TOPOGRAPHIC COASTLINE TERRAIN MESH */}
              <div className="loader-terrain-col">
                <TerrainRadarCanvas />
              </div>
            </div>

            {/* BOTTOM SECTION: CAPSULE PROGRESS BAR & TELEMETRY STRIP */}
            <div className="loader-bottom-section">
              <div className="progress-pill-wrapper">
                <div
                  className="progress-pill-fill"
                  style={{ width: `${progress}%` }}
                />
                <span className="progress-percentage-pill">{progress}%</span>
              </div>

              {/* Sub-bar telemetry row exactly matching image */}
              <div className="sample-telemetry-strip">
                <span className="strip-item">
                  ACCURACY: <span className="strip-val">85.48%</span>
                </span>
                <span className="strip-divider">|</span>
                <span className="strip-item">
                  TRANSECTS:{" "}
                  <span className="strip-val">
                    {Math.min(Math.round((progress / 100) * 320), 320)} / 320
                  </span>
                </span>
                <span className="strip-divider">|</span>
                <span className="strip-item">
                  <span className="strip-val">SECURE LINK ACTIVE</span>
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
          opacity: phase === "earth" ? 1 : 0,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: phase === "earth" ? "auto" : "none" }}
      >
        <EarthGlobe onExplore={handleEarthClick} phase={phase} />
      </motion.div>

      {/* 5. Direct to Homepage Button on Globe Screen */}
      <AnimatePresence>
        {phase === "earth" && (
          <motion.button
            type="button"
            className="direct-to-homepage-globe-btn"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={handleDirectHomepage}
            title="Direct to Coastal AI Homepage"
          >
            <span>Direct to Homepage</span>
            <span className="direct-arrow">→</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 6. Click to Explore Button */}
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

      {/* 7. Extracted Coastal Optical Frame Sequence (Plays smoothly after clicking Earth) */}
      {phase === "sequence" && (
        <CoastalFrameSequence
          onEnterHomepage={handleDirectHomepage}
          onDirectHomepage={handleDirectHomepage}
        />
      )}
    </div>
  );
};

export default Loader;
