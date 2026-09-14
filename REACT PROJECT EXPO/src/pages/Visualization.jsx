import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";
import PremiumGallery from "../components/PremiumGallery";
import PostcardFilmStrip from "../components/PostcardFilmStrip";
import Treasure3D from "../components/Treasure3D";

function Visualization() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedMlImage, setSelectedMlImage] = useState(null);


  return (
    <PageReveal>
      <motion.main className="page visualization-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="treasure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
              transition={{ duration: 1 }}
              className="treasure-entry-section"
            >
              <section className="section-header-centered">
                <span className="tech-tag" style={{ color: 'var(--amber)' }}>UNCOVER THE DATA</span>
                <h1 className="hero-title-large">VISUAL</h1>
                <h1 className="hero-title-large outline-text">ARCHIVE</h1>
              </section>

              <Suspense fallback={<div className="loading-text">Diving into the sea...</div>}>
                <Treasure3D onOpen={() => setIsUnlocked(true)} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="dashboard-content"
            >
              <div className="dashboard-controls-top" style={{ position: 'fixed', top: '120px', left: '40px', zIndex: 10000, pointerEvents: 'auto' }}>
                <motion.button
                  className="back-to-sea"
                  onClick={() => setIsUnlocked(false)}
                  whileHover={{ scale: 1.1, x: 10, boxShadow: '0 15px 45px rgba(245, 158, 11, 0.4)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 25px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'var(--amber)',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    borderRadius: '50px'
                  }}
                >
                  ← BACK TO SEA
                </motion.button>
              </div>

              <section className="section-header" style={{ marginTop: '100px', paddingTop: '20px', marginBottom: '30px' }}>
                <span className="tech-tag" style={{ display: 'block', marginBottom: '10px' }}>SHORELINE // MONITORING SYSTEM</span>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '10px'
                  }}
                >
                  <h1 style={{
                    fontSize: '3.2rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, var(--teal), var(--amber))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.3))'
                  }}>
                    MODEL INTERPRETATION
                  </h1>
                  <h1 style={{
                    fontSize: '2.8rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    opacity: 0.9
                  }}>
                    AND DATA VISUALIZATION
                  </h1>
                </motion.div>
              </section>

              {/* � ADVANCED ANALYTICS SECTION (Google Colab Outputs) */}
              <section className="analytics-section">
                <div className="analytics-header">
                  <h2 className="section-subtitle" style={{ color: 'var(--amber)', textShadow: '0 0 30px rgba(255, 214, 10, 0.35)' }}>DETAILED ANALYSIS</h2>
                  <p className="section-desc">Machine Learning outputs generated via Google Colab for erosion and accretion patterns.</p>
                </div>
                <div className="analytics-intro-card">
                  <PostcardFilmStrip />
                </div>

                <div className="analytics-grid">
                  <div className="glass-card analytics-card">
                    <h2 className="analysis-title-large">MEAN SHORELINE POSITION PER YEAR</h2>
                    <div className="graph-placeholder">
                      <img
                        src="/shoreline/mean_position.png"
                        alt="Mean shoreline position per year"
                        className="shoreline-graph-image"
                      />
                      <p>Yearly mean shoreline position analysis in a single overview chart.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🤖 ML MODEL PERFORMANCE RESEARCH */}
              <section className="ml-performance-section">
                <div className="section-header">
                  <span className="tech-tag">RESEARCH // VALIDATION</span>
                  <h2 className="hero-title-large" style={{ fontSize: '3rem' }}>MODEL PERFORMANCE</h2>
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
                              title: "DEEPLABV3+ CONFUSION MATRIX"
                            })
                          }
                        >
                          <img src="/env_ml_confusion_matrix_deeplab.png?v=3" alt="Confusion Matrix - DeepLabV3+ Final Model" className="ml-image" />
                        </button>
                        <div className="ml-card-info">
                          <span className="tech-meta">VISUALIZATION 01</span>
                          <h4>CONFUSION MATRIX</h4>
                          <p>DEEPLABV3+ MODEL SEGMENTATION PERFORMANCE ACROSS LAND AND WATER SHORELINE CLASSES.</p>
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
                              title: "PERFORMANCE METRICS"
                            })
                          }
                        >
                          <img src="/env_ml_report_deeplab.png?v=3" alt="DeepLabV3+ Validation Performance Metrics" className="ml-image" />
                        </button>
                        <div className="ml-card-info">
                          <span className="tech-meta">VISUALIZATION 02</span>
                          <h4>PERFORMANCE METRICS</h4>
                          <p>DEEPLABV3+ ACCURACY METRICS REPORTING AN OUTSTANDING 85.48% VALIDATION ACCURACY BENCHMARK.</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </section>

              <div className="huge-gallery-wrapper">
                <h2 className="gallery-title-large" style={{ opacity: 1, color: 'var(--text-main)' }}>COASTAL GALLERY</h2>
                <PremiumGallery />
              </div>

              <AnimatePresence>
                {selectedMlImage && (
                  <motion.div
                    className="ml-lightbox-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedMlImage(null)}
                  >
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
                        aria-label="Close model image"
                      >
                        ×
                      </button>
                      <img src={selectedMlImage.src} alt={selectedMlImage.alt} className="ml-lightbox-image" />
                      <h4>{selectedMlImage.title}</h4>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          )}
        </AnimatePresence>
      </motion.main>
    </PageReveal>
  );
}

export default Visualization;
