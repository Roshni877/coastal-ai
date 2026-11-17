import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Radio, Cpu, ShieldCheck } from "lucide-react";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState("Initializing Coastal Analysis System...");

  useEffect(() => {
    let currentProgress = 20;
    const interval = setInterval(() => {
      // Check actual browser readyState
      if (document.readyState === "complete") {
        currentProgress += Math.floor(Math.random() * 20) + 15;
      } else {
        currentProgress += Math.floor(Math.random() * 10) + 5;
      }

      if (currentProgress >= 40 && currentProgress < 70) {
        setStatusMessage("Loading Remote Sensing Telemetry & Shoreline GeoJSON...");
      } else if (currentProgress >= 70 && currentProgress < 95) {
        setStatusMessage("Calibrating DeepLabV3+ & ResNet-34 Feature Weights...");
      } else if (currentProgress >= 100) {
        currentProgress = 100;
        setStatusMessage("Coastal Intelligence System Ready");
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 350);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="scientific-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          backgroundColor: "#030712",
          backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233, 0.12) 0%, rgba(2, 6, 23, 0.98) 75%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          padding: "24px",
          userSelect: "none"
        }}
      >
        {/* Computer Screen Frame / Radar Analysis Canvas */}
        <div
          style={{
            width: "min(520px, 92vw)",
            background: "#081325",
            borderRadius: "14px",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(14, 165, 233, 0.15)",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(15, 23, 42, 0.9)",
              borderBottom: "1px solid rgba(56, 189, 248, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
              color: "#94a3b8"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontWeight: 600, color: "#38bdf8" }}>COASTAL MONITORING TERMINAL</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "monospace", fontSize: "0.7rem" }}>
              <span>LAT: 13.3409° N</span>
              <span>LON: 74.7421° E</span>
            </div>
          </div>

          {/* Screen Display Area */}
          <div
            style={{
              position: "relative",
              height: "220px",
              background: "#050e1d",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* GIS Grid Background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px)
                `,
                backgroundSize: "24px 24px"
              }}
            />

            {/* Simulated Coastline SVG Contour */}
            <svg
              viewBox="0 0 500 200"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.85
              }}
            >
              {/* Land fill */}
              <path
                d="M 0,0 L 500,0 L 500,70 Q 420,110 350,85 T 220,130 T 110,95 Q 40,140 0,110 Z"
                fill="rgba(16, 185, 129, 0.08)"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="1.5"
              />
              {/* Historical Shoreline 2020 (Blue) */}
              <path
                d="M 0,105 Q 80,85 160,115 T 280,100 T 400,120 T 500,85"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              {/* Active Shoreline 2024 (Cyan) */}
              <path
                d="M 0,118 Q 80,100 160,130 T 280,115 T 400,135 T 500,98"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Predicted Retreat Contour (Rose/Amber) */}
              <path
                d="M 0,128 Q 80,110 160,140 T 280,128 T 400,145 T 500,108"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.8"
                strokeDasharray="2 2"
              />
              {/* Scanning Crosshair */}
              <circle cx="280" cy="115" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
              <circle cx="280" cy="115" r="4" fill="#38bdf8" />
            </svg>

            {/* Radar / Analysis Scan Beam */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "60px",
                background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.25), rgba(56, 189, 248, 0.5), transparent)",
                pointerEvents: "none"
              }}
            />

            {/* Telemetry Overlays */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "14px",
                display: "flex",
                gap: "10px",
                fontSize: "0.68rem",
                color: "#7dd3fc",
                fontFamily: "monospace",
                background: "rgba(3, 7, 18, 0.75)",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(56, 189, 248, 0.2)"
              }}
            >
              <span>EPSG:32643 UTM-43N</span>
              <span>·</span>
              <span>TRANSECTS: 3,321</span>
              <span>·</span>
              <span>SENSOR: SENTINEL-1/2</span>
            </div>

            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.7rem",
                color: "#34d399",
                background: "rgba(5, 46, 22, 0.6)",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(52, 211, 153, 0.3)"
              }}
            >
              <Radio size={12} className="animate-pulse" />
              <span>SCANNING CORRIDOR</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div style={{ width: "min(520px, 92vw)", marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "0.82rem"
            }}
          >
            <span style={{ color: "#e2e8f0", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={15} style={{ color: "#38bdf8" }} />
              {statusMessage}
            </span>
            <span style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "monospace" }}>
              {progress}%
            </span>
          </div>

          {/* Actual Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(56, 189, 248, 0.2)"
            }}
          >
            <motion.div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #0284c7 0%, #38bdf8 60%, #10b981 100%)",
                borderRadius: "4px",
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.7)"
              }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              fontSize: "0.72rem",
              color: "#64748b"
            }}
          >
            <span>Udupi Coastal Erosion Analysis Platform</span>
            <span>Remote Sensing & AI Environment</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;