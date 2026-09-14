import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiArrowRight, FiSun, FiMap, FiX, FiPlay } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "../components/MagneticButton";
import Coastal3D from "../components/Coastal3D";

const VIDEO_EMBED_URL = "https://drive.google.com/file/d/1S8UMPUD5OIofQhb2c-wDUCMZ201IA5Jq/preview";

function Home() {
  const titleRef = useRef();
  const taglineRef = useRef();
  const descRef = useRef();
  const buttonsRef = useRef();
  const containerRef = useRef();
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
      .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=1.5")
      .fromTo(titleRef.current, { y: -300, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "bounce.out" }, "-=1.2")
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8");
  }, []);

  // Close video on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <main className="page" ref={containerRef}>
      <Coastal3D />

      <section className="hero-container">
        <div ref={taglineRef} className="tagline-marquee">
          <div className="marquee-content">
            <span className="tagline-text"><FiSun style={{ marginRight: '8px' }} /> PRESERVING COASTAL ECOSYSTEMS</span>
            <span className="tagline-text"><FiMap style={{ marginRight: '8px' }} /> REAL-TIME NATURE MONITORING</span>
          </div>
        </div>

        <h1 ref={titleRef} className="main-title">COASTAL AI</h1>

        <p ref={descRef} className="description">
          Harnessing Intelligence to Protect Our Oceans.
          Mapping the future of coastal conservation with <b>Eco-Intelligence</b> and <b>Nature-First Analysis</b>.
        </p>

        <div ref={buttonsRef} className="btn-group">
          <MagneticButton>
            <button
              className="btn-premium-explore"
              onClick={() => setVideoOpen(true)}
            >
              <div className="btn-text-wrapper">
                <span className="btn-text-normal">Explore Project</span>
                <span className="btn-text-hover">Watch Demo</span>
              </div>
              <div className="btn-icon-wrapper">
                <FiPlay className="btn-icon-normal" />
                <FiPlay className="btn-icon-hover" />
              </div>
            </button>
          </MagneticButton>
        </div>
      </section>

      {/* 🎬 CINEMATIC VIDEO MODAL */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >

            <motion.div
              className="video-modal-container"
              initial={{ scale: 0.7, opacity: 0, y: 80 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 80 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="video-modal-header">
                <div>
                  <span className="video-modal-tag">PROJECT // COASTAL AI</span>
                  <h3 className="video-modal-title">PROJECT OVERVIEW</h3>
                </div>
                <button className="video-modal-close" onClick={() => setVideoOpen(false)}>
                  <FiX size={22} />
                </button>
              </div>

              {/* Video */}
              <div className="video-embed-wrapper">
                <iframe
                  src={VIDEO_EMBED_URL}
                  title="Coastal AI Project Video"
                  allow="autoplay"
                  allowFullScreen
                  className="video-embed-frame"
                />
              </div>

              {/* Footer bar */}
              <div className="video-modal-footer">
                <span className="vessel-id">COASTAL_AI_V1 // NATURE INTELLIGENCE</span>
                <span className="vessel-id">2024 // RESEARCH OUTPUT</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Home;