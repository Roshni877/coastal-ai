import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  ArrowRight, 
  Play, 
  X, 
  Satellite, 
  Cpu, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  Activity,
  CheckCircle,
  TrendingDown,
  Layers
} from "lucide-react";
import Coastal3D from "../components/Coastal3D";

const VIDEO_EMBED_URL = "https://drive.google.com/file/d/1S8UMPUD5OIofQhb2c-wDUCMZ201IA5Jq/preview";

function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <main className="page home-page-professional" style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 🌊 Interactive 3D Ocean Surface in Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: isDark ? 0.65 : 0.85, pointerEvents: "auto" }}>
        <Coastal3D />
      </div>

      {/* Subtle Scientific Vignette & Grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(circle at 50% 35%, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.88) 85%)"
            : "radial-gradient(circle at 50% 35%, rgba(240, 249, 255, 0.45) 0%, rgba(240, 249, 255, 0.9) 85%)"
        }}
      />

      {/* Main Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "100px 24px 60px",
          display: "flex",
          flexDirection: "column",
          gap: "48px"
        }}
      >
        {/* 🛰️ Header & Project Classification Badge */}
        <section style={{ textAlign: "center", maxWidth: "980px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "30px",
              background: "rgba(14, 165, 233, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: isDark ? "#38bdf8" : "#0284c7",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.5px",
              marginBottom: "20px"
            }}
          >
            <Satellite size={15} />
            <span>FINAL YEAR ENGINEERING MAJOR PROJECT · REMOTE SENSING & ML</span>
          </motion.div>

          {/* Exact Required Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.2rem, 4.8vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "var(--text-main)",
              letterSpacing: "-0.5px",
              margin: "0 0 18px 0"
            }}
          >
            Coastal Erosion Detection and Analysis Using Machine Learning and Remote Sensing
          </motion.h1>

          {/* Exact Required Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
              color: "var(--text-muted, #94a3b8)",
              lineHeight: 1.6,
              maxWidth: "840px",
              margin: "0 auto 32px auto",
              fontWeight: 400
            }}
          >
            Monitoring coastal changes through satellite imagery, machine learning and environmental intelligence along Karnataka's vulnerable coastline.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px"
            }}
          >
            <NavLink
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "13px 28px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.96rem",
                textDecoration: "none",
                boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.4)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={17} />
            </NavLink>

            <NavLink
              to="/visualization"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 24px",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(8px)",
                color: "var(--text-main)",
                fontWeight: 600,
                fontSize: "0.96rem",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.2s ease"
              }}
            >
              <Activity size={16} style={{ color: "#38bdf8" }} />
              <span>Model & Visualizations</span>
            </NavLink>

            <NavLink
              to="/reporting"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 22px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.12)",
                backdropFilter: "blur(8px)",
                color: isDark ? "#34d399" : "#059669",
                fontWeight: 600,
                fontSize: "0.96rem",
                textDecoration: "none",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              <ShieldAlert size={16} />
              <span>Report Erosion</span>
            </NavLink>

            <button
              onClick={() => setVideoOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 20px",
                borderRadius: "10px",
                background: "transparent",
                color: "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.92rem",
                border: "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Play size={16} style={{ color: "#f59e0b" }} />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </section>

        {/* 📊 Key Scientific Metrics Banner */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px"
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.5px" }}>CORRIDOR EXTENT</span>
              <MapPin size={16} style={{ color: "#38bdf8" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>97.2 km</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Udupi & Dakshina Kannada Arabian Sea Corridor (EPSG:32643)
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", letterSpacing: "0.5px" }}>ACTIVE TRANSECTS</span>
              <Layers size={16} style={{ color: "#34d399" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>3,321</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              50-meter spaced measurement points cross-intersecting multi-decadal imagery
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#818cf8", letterSpacing: "0.5px" }}>DEEPLABV3+ ACCURACY</span>
              <Cpu size={16} style={{ color: "#818cf8" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>85.48%</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Validation Dice coefficient across optical (Sentinel-2) + SAR (Sentinel-1)
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f43f5e", letterSpacing: "0.5px" }}>HOTSPOT RETREAT</span>
              <TrendingDown size={16} style={{ color: "#f43f5e" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f43f5e" }}>-24.0 m</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Peak displacement at critical zones (Bengre spit & Maravanthe barrier beach)
            </div>
          </div>
        </section>

        {/* 🏛️ The Three Pillars: Detection · Assessment · Decision Support */}
        <section>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#38bdf8", letterSpacing: "1.5px" }}>CORE SYSTEM ARCHITECTURE</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 0 0", color: "var(--text-main)" }}>
              Environmental Intelligence in Three Stages
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px"
            }}
          >
            {/* Pillar 1: Detection */}
            <div
              style={{
                padding: "28px",
                background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                  marginBottom: "18px"
                }}
              >
                <Satellite size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 10px 0", color: "var(--text-main)" }}>
                1. Detection
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                Automated multi-spectral and synthetic aperture radar (SAR) feature extraction. Ingests Sentinel-1 GRD and Sentinel-2 MSI via Google Earth Engine, deriving NDWI indices and deep convolutional boundary segmentations.
              </p>
            </div>

            {/* Pillar 2: Assessment */}
            <div
              style={{
                padding: "28px",
                background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                  marginBottom: "18px"
                }}
              >
                <ShieldAlert size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 10px 0", color: "var(--text-main)" }}>
                2. Assessment
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                Rigorous evaluation of shoreline movement, volumetric sand displacement, and cumulative hectares lost. Classifies coastal risk (Low, Moderate, High, Critical) and documents ecological and socio-economic consequences.
              </p>
            </div>

            {/* Pillar 3: Decision Support */}
            <div
              style={{
                padding: "28px",
                background: "var(--card-bg, rgba(11, 19, 41, 0.75))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  marginBottom: "18px"
                }}
              >
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 10px 0", color: "var(--text-main)" }}>
                3. Decision Support
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                Actionable, scientifically responsible coastal recommendations and citizen reporting workflows. Forwards evidence-backed incident reports to authorities while advocating for nature-based stabilization over hard groynes.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 🎬 Academic Video Demonstration Modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(3, 7, 18, 0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0b1329",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "14px",
                width: "min(900px, 95vw)",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8)"
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
                <div>
                  <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "1px" }}>
                    ACADEMIC PROJECT DEMONSTRATION
                  </span>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#f8fafc", fontWeight: 700 }}>
                    Coastal Erosion Detection Pipeline Overview
                  </h4>
                </div>
                <button
                  onClick={() => setVideoOpen(false)}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "6px" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
                <iframe
                  src={VIDEO_EMBED_URL}
                  title="Coastal AI Project Video"
                  allow="autoplay"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>

              <div
                style={{
                  padding: "12px 20px",
                  fontSize: "0.78rem",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "rgba(15, 23, 42, 0.9)"
                }}
              >
                <span>SMVITM Computer Science & Engineering</span>
                <span>Udupi Coastal Monitoring Study</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Home;