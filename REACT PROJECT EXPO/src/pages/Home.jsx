import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  FiArrowRight, FiSun, FiMap, FiX, FiPlay, 
  FiChevronDown, FiShield, FiCpu, FiAward, FiLayers, FiActivity 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import MagneticButton from "../components/MagneticButton";
import Coastal3D from "../components/Coastal3D";

const VIDEO_EMBED_URL = "https://drive.google.com/file/d/1S8UMPUD5OIofQhb2c-wDUCMZ201IA5Jq/preview";

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
    tl.fromTo(containerRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" })
      .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=1.2")
      .fromTo(titleRef.current, { y: -80, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.3, ease: "bounce.out" }, "-=0.9")
      .fromTo(descRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8")
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
  }, []);

  // Close video on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const scrollToStory = () => {
    const target = document.getElementById("story-section");
    if (!target) return;
    if (window.locomotiveScroll && typeof window.locomotiveScroll.scrollTo === "function") {
      window.locomotiveScroll.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="page home-page-layout" ref={containerRef}>
      {/* 3D Dynamic Ocean Experience in Background */}
      <Coastal3D />

      {/* =====================================================================
          1. HERO SECTION (100VH)
          ===================================================================== */}
      <section className="home-hero-wrapper">
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
                <span className="btn-text-hover">Watch Demo</span>
              </div>
              <div className="btn-icon-wrapper">
                <FiPlay className="btn-icon-normal" />
                <FiPlay className="btn-icon-hover" />
              </div>
            </button>
          </MagneticButton>
        </div>

        {/* Smooth Scroll Prompt Indicator */}
        <div className="home-scroll-prompt" onClick={scrollToStory} role="button" tabIndex={0}>
          <span>The Story of Coastal AI</span>
          <FiChevronDown className="scroll-prompt-icon" />
        </div>
      </section>

      {/* =====================================================================
          2. SIMPLE STORYTELLING SECTION (3 CLEAN ACTS)
          ===================================================================== */}
      <section id="story-section" className="simple-story-section" data-scroll-section>
        <div className="story-section-header">
          <div className="story-pill-badge">
            <FiShield style={{ marginRight: '6px' }} />
            <span>01 // NARRATIVE ARCHITECTURE</span>
          </div>
          <h2 className="story-main-title">The Story Behind Coastal AI</h2>
          <p className="story-main-subtitle">
            How 97.2 km of vulnerable Karnataka coastline inspired an all-weather satellite AI monitoring system.
          </p>
        </div>

        {/* 3 Simple Story Cards */}
        <div className="simple-story-grid">
          {/* Card 1 */}
          <div className="simple-story-card">
            <div className="story-card-top">
              <span className="card-act-badge">ACT 01 // OBSERVATION</span>
              <h3 className="card-story-title">A Dynamic Coast Under Threat</h3>
              <p className="card-story-body">
                The Udupi coastline faces relentless Arabian Sea monsoon swell and dynamic sediment shifts. Critical spit formations and fishing settlements retreat silently without automated continuous tracking.
              </p>
              <div className="card-story-metric">
                <FiActivity style={{ flexShrink: 0 }} />
                <span>Up to -24.0 m hotspot retreat at Bengre Sandspit</span>
              </div>
            </div>
            <NavLink to="/comparison" className="card-action-link">
              <span>Explore Shoreline Comparison</span>
              <FiArrowRight />
            </NavLink>
          </div>

          {/* Card 2 */}
          <div className="simple-story-card">
            <div className="story-card-top">
              <span className="card-act-badge">ACT 02 // INTELLIGENCE</span>
              <h3 className="card-story-title">Penetrating Monsoon Clouds</h3>
              <p className="card-story-body">
                Standard optical satellites are blinded by dense monsoon clouds for four months each year. We fused cloud-penetrating Sentinel-1 SAR with Sentinel-2 optical bands into a 9-channel AI tensor.
              </p>
              <div className="card-story-metric">
                <FiCpu style={{ flexShrink: 0 }} />
                <span>85.48% Validation Dice Score (DeepLabV3+)</span>
              </div>
            </div>
            <NavLink to="/evidence-lab" className="card-action-link">
              <span>Inspect Research & Evidence Lab</span>
              <FiArrowRight />
            </NavLink>
          </div>

          {/* Card 3 */}
          <div className="simple-story-card">
            <div className="story-card-top">
              <span className="card-act-badge">ACT 03 // PREPAREDNESS</span>
              <h3 className="card-story-title">Forecasting Future Vulnerability</h3>
              <p className="card-story-body">
                Moving beyond historical recording, Coastal AI computes End Point Rates (EPR) across 1,944 baseline transects and models future risk with XGBoost, projecting vulnerable areas before land is lost.
              </p>
              <div className="card-story-metric">
                <FiLayers style={{ flexShrink: 0 }} />
                <span>7.88 Hectares projected land loss by 2029</span>
              </div>
            </div>
            <NavLink to="/dashboard" className="card-action-link">
              <span>Launch Live GIS Dashboard</span>
              <FiArrowRight />
            </NavLink>
          </div>
        </div>

        {/* Simple Story Console & Viva Links */}
        <div className="simple-story-console">
          <div className="console-left">
            <span className="console-left-tag">TECHNICAL EVALUATION & DEFENSE</span>
            <h4 className="console-left-title">Experience the Complete Scientific Pipeline</h4>
            <p className="console-left-desc">
              Watch the complete project demonstration video or launch into the interactive evidence portals for the final presentation.
            </p>
          </div>
          <div className="console-actions">
            <button className="btn-console-demo" onClick={() => setVideoOpen(true)}>
              <FiPlay style={{ marginRight: "4px" }} />
              <span>Watch Latest Demo Video</span>
            </button>
            <NavLink to="/evidence-lab" className="btn-console-pill">
              <FiAward style={{ marginRight: "4px" }} />
              <span>Evidence Lab (Viva Mode)</span>
            </NavLink>
            <NavLink to="/methodology" className="btn-console-pill">
              <FiCpu style={{ marginRight: "4px" }} />
              <span>Methodology</span>
            </NavLink>
            <NavLink to="/synopsis" className="btn-console-pill">
              <FiLayers style={{ marginRight: "4px" }} />
              <span>Synopsis</span>
            </NavLink>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CINEMATIC VIDEO MODAL (PLAYS LATEST TEAM-21 VIDEO)
          ===================================================================== */}
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
                  <h3 className="video-modal-title">COASTAL EROSION DETECTION USING ML & REMOTE SENSING</h3>
                </div>
                <button className="video-modal-close" onClick={() => setVideoOpen(false)}>
                  <FiX size={22} />
                </button>
              </div>

              {/* Video Player */}
              <div className="video-embed-wrapper">
                <video
                  src="/demo_video.mp4"
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
                  <source src="/demo_video.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>
              </div>

              {/* Footer bar */}
              <div className="video-modal-footer">
                <span className="vessel-id">TEAM-21 // FINAL YEAR MAJOR PROJECT</span>
                <a 
                  href={VIDEO_EMBED_URL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="vessel-id" 
                  style={{ textDecoration: 'none', color: '#38bdf8' }}
                >
                  ↗ External Mirror
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Home;
