import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiCamera } from "react-icons/fi";

const filmImages = [
  {
    id: 1,
    src: "/analysis/annual_change_rate.png",
    alt: "Annual Shoreline Change Rate (2020-2024)",
    description: "Histogram of shoreline erosion and accretion rates across all transects."
  },
  {
    id: 2,
    src: "/analysis/shoreline_position_time.png",
    alt: "Shoreline Position Over Time (Transect 100)",
    description: "Time series plot showing shoreline position trend for a representative transect."
  },
  {
    id: 3,
    src: "/analysis/transect_rate_scatter.png",
    alt: "Transect-by-Transect Shoreline Change Rate",
    description: "Scatter view of shoreline change rates for each transect along the coast."
  },
  {
    id: 4,
    src: "/analysis/alongshore_heatmap.png",
    alt: "Alongshore Heatmap of Erosion/Accretion",
    description: "Heatmap-style visualization of alongshore erosion and accretion variability."
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
