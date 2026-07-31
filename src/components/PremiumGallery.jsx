import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock } from "react-icons/fi";

const images = [
  { id: 1, src: "/shoreline/2020.png", alt: "Shoreline Detection 2020", title: "Shoreline Detection 2020" },
  { id: 2, src: "/shoreline/2021.png", alt: "Shoreline Detection 2021", title: "Shoreline Detection 2021" },
  { id: 3, src: "/shoreline/2022.png", alt: "Shoreline Detection 2022", title: "Shoreline Detection 2022" },
  { id: 4, src: "/shoreline/2023.png", alt: "Shoreline Detection 2023", title: "Shoreline Detection 2023" },
  { id: 5, src: "/shoreline/2024.png", alt: "Shoreline Detection 2024", title: "Shoreline Detection 2024" },
  {
    id: 6,
    src: "/shoreline/overall_analysis_new.png",
    alt: "Overall Shoreline Analysis Map",
    title: "Overall Shoreline Analysis Map"
  },
  {
    id: 7,
    src: "/shoreline/mean_position.png",
    alt: "Mean Shoreline Position per Year",
    title: "Mean Shoreline Position per Year"
  },
  {
    id: 8,
    src: "/analysis/alongshore_heatmap.png",
    alt: "Alongshore Erosion Heatmap",
    title: "Alongshore Erosion Heatmap"
  },
  {
    id: 9,
    src: "/analysis/annual_change_rate.png",
    alt: "Annual Shoreline Change Rate",
    title: "Annual Shoreline Change Rate"
  },
  {
    id: 10,
    src: "/analysis/shoreline_position_time.png",
    alt: "Shoreline Position over Time",
    title: "Shoreline Position over Time"
  },
  {
    id: 11,
    src: "/analysis/transect_rate_scatter.png",
    alt: "Transect Change Rate Scatter",
    title: "Transect Change Rate Scatter"
  },
  {
    id: 12,
    src: "/report_images/longshore_rate_profile.png",
    alt: "Longshore Erosion Rate Profile",
    title: "Longshore Erosion Rate Profile"
  },
  {
    id: 13,
    src: "/report_images/rate_distribution_density.png",
    alt: "Erosion Rate Distribution Density",
    title: "Erosion Rate Distribution Density"
  },
  {
    id: 14,
    src: "/report_images/scatter_rate_comparison.png",
    alt: "Scatter Rate Comparison",
    title: "Scatter Rate Comparison"
  },
  {
    id: 15,
    src: "/env_feature_importance.png",
    alt: "XGBoost Feature Importance Estimator",
    title: "XGBoost Feature Importance Estimator"
  },
  {
    id: 16,
    src: "/env_correlation_heatmap.png",
    alt: "Environmental Correlation Heatmap",
    title: "Environmental Correlation Heatmap"
  },
  {
    id: 17,
    src: "/env_ml_confusion_matrix_rf.png",
    alt: "Random Forest Confusion Matrix",
    title: "Random Forest Confusion Matrix"
  },
  {
    id: 18,
    src: "/env_ml_confusion_matrix_xgb.png",
    alt: "XGBoost Confusion Matrix",
    title: "XGBoost Confusion Matrix"
  },
  {
    id: 19,
    src: "/env_ml_confusion_matrix_svm.png",
    alt: "SVM Confusion Matrix",
    title: "SVM Confusion Matrix"
  },
  {
    id: 20,
    src: "/confusion-matrix.jpg",
    alt: "DeepLabV3+ Segmentation Confusion Matrix",
    title: "DeepLabV3+ Segmentation Confusion Matrix"
  },
  {
    id: 21,
    src: "/model-metrics.jpg",
    alt: "DeepLabV3+ Performance Metrics",
    title: "DeepLabV3+ Performance Metrics"
  }
];






function PremiumGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  const doorTransition = { duration: 1.5, ease: [0.76, 0, 0.24, 1] };
  const closeLightbox = () => setSelectedImage(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    document.body.classList.toggle("lightbox-open", Boolean(selectedImage));
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <div className="premium-gallery-wrapper">
      {/* 🚪 GATEWAY DOORS */}
      <motion.div 
        className="gateway-door gateway-left"
        initial={false}
        animate={{ x: isGatewayOpen ? "-100%" : "0%" }}
        transition={doorTransition}
      >
        <div className="door-content">
          <span className="door-text">VISUAL</span>
        </div>
      </motion.div>

      <motion.div 
        className="gateway-door gateway-right"
        initial={false}
        animate={{ x: isGatewayOpen ? "100%" : "0%" }}
        transition={doorTransition}
      >
        <div className="door-content">
          <span className="door-text">ARCHIVE</span>
        </div>
      </motion.div>

      {/* 🔒 UNLOCK BUTTON */}
      <AnimatePresence>
        {!isGatewayOpen && (
          <motion.div 
            className="gateway-center-lock"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <button className="btn-gateway" onClick={() => setIsGatewayOpen(true)}>
              <FiLock className="gateway-icon" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖼️ ACTUAL GALLERY CONTENT */}
      <div className="premium-gallery-container">
        <div className="gallery-header">
          <span className="tech-meta">ARCHIVE // VISUAL DATA</span>
          <h2 className="gallery-title">COASTAL ARCHIVE</h2>
          <motion.button 
            className="btn-gateway-close" 
            onClick={() => setIsGatewayOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLock className="gateway-icon" />
            <span>LOCK ARCHIVE</span>
          </motion.button>

        </div>

        <div className="premium-gallery-grid">
          {images.map((img) => (
            <motion.div
              key={img.id}
              className="gallery-card"
              layoutId={`gallery-image-${img.id}`}
              onClick={() => setSelectedImage(img)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <div className="gallery-card-inner" style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {img.src.match(/\.(mp4|webm|ogg)$/) ? (
                    <video 
                      src={img.src} 
                      className="gallery-img" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="gallery-img" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="gallery-hover-overlay">
                  <span className="gallery-card-title">{img.title}</span>
                </div>
            </motion.div>

          ))}
        </div>
      </div>

      {/* 🔍 LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <motion.div
              layoutId={`gallery-image-${selectedImage.id}`}
              className="lightbox-content pro-lightbox"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close-pro"
                aria-label="Close image preview"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
              >
                ×
              </button>

              <div className="lightbox-media-container">
                {selectedImage.src.match(/\.(mp4|webm|ogg)$/) ? (
                  <video 
                    src={selectedImage.src} 
                    className="lightbox-img" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    controls
                  />
                ) : (
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.alt} 
                    className="lightbox-img" 
                  />
                )}
              </div>
              
              <div className="lightbox-caption-pro">
                <h3>{selectedImage.title}</h3>
                <p>Detailed visualization of coastal change patterns across the monitoring period.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

export default PremiumGallery;
