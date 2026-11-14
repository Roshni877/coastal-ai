import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiCamera } from "react-icons/fi";

const filmImages = [
  {
    id: 1,
    step: "FINAL RESULT 01 // AI VALIDATION",
    src: "/env_ml_confusion_matrix_deeplab.png?v=3",
    alt: "DeepLabV3+ Final Validation Result (85.48% Accuracy)",
    description: "Deep learning pixel segmentation confusion matrix validating 85.48% accuracy and 92.17% Dice coefficient across coastal land/water boundaries."
  },
  {
    id: 2,
    step: "FINAL RESULT 02 // OVERALL SHORELINE BOUNDARY",
    src: "/shoreline/overall_analysis_new.png",
    alt: "Overall Shoreline Analysis Map & Boundary Envelopes",
    description: "Final multi-year spatial overlay integrating empirical shoreline boundaries (2020–2024) with forward projections across Udupi's 97.2 km coast."
  },
  {
    id: 3,
    step: "FINAL RESULT 03 // ALONGSHORE RISK HEATMAP",
    src: "/analysis/alongshore_heatmap.png",
    alt: "Alongshore Spatial Erosion & Accretion Heatmap",
    description: "Two-dimensional space-time raster mapping alongshore transect IDs against years to pinpoint severe erosion hotspots near river mouths."
  },
  {
    id: 4,
    step: "FINAL RESULT 04 // LONGSHORE RATE PROFILE",
    src: "/report_images/longshore_rate_profile.png",
    alt: "Longshore Erosion Rate Envelope Profile (EPR)",
    description: "Calculated shoreline migration rates in m/year across all 1,944 shore-normal transects from northern Kundapura to southern Mulki."
  },
  {
    id: 5,
    step: "FINAL RESULT 05 // DECADAL NET MOVEMENT",
    src: "/forecast/average_net_shoreline_movement_2020_2029.jpg",
    alt: "Average Net Shoreline Movement (2020–2029)",
    description: "Complete decadal trajectory tracing average net cross-shore displacement from historical baseline (2020) through the 2029 forecast horizon."
  },
  {
    id: 6,
    step: "FINAL RESULT 06 // FORECASTED LAND LOSS",
    src: "/forecast/forecasted_cumulative_land_loss_2024_2029.jpg",
    alt: "Forecasted Cumulative Coastal Land Loss (2024–2029)",
    description: "Forward machine learning prediction forecasting +7.88 hectares of cumulative coastal land loss by 2029 across Udupi's vulnerable beaches."
  },
  {
    id: 7,
    step: "FINAL RESULT 07 // VULNERABILITY EXTENT",
    src: "/forecast/vulnerability_quantification.jpg",
    alt: "Coastal Vulnerability Length Quantification (km)",
    description: "Categorical risk classification quantifying 7.65 km of Severe erosion, 5.76 km of Moderate erosion, and 83.79 km of Stable shoreline."
  },
  {
    id: 8,
    step: "FINAL RESULT 08 // MASTER 3-PANEL FORECAST",
    src: "/forecast/final_graph_3panel.jpg",
    alt: "Publication-Grade 3-Panel Decadal Evolution Forecast",
    description: "Comprehensive 3-panel publication synthesis combining coastal vulnerability risk classification, cumulative land loss, and decadal net movement."
  }
];

function PostcardFilmStrip() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getSlideWidth = () => {
    const container = scrollRef.current;
    if (!container) return 280;
    const slide = container.querySelector(".film-slide");
    return slide ? slide.clientWidth + 24 : 280;
  };

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const width = getSlideWidth();
    container.scrollTo({ left: index * width, behavior: "smooth" });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const next = Math.min(prev + 1, filmImages.length - 1);
      scrollToIndex(next);
      return next;
    });
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      scrollToIndex(next);
      return next;
    });
  };

  return (
    <div className="postcard-film-strip">
      <motion.div
        className={`postcard-card ${isOpen ? "postcard-open" : ""}`}
        onClick={handleToggle}
        initial={false}
        animate={{ 
          opacity: 1,
          y: isOpen ? -20 : 0,
          rotate: isOpen ? -2 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="postcard-face postcard-top" />
        <div className="postcard-face postcard-bottom" />
        <div className="postcard-face postcard-left" />
        <div className="postcard-face postcard-right" />

        <div className="postcard-center">
          <div className="postcard-hint">
            <FiCamera className="postcard-icon" style={{ fontSize: '3.5rem', color: isOpen ? 'var(--teal)' : 'var(--amber)' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: isOpen ? 'var(--teal)' : 'var(--amber)' }}>
              {isOpen ? "CLOSE ARCHIVE" : "OPEN ARCHIVE"}
            </span>
            <small style={{ color: 'var(--text-main)', opacity: 0.7 }}>
              {isOpen ? "Click to pack the memory strip back inside" : "Click to pull the coastal memories from inside"}
            </small>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={`film-strip-stage ${isOpen ? "opened" : "closed"}`}
        initial={{ opacity: 0, y: -20, scale: 0.95, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 40 : -20,
          scale: isOpen ? 1 : 0.95,
          height: isOpen ? 'auto' : 0,
          marginBottom: isOpen ? 60 : 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        style={{ overflow: 'hidden' }}
      >
        <div
          ref={scrollRef}
          className="film-strip-view"
          role="group"
          aria-label="Film strip viewer"
        >
          <div className="film-strip-track">
            {filmImages.map((image, index) => (
              <motion.div 
                key={image.id} 
                className={`film-slide ${index === activeIndex ? "active" : ""}`}
                onClick={() => setSelectedImage(image)}
                onTap={() => setSelectedImage(image)}
                layoutId={`film-container-${image.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: 'pointer' }}
              >
                <motion.img 
                  src={image.src} 
                  alt={image.alt} 
                  layoutId={`film-image-${image.id}`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="film-strip-controls">
          <button className="film-btn" onClick={handlePrevious} disabled={activeIndex === 0}>
            <FiChevronLeft />
          </button>
          <div className="film-index">{String(activeIndex + 1).padStart(2, "0")} / {filmImages.length}</div>
          <button className="film-btn" onClick={handleNext} disabled={activeIndex === filmImages.length - 1}>
            <FiChevronRight />
          </button>
        </div>
      </motion.div>

      {/* LIGHTBOX / ENLARGED VIEW */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="film-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              type="button"
              className="film-lightbox-close"
              aria-label="Close analysis preview"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ×
            </button>

            <button 
              className="lightbox-nav-btn prev" 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filmImages.findIndex(img => img.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + filmImages.length) % filmImages.length;
                setSelectedImage(filmImages[prevIndex]);
              }}
            >
              <FiChevronLeft />
            </button>

            <motion.div 
              className="film-lightbox-content"
              layoutId={`film-container-${selectedImage.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                layoutId={`film-image-${selectedImage.id}`}
              />
              <motion.div 
                className="film-lightbox-caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                  {selectedImage.step}
                </div>
                <h3>{selectedImage.alt}</h3>
                <p>{selectedImage.description}</p>
                <div className="lightbox-controls-hint">
                  <span className="nav-hint">USE ARROWS TO BROWSE</span>
                  <span className="close-hint">CLICK ANYWHERE TO CLOSE</span>
                </div>
              </motion.div>
            </motion.div>

            <button 
              className="lightbox-nav-btn next" 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filmImages.findIndex(img => img.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % filmImages.length;
                setSelectedImage(filmImages[nextIndex]);
              }}
            >
              <FiChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PostcardFilmStrip;
