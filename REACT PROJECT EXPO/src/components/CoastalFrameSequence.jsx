import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  ChevronDown,
  Mouse,
  Layers,
  Activity,
  Sliders
} from "lucide-react";
import "./CoastalFrameSequence.css";

const TOTAL_FRAMES = 240;

const getFrameUrl = (index) => {
  const padded = String(index).padStart(6, "0");
  return `/assets/sequence/frame_${padded}.jpeg`;
};

const STORY_CHAPTERS = [
  {
    range: [0, 58],
    chapter: "CHAPTER 01 // ORBITAL INGESTION",
    title: "Sentinel-1 SAR & Optical Constellation Sync",
    desc: "Ingesting synthetic aperture radar and multi-spectral optical data from low-Earth orbit over Karnataka's coastline.",
    metric: "ALTITUDE: 693 KM · SENSOR: C-BAND SAR / MSI",
    color: "#38bdf8"
  },
  {
    range: [59, 120],
    chapter: "CHAPTER 02 // ATMOSPHERIC CALIBRATION",
    title: "Sub-Pixel Cloud Masking & Radiometric Stacking",
    desc: "Filtering atmospheric cloud interference and assembling the 9-channel tensor across Udupi's 97.2 km monitoring corridor.",
    metric: "CLOUD COVER: 0.00% · RES: 10M",
    color: "#06b6d4"
  },
  {
    range: [121, 185],
    chapter: "CHAPTER 03 // DEEPLABV3+ SHORELINE LOCK",
    title: "Automated Deep Learning Shoreline Delineation",
    desc: "Extracting instantaneous water boundaries with in-situ astronomical tidal datum correction (tan β = 0.03).",
    metric: "ACCURACY: 85.48% · 1,944 TRANSECTS",
    color: "#3b82f6"
  },
  {
    range: [186, 239],
    chapter: "CHAPTER 04 // TARGET ACQUIRED",
    title: "Coastal Kinematics & 2029 DL Projections Ready",
    desc: "Historical actual baseline (2020–2024) aligned with multi-year future deep learning erosion trajectories (2027–2029).",
    metric: "STATUS: VERIFIED // READY FOR EXPLORATION",
    color: "#10b981"
  }
];

export default function CoastalFrameSequence({ onEnterHomepage, onDirectHomepage }) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // States
  const [loadedCount, setLoadedCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Smooth frame interpolation ref
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const touchStartYRef = useRef(0);

  // 1. Preload all 240 frames progressively
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(TOTAL_FRAMES);

    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= 20 && isBuffering) {
          setIsBuffering(false);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= 20 && isBuffering) {
          setIsBuffering(false);
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Draw frame to canvas maintaining aspect ratio
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const clampedIdx = Math.min(Math.max(Math.round(frameIdx), 0), TOTAL_FRAMES - 1);
    const img = imagesRef.current[clampedIdx];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / img.naturalWidth;
      const vRatio = canvas.height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const drawWidth = img.naturalWidth * ratio;
      const drawHeight = img.naturalHeight * ratio;
      const shiftX = (canvas.width - drawWidth) / 2;
      const shiftY = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, drawWidth, drawHeight);
    }
  }, []);

  // 3. Animation loop: smoothly interpolate towards targetFrameRef (NO AUTO-PLAY, 100% USER DRIVEN)
  useEffect(() => {
    if (isBuffering) return;

    // Draw initial frame 0
    drawFrame(0);

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.28; // Responsive inertial easing
        const rounded = Math.min(Math.max(Math.round(currentFrameRef.current), 0), TOTAL_FRAMES - 1);
        setCurrentFrame(rounded);
        drawFrame(rounded);
      }
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isBuffering, drawFrame]);

  // 4. MULTI-INPUT USER SCROLL HANDLERS (Wheel, Touch, Trackpad, Keyboard)
  useEffect(() => {
    if (isBuffering) return;

    // A. Mouse Wheel & Laptop Touchpad Scroll Handler
    const handleWheel = (e) => {
      e.preventDefault();
      setHasScrolled(true);

      // Normalize delta
      const delta = e.deltaY;
      const step = delta > 0
        ? Math.max(1, Math.min(Math.abs(delta) * 0.12, 8))
        : -Math.max(1, Math.min(Math.abs(delta) * 0.12, 8));

      targetFrameRef.current = Math.min(
        Math.max(targetFrameRef.current + step, 0),
        TOTAL_FRAMES - 1
      );
    };

    // B. Mobile & Tablet Touch Swiping
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        setHasScrolled(true);
        const currentY = e.touches[0].clientY;
        const delta = touchStartYRef.current - currentY;
        touchStartYRef.current = currentY;

        const step = delta * 0.45;
        targetFrameRef.current = Math.min(
          Math.max(targetFrameRef.current + step, 0),
          TOTAL_FRAMES - 1
        );
      }
    };

    // C. Keyboard Arrow Keys & Spacebar
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setHasScrolled(true);
        targetFrameRef.current = Math.min(targetFrameRef.current + 6, TOTAL_FRAMES - 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setHasScrolled(true);
        targetFrameRef.current = Math.max(targetFrameRef.current - 6, 0);
      }
    };

    const targetEl = viewportRef.current || window;
    targetEl.addEventListener("wheel", handleWheel, { passive: false });
    targetEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    targetEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      targetEl.removeEventListener("wheel", handleWheel);
      targetEl.removeEventListener("touchstart", handleTouchStart);
      targetEl.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBuffering]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Direct Interactive Timeline Slider Drag
  const handleSliderChange = (e) => {
    setHasScrolled(true);
    const frame = parseInt(e.target.value, 10);
    targetFrameRef.current = frame;
    currentFrameRef.current = frame;
    setCurrentFrame(frame);
    drawFrame(frame);
  };

  // Active Story Chapter
  const activeChapter = STORY_CHAPTERS.find(
    (ch) => currentFrame >= ch.range[0] && currentFrame <= ch.range[1]
  ) || STORY_CHAPTERS[0];

  const progressPercent = Math.round((currentFrame / (TOTAL_FRAMES - 1)) * 100);
  const isComplete = currentFrame >= 235;

  return (
    <div
      ref={viewportRef}
      className="coastal-story-scroll-viewport"
    >
      {/* 1. Cinematic Canvas */}
      <canvas ref={canvasRef} className="story-canvas" />

      {/* 2. Initial Buffer State */}
      {isBuffering && (
        <div className="sequence-buffering-overlay">
          <div className="buffering-spinner" />
          <div className="buffering-text">
            <span>CALIBRATING SATELLITE DESCENT TELEMETRY...</span>
            <small>Buffering optical frames ({loadedCount} / {TOTAL_FRAMES})</small>
          </div>
        </div>
      )}

      {/* 3. Top HUD Bar */}
      {!isBuffering && (
        <div className="story-hud-top">
          <div className="hud-telemetry-badge">
            <div className="hud-indicator">
              <span className="hud-pulse" />
              <span>SCROLLYTELLING // USER-CONTROLLED DESCENT</span>
            </div>
            <div className="hud-coords">
              <span>TARGET: 13.3409° N, 74.7421° E · KARNATAKA COAST</span>
            </div>
          </div>

          <div className="hud-action-group">
            {/* Direct to Homepage Button */}
            <button
              type="button"
              className="hud-direct-btn"
              onClick={onDirectHomepage}
              title="Direct to Homepage"
            >
              <span>Direct to Homepage</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 4. Story Chapter Overlay Card (Dynamically updates as you scroll) */}
      {!isBuffering && !isComplete && (
        <div className="story-chapter-card-container">
          <div className="story-chapter-card" key={activeChapter.chapter}>
            <div className="chapter-badge" style={{ color: activeChapter.color, borderColor: `${activeChapter.color}66` }}>
              <Layers size={13} />
              <span>{activeChapter.chapter}</span>
            </div>
            <h3 className="chapter-title">{activeChapter.title}</h3>
            <p className="chapter-desc">{activeChapter.desc}</p>
            <div className="chapter-metric-tag">
              <Activity size={12} className="text-sky" />
              <span>{activeChapter.metric}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Scroll Prompt (Guides user to scroll or swipe) */}
      {!isBuffering && !hasScrolled && !isComplete && (
        <div className="story-scroll-prompt">
          <div className="mouse-icon-wrap">
            <Mouse size={24} className="mouse-pulse" />
            <ChevronDown size={20} className="chevron-pulse" />
          </div>
          <span className="scroll-prompt-text">SCROLL DOWN OR SWIPE TO ADVANCE STORY</span>
        </div>
      )}

      {/* 6. Interactive Bottom Story Scrubbing Bar */}
      {!isBuffering && !isComplete && (
        <div className="story-bottom-progress-bar">
          <div className="story-progress-stats">
            <span className="stats-chapter-label">{activeChapter.chapter}</span>
            <span className="stats-frame-counter">
              FRAME {String(currentFrame + 1).padStart(3, "0")} / {TOTAL_FRAMES} · {progressPercent}%
            </span>
          </div>

          {/* Interactive Scrub Track Slider */}
          <div className="story-slider-wrap">
            <input
              type="range"
              min="0"
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={handleSliderChange}
              className="story-scrub-slider"
              title="Drag to scrub story frames"
            />
          </div>
        </div>
      )}

      {/* 7. Completion Modal Overlay (Revealed at Frame 239 / End of Story) */}
      {isComplete && (
        <div className="sequence-complete-overlay">
          <div className="sequence-complete-modal">
            <div className="complete-badge">
              <ShieldCheck size={18} className="text-emerald" />
              <span>COASTAL RECONNAISSANCE COMPLETE</span>
            </div>
            <h2 className="complete-title">Karnataka Shoreline Target Acquired</h2>
            <p className="complete-desc">
              High-resolution optical frames successfully calibrated across Karnataka's 97.2 km monitored corridor.
              Historical actual observed data (2020–2024) and Deep Learning predictive models (2027–2029) are fully loaded.
            </p>

            <button
              type="button"
              className="btn-explore-coastal-ai"
              onClick={onEnterHomepage}
            >
              <Compass size={22} className="btn-icon-spin" />
              <span>Explore Coastal AI – Enter Homepage</span>
              <ArrowRight size={22} className="btn-icon-arrow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
