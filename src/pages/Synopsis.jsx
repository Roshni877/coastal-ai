import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageReveal from "../components/PageReveal";
import { FiChevronDown, FiChevronUp, FiBook, FiUsers } from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "power2.out" } },
};

function Synopsis() {
  const [showLiterature, setShowLiterature] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [openBrick, setOpenBrick] = useState(null); // 'projectInfo', 'introduction', 'objectives', 'methodology', or null

  const literatureReviews = [
    {
      id: 1,
      authors: "Arasi et al. (2025)",
      title: "Automated detection of coastal erosion hotspots using remote sensing, GIS and machine learning",
      description: "Proposed an automated approach for detecting coastal erosion hotspots by integrating remote sensing, GIS, and machine learning techniques. The study utilized satellite imagery such as Landsat along with GIS-based spatial analysis to identify erosion-prone regions."
    },
    {
      id: 2,
      authors: "Khurram et al. (2025)",
      title: "Satellite-based multi-decadal shoreline change detection using U-Net and DeepLabV3+",
      description: "Focused on multi-decadal shoreline change detection using deep learning models such as U-Net and DeepLabV3+. The study leveraged long-term satellite imagery to analyze shoreline variations over time."
    },
    {
      id: 3,
      authors: "Dang et al. (2022)",
      title: "Application of deep learning models to detect coastlines",
      description: "Explored the application of deep learning models, particularly convolutional neural networks (CNNs), for coastline detection. The study demonstrated that deep learning approaches significantly outperform traditional techniques."
    },
    {
      id: 4,
      authors: "Sun et al. (2023)",
      title: "Coastline extraction using remote sensing: A review",
      description: "Presented a comprehensive review of coastline extraction methods using remote sensing data. The paper analyzed both traditional techniques such as NDWI and edge detection, as well as modern machine learning approaches."
    },
    {
      id: 5,
      authors: "Christofi et al. (2025)",
      title: "Remote sensing, GIS, AI and UAV for shoreline detection",
      description: "Proposed an integrated approach combining remote sensing, GIS, artificial intelligence, and UAV (drone) technology for shoreline detection. By merging satellite data with high-resolution UAV imagery."
    }
  ];

  const references = [
    "[1] M. A. Arasi et al., 'Automated detection of coastal erosion hotspots using remote sensing, GIS and machine learning,' ScienceDirect, 2025.",
    "[2] S. Khurram et al., 'Satellite-based multi-decadal shoreline change detection using U-Net and DeepLabV3+,' Remote Sensing, 2025.",
    "[3] K. B. Dang et al., 'Application of deep learning models to detect coastlines,' Environmental Monitoring, 2022.",
    "[4] W. Sun et al., 'Coastline extraction using remote sensing: A review,' 2023.",
    "[5] D. Christofi et al., 'Remote sensing, GIS, AI and UAV for shoreline detection,' Applied Sciences, 2025.",
    "[6] A. S. Mahmoud et al., 'Advanced shoreline extraction using deep learning,' Springer, 2025.",
    "[7] Q. Lv et al., 'DeepSA-Net for coastline extraction using remote sensing,' 2024.",
    "[8] A. Boussetta et al., 'Machine learning methods for coastal monitoring using Landsat and Sentinel,' 2023.",
    "[9] C. Chawalit et al., '35-year analysis of coastal erosion using ML and DSAS,' 2025.",
    "[10] I. Osondu et al., 'Machine learning prediction of shoreline change,' 2025.",
    "[11] S. K. Muroi et al., 'Machine learning methods for predicting shoreline change,' 2025.",
    "[12] A. Adeli et al., 'Shoreline dynamics prediction using machine learning,' 2025.",
    "[13] M. A. Blais et al., 'Deep learning in coastal boundary extraction: Review,' 2025.",
    "[14] S. Anufriiev et al., 'CNN-based automatic beachline detection using UAV,' 2025.",
    "[15] E. Graham et al., 'Drone survey for coastal erosion monitoring,' 2025.",
    "[16] X. Zhou et al., 'Overview of coastline extraction from remote sensing,' 2023.",
    "[17] M. Rogers et al., 'Machine learning and remote sensing for shoreline monitoring,' 2022.",
    "[18] M. Al Najar et al., 'Interpretable machine learning for shoreline forecasting,' 2026.",
    "[19] L. Schlegel and V. Schulz, 'Shape optimization for coastal erosion mitigation,' 2021.",
    "[20] O. Pappas et al., 'High-resolution coastline extraction using SAR image segmentation,' 2022."
  ];

  const teamMembers = [
    { usn: "4MW23CS122", name: "Roshni" },
    { usn: "4MW23CS063", name: "Maithri Shetty" },
    { usn: "4MW23CS111", name: "Raksha" },
    { usn: "4MW23CS115", name: "Rashmi Salvankar" }
  ];

  return (
    <PageReveal>
      <motion.main className="page synopsis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        background: `url('https://lh3.googleusercontent.com/d/1c2nOt5GCnYhCXPkku') center/cover no-repeat, linear-gradient(135deg, rgba(245, 240, 232, 0.9), rgba(232, 224, 213, 0.9), rgba(240, 233, 220, 0.9))`,
        minHeight: '100vh',
        backgroundBlendMode: 'overlay'
      }}>
        <section className="section-header" style={{ marginTop: '60px' }}>
          <span className="tech-tag">PROJECT // SEMESTER VI</span>
          <h1 className="hero-title-large" style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #16a34a, #15803d, #166534, #15803d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient 3s ease infinite',
            backgroundSize: '200% 200%',
            fontFamily: "'Brush Script MT', cursive, 'Comic Sans MS', fantasy",
            letterSpacing: '4px',
            marginBottom: '10px',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}>SYNOPSIS &</h1>
          <h1 className="hero-title-large outline-text" style={{
            fontSize: '3.5rem',
            fontWeight: '600',
            color: 'rgba(22, 163, 74, 0.9)',
            fontFamily: "'Brush Script MT', cursive, 'Comic Sans MS', fantasy",
            letterSpacing: '4px',
            textStroke: '2px rgba(22, 163, 74, 0.3)',
            WebkitTextStroke: '2px rgba(22, 163, 74, 0.3)',
            filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))'
          }}>REPORT</h1>
          <h2 className="hero-subtitle" style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#16a34a',
            textAlign: 'center',
            marginTop: '5px',
            marginBottom: '5px',
            fontFamily: "'Brush Script MT', cursive, 'Comic Sans MS', fantasy",
            letterSpacing: '3px',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
          }}>Using Deep Learning and Remote Sensing (85.0% Accuracy)</h2>
        </section>

        <div className="synopsis-content">
          {/* BRICK ANIMATION SECTIONS */}
          <div className="brick-animation-grid">
            {/* Project Information Brick */}
            <div className={`brick-container ${openBrick === 'projectInfo' ? 'opened' : ''}`} onClick={() => setOpenBrick(openBrick === 'projectInfo' ? null : 'projectInfo')}>
              <div className="brick-square">
                <div className="brick-panel brick-panel-top-left"></div>
                <div className="brick-panel brick-panel-top-right"></div>
                <div className="brick-panel brick-panel-bottom-left"></div>
                <div className="brick-panel brick-panel-bottom-right"></div>
              </div>
              {openBrick === 'projectInfo' && (
                <div className="brick-content">
                  <button className="brick-close-btn" onClick={(e) => { e.stopPropagation(); setOpenBrick(null); }}>×</button>
                  <h3>Project Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Project Group No:</span>
                      <span className="value">21</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Academic Year:</span>
                      <span className="value">2026-27</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Institute:</span>
                      <span className="value">Shri Madhwa Vadiraja Institute of Technology and Management</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Introduction Brick */}
            <div className={`brick-container ${openBrick === 'introduction' ? 'opened' : ''}`} onClick={() => setOpenBrick(openBrick === 'introduction' ? null : 'introduction')}>
              <div className="brick-square">
                <div className="brick-panel brick-panel-top-left"></div>
                <div className="brick-panel brick-panel-top-right"></div>
                <div className="brick-panel brick-panel-bottom-left"></div>
                <div className="brick-panel brick-panel-bottom-right"></div>
              </div>
              {openBrick === 'introduction' && (
                <div className="brick-content">
                  <button className="brick-close-btn" onClick={(e) => { e.stopPropagation(); setOpenBrick(null); }}>×</button>
                  <h3>Introduction</h3>
                  <p>Coastal erosion is a major environmental problem caused by natural forces like waves, tides, and human activities. It leads to loss of land and affects coastal ecosystems. Using satellite images and machine learning techniques helps in detecting and monitoring shoreline changes more accurately and efficiently.</p>
                </div>
              )}
            </div>

            {/* Objectives Brick */}
            <div className={`brick-container ${openBrick === 'objectives' ? 'opened' : ''}`} onClick={() => setOpenBrick(openBrick === 'objectives' ? null : 'objectives')}>
              <div className="brick-square">
                <div className="brick-panel brick-panel-top-left"></div>
                <div className="brick-panel brick-panel-top-right"></div>
                <div className="brick-panel brick-panel-bottom-left"></div>
                <div className="brick-panel brick-panel-bottom-right"></div>
              </div>
              {openBrick === 'objectives' && (
                <div className="brick-content">
                  <button className="brick-close-btn" onClick={(e) => { e.stopPropagation(); setOpenBrick(null); }}>×</button>
                  <h3>Objectives</h3>
                  <ul>
                    <li>To analyze coastal erosion using satellite data</li>
                    <li>To apply machine learning models for shoreline detection</li>
                    <li>To compare different techniques for accuracy</li>
                    <li>To identify areas of erosion and accretion</li>
                    <li>To help in coastal management and protection planning</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* METHODOLOGY BRICK - FULL WIDTH */}
          <div className={`brick-container brick-full-width ${openBrick === 'methodology' ? 'opened' : ''}`} onClick={() => setOpenBrick(openBrick === 'methodology' ? null : 'methodology')}>
            <div className="brick-square brick-square-wide">
              <div className="brick-panel brick-panel-top-left"></div>
              <div className="brick-panel brick-panel-top-right"></div>
              <div className="brick-panel brick-panel-bottom-left"></div>
              <div className="brick-panel brick-panel-bottom-right"></div>
            </div>
            {openBrick === 'methodology' && (
              <div className="brick-content brick-content-wide">
                <button className="brick-close-btn" onClick={(e) => { e.stopPropagation(); setOpenBrick(null); }}>×</button>
                <h3>Methodology</h3>
                <ol>
                  <li><strong>Data Collection</strong> - Satellite images are collected from sources like Landsat and Sentinel to study coastal areas over time.</li>
                  <li><strong>Pre-processing</strong> - The images are cleaned, corrected, and enhanced to remove noise and improve quality.</li>
                  <li><strong>Shoreline Extraction</strong> - Techniques like NDWI or machine learning models (U-Net, Random Forest) are used to separate land and water boundaries.</li>
                  <li><strong>Change Detection</strong> - Shoreline positions from different years are compared using tools like DSAS to measure erosion and accretion.</li>
                  <li><strong>Model Implementation</strong> - Machine learning or deep learning models are applied to improve accuracy in detecting shoreline changes.</li>
                  <li><strong>Analysis & Evaluation</strong> - Results are analyzed using accuracy metrics (like F1-score, IoU) to check model performance.</li>
                  <li><strong>Result Interpretation</strong> - Erosion and accretion areas are identified to understand coastal changes and support decision-making.</li>
                </ol>
              </div>
            )}
          </div>

          {/* RESULTS & REPORT SECTION */}
          <motion.div className="collapsible-section special-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <button 
              className="collapsible-header" 
              onClick={() => setShowResults(!showResults)}
            >
              <FiBook className="icon" />
              <span>Results & Final Report</span>
              {showResults ? <FiChevronUp className="chevron" /> : <FiChevronDown className="chevron" />}
            </button>
            
            <AnimatePresence>
              {showResults && (
                <motion.div 
                  className="collapsible-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '30px' }}>
                    
                    {/* Part 1: Executive Summary */}
                    <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                      <h4 style={{ color: '#16a34a', margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Executive Summary</h4>
                      <p style={{ color: 'var(--text-main)', opacity: 0.9, lineHeight: '1.7', fontSize: '0.95rem' }}>
                        This project was created to help monitor and protect the beaches of Udupi, Karnataka, India, from the threat of coastal erosion (losing land to the sea). By combining radar satellite images (which can see through clouds) with regular optical satellite images, we trained a smart computer model called DeepLabV3+ to automatically trace the exact boundary where the land meets the ocean. Our model is highly accurate, matching real shorelines with a success score of <strong>85.48%</strong>. Since tides pull the water line back and forth throughout the day, we used physics equations based on the slope of the beach to adjust each image. This gave us the true, corrected speed of shoreline movement across 1,944 points along the coast. We then trained an XGBoost algorithm to group beaches into different risk levels. This proved that strong monsoon winds and large waves are the primary physical causes of shoreline retreat. Finally, we project that by 2029, Udupi will experience <strong>7.88 hectares</strong> of cumulative land loss, with <strong>7.65 km</strong> of its beach classified under severe threat of erosion.
                      </p>
                    </div>

                    {/* Part 2: Implementation Pipeline & Step-by-Step Guide */}
                    <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                      <h4 style={{ color: '#16a34a', margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Technical Pipeline & Execution Guide</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 1: Dataset Patch Preparation (prepare_dataset.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Slices large, raw satellite images into thousands of small, overlapping 256x256 tiles (patches) with a 50% overlap. This gives the AI model plenty of training examples and prepares the image colors so the model can read them easily.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 2: DeepLabV3+ Model Training (train_deeplabv3.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Trains the computer brain (neural network) to identify which pixels in the satellite tiles are water and which are land. It automatically saves the best-performing model settings to a file called <strong>best_deeplabv3_model.pth</strong>.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 3: Automated Boundary Extraction (run_inference.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Applies the trained model to find the shoreline boundary in new satellite images. It cleans up any image noise (like wave foam) and draws the final shoreline as a GIS vector file so it can be opened on maps.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 4: Rate Calculation & Tidal Correction (run_calculation.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Measures the distance of the shoreline from baseline points. It subtracts the tide's influence (using local tide height records at the time the photo was taken) to find the clean, tide-corrected shoreline movement speed.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 5: Temporal Shoreline Forecasting (forecast_shoreline.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Uses the historical speed of shoreline movement to project and draw future coastline lines for the years 2027, 2028, and 2029.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 6: Environmental ML Modeling (env_ml_analysis.py)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Gathers environmental data (such as wave sizes and monsoonal winds) and teaches an XGBoost algorithm to classify which beaches are at high risk (severe erosion) vs. stable or growing.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Step 7: Physical Quantification & Web-GIS Serve (quantify_erosion.py & dashboard)</span>
                          <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)' }}>
                            Calculates the total lost land area in hectares and starts this interactive dashboard so planners can inspect any point on a map.
                          </p>
                        </div>
                        
                      </div>
                    </div>

                    {/* Part 3: Theoretical Foundations & Formulations */}
                    <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                      <h4 style={{ color: '#16a34a', margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Mathematical & Physical Formulations</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        
                        <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '15px', border: '1px solid var(--card-border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Tidal Correction Offset</span>
                          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px', margin: '10px 0', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: 'bold' }}>
                            Δx = (H_tide - H_mean) / tan(β)
                          </div>
                          <p style={{ fontSize: '0.8rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Normalizes the observed water boundary landward or seaward relative to local Mean Sea Level (H_mean = 0.8m) based on tide elevation (H_tide = 0.7m) and average sandy beach slope slope (tan β = 0.03).
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '15px', border: '1px solid var(--card-border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Erosion Velocity (EPR)</span>
                          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px', margin: '10px 0', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: 'bold' }}>
                            EPR = (Dist_2024 - Dist_2020) / 4.0 yr
                          </div>
                          <p style={{ fontSize: '0.8rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Computes End Point Rate (EPR) change velocities (m/yr) along baseline transects, where negative values represent geomorphological erosion and positive values indicate sediment accretion.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '15px', border: '1px solid var(--card-border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Cumulative Land Loss</span>
                          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px', margin: '10px 0', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: 'bold' }}>
                            Area = Sum( -EPR * 50m * 5 yr ) / 10,000
                          </div>
                          <p style={{ fontSize: '0.8rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Estimates total land area lost in hectares (1 Ha = 10,000 m²) by multiplying linear shoreline retreat rates with transect spacing intervals (50m) across the 5-year prediction horizon.
                          </p>
                        </div>
                        
                      </div>
                    </div>

                    {/* Part 4: Metrics Panel */}
                    <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                      <h4 style={{ color: '#16a34a', margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Empirical Findings & Key Metrics</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        
                        <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>DeepLabV3+ Val IoU</span>
                          <h5 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '5px 0', color: 'var(--text-main)' }}>85.48%</h5>
                          <p style={{ fontSize: '0.75rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)' }}>Dice coefficient agreement in segmenting coastal boundary land/water classes.</p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Severely Threatened Coast</span>
                          <h5 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '5px 0', color: 'var(--text-main)' }}>7.65 km</h5>
                          <p style={{ fontSize: '0.75rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)' }}>Coast length experiencing high-risk retreat rates exceeding -2m/year.</p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Predicted Land Loss</span>
                          <h5 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '5px 0', color: 'var(--text-main)' }}>7.88 Ha</h5>
                          <p style={{ fontSize: '0.75rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)' }}>Cumulative land surface area projected to wash away by the year 2029.</p>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Erosion Hazard Drivers</span>
                          <h5 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '10px 0', color: 'var(--text-main)', textTransform: 'uppercase' }}>Monsoon Wind Exposure</h5>
                          <p style={{ fontSize: '0.75rem', margin: '0', opacity: 0.8, color: 'var(--text-muted)' }}>Determined as primary physical catalyst via XGBoost importance curves.</p>
                        </div>
                        
                      </div>
                    </div>

                    {/* Part 5: Comprehensive Visual Archives & Generated Plots */}
                    <div>
                      <h4 style={{ color: '#16a34a', margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Visual Report & Generated Pipeline Plots</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        
                        {/* Row 1: Model Progress and Confusion Matrix */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 1: DEEPLABV3+ CONFUSION MATRIX (VALIDATION)</span>
                            <img src="/confusion-matrix.jpg" alt="Model Confusion Matrix" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This diagram is a pixel-level confusion matrix which measures the accuracy of the DeepLabV3+ model in separating land from water. It compares what the AI predicted (horizontal) against the actual ground truth verified by human experts (vertical). The extremely high numbers on the main diagonal show that the model rarely confuses land for water, proving it is highly reliable for tracing coastlines.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 2: DEEPLABV3+ BOUNDARY EVALUATION METRICS</span>
                            <img src="/model-metrics.jpg" alt="Model Training Metrics" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This chart plots the performance metrics (Precision, Recall, and Dice Score) during the model's training process. A Precision score of over 85% means that when the AI identifies a pixel as water, it is almost always correct. This high level of accuracy is essential because even small errors at the pixel level can result in shoreline measurements being off by tens of meters.
                            </p>
                          </div>
                        </div>

                        {/* Row 2: Change Rate Profiles and Distributions */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 3: LONGSHORE CHANGE RATE PROFILE (EPR)</span>
                            <img src="/report_images/longshore_rate_profile.png" alt="Longshore Erosion Rate Profile" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This longshore profile shows the calculated speed of shoreline change (in meters per year) across all 1,944 points (transects) from north to south. Negative bars extending downward represent erosion (beaches shrinking), while positive bars extending upward represent accretion (beaches growing). This makes it very easy to spot exactly which stretches of the Udupi coast are eroding the fastest.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 4: EROSION RATE DENSITY DISTRIBUTION</span>
                            <img src="/report_images/rate_distribution_density.png" alt="Erosion Rate Density" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This density curve shows the overall distribution of erosion rates along the coast. The highest peak sits close to zero, meaning most of the coastline is stable. However, the long tail extending to the left shows that a significant number of points are experiencing severe erosion (retreating faster than -2 meters per year), highlighting the need for targeted protection.
                            </p>
                          </div>
                        </div>

                        {/* Row 3: Scatter Rate and Mean Shoreline Position */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 5: TRANSECT RATE SCATTER COMPARISON (MODEL VS GEE)</span>
                            <img src="/report_images/scatter_rate_comparison.png" alt="Scatter Rate Comparison" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This scatter plot compares our AI model's shoreline change measurements against traditional historical data from Google Earth Engine (GEE). Since the points lie close to a straight diagonal line, it proves that our automated, satellite-based method produces results that closely match established scientific datasets.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 6: MEAN SHORELINE POSITION TRENDS (2020 - 2029)</span>
                            <img src="/shoreline/mean_position.png" alt="Mean Shoreline Position" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This trend graph tracks how the average position of the entire Udupi shoreline moves over a ten-year period (from 2020 to 2029). The steady downward slope shows a continuous landward retreat, meaning the ocean is gradually encroaching on the land year after year. This highlights the long-term threat of sea-level rise and storm waves.
                            </p>
                          </div>
                        </div>

                        {/* Row 4: Alongshore Heatmap and Overall Map */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 7: ALONGSHORE EROSION RISK HEATMAP</span>
                            <img src="/analysis/alongshore_heatmap.png" alt="Alongshore Heatmap" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This spatial heatmap uses warm colors (reds and oranges) to indicate high-risk erosion hotspots and cool colors (blues) for stable areas. By looking at this map, coastal managers can instantly identify that sandy spits and river inlets are experiencing the most rapid land loss and require immediate engineering interventions.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 8: OVERALL SHORELINE BOUNDARY MAP INTERSECTIONS</span>
                            <img src="/shoreline/overall_analysis_new.png" alt="Overall Shoreline Map" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This map displays the actual geographic lines of Udupi's shorelines. It overlays the historical lines (2020-2024) with our predicted future lines (2027-2029). The gap between the lines represents the physical space that will be claimed by the sea, giving engineers a clear visual guide on where the beach will be in the future.
                            </p>
                          </div>
                        </div>

                        {/* Row 5: Feature Importance and Correlation Map */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 9: XGBOOST FEATURE IMPORTANCE ESTIMATOR</span>
                            <img src="/env_feature_importance.png" alt="XGBoost Feature Importance" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This feature importance chart shows which environmental factors have the biggest influence on coastal erosion. The length of each bar indicates the factor's impact. The chart clearly shows that monsoonal wind direction and wave heights are the dominant physical drivers, meaning erosion is highly seasonal and storm-driven.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 10: GEOMORPHIC SHORELINE RISK PROFILE</span>
                            <img src="/analysis/transect_rate_scatter.png" alt="Transect Risk Profile" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This scatter profile shows individual transect erosion rates sorted by their geographic location IDs. It reveals that erosion is not uniform; instead, it varies heavily depending on local features like beach width, nearby river mouths, and constructed sea walls, which block natural sand flow.
                            </p>
                          </div>
                        </div>

                        {/* Row 6: Environmental Correlation Heatmap and Confusion Matrix */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 11: ENVIRONMENTAL PARAMETERS CORRELATION MATRIX</span>
                            <img src="/env_correlation_heatmap.png" alt="Environmental Correlation Heatmap" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This correlation matrix uses colors to show how different factors relate to one another. Darker colors represent strong relationships. It confirms a direct link between high monsoonal wave energy and rapid shoreline retreat, proving that wave impact is the main force pulling sand away from the beach.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 12: ENVIRONMENTAL ML RISK CONFUSION MATRIX</span>
                            <img src="/env_ml_confusion_matrix.png" alt="ML Confusion Matrix" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This confusion matrix measures how well our XGBoost classifier predicts whether a beach is at severe, moderate, or stable risk of erosion. It demonstrates that the model is highly accurate at identifying high-risk areas, allowing planners to trust its predictions when designing coastal defense structures.
                            </p>
                          </div>
                        </div>

                        {/* Row 7: Shoreline Position Over Time and Annual Change Rates */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 13: SHORELINE POSITION OVER TIME TRENDS</span>
                            <img src="/analysis/shoreline_position_time.png" alt="Shoreline Position Over Time" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This linear trend graph plots the changing position of the shoreline over time for individual points. The straight regression lines show the rate of landward retreat, proving that coastal erosion is a steady, ongoing process rather than a series of random events, allowing us to make reliable future forecasts.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>FIG 14: ANNUAL SHORELINE CHANGE RATES (BAR GRAPH)</span>
                            <img src="/analysis/annual_change_rate.png" alt="Annual Shoreline Change Rate" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                            <p style={{ fontSize: '0.82rem', margin: '5px 0 0 0', opacity: 0.9, color: 'var(--text-main)', lineHeight: '1.5' }}>
                              <strong>Analysis & Explanation:</strong> This bar chart compares the average erosion rates across different years. It highlights that erosion is highly variable from year to year, with some years showing massive land loss due to severe monsoon seasons and storm surges, while other years remain relatively stable.
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>


          {/* LITERATURE REVIEW SECTION */}
          <motion.div className="collapsible-section red-section special-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <button 
              className="collapsible-header red-header" 
              onClick={() => setShowLiterature(!showLiterature)}
            >
              <FiBook className="icon" />
              <span>Literature Review</span>
              {showLiterature ? <FiChevronUp className="chevron" /> : <FiChevronDown className="chevron" />}
            </button>
            
            <AnimatePresence>
              {showLiterature && (
                <motion.div 
                  className="collapsible-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="literature-list">
                    {literatureReviews.map((review) => (
                      <div key={review.id} className="literature-item">
                        <h4>{review.authors}</h4>
                        <p><strong>{review.title}</strong></p>
                        <p>{review.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* REFERENCES SECTION */}
          <motion.div className="collapsible-section red-section special-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <button 
              className="collapsible-header red-header" 
              onClick={() => setShowReferences(!showReferences)}
            >
              <FiBook className="icon" />
              <span>References</span>
              {showReferences ? <FiChevronUp className="chevron" /> : <FiChevronDown className="chevron" />}
            </button>
            
            <AnimatePresence>
              {showReferences && (
                <motion.div 
                  className="collapsible-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="references-list">
                    {references.map((ref, index) => (
                      <div key={index} className="reference-item" data-index={index + 1}>
                        <p>{ref}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* INTERACTIVE GIFT BOX REVEAL */}
          <GiftBoxDownload />
        </div>
      </motion.main>
    </PageReveal>
  );
}

const GiftBoxDownload = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', paddingBottom: '100px' }}>
      <motion.div 
        className="gift-box-wrapper"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        style={{ position: 'relative', cursor: 'pointer', width: '120px', height: '120px' }}
        onClick={() => setIsOpen(true)}
      >
        {/* Pulsing Glow Background */}
        {!isOpen && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-20%',
              width: '140%',
              height: '140%',
              background: 'radial-gradient(circle, rgba(22, 163, 74, 0.4) 0%, transparent 70%)',
              zIndex: 0
            }}
          />
        )}

        {/* The Box Body */}
        <motion.div 
          animate={isOpen ? { y: 20, opacity: 0.8 } : {}}
          style={{
            width: '100%',
            height: '100%',
            background: '#16a34a',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Vertical Ribbon */}
          <div style={{ position: 'absolute', width: '20px', height: '100%', background: '#fbbf24', left: '50%', transform: 'translateX(-50%)' }} />
          {/* Horizontal Ribbon */}
          <div style={{ position: 'absolute', width: '100%', height: '20px', background: '#fbbf24', top: '50%', transform: 'translateY(-50%)' }} />
          
          <AnimatePresence>
            {!isOpen && (
              <motion.span 
                exit={{ opacity: 0 }}
                style={{ color: '#fff', fontSize: '10px', fontWeight: '900', letterSpacing: '1px', zIndex: 3 }}
              >
                OPEN ME
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* The Box Lid */}
        <motion.div 
          animate={isOpen ? { y: -100, x: 40, rotate: 45, opacity: 0 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-5px',
            width: '130px',
            height: '30px',
            background: '#15803d',
            borderRadius: '8px',
            zIndex: 4,
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}
        >
          {/* Lid Ribbon Knot */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '30px',
            background: '#fbbf24',
            borderRadius: '50% 50% 0 0',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }} />
        </motion.div>
      </motion.div>

      {/* Revealed Download Button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            style={{ marginTop: '40px' }}
          >
            <a 
              href="https://drive.google.com/uc?export=download&id=1QbX0UflLftd-2WqidtZ0fpaHMWTPblkr" 
              target="_blank"
              rel="noopener noreferrer"
              className="premium-download-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px 45px',
                background: 'rgba(22, 163, 74, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid #16a34a',
                borderRadius: '60px',
                color: '#16a34a',
                textDecoration: 'none',
                fontWeight: '900',
                fontSize: '15px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: '0 15px 40px rgba(22, 163, 74, 0.2)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(22, 163, 74, 0.15)';
                e.currentTarget.style.color = '#16a34a';
              }}
            >
              <span style={{ fontSize: '24px' }}>🎁</span>
              <span>Claim Your PDF</span>
            </a>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ textAlign: 'center', color: '#16a34a', fontSize: '12px', fontWeight: 'bold', marginTop: '15px', letterSpacing: '1px' }}
            >
              SUCCESSFULLY UNBOXED!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Synopsis;