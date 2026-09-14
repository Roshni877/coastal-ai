import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaterSplash from "./WaterSplash";
import WaterDroplets from "./WaterDroplets";
import EarthGlobe from "./EarthGlobe";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("initial"); // initial -> opening -> droplets -> earth -> falling
  const [showSplash, setShowSplash] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Play subtle ocean sound on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => { });
    }
  }, []);

  const handleThreadClick = () => {
    if (phase === "initial") {
      setPhase("opening");
      setShowSplash(true);

      // Sequence:
      // 1. Curtains open & show droplets
      setTimeout(() => setPhase("droplets"), 500);

      // 2. Show Earth after droplets have been visible for a bit
      setTimeout(() => setPhase("earth"), 3500);

      if (audioRef.current) {
        const fadeOut = setInterval(() => {
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
          }
        }, 100);
      }
    }
  };

  const handleEarthClick = () => {
    if (phase === "earth") {
      setPhase("whiteout");
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
    <div className="palace-loader" style={{ backgroundColor: "#000", position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden' }}>
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/nature/ocean-wave-1.mp3"
        loop
        preload="auto"
      />

      {/* 0. Whiteout Overlay (Flash effect) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "whiteout" || phase === "falling" ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#fff',
          zIndex: 100,
          pointerEvents: 'none'
        }}
      />

      <AnimatePresence>
        {/* 1. Red Curtains */}
        {phase !== "completed" && (
          <motion.div
            key="door-left"
            initial={{ x: 0 }}
            animate={phase !== "initial" ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 1.5, ease: [0.45, 0, 0.55, 1] }}
            className="palace-door palace-door-left"
            style={{ width: '50%', height: '100%', position: 'absolute', left: 0, zIndex: 50 }}
          />
        )}
        {phase !== "completed" && (
          <motion.div
            key="door-right"
            initial={{ x: 0 }}
            animate={phase !== "initial" ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 1.5, ease: [0.45, 0, 0.55, 1] }}
            className="palace-door palace-door-right"
            style={{ width: '50%', height: '100%', position: 'absolute', right: 0, zIndex: 50 }}
          />
        )}

        {/* 2. Yellow Thread/Knot */}
        {phase === "initial" && (
          <motion.div
            key="curtain-knot"
            className="curtain-knot"
            onClick={handleThreadClick}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              position: 'absolute',
              top: '72%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 60,
              cursor: 'pointer'
            }}
          />
        )}

        {/* 3. Title Animation (Centered -> Up on open) */}
        <motion.div
          key="loader-title"
          initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={
            phase === "initial" ? { x: "-50%", y: "-50%", scale: 1, opacity: 1, filter: "blur(0px)" } :
              phase === "opening" || phase === "droplets" || phase === "earth" ? { x: "-50%", y: "-500px", scale: 0.7, opacity: 0, filter: "blur(10px)" } :
                phase === "falling" ? { x: "-50%", y: "-50%", scale: 1.2, opacity: 0, filter: "blur(0px)" } : {}
          }
          transition={{
            duration: 1.5,
            ease: [0.45, 0, 0.55, 1]
          }}
          className="loader-center-content"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 55,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div className="palace-seal">
            <h1 className="seal-text">COASTAL</h1>
            <h1 className="seal-text outline-seal">AI</h1>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 4. Background Effects (Water Splash & Rain) */}
      {showSplash && <WaterSplash />}

      <motion.div
        className="droplets-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: (phase === "droplets" || phase === "earth" || phase === "falling") ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ position: 'absolute', inset: 0, zIndex: 9 }}
      >
        <WaterDroplets />
      </motion.div>

      <motion.div
        className="earth-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: (phase === "earth" || phase === "falling") ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ position: 'absolute', inset: 0, zIndex: 10 }}
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
            transition={{ delay: 1, duration: 0.8, ease: "backOut" }}
            onClick={handleEarthClick}
            style={{ cursor: 'pointer' }}
          >
            <button className="explore-btn">
              CLICK THE HIGHLIGHTED AREA<br />ON THE INDIA'S WESTERN<br />COASTLINE TO EXPLORE<br />COASTAL AI
            </button>
            <span className="explore-hint">START</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Filter for realistic fabric texture (applied to curtains) */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
        <filter id="fabric-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>
    </div>
  );
};

export default Loader;
