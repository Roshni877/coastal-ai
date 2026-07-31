import React from "react";
import { motion } from "framer-motion";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";

const dataSources = [
  {
    id: "01",
    name: "LANDSAT MISSION",
    agency: "NASA // USGS",
    description: "Multi-spectral imaging data acquired via the Landsat satellite network, jointly managed by the National Aeronautics and Space Administration and the U.S. Geological Survey.",
    image: "/landsat_source.png",
    color: "#0ea5e9",
    meta: "GLOBAL // TERRESTRIAL",
    website: "https://earthexplorer.usgs.gov"
  },
  {
    id: "02",
    name: "SENTINEL PROGRAM",
    agency: "COPERNICUS // EU",
    description: "High-resolution radar and optical imaging from the Sentinel constellation, part of the European Union's Copernicus Earth Observation program.",
    image: "/sentinel_source.png",
    color: "#10b981",
    meta: "EU // OCEANIC",
    website: "https://browser.dataspace.copernicus.eu"
  },
  {
    id: "03",
    name: "TIDAL DATA",
    agency: "IN-SITU TIDE GAUGES",
    description: "Hourly tidal elevation records used to perform hydrodynamic tide height correction, normalizing shoreline boundaries to Mean Sea Level (MSL).",
    image: "/tides_currents_noaa.png",
    color: "#eab308",
    meta: "HYDRODYNAMIC // CORRECTION",
    website: "https://tidesandcurrents.noaa.gov"
  },
  {
    id: "04",
    name: "GEE SHORELINES",
    agency: "GOOGLE EARTH ENGINE",
    description: "Cloud-extracted historical shoreline vector datasets spanning 2020-2024, utilized as ground truth to train baseline models and evaluate rates.",
    image: "/google_earth_engine_platform.png",
    color: "#a855f7",
    meta: "CLOUD // SPATIO-TEMPORAL",
    website: "https://earthengine.google.com"
  }
];

function DatasetGuide() {
  return (
    <PageReveal>
      <motion.main className="page dataset-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffa0c9 75%, #fed6aa 100%)',
        minHeight: '100vh'
      }}>
        <section className="section-header" style={{ marginTop: '60px' }}>
          <motion.span 
            className="tech-tag"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            DATA_INFRASTRUCTURE // v2.0
          </motion.span>
          <h1 className="hero-title-large" style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '3px',
            marginBottom: '10px',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
          }}>DATASETS &</h1>
          <h1 className="hero-title-large outline-text" style={{
            fontSize: '3.5rem',
            fontWeight: '600',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '3px',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))'
          }}>ALGORITHMS</h1>
        </section>

        <div className="source-grid">
          {dataSources.map((source, index) => (
            <motion.div 
              key={source.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.2 }}
              style={{ width: '100%' }}
            >
              <TiltCard>
                <div className="source-card">
                  <div className="source-image-container">
                    <img src={source.image} alt={source.name} className="source-img" />
                    <div className="image-overlay" style={{ background: `radial-gradient(circle at center, transparent 0%, ${source.color}22 100%)` }}></div>
                  </div>
                  
                  <div className="source-content">
                    <div className="source-header">
                      <span className="source-id">{source.id}</span>
                      <div className="source-title-group">
                        <span className="source-agency" style={{ color: source.color }}>{source.agency}</span>
                        <h3 className="source-name">{source.name}</h3>
                      </div>
                    </div>
                    
                    <p className="source-desc">{source.description}</p>
                    
                    <div className="source-footer">
                      <span className="source-meta">{source.meta}</span>
                      <div className="source-actions">
                        <div className="status-indicator">
                          <div className="status-dot" style={{ backgroundColor: source.color }}></div>
                          <span className="status-text">ACTIVE_LINK</span>
                        </div>
                        <button 
                          className="website-btn"
                          onClick={() => window.open(source.website, '_blank')}
                          style={{ 
                            backgroundColor: source.color,
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = `0 4px 15px ${source.color}66`;
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Go to Website →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* ALGORITHMS SECTION */}
        <section className="section-header" style={{ marginTop: '80px', marginBottom: '30px' }}>
          <span className="tech-tag">MACHINE_LEARNING // ARCHITECTURE</span>
          <h1 className="hero-title-large" style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
          }}>ALGORITHMS USED</h1>
        </section>

        <div className="source-grid" style={{ marginBottom: '50px' }}>
          {/* DeepLabV3+ Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">01</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#ff2a6d' }}>NEURAL NETWORK // SEGMENTATION</span>
                      <h3 className="source-name">DeepLabV3+</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    Fine-tuned state-of-the-art semantic segmentation model utilizing a ResNet backbone to perform high-resolution pixel-level land vs. water boundary classification. This is our primary model for automated shoreline extraction.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#ff2a6d', fontWeight: 'bold' }}>VALIDATION ACCURACY: 85.0%</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Random Forest Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">02</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#8222ff' }}>ENSEMBLE LEARNING // CLASSIFICATION</span>
                      <h3 className="source-name">Random Forest</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    Used as a baseline model and classification evaluator to identify shoreline change severity (Erosion vs. Accretion) across historical transects using dynamic physical attributes.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#8222ff', fontWeight: 'bold' }}>DECISION TREE MODEL</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* XGBoost Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">03</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#00f0ff' }}>GRADIENT BOOSTING // REGRESSION</span>
                      <h3 className="source-name">XGBoost</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    A high-performance extreme gradient boosted tree implementation utilized to predict numerical shoreline displacement rates, capturing non-linear relationships in wave energy and beach slopes.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#00f0ff', fontWeight: 'bold' }}>GRADIENT BOOSTED TREES</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* SVM Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">04</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#10b981' }}>SUPPORT VECTOR MACHINE // CLASSIFICATION</span>
                      <h3 className="source-name">Support Vector Machine (SVM)</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    Utilizes optimal separating hyperplanes and kernel transformations (RBF) to categorize shoreline segments into erosion vulnerability levels, serving as a highly stable structural classifier.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#10b981', fontWeight: 'bold' }}>KERNEL MACHINE / CLASS BOUNDARIES</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* EPR & Tidal Correction Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">05</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#eab308' }}>GEOSPATIAL GIS // RATE ANALYSIS</span>
                      <h3 className="source-name">EPR & Tidal Correction</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    Calculates historical shoreline End Point Rates (EPR) by intersecting multi-year vectors with 1,944 shoreline transects, and incorporates beach slope slope estimates to correct for fluctuating tidal elevations.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#eab308', fontWeight: 'bold' }}>TIDAL DE-BIASING & GEOPANDAS</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Linear Extrapolation Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ width: '100%' }}
          >
            <TiltCard>
              <div className="source-card">
                <div className="source-content" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="source-header">
                    <span className="source-id">06</span>
                    <div className="source-title-group">
                      <span className="source-agency" style={{ color: '#ec4899' }}>FORECASTING // LINEAR PROJECTION</span>
                      <h3 className="source-name">Linear Extrapolation</h3>
                    </div>
                  </div>
                  <p className="source-desc">
                    Projects future coastline coordinates forward to 2027, 2028, and 2029 by linearly propagating transect intersection points according to computed historical erosion velocities.
                  </p>
                  <div className="source-footer" style={{ marginTop: 'auto' }}>
                    <span className="source-meta" style={{ color: '#ec4899', fontWeight: 'bold' }}>TEMPORAL EXTRAPOLATION</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        <section className="mission-footer">
          <div className="mission-line"></div>
          <p className="mission-text">ALL DATASETS AND MODELS ARE RUN THROUGH THE AUTOMATED NEURAL INFERENCE ENGINE FOR MAX PREDICTIVE STABILITY.</p>
        </section>
      </motion.main>
    </PageReveal>
  );
}

export default DatasetGuide;