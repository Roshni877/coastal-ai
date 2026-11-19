import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowLeft, X } from "lucide-react";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";
import PremiumGallery from "../components/PremiumGallery";
import SeashoreBackground from "../components/SeashoreBackground";

function Visualization() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedMlImage, setSelectedMlImage] = useState(null);
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

  // Trigger smooth full-screen opening animation
  const handleOpenArchive = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsUnlocked(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }, 650);
  };

  // Return/close back to the initial circular button view
  const handleCloseArchive = () => {
    setIsUnlocked(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  };

  // Allow closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isUnlocked) {
        handleCloseArchive();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUnlocked]);

  return (
    <PageReveal>
      <motion.main
        className="page visualization-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="circular-entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="archive-circular-entry"
            >
              {/* Restored Immersive Seashore Background (Ocean Waves + 3D Beach Canvas) */}
              <SeashoreBackground />

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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fullscreen-archive-view"
            >
              {/* Top Controls / Smooth Return Button */}
              <div className="archive-top-controls">
                <motion.button
                  className="archive-back-btn"
                  onClick={handleCloseArchive}
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Back to overview"
                >
                  <ArrowLeft size={18} />
                  <span>BACK TO OVERVIEW</span>
                  <span className="esc-tag">[ESC]</span>
                </motion.button>
              </div>

              {/* Shoreline Monitoring Header */}
              <section
                className="section-header"
                style={{
                  marginTop: "20px",
                  paddingTop: "10px",
                  marginBottom: "30px",
                }}
              >
                <span
                  className="tech-tag"
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  SHORELINE // MONITORING SYSTEM
                </span>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "3.2rem",
                      fontWeight: "800",
                      color: "var(--text-main)",
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "2px",
                      textAlign: "center",
                      background:
                        "linear-gradient(45deg, var(--teal), var(--amber))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 10px rgba(0,212,255,0.3))",
                    }}
                  >
                    MODEL INTERPRETATION
                  </h1>
                  <h1
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: "600",
                      color: "var(--text-muted)",
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "1px",
                      textAlign: "center",
                      opacity: 0.9,
                    }}
                  >
                    AND DATA VISUALIZATION
                  </h1>
                </motion.div>
              </section>

              {/* 📊 ADVANCED ANALYTICS SECTION (Google Colab Outputs) */}
              <section className="analytics-section">
                <div className="analytics-header">
                  <h2
                    className="section-subtitle"
                    style={{
                      color: "var(--amber)",
                      textShadow: "0 0 30px rgba(255, 214, 10, 0.35)",
                    }}
                  >
                    DETAILED ANALYSIS
                  </h2>
                  <p className="section-desc">
                    Machine Learning outputs generated via Google Colab for
                    erosion and accretion patterns.
                  </p>
                </div>

                {/* Mean Shoreline Position Per Year (Preserved exactly as it is) */}
                <div className="analytics-grid">
                  <div className="glass-card analytics-card">
                    <h2 className="analysis-title-large">
                      MEAN SHORELINE POSITION PER YEAR
                    </h2>
                    <div className="graph-placeholder">
                      <img
                        src="/shoreline/mean_position.png"
                        alt="Mean shoreline position per year"
                        className="shoreline-graph-image"
                      />
                      <p>
                        Yearly mean shoreline position analysis in a single
                        overview chart.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🤖 ML MODEL PERFORMANCE RESEARCH */}
              <section className="ml-performance-section">
                <div className="section-header">
                  <span className="tech-tag">RESEARCH // VALIDATION</span>
                  <h2 className="hero-title-large" style={{ fontSize: "3rem" }}>
                    MODEL PERFORMANCE
                  </h2>
                </div>

                <div className="ml-performance-grid">
                  <TiltCard>
                    <div className="glass-card performance-card">
                      <div className="ml-image-container">
                        <button
                          type="button"
                          className="ml-image-btn"
                          onClick={() =>
                            setSelectedMlImage({
                              src: "/env_ml_confusion_matrix_deeplab.png?v=3",
                              alt: "Confusion Matrix - DeepLabV3+ Final Model",
                              title: "DEEPLABV3+ CONFUSION MATRIX",
                            })
                          }
                        >
                          <img
                            src="/env_ml_confusion_matrix_deeplab.png?v=3"
                            alt="Confusion Matrix - DeepLabV3+ Final Model"
                            className="ml-image"
                          />
                        </button>
                        <div className="ml-card-info">
                          <span className="tech-meta">VISUALIZATION 01</span>
                          <h4>CONFUSION MATRIX</h4>
                          <p>
                            DEEPLABV3+ MODEL SEGMENTATION PERFORMANCE ACROSS
                            LAND AND WATER SHORELINE CLASSES.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>

                  <TiltCard>
                    <div className="glass-card performance-card">
                      <div className="ml-image-container">
                        <button
                          type="button"
                          className="ml-image-btn"
                          onClick={() =>
                            setSelectedMlImage({
                              src: "/env_ml_report_deeplab.png?v=3",
                              alt: "DeepLabV3+ Validation Performance Metrics",
                              title: "PERFORMANCE METRICS",
                            })
                          }
                        >
                          <img
                            src="/env_ml_report_deeplab.png?v=3"
                            alt="DeepLabV3+ Validation Performance Metrics"
                            className="ml-image"
                          />
                        </button>
                        <div className="ml-card-info">
                          <span className="tech-meta">VISUALIZATION 02</span>
                          <h4>PERFORMANCE METRICS</h4>
                          <p>
                            DEEPLABV3+ ACCURACY METRICS REPORTING AN OUTSTANDING
                            85.48% VALIDATION ACCURACY BENCHMARK.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </section>

              {/* 📷 COASTAL GALLERY */}
              <div className="huge-gallery-wrapper">
                <h2
                  className="gallery-title-large"
                  style={{ opacity: 1, color: "var(--text-main)" }}
                >
                  COASTAL GALLERY
                </h2>
                <PremiumGallery />
              </div>

              {/* Lightbox Modal */}
              <AnimatePresence>
                {selectedMlImage && (
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
                      aria-label="Close image"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>

                    <motion.div
                      className="ml-lightbox-content"
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.96, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="ml-lightbox-close"
                        onClick={() => setSelectedMlImage(null)}
                        aria-label="Close image"
                      >
                        <X size={22} strokeWidth={2.5} />
                      </button>
                      <img
                        src={selectedMlImage.src}
                        alt={selectedMlImage.alt}
                        className="ml-lightbox-image"
                      />
                      <h4>{selectedMlImage.title}</h4>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full-Screen Expanding Circular Portal Animation */}
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
