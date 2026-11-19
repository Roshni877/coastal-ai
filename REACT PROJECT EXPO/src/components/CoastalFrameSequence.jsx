import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";
import "./CoastalFrameSequence.css";

const TOTAL_FRAMES = 240;
const FPS = 25; // Smooth 25 frames per second (~9.6s sequence)
const FRAME_DURATION = 1000 / FPS;

const getFrameUrl = (index) => {
  const padded = String(index).padStart(6, "0");
  return `/assets/sequence/frame_${padded}.jpeg`;
};

export default function CoastalFrameSequence({ onEnterHomepage, onDirectHomepage }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // Preload frames progressively
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
        // Start playback once the initial buffer (first 25 frames or 10%) is ready
        if (loaded >= 25 && isBuffering) {
          setIsBuffering(false);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= 25 && isBuffering) {
          setIsBuffering(false);
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas render and animation loop
  useEffect(() => {
    if (isBuffering) return;

    let animId;
    let lastTime = performance.now();
    let frameIdx = 0;

    const render = (now) => {
      const delta = now - lastTime;

      if (delta >= FRAME_DURATION) {
        lastTime = now - (delta % FRAME_DURATION);

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          // Match canvas size to display size
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }

          const img = imagesRef.current[frameIdx];
          if (img && img.complete && img.naturalWidth > 0) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Maintain exact aspect ratio without distortion
            const hRatio = canvas.width / img.naturalWidth;
            const vRatio = canvas.height / img.naturalHeight;
            const ratio = Math.max(hRatio, vRatio);
            const drawWidth = img.naturalWidth * ratio;
            const drawHeight = img.naturalHeight * ratio;
            const shiftX = (canvas.width - drawWidth) / 2;
            const shiftY = (canvas.height - drawHeight) / 2;

            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, drawWidth, drawHeight);
          }

          setCurrentFrame(frameIdx);

          if (frameIdx < TOTAL_FRAMES - 1) {
            frameIdx++;
          } else {
            setIsComplete(true);
            return; // Sequence finished, freeze on final frame
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isBuffering]);

  // Keep drawing final frame on window resize after completion
  useEffect(() => {
    if (!isComplete) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const img = imagesRef.current[TOTAL_FRAMES - 1];
      if (img && img.complete) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const ratio = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
        const drawWidth = img.naturalWidth * ratio;
        const drawHeight = img.naturalHeight * ratio;
        const shiftX = (canvas.width - drawWidth) / 2;
        const shiftY = (canvas.height - drawHeight) / 2;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, drawWidth, drawHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isComplete]);

  return (
    <div className="coastal-sequence-viewport">
      {/* 1. Cinematic Canvas */}
      <canvas ref={canvasRef} className="sequence-canvas" />

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

      {/* 3. Top Status HUD */}
      {!isBuffering && (
        <div className="sequence-hud-top">
          <div className="hud-telemetry">
            <div className="hud-indicator">
              <span className="hud-pulse" />
              <span>LIVE SHORELINE RECONNAISSANCE</span>
            </div>
            <div className="hud-coords">
              <span>TARGET: 13.3409° N, 74.7421° E · UDUPI COASTLINE</span>
            </div>
          </div>

          {/* Alternative direct to homepage button */}
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
      )}

      {/* 4. Bottom Progress Line */}
      {!isBuffering && !isComplete && (
        <div className="sequence-progress-bar-wrap">
          <div
            className="sequence-progress-bar-fill"
            style={{ width: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%` }}
          />
          <div className="sequence-frame-counter">
            FRAME {String(currentFrame + 1).padStart(3, "0")} / {TOTAL_FRAMES}
          </div>
        </div>
      )}

      {/* 5. Completion Overlay with "Explore Coastal AI – Enter Homepage" Button */}
      {isComplete && (
        <div className="sequence-complete-overlay">
          <div className="sequence-complete-modal">
            <div className="complete-badge">
              <ShieldCheck size={18} className="text-emerald" />
              <span>COASTAL RECONNAISSANCE COMPLETE</span>
            </div>
            <h2 className="complete-title">Karnataka Shoreline Target Acquired</h2>
            <p className="complete-desc">
              High-resolution multi-spectral satellite imagery calibrated across Karnataka's 97.2 km monitored corridor.
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
