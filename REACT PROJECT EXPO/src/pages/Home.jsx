import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiArrowRight, FiSun, FiMap, FiX, FiPlay } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import MagneticButton from "../components/MagneticButton";
import Coastal3D from "../components/Coastal3D";

function Home() {
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const containerRef = useRef(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

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

        <h1 
          ref={titleRef} 
          className="main-title outline-text"
          style={{
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: 0.92,
            margin: '10px 0 25px 0',
            color: isDark ? '#7dd3fc' : '#38bdf8',
            background: isDark
              ? 'linear-gradient(180deg, #a5f3fc 0%, #38bdf8 50%, #0ea5e9 100%)'
              : 'linear-gradient(180deg, #67e8f9 0%, #38bdf8 45%, #0284c7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: isDark ? '2px rgba(255, 255, 255, 0.95)' : '2px #ffffff',
            filter: isDark
              ? 'drop-shadow(0 4px 25px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 40px rgba(56, 189, 248, 0.9))'
              : 'drop-shadow(0 4px 22px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.85))',
            transition: 'all 0.4s ease',
          }}
        >
          COASTAL AI
        </h1>

        <p ref={descRef} className="description">
          Harnessing Intelligence to Protect Our Oceans.
          Mapping the future of coastal conservation with <b>Eco-Intelligence</b> and <b>Nature-First Analysis</b>.
        </p>

        <div ref={buttonsRef} className="btn-group">
          <MagneticButton>
            <NavLink to="/comparison" className="btn-premium-explore comparison-home-cta">
              <div className="btn-text-wrapper">
                <span className="btn-text-normal">Historical Comparison</span>
                <span className="btn-text-hover">View Interval Results</span>
              </div>
              <div className="btn-icon-wrapper">
                <FiArrowRight className="btn-icon-normal" />
                <FiArrowRight className="btn-icon-hover" />
              </div>
            </NavLink>
          </MagneticButton>
          <MagneticButton>
            <button
              className="btn-premium-explore demo-home-cta"
              onClick={() => setVideoOpen(true)}
            >
              <div className="btn-text-wrapper">
                <span className="btn-text-normal">Watch Project Demo</span>
                <span className="btn-text-hover">Watch Team-21 Demo</span>
              </div>
              <div className="btn-icon-wrapper">
                <FiPlay className="btn-icon-normal" />
                <FiPlay className="btn-icon-hover" />
              </div>
            </button>
          </MagneticButton>
        </div>
      </section>

      {/* 🎬 CINEMATIC VIDEO MODAL (PLAYS LATEST TEAM-21 VIDEO) */}
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
                  <span className="video-modal-tag">PROJECT // TEAM-21 DEMONSTRATION</span>
                  <h3 className="video-modal-title">COASTAL EROSION DETECTION USING ML &amp; REMOTE SENSING</h3>
                </div>
                <button className="video-modal-close" onClick={() => setVideoOpen(false)} aria-label="Close video">
                  <FiX size={22} />
                </button>
              </div>

              {/* Video Player */}
              <div className="video-embed-wrapper">
                <video
                  key="team-21-video-player"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="video-embed-frame"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor: "#000",
                  }}
                >
                  <source src="/Team-21%20-%20Coastal%20Erosion%20Detection%20Using%20ML%20and%20Remote%20Sensing.mp4" type="video/mp4" />
                  <source src="/demo_video.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>
              </div>

              {/* Footer bar */}
              <div className="video-modal-footer">
                <span className="vessel-id">TEAM-21 // FINAL YEAR MAJOR PROJECT</span>
                <span className="vessel-id">RESEARCH &amp; VIDEO DEMONSTRATION</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Home;
