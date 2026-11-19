import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";
import "./CoastalFrameSequence.css";

const TOTAL_FRAMES = 240;

const getFrameUrl = (index) => {
  const padded = String(index).padStart(6, "0");
  return `/assets/sequence/frame_${padded}.jpeg`;
};

export default function CoastalFrameSequence({ onEnterHomepage, onDirectHomepage }) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // States
  const [loadedCount, setLoadedCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);

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

  // 3. Animation loop: smoothly interpolate towards targetFrameRef (100% USER SCROLL DRIVEN)
  useEffect(() => {
    if (isBuffering) return;

    drawFrame(0);

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.28;
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

  // 4. USER SCROLL INPUT HANDLERS (Wheel, Touch, Keyboard)
  useEffect(() => {
    if (isBuffering) return;

    // Mouse wheel / touchpad
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const step = delta > 0
        ? Math.max(1, Math.min(Math.abs(delta) * 0.12, 8))
        : -Math.max(1, Math.min(Math.abs(delta) * 0.12, 8));

      targetFrameRef.current = Math.min(
        Math.max(targetFrameRef.current + step, 0),
        TOTAL_FRAMES - 1
      );
    };

    // Mobile / Tablet touch swipe
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
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

    // Keyboard arrow keys
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        targetFrameRef.current = Math.min(targetFrameRef.current + 6, TOTAL_FRAMES - 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
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

  const isComplete = currentFrame >= 235;

  return (
    <div
      ref={viewportRef}
      className="coastal-clean-scroll-viewport"
    >
      {/* 1. Cinematic Clean Canvas */}
      <canvas ref={canvasRef} className="story-canvas" />

      {/* 2. Top-Right Direct to Homepage Button */}
      {!isBuffering && (
        <div className="clean-top-nav">
          <button
            type="button"
            className="clean-direct-btn"
            onClick={onDirectHomepage}
            title="Direct to Homepage"
          >
            <span>Direct to Homepage</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* 3. Completion Modal Overlay (Appears on Frame 239) */}
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
