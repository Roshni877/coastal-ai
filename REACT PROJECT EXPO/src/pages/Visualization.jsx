import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Radio, Compass, BarChart3, Image as ImageIcon } from "lucide-react";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";
import PremiumGallery from "../components/PremiumGallery";
import ShorelineDynamicsPlayer from "../components/ShorelineDynamicsPlayer";

function Visualization() {
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

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (animModalOpen) setAnimModalOpen(false);
        if (selectedMlImage) setSelectedMlImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [animModalOpen, selectedMlImage]);

  return (
    <PageReveal>
      <motion.main
        className="page visualization-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="fullscreen-archive-view" style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "20px 20px 80px 20px" }}>
          
          {/* Header Title Section */}
          <section
            className="section-header"
            style={{
              marginTop: "20px",
              paddingTop: "10px",
              marginBottom: "35px",
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
                  fontSize: "clamp(2.8rem, 6.5vw, 4.5rem)",
                  fontWeight: 900,
                  color: "var(--text-main)",
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: "1px",
                  textAlign: "center",
                  lineHeight: 1.1,
                  margin: 0,
                  background: "linear-gradient(45deg, var(--teal), var(--amber))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 12px rgba(0,212,255,0.35))",
                }}
              >
                VISUAL ARCHIVE &amp; MODEL INTERPRETATION
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  maxWidth: "720px",
                  textAlign: "center",
                  margin: "8px auto 0 auto",
                  lineHeight: 1.6,
                }}
              >
                Multi-temporal satellite dynamics, DeepLabV3+ segmentation validation benchmarks, 
                and high-precision coastal erosion analytics across Karnataka's 97.2 km monitored corridor.
              </p>
            </motion.div>
          </section>

          {/* 🌊 MULTI-TEMPORAL SHORELINE DYNAMICS ANIMATION SECTION */}
          <section className="analytics-section" style={{ marginBottom: "50px" }}>
            <div className="analytics-header" style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "6px" }}>
                <span className="live-indicator"><span className="dot" /> EMPIRICAL SATELLITE RASTER DYNAMICS</span>
              </div>
              <h2
                className="section-subtitle"
                style={{
                  color: "var(--amber)",
                  textShadow: "0 0 30px rgba(255, 214, 10, 0.35)",
                  textAlign: "center"
                }}
              >
                MULTI-TEMPORAL SHORELINE DYNAMICS (2020 &rarr; 2024)
              </h2>
              <p className="section-desc" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
                Sequential satellite shoreline vectors extracted along 97.2 km of Udupi coastline via 9-channel DeepLabV3+. 
                Toggle between the Interactive Player and the Continuous Loop GIF below.
              </p>
            </div>

            {/* Shoreline Dynamics Animation Player Component */}
            <div style={{ marginBottom: "35px" }}>
              <ShorelineDynamicsPlayer
                onExpandFullscreen={() => setAnimModalOpen(true)}
                showTitle={true}
              />
            </div>

            {/* Mean Shoreline Position Per Year (Preserved exactly as it is) */}
            <div className="analytics-grid" style={{ marginTop: "30px" }}>
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
                    Yearly mean shoreline position analysis across the 1,944 baseline transects (2020–2024).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 🤖 ML MODEL PERFORMANCE RESEARCH */}
          <section className="ml-performance-section" style={{ marginBottom: "60px" }}>
            <div className="section-header" style={{ textAlign: "center", marginBottom: "30px" }}>
              <span className="tech-tag">RESEARCH // QUANTITATIVE VALIDATION</span>
              <h2 className="hero-title-large" style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "8px 0" }}>
                MODEL PERFORMANCE METRICS
              </h2>
              <p style={{ color: "var(--text-muted)", maxWidth: "650px", margin: "0 auto" }}>
                Click either card to inspect high-resolution confusion matrix and precision-recall telemetry.
              </p>
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
              style={{ opacity: 1, color: "var(--text-main)", textAlign: "center", marginBottom: "30px" }}
            >
              COASTAL SATELLITE GALLERY
            </h2>
            <PremiumGallery />
          </div>

        </div>

        {/* ========================================================
            LIGHTBOX MODAL FOR ML IMAGES (VIA CREATEPORTAL)
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
                onClick={() => setSelectedMlImage(null)}
                aria-label="Close model image"
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
      </motion.main>
    </PageReveal>
  );
}

export default Visualization;
