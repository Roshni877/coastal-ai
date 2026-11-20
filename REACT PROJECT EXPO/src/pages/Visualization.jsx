import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowLeft, X, Radio, BarChart3, Image as ImageIcon } from "lucide-react";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";
import PremiumGallery from "../components/PremiumGallery";
import ShorelineDynamicsPlayer from "../components/ShorelineDynamicsPlayer";

function Visualization() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedMlImage, setSelectedMlImage] = useState(null);
  const [animModalOpen, setAnimModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Suppress navbar when any lightbox or modal is open
  useEffect(() => {
    if (selectedMlImage || animModalOpen) {
      document.body.classList.add("modal-open-suppress-nav");
    } else {
      document.body.classList.remove("modal-open-suppress-nav");
    }
    return () => document.body.classList.remove("modal-open-suppress-nav");
  }, [selectedMlImage, animModalOpen]);

  // Trigger smooth full-screen opening animation in fashion
  const handleOpenArchive = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsUnlocked(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 700);
  };

  // Return/close back to the initial circular button view
  const handleCloseArchive = () => {
    setIsUnlocked(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Allow closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (animModalOpen) {
          setAnimModalOpen(false);
        } else if (selectedMlImage) {
          setSelectedMlImage(null);
        } else if (isUnlocked) {
          handleCloseArchive();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUnlocked, animModalOpen, selectedMlImage]);

  return (
    <PageReveal>
      <motion.main
        className="page visualization-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="circular-entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="archive-circular-entry"
            >
              {/* Header Title Section */}
              <div className="archive-header-block">
                <span
                  className="tech-tag"
                  style={{
                    color: "#f59e0b",
                    fontWeight: 800,
                    letterSpacing: "4px",
                    textShadow:
                      "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(245, 158, 11, 0.6)",
                    marginBottom: "12px",
                    display: "inline-block",
                  }}
                >
                  UNCOVER THE DATA
                </span>
                <h1
                  className="hero-title-large"
                  style={{
                    fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
                    fontWeight: 900,
                    textAlign: "center",
                    lineHeight: 0.88,
                    letterSpacing: "-2px",
                    textTransform: "uppercase",
                    margin: 0,
                    color: "#ffffff",
                    textShadow: isDark
                      ? "0 4px 28px rgba(0, 0, 0, 0.98), 0 0 40px rgba(14, 165, 233, 0.6)"
                      : "0 4px 25px rgba(0, 0, 0, 0.95), 0 0 35px rgba(14, 165, 233, 0.5)",
                    transition: "all 0.4s ease",
                  }}
                >
                  VISUAL
                </h1>
                <h1
                  className="hero-title-large outline-text"
                  style={{
                    fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
                    fontWeight: 900,
                    textAlign: "center",
                    lineHeight: 0.88,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    margin: 0,
                    color: isDark ? "#7dd3fc" : "#38bdf8",
                    background: isDark
                      ? "linear-gradient(180deg, #a5f3fc 0%, #38bdf8 50%, #0ea5e9 100%)"
                      : "linear-gradient(180deg, #67e8f9 0%, #38bdf8 45%, #0284c7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: isDark
                      ? "2px rgba(255, 255, 255, 0.95)"
                      : "2px #ffffff",
                    filter: isDark
                      ? "drop-shadow(0 4px 25px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 40px rgba(56, 189, 248, 0.9))"
                      : "drop-shadow(0 4px 22px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.85))",
                    transition: "all 0.4s ease",
                  }}
                >
                  ARCHIVE
                </h1>
              </div>

              {/* Clean, Modern Circular Interactive Button */}
              <div className="circular-orb-container">
                <motion.button
                  className="archive-circular-button"
                  onClick={handleOpenArchive}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Open Visual Archive"
                >
                  {/* Outer Pulsing Glow Aura */}
                  <div className="orb-pulse-aura" />

                  {/* Rotating Dashed Orbital Ring */}
                  <div className="orb-orbital-ring" />

                  {/* Translucent Glassmorphic Core */}
                  <div className="orb-glass-core">
                    <div className="orb-icon-wrapper">
                      <Compass size={32} />
                    </div>
                    <span className="orb-label">OPEN</span>
                    <span className="orb-sublabel">ARCHIVE</span>
                  </div>
                </motion.button>

                <p className="archive-orb-hint">
                  Click to launch full-screen visual archive
                </p>
              </div>
            </motion.div>
          ) : (
            /* Complete Visual Archive Interface in Full-Screen View */
            <motion.div
              key="fullscreen-archive"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fullscreen-archive-view"
              style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "20px 20px 80px 20px" }}
            >
              {/* Top Controls / Smooth Return Button */}
              <div className="archive-top-controls" style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
                <motion.button
                  className="archive-back-btn"
                  onClick={handleCloseArchive}
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Back to overview"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(56, 189, 248, 0.35)",
                    color: "#38bdf8",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <ArrowLeft size={18} />
                  <span>BACK TO OVERVIEW</span>
                  <span className="esc-tag" style={{ opacity: 0.6, fontSize: "0.75rem", marginLeft: "4px" }}>[ESC]</span>
                </motion.button>
              </div>

              {/* Shoreline Monitoring Header Section */}
              <section
                className="section-header"
                style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  marginBottom: "30px",
                  textAlign: "center"
                }}
              >
                <span
                  className="tech-tag"
                  style={{
                    color: "#f59e0b",
                    fontWeight: 800,
                    letterSpacing: "3px",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(245, 158, 11, 0.5)",
                    marginBottom: "12px",
                    display: "inline-block",
                  }}
                >
                  SHORELINE // MONITORING &amp; PREDICTION SYSTEM
                </span>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "6px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
                      fontWeight: 900,
                      letterSpacing: "-1px",
                      margin: 0,
                      textTransform: "uppercase",
                      color: isDark ? "#ffffff" : "#0f172a",
                      textShadow: isDark
                        ? "0 4px 20px rgba(0,0,0,0.8)"
                        : "none",
                      lineHeight: 1.1,
                    }}
                  >
                    VISUAL ARCHIVE &amp; MODEL INTERPRETATION
                  </h1>
                  <h2
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                      fontWeight: 700,
                      color: "#38bdf8",
                      margin: "4px 0 0 0",
                      letterSpacing: "1px",
                    }}
                  >
                    MULTI-TEMPORAL SHORELINE DYNAMICS (2020 &rarr; 2024)
                  </h2>
                  <p
                    style={{
                      maxWidth: "780px",
                      margin: "12px auto 0 auto",
                      color: isDark ? "#94a3b8" : "#475569",
                      fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
                      lineHeight: 1.6,
                    }}
                  >
                    Satellite-derived coastal change vectors extracted via DeepLabV3+ with fused
                    Sentinel-2 MSI and Sentinel-1 SAR imagery across 97.2 km of Udupi coastline.
                  </p>
                </motion.div>
              </section>

              {/* Inline Interactive Shoreline Dynamics Player */}
              <div style={{ marginBottom: "50px" }}>
                <ShorelineDynamicsPlayer
                  onExpandFullscreen={() => setAnimModalOpen(true)}
                  showTitle={false}
                />
              </div>

              {/* MODEL INTERPRETATION & KEY METRICS */}
              <section className="section-header" style={{ marginBottom: "25px" }}>
                <span className="tech-tag" style={{ display: "block", marginBottom: "8px", color: "#38bdf8", fontWeight: 800 }}>
                  DEEP LEARNING ARCHITECTURE
                </span>
                <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)", fontWeight: 900, color: "var(--text-main)" }}>
                  MODEL INTERPRETATION &amp; PERFORMANCE
                </h2>
              </section>

              <div className="grid-2-col" style={{ marginBottom: "60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                <TiltCard>
                  <div
                    className="feature-card"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setSelectedMlImage({
                        src: "/model_prediction.png",
                        alt: "DeepLabV3+ Model Prediction Sample",
                        title: "DeepLabV3+ Model Prediction Sample (Inference)",
                      })
                    }
                  >
                    <div className="card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div className="icon-wrapper" style={{ background: "rgba(2, 132, 199, 0.15)", padding: "10px", borderRadius: "12px" }}>
                        <Radio size={24} color="#0284c7" />
                      </div>
                      <span className="card-status active" style={{ fontSize: "0.75rem", fontWeight: 800, padding: "4px 10px", borderRadius: "20px", background: "rgba(14, 165, 233, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                        INFERENCE ENGINE
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="card-image-box" style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                        <img
                          src="/model_prediction.png"
                          alt="DeepLabV3+ Model Prediction Sample"
                          className="preview-img"
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-text">
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
                          MODEL PREDICTION SAMPLE
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                          DEEPLABV3+ TEST INFERENCE SHOWCASING ACCURATE SHORELINE DELINEATION OVER COMPLEX COASTAL PROFILES.
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                <TiltCard>
                  <div
                    className="feature-card"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setSelectedMlImage({
                        src: "/accuracy_metrics.png",
                        alt: "DeepLabV3+ Performance Metrics & Confusion Matrix",
                        title: "DeepLabV3+ Performance Metrics & Confusion Matrix",
                      })
                    }
                  >
                    <div className="card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div className="icon-wrapper" style={{ background: "rgba(2, 132, 199, 0.15)", padding: "10px", borderRadius: "12px" }}>
                        <BarChart3 size={24} color="#0284c7" />
                      </div>
                      <span className="card-status active" style={{ fontSize: "0.75rem", fontWeight: 800, padding: "4px 10px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                        BENCHMARK 85.48%
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="card-image-box" style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                        <img
                          src="/accuracy_metrics.png"
                          alt="DeepLabV3+ Performance Metrics"
                          className="preview-img"
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-text">
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
                          PERFORMANCE METRICS
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                          DEEPLABV3+ ACCURACY METRICS REPORTING AN OUTSTANDING 85.48% VALIDATION ACCURACY BENCHMARK.
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* 📷 COASTAL GALLERY */}
              <div className="huge-gallery-wrapper" style={{ marginTop: "30px" }}>
                <h2
                  className="gallery-title-large"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 900,
                    marginBottom: "24px",
                    color: "var(--text-main)",
                    textAlign: "center"
                  }}
                >
                  COASTAL GALLERY
                </h2>
                <PremiumGallery />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            ML MODEL IMAGE LIGHTBOX MODAL (VIA CREATEPORTAL)
            ======================================================== */}
        <AnimatePresence>
          {selectedMlImage && typeof document !== "undefined" && createPortal(
            <motion.div
              className="ml-lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMlImage(null)}
            >
              <button
                type="button"
                className="global-lightbox-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMlImage(null);
                }}
                aria-label="Close model lightbox"
              >
                <X size={26} strokeWidth={3} />
              </button>

              <motion.div
                className="ml-lightbox-content"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedMlImage.src}
                  alt={selectedMlImage.alt}
                  className="ml-lightbox-image"
                />
                <h4 style={{ margin: "16px 0 0 0", color: "#ffffff", textAlign: "center" }}>
                  {selectedMlImage.title}
                </h4>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>

        {/* ========================================================
            FULLSCREEN SHORELINE DYNAMICS ANIMATION MODAL (VIA CREATEPORTAL)
            ======================================================== */}
        <AnimatePresence>
          {animModalOpen && typeof document !== "undefined" && createPortal(
            <motion.div
              className="anim-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnimModalOpen(false)}
            >
              <button
                type="button"
                className="global-lightbox-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setAnimModalOpen(false);
                }}
                aria-label="Close animation modal"
              >
                <X size={26} strokeWidth={3} />
              </button>

              <motion.div
                className="anim-modal-container"
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="anim-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="live-indicator"><span className="dot" /> LIVE TIME-LAPSE</span>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f8fafc", fontWeight: 800 }}>
                      Multi-Temporal Shoreline Dynamics Animation (2020 &rarr; 2024)
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="video-modal-close lightbox-close-btn-fixed"
                    onClick={() => setAnimModalOpen(false)}
                    aria-label="Close animation modal"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="anim-modal-body" style={{ padding: "16px" }}>
                  <ShorelineDynamicsPlayer isModal={true} showTitle={false} />
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>
        {/* Full-Screen Expanding Circular Portal Fashion Animation */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              className="archive-expanding-portal"
              initial={{ scale: 0.1, opacity: 0.85 }}
              animate={{ scale: 45, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.main>
    </PageReveal>
  );
}

export default Visualization;
