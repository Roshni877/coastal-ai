import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  FiArrowRight, FiSun, FiMap, FiPlay, FiMaximize2, FiVolume2, FiVolumeX, 
  FiLayers, FiActivity, FiShield, FiTrendingDown, FiEye, FiSliders, FiCpu, 
  FiCompass, FiCheckCircle, FiChevronDown, FiClock, FiTarget, 
  FiDatabase, FiAward, FiAlertTriangle 
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import MagneticButton from "../components/MagneticButton";
import Coastal3D from "../components/Coastal3D";

const VIDEO_EMBED_URL = "https://drive.google.com/file/d/1S8UMPUD5OIofQhb2c-wDUCMZ201IA5Jq/preview";

export default function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const videoRef = useRef(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [sarView, setSarView] = useState("sar"); // "optical" or "sar"
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);

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
    tl.fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" })
      .fromTo(titleRef.current, { y: -50, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "-=0.8")
      .fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8")
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        videoRef.current.play().then(() => setVideoPlaying(true)).catch(() => {});
      }
    }
  };

  const handleVideoFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleVideoMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted;
      setVideoMuted(!videoMuted);
    }
  };

  const jumpToVideoChapter = (timeInSec, index) => {
    setActiveVideoChapter(index);
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSec;
      videoRef.current.play().then(() => setVideoPlaying(true)).catch(() => {});
    }
  };

  const storyChapters = [
    {
      id: 0,
      act: "ACT 01",
      title: "The Invisible Retreat",
      subtitle: "Karnataka's Coastline Under Rapid Climate Siege",
      summary: "While coastlines appear static from orbit, extreme wave energy and sea level rise are clawing away up to -24.0 meters of beach along critical sandspits in Udupi.",
      highlight: "-24.0m Peak Retreat",
      color: "#f43f5e",
    },
    {
      id: 1,
      act: "ACT 02",
      title: "The Monsoon Blindspot",
      subtitle: "Why Traditional Satellites & Ground Surveys Fail",
      summary: "80% of coastal erosion strikes during the Southwest Monsoon (June–Sept), but persistent 90%+ cloud cover blinds conventional optical satellites exactly when monitoring is most urgent.",
      highlight: "4 Months Blinded by Clouds",
      color: "#eab308",
    },
    {
      id: 2,
      act: "ACT 03",
      title: "The Multi-Sensor AI Solution",
      subtitle: "All-Weather Radar + 10m Multi-Spectral + DeepLabV3+",
      summary: "Coastal AI fuses cloud-penetrating Sentinel-1 SAR radar with 10-meter Sentinel-2 multi-spectral optics and DeepLabV3+ with ResNet-34 to achieve an 85.48% Dice score across 1,944 transects.",
      highlight: "85.48% Validation Dice",
      color: "#10b981",
    }
  ];

  const videoChapters = [
    { title: "Orbital Ingestion & Cloud Piercing", time: 0, label: "00:00", desc: "Dual-satellite Sentinel-1/2 data alignment" },
    { title: "DeepLabV3+ Neural Architecture", time: 75, label: "01:15", desc: "ASPP multi-scale receptive field segmentation" },
    { title: "1,944 Transects & EPR Rates", time: 150, label: "02:30", desc: "Digital Shoreline Analysis System calculations" },
    { title: "2029 Future Hazard Projections", time: 225, label: "03:45", desc: "Downstream XGBoost risk classification (84.8%)" },
  ];

  return (
    <div className="home-super-wrapper" ref={containerRef}>
      {/* Fixed 3D Ocean Waves in Ambient Canvas */}
      <Coastal3D />

      {/* =========================================================================
          HERO SECTION (SEAMLESS CONTINUITY FROM 3D EARTH GLOBE ZOOM)
          ========================================================================= */}
      <section className="home-hero-landing">
        <div className="hero-content-bounds">
          {/* Orbital Insertion Confirmation Badge */}
          <div className="orbital-descent-badge">
            <span className="orbital-pulse-dot"></span>
            <span className="orbital-badge-text">
              ORBITAL INSERTION CONFIRMED // UDUPI COAST, KARNATAKA (13.34° N, 74.74° E)
            </span>
          </div>

          <div ref={taglineRef} className="tagline-marquee" style={{ margin: "16px 0 10px 0" }}>
            <div className="marquee-content">
              <span className="tagline-text"><FiSun style={{ marginRight: '8px' }} /> PRESERVING COASTAL ECOSYSTEMS</span>
              <span className="tagline-text"><FiMap style={{ marginRight: '8px' }} /> REAL-TIME SATELLITE MONITORING</span>
              <span className="tagline-text"><FiShield style={{ marginRight: '8px' }} /> 1,944 DIGITAL KINEMATIC TRANSECTS</span>
            </div>
          </div>

          <h1 
            ref={titleRef} 
            className="home-brand-title"
            style={{
              color: isDark ? '#7dd3fc' : '#0284c7',
              background: isDark
                ? 'linear-gradient(180deg, #a5f3fc 0%, #38bdf8 50%, #0ea5e9 100%)'
                : 'linear-gradient(180deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            COASTAL AI
          </h1>

          <p ref={descRef} className="home-brand-description">
            Autonomous Coastal Erosion Detection & Multi-Temporal Shoreline Kinematics powered by 
            <b> Dual-Satellite SAR Radar</b>, <b>10m Multi-Spectral Optics</b>, and <b>DeepLabV3+ Semantic Segmentation</b>.
          </p>

          {/* Rapid Quantitative Telemetry Badges */}
          <div className="home-telemetry-strip">
            <div className="telemetry-pill">
              <span className="telemetry-val">97.2 km</span>
              <span className="telemetry-lbl">Study Span</span>
            </div>
            <div className="telemetry-pill">
              <span className="telemetry-val">1,944</span>
              <span className="telemetry-lbl">EPR Transects</span>
            </div>
            <div className="telemetry-pill highlight-pill">
              <span className="telemetry-val">85.48%</span>
              <span className="telemetry-lbl">Validation Dice</span>
            </div>
            <div className="telemetry-pill danger-pill">
              <span className="telemetry-val">-24.0 m</span>
              <span className="telemetry-lbl">Max Retreat</span>
            </div>
            <div className="telemetry-pill">
              <span className="telemetry-val">2020–2029</span>
              <span className="telemetry-lbl">Temporal Scope</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div ref={buttonsRef} className="home-cta-actions">
            <MagneticButton>
              <button 
                onClick={() => scrollToSection("scrollytelling-section")}
                className="btn-story-launch"
              >
                <span>Uncover the Story</span>
                <FiChevronDown style={{ marginLeft: "8px", fontSize: "1.2rem" }} />
              </button>
            </MagneticButton>

            <MagneticButton>
              <button 
                onClick={() => scrollToSection("demo-video-section")}
                className="btn-video-launch"
              >
                <FiPlay style={{ marginRight: "8px" }} />
                <span>Watch Project Demo</span>
              </button>
            </MagneticButton>

            <MagneticButton>
              <NavLink to="/evidence-lab" className="btn-evidence-lab-shortcut">
                <FiEye style={{ marginRight: "8px" }} />
                <span>Research & Evidence Lab</span>
              </NavLink>
            </MagneticButton>
          </div>

          {/* Pulsing Downward Indicator */}
          <div className="scroll-invitation" onClick={() => scrollToSection("scrollytelling-section")}>
            <span className="scroll-hint-text">EXPLORE THE RESEARCH JOURNEY</span>
            <div className="scroll-chevron-bounce">
              <FiChevronDown />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ORBITAL TRANSITION BAR: FROM SPACE TO THE KARNATAKA COAST
          ========================================================================= */}
      <section className="orbital-transition-banner">
        <div className="transition-banner-inner">
          <div className="transition-loc-info">
            <span className="loc-label">TARGET STUDY REGION</span>
            <h3 className="loc-title">Udupi Littoral Corridor, Karnataka, India</h3>
            <p className="loc-sub">
              Coordinates: 13.08° N – 13.88° N, 74.68° E – 74.85° E // Arabian Sea High-Energy Littoral Zone
            </p>
          </div>
          <div className="transition-specs-grid">
            <div className="spec-box">
              <span className="spec-num">97.2 KM</span>
              <span className="spec-name">Coastline Length</span>
            </div>
            <div className="spec-box">
              <span className="spec-num">50 METERS</span>
              <span className="spec-name">Transect Spacing</span>
            </div>
            <div className="spec-box">
              <span className="spec-num">9 CHANNELS</span>
              <span className="spec-name">SAR + MSI Fusion</span>
            </div>
            <div className="spec-box">
              <span className="spec-num">10 METERS</span>
              <span className="spec-name">Ground Resolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCROLLYTELLING: THE SHORELINE CRISIS & WHAT PROBLEM WE ARE SOLVING
          ========================================================================= */}
      <section id="scrollytelling-section" className="scrollytelling-section">
        <div className="section-header-centered">
          <span className="cyber-section-tag">
            <FiActivity style={{ marginRight: "6px" }} />
            THE PROBLEM WE ARE SOLVING // A STORY IN THREE ACTS
          </span>
          <h2 className="section-main-heading">
            From Vanishing Sands to Satellite Intelligence
          </h2>
          <p className="section-lead-paragraph">
            Understanding why Karnataka's shoreline is retreating, why traditional monitoring collapses during monsoons, and how deep learning solves the puzzle.
          </p>
        </div>

        {/* Chapter Stepper Buttons */}
        <div className="scrollytelling-nav-pills">
          {storyChapters.map((ch, idx) => (
            <button
              key={ch.id}
              className={`story-chapter-pill ${activeChapter === idx ? "active" : ""}`}
              onClick={() => setActiveChapter(idx)}
              style={{
                borderColor: activeChapter === idx ? ch.color : "rgba(255, 255, 255, 0.15)",
                backgroundColor: activeChapter === idx 
                  ? (isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.95)") 
                  : "transparent",
              }}
            >
              <div className="pill-act-badge" style={{ backgroundColor: ch.color }}>{ch.act}</div>
              <div className="pill-text-group">
                <span className="pill-title">{ch.title}</span>
                <span className="pill-highlight" style={{ color: ch.color }}>{ch.highlight}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Chapter Content Viewer */}
        <div className="chapter-display-card">
          {/* ACT 1: THE INVISIBLE RETREAT */}
          {activeChapter === 0 && (
            <div className="chapter-content-grid">
              <div className="chapter-narrative-col">
                <div className="chapter-badge-act" style={{ color: "#f43f5e" }}>ACT 01 // THE CRISIS</div>
                <h3 className="chapter-heading">The Arabian Sea is Swallowing Land at -24.0m Per Epoch</h3>
                <p className="chapter-body-text">
                  Karnataka’s 97.2 km coastline is home to bustling fishing harbors (Malpe, Gangolli), National Highway 66, and dense coastal communities. Under intensifying Arabian Sea cyclones and seasonal monsoon swells, the shore is experiencing acute, irreversible retreat.
                </p>

                <div className="crisis-stats-list">
                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>
                      <FiTrendingDown size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">-24.0 Meters Maximum Retreat</h4>
                      <p className="stat-desc">Recorded at Bengre Sandspit, threatening to breach the estuarine barrier separating the Gurupura-Mulki rivers from the open ocean.</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>
                      <FiAlertTriangle size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">7.65 km Severe Erosion Zones</h4>
                      <p className="stat-desc">Over 7.65 km of the 97.2 km coastline exceeds -2.0 m/year End Point Rate (EPR), requiring urgent structural armoring and policy zoning.</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>
                      <FiShield size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">7.88 Hectares Projected Land Loss</h4>
                      <p className="stat-desc">Linear kinematic extrapolation projects a cumulative 7.88 ha of prime beach and dune territory lost permanently to the sea by 2029.</p>
                    </div>
                  </div>
                </div>

                <div className="chapter-takeaway-box">
                  <b>Core Research Problem:</b> Without high-precision continuous shoreline tracking, coastal defense works (groynes, seawalls) are built reactively rather than proactively.
                </div>
              </div>

              {/* Interactive Before/After Split Viewer */}
              <div className="chapter-visual-col">
                <div className="visual-panel-card">
                  <div className="visual-panel-header">
                    <span>INTERACTIVE EVIDENCE // BENGRE SANDSPIT RETREAT</span>
                    <span className="live-tag">2020 VS 2024</span>
                  </div>

                  <div className="split-slider-wrapper">
                    <div className="split-image-container" onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                      setSliderPos((x / rect.width) * 100);
                    }}>
                      {/* Base Image: 2024 Observed with Erosion Overlay */}
                      <img 
                        src="/scrollytelling/bengre_erosion_overlay.png" 
                        alt="2024 Shoreline Retreat" 
                        className="split-img-layer"
                      />

                      {/* Top Clipped Image: 2020 Baseline Satellite Image */}
                      <div 
                        className="split-img-overlay"
                        style={{ width: `${sliderPos}%` }}
                      >
                        <img 
                          src="/training_samples/sample1_input.png" 
                          alt="2020 Baseline Satellite Image" 
                          className="split-img-layer"
                        />
                        <div className="split-badge-tag left-tag">2020 BASELINE</div>
                      </div>

                      <div className="split-badge-tag right-tag">2024 ERODED</div>

                      {/* Draggable Divider Line */}
                      <div className="split-divider-line" style={{ left: `${sliderPos}%` }}>
                        <div className="split-divider-handle">
                          <FiSliders />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="visual-caption-bar">
                    <span>Drag or hover across the satellite tile to inspect shoreline recession at Bengre Sandspit.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 2: THE MONSOON BLINDSPOT */}
          {activeChapter === 1 && (
            <div className="chapter-content-grid">
              <div className="chapter-narrative-col">
                <div className="chapter-badge-act" style={{ color: "#eab308" }}>ACT 02 // THE OBSTACLE</div>
                <h3 className="chapter-heading">The Paradox: Monitoring Fails Exactly When Waves Strike</h3>
                <p className="chapter-body-text">
                  Coastal erosion is not evenly distributed across the year. Over <b>80% of all shoreline retreat occurs during the 4 months of the Southwest Monsoon</b> (June through September), when wave heights exceed 3.5 meters and storm surges batter the coast.
                </p>

                <div className="crisis-stats-list">
                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                      <FiEye size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">90%+ Cloud Cover Blinds Optical Satellites</h4>
                      <p className="stat-desc">Standard optical satellites (Landsat, standard Sentinel-2 RGB) cannot pierce through dense monsoon cloud decks, creating a 120-day complete data blackout every single year.</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                      <FiAlertTriangle size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">Manual Field Surveys are Physically Impossible</h4>
                      <p className="stat-desc">Walking turbulent surf zones with manual GPS theodolites during monsoonal storm surges is dangerous, prohibitive in cost, and covers only a few isolated meters.</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                      <FiClock size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">Tidal Waterline Ambiguity</h4>
                      <p className="stat-desc">A 1.5-meter tidal oscillation on a low-gradient beach shifts the instantaneous waterline by up to 35 meters horizontally, masquerading as false erosion unless corrected.</p>
                    </div>
                  </div>
                </div>

                <div className="chapter-takeaway-box" style={{ borderLeftColor: "#eab308" }}>
                  <b>The Monitoring Gap:</b> How do you defend a 97.2 km coastline when your satellite eyes are blinded by storm clouds during the exact season when erosion occurs?
                </div>
              </div>

              {/* Interactive Optical Cloud vs SAR Piercing Toggle */}
              <div className="chapter-visual-col">
                <div className="visual-panel-card">
                  <div className="visual-panel-header">
                    <span>SENSOR COMPARISON // CLOUD BLINDSPOT VS RADAR PENETRATION</span>
                    <div className="view-toggle-btns">
                      <button 
                        className={`toggle-sub-btn ${sarView === "optical" ? "active" : ""}`}
                        onClick={() => setSarView("optical")}
                      >
                        Optical (Clouded)
                      </button>
                      <button 
                        className={`toggle-sub-btn ${sarView === "sar" ? "active" : ""}`}
                        onClick={() => setSarView("sar")}
                      >
                        Sentinel-1 SAR Radar
                      </button>
                    </div>
                  </div>

                  <div className="sensor-compare-display">
                    {sarView === "optical" ? (
                      <div className="sensor-view-wrapper">
                        <img 
                          src="/scrollytelling/optical_cloud_monsoon.png" 
                          alt="Optical Satellites Obscured by Monsoon Clouds" 
                          className="sensor-display-img"
                        />
                        <div className="sensor-status-overlay error-state">
                          <FiAlertTriangle />
                          <span>OPTICAL BAND FAILURE: 92% MONSOON CLOUD COVER BLINDS SHORELINE</span>
                        </div>
                      </div>
                    ) : (
                      <div className="sensor-view-wrapper">
                        <img 
                          src="/satellite_bands/s1_sar_composite.png" 
                          alt="Sentinel-1 C-Band SAR Penetrates Clouds" 
                          className="sensor-display-img"
                        />
                        <div className="sensor-status-overlay success-state">
                          <FiCheckCircle />
                          <span>SENTINEL-1 C-BAND SAR ACTIVE: 100% ALL-WEATHER CLOUD PIERCING (VV+VH)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="visual-caption-bar">
                    <span>
                      {sarView === "optical" 
                        ? "Conventional optical sensors see only white cloud tops during monsoon months." 
                        : "Active 5.405 GHz microwave pulses penetrate rain and clouds, measuring dielectric roughness of water vs land."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 3: THE MULTI-SENSOR AI SOLUTION */}
          {activeChapter === 2 && (
            <div className="chapter-content-grid">
              <div className="chapter-narrative-col">
                <div className="chapter-badge-act" style={{ color: "#10b981" }}>ACT 03 // THE BREAKTHROUGH</div>
                <h3 className="chapter-heading">Dual-Satellite Fusion + DeepLabV3+ Neural Segmentation</h3>
                <p className="chapter-body-text">
                  Coastal AI overcomes both the cloud blindspot and manual survey limitations by fusing <b>Sentinel-1 SAR radar</b> (VV, VH) with <b>Sentinel-2 optical</b> (B2, B3, B4, B8, B8A, B11, B12) into a unified <b>9-channel geospatial tensor</b>.
                </p>

                <div className="crisis-stats-list">
                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                      <FiLayers size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">9-Channel Multi-Sensor Tensor</h4>
                      <p className="stat-desc">Pairs microwave dielectric roughness from SAR with Green and NIR spectral indices (NDWI) for sub-pixel boundary discrimination.</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                      <FiCpu size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">DeepLabV3+ with ResNet-34 & ASPP</h4>
                      <p className="stat-desc">Atrous Spatial Pyramid Pooling (dilation rates 6, 12, 18) provides multi-scale contextual awareness, eliminating the spatial coordinate blindness of Random Forest (54%) and SVM (38%).</p>
                    </div>
                  </div>

                  <div className="crisis-stat-item">
                    <div className="stat-circle" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                      <FiTarget size={22} />
                    </div>
                    <div>
                      <h4 className="stat-title">85.48% Validation Dice Score</h4>
                      <p className="stat-desc">Achieved with a combined Binary Cross Entropy (BCE) + Dice loss decaying to 0.4304 across 1,944 orthogonal transects spaced 50m apart.</p>
                    </div>
                  </div>
                </div>

                <div className="chapter-takeaway-box" style={{ borderLeftColor: "#10b981" }}>
                  <b>The Proven Result:</b> Continuous, automated, all-season shoreline mapping with sub-pixel precision across 97.2 km of coastline.
                </div>
              </div>

              {/* 3-Stage Visual Pipeline: Input -> GT -> DeepLabV3+ */}
              <div className="chapter-visual-col">
                <div className="visual-panel-card">
                  <div className="visual-panel-header">
                    <span>AI SEGMENTATION PIPELINE // PADUBIDRI SURF ZONE</span>
                    <span className="live-tag" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>85.48% ACCURACY</span>
                  </div>

                  <div className="ai-pipeline-triad">
                    <div className="triad-step">
                      <span className="step-tag">1. 9-CH INPUT</span>
                      <img src="/training_samples/sample3_input.png" alt="Raw Satellite Input" className="triad-img" />
                      <span className="step-desc">Fused SAR + MSI</span>
                    </div>

                    <div className="triad-arrow">→</div>

                    <div className="triad-step">
                      <span className="step-tag">2. GROUND TRUTH</span>
                      <img src="/training_samples/sample3_gt.png" alt="Ground Truth Mask" className="triad-img" />
                      <span className="step-desc">Validated Mask</span>
                    </div>

                    <div className="triad-arrow">→</div>

                    <div className="triad-step highlight-step">
                      <span className="step-tag">3. DEEPLABV3+</span>
                      <img src="/training_samples/sample3_pred.png" alt="DeepLabV3+ Output" className="triad-img" />
                      <span className="step-desc">Predicted Shoreline</span>
                    </div>
                  </div>

                  <div className="visual-caption-bar">
                    <span>Raw satellite tensor is mapped through deep atrous convolutions into crisp binary water/land delineations.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SMART METHODOLOGY & CORE SYSTEM LINKAGE
          ========================================================================= */}
      <section id="methodology-section" className="home-methodology-section">
        <div className="section-header-centered">
          <span className="cyber-section-tag">
            <FiCompass style={{ marginRight: "6px" }} />
            SYSTEM ARCHITECTURE // SMART PROJECT LINKAGE
          </span>
          <h2 className="section-main-heading">
            Explore the Core Dimensions of Coastal AI
          </h2>
          <p className="section-lead-paragraph">
            Navigate directly from the scientific story into the research evidence, computational pipeline, historical comparisons, and geospatial decision support.
          </p>
        </div>

        <div className="smart-architecture-grid">
          {/* Card 1: Research & Evidence Lab */}
          <div className="smart-arch-card">
            <div className="smart-card-top">
              <div className="smart-card-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
                <FiDatabase size={24} />
              </div>
              <span className="smart-card-badge">VIVA DEFENSE HUB</span>
            </div>
            <h3 className="smart-card-title">Research & Evidence Lab</h3>
            <p className="smart-card-desc">
              Inspect the raw 7 Sentinel-2 bands, 4 SAR products, 8-stage NDWI pipeline, 4 real training patch triads, and full viva presentation mode with 10 structured defense slides.
            </p>
            <div className="smart-card-meta">
              <span>9 Spectral Bands</span> • <span>10 Viva Slides</span> • <span>Loss: 0.4304</span>
            </div>
            <NavLink to="/evidence-lab" className="smart-card-action-btn">
              <span>Enter Evidence Lab</span>
              <FiArrowRight />
            </NavLink>
          </div>

          {/* Card 2: Interactive Methodology */}
          <div className="smart-arch-card">
            <div className="smart-card-top">
              <div className="smart-card-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <FiCpu size={24} />
              </div>
              <span className="smart-card-badge">COMPUTATIONAL FLOW</span>
            </div>
            <h3 className="smart-card-title">Mathematical Methodology</h3>
            <p className="smart-card-desc">
              Step through the full engineering pipeline: Google Earth Engine cloud masking, tidal datum normalization, Otsu thresholding, and ResNet-34 atrous convolutional layers.
            </p>
            <div className="smart-card-meta">
              <span>GEE Ingestion</span> • <span>Tidal Correction</span> • <span>ResNet-34</span>
            </div>
            <NavLink to="/methodology" className="smart-card-action-btn">
              <span>Explore Methodology</span>
              <FiArrowRight />
            </NavLink>
          </div>

          {/* Card 3: Multi-Temporal Comparison */}
          <div className="smart-arch-card">
            <div className="smart-card-top">
              <div className="smart-card-icon" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                <FiSliders size={24} />
              </div>
              <span className="smart-card-badge">KINEMATICS</span>
            </div>
            <h3 className="smart-card-title">Shoreline Comparison</h3>
            <p className="smart-card-desc">
              Examine the historical 2020 vs 2024 observed coastline changes across 1,944 orthogonal transects. Calculate End Point Rate (EPR) and inspect longshore rate distributions.
            </p>
            <div className="smart-card-meta">
              <span>1,944 Transects</span> • <span>50m Spacing</span> • <span>DSAS Protocol</span>
            </div>
            <NavLink to="/comparison" className="smart-card-action-btn">
              <span>View Comparison</span>
              <FiArrowRight />
            </NavLink>
          </div>

          {/* Card 4: Geospatial Dashboard */}
          <div className="smart-arch-card">
            <div className="smart-card-top">
              <div className="smart-card-icon" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#ec4899" }}>
                <FiMap size={24} />
              </div>
              <span className="smart-card-badge">LIVE WEBGIS</span>
            </div>
            <h3 className="smart-card-title">Geospatial Risk Dashboard</h3>
            <p className="smart-card-desc">
              Interactive WebGIS mapping platform showing shoreline shapefiles, erosion risk heatmaps, transect popups, and downstream XGBoost hazard classification (84.8% accuracy).
            </p>
            <div className="smart-card-meta">
              <span>84.8% Accuracy</span> • <span>2025–2029 Forecast</span> • <span>GIS Layers</span>
            </div>
            <NavLink to="/dashboard" className="smart-card-action-btn">
              <span>Open GIS Dashboard</span>
              <FiArrowRight />
            </NavLink>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED CINEMATIC PROJECT DEMO VIDEO SHOWCASE
          ========================================================================= */}
      <section id="demo-video-section" className="home-demo-video-section">
        <div className="section-header-centered">
          <span className="cyber-section-tag">
            <FiPlay style={{ marginRight: "6px" }} />
            CINEMATIC PROJECT SHOWCASE // COMPLETE SYSTEM DEMO
          </span>
          <h2 className="section-main-heading">
            Live Platform Demonstration & Viva Presentation Walkthrough
          </h2>
          <p className="section-lead-paragraph">
            Watch the complete end-to-end system walkthrough: satellite data ingestion, cloud-piercing radar, DeepLabV3+ segmentation, transect calculation, and future 2029 risk forecasting.
          </p>
        </div>

        {/* High-Tech Video Console */}
        <div className="cinematic-video-console">
          <div className="console-top-telemetry">
            <div className="console-status-group">
              <span className="console-dot-live"></span>
              <span className="console-label">SYSTEM DEMO RECORDING</span>
              <span className="console-badge">1080P HD // 60 FPS</span>
            </div>
            <div className="console-title-text">
              COASTAL_AI_V1 // UDUPI STUDY CORRIDOR (97.2 KM)
            </div>
            <div className="console-controls-quick">
              <button 
                onClick={handleVideoMuteToggle}
                className="console-tool-btn"
                title={videoMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {videoMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>
              <button 
                onClick={handleVideoFullscreen}
                className="console-tool-btn"
                title="Fullscreen Mode"
              >
                <FiMaximize2 size={18} />
              </button>
            </div>
          </div>

          {/* Video Player Display */}
          <div className="video-player-frame">
            {!videoError ? (
              <video
                ref={videoRef}
                src="/demo_video.mp4"
                controls
                playsInline
                className="native-demo-video"
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onError={() => setVideoError(true)}
              >
                <source src="/demo_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={VIDEO_EMBED_URL}
                title="Coastal AI Project Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="iframe-demo-video"
              />
            )}

            {/* Overlay Play Button if Video Paused */}
            {!videoPlaying && !videoError && (
              <div className="video-hero-play-overlay" onClick={handleVideoPlayPause}>
                <div className="play-circle-glow">
                  <FiPlay size={36} style={{ marginLeft: "4px" }} />
                </div>
                <span className="play-overlay-text">CLICK TO PLAY SYSTEM DEMONSTRATION</span>
              </div>
            )}
          </div>

          {/* Interactive Chapter Timestamp Navigation */}
          <div className="console-chapters-bar">
            <div className="chapters-label">
              <FiClock style={{ marginRight: "6px" }} />
              <span>CHAPTER JUMP:</span>
            </div>
            <div className="chapter-buttons-track">
              {videoChapters.map((vc, i) => (
                <button
                  key={i}
                  className={`video-ch-pill ${activeVideoChapter === i ? "active" : ""}`}
                  onClick={() => jumpToVideoChapter(vc.time, i)}
                >
                  <span className="ch-time">{vc.label}</span>
                  <span className="ch-title">{vc.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Takeaways Bar */}
          <div className="console-summary-footer">
            <div className="summary-col">
              <span className="sum-label">NEURAL BACKBONE</span>
              <span className="sum-val">DeepLabV3+ with ResNet-34</span>
            </div>
            <div className="summary-col">
              <span className="sum-label">SEGMENTATION SCORE</span>
              <span className="sum-val">85.48% Validation Dice</span>
            </div>
            <div className="summary-col">
              <span className="sum-label">HAZARD PREDICTOR</span>
              <span className="sum-val">XGBoost (84.8% Accuracy)</span>
            </div>
            <div className="summary-col">
              <span className="sum-label">CUMULATIVE 2029 LOSS</span>
              <span className="sum-val">7.88 Hectares Projected</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK LAUNCHPAD & VIVA READY FOOTER
          ========================================================================= */}
      <section className="home-quick-launchpad">
        <div className="launchpad-inner">
          <div className="launchpad-header">
            <h3>Ready for the Viva Defense?</h3>
            <p>Direct shortcuts to every technical section and evaluation artifact.</p>
          </div>
          <div className="launchpad-pills-row">
            <NavLink to="/evidence-lab" className="launch-pill">
              <FiAward style={{ marginRight: "6px" }} />
              <span>Evidence Lab (Viva Mode)</span>
            </NavLink>
            <NavLink to="/methodology" className="launch-pill">
              <FiCpu style={{ marginRight: "6px" }} />
              <span>Methodology Architecture</span>
            </NavLink>
            <NavLink to="/dashboard" className="launch-pill">
              <FiMap style={{ marginRight: "6px" }} />
              <span>Live GIS Dashboard</span>
            </NavLink>
            <NavLink to="/comparison" className="launch-pill">
              <FiSliders style={{ marginRight: "6px" }} />
              <span>Shoreline Comparison</span>
            </NavLink>
            <NavLink to="/dataset" className="launch-pill">
              <FiDatabase style={{ marginRight: "6px" }} />
              <span>Datasets & Algorithms</span>
            </NavLink>
            <NavLink to="/synopsis" className="launch-pill">
              <FiLayers style={{ marginRight: "6px" }} />
              <span>Project Synopsis & Report</span>
            </NavLink>
            <NavLink to="/team" className="launch-pill">
              <FiSun style={{ marginRight: "6px" }} />
              <span>Project Team</span>
            </NavLink>
          </div>

          <div className="launchpad-citation-box">
            <div className="citation-text">
              <b>Coastal Erosion Detection and Analysis using Machine Learning and Remote Sensing</b><br />
              Department of Computer Science & Engineering // Final Year Major Project // Study Area: Udupi Coast, Karnataka, India
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
