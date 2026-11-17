import React, { useRef, useEffect } from "react";

const TerrainRadarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.clientWidth || 550;
    let height = canvas.clientHeight || 420;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Terrain grid definition
    const COLS = 34;
    const ROWS = 34;
    const spacing = Math.min(width, height) / 44;

    // Elevation height function
    const getHeight = (i, j, time) => {
      // Mountain ridge on top/right sloping down to sea
      const ridge = Math.sin(i * 0.28) * Math.cos(j * 0.28) * 16;
      const slope = (j * 1.1 - i * 0.9) * 2.2;
      const microTerrain = Math.sin((i + j) * 0.45) * 6;
      const oceanWave = Math.sin(i * 0.4 + time * 2) * 2.5;
      return ridge + slope + microTerrain + oceanWave;
    };

    // Shoreline contour test: points where elevation crosses sea level
    const isShorelinePoint = (i, j) => {
      const val = j - i * 0.75;
      return Math.abs(val - 3) < 1.4;
    };

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.52;
      const centerY = height * 0.52;

      // Project grid points to isometric 2D
      const points = [];
      for (let i = 0; i < COLS; i++) {
        points[i] = [];
        for (let j = 0; j < ROWS; j++) {
          const z = getHeight(i, j, time);
          // Isometric projection
          const isoX = centerX + (i - j) * spacing * 1.35;
          const isoY = centerY + (i + j) * spacing * 0.68 - z;
          points[i][j] = { x: isoX, y: isoY, z, isShore: isShorelinePoint(i, j) };
        }
      }

      // Radar center (centered around the shoreline middle)
      const radarCenter = points[Math.floor(COLS * 0.48)][Math.floor(ROWS * 0.48)];
      const radarRadius = Math.min(width, height) * 0.42;
      const sweepAngle = time * 1.1; // Radar rotational speed
      const sectorAngle = Math.PI * 0.65; // Arc width of radar beam

      // 1. Draw circular radar sweep fan gradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(radarCenter.x, radarCenter.y);
      ctx.arc(
        radarCenter.x,
        radarCenter.y,
        radarRadius,
        sweepAngle - sectorAngle,
        sweepAngle,
        false
      );
      ctx.closePath();

      const radarGradient = ctx.createRadialGradient(
        radarCenter.x,
        radarCenter.y,
        0,
        radarCenter.x,
        radarCenter.y,
        radarRadius
      );
      radarGradient.addColorStop(0, "rgba(0, 240, 255, 0.45)");
      radarGradient.addColorStop(0.6, "rgba(0, 240, 255, 0.2)");
      radarGradient.addColorStop(1, "rgba(0, 240, 255, 0.0)");
      ctx.fillStyle = radarGradient;
      ctx.fill();

      // Glowing outer rim of radar arc
      ctx.beginPath();
      ctx.arc(
        radarCenter.x,
        radarCenter.y,
        radarRadius,
        sweepAngle - sectorAngle,
        sweepAngle,
        false
      );
      ctx.strokeStyle = "rgba(0, 240, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Leading radar laser sweep line
      ctx.beginPath();
      ctx.moveTo(radarCenter.x, radarCenter.y);
      ctx.lineTo(
        radarCenter.x + Math.cos(sweepAngle) * radarRadius,
        radarCenter.y + Math.sin(sweepAngle) * radarRadius
      );
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // 2. Draw 3D wireframe mesh grid lines
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const pt = points[i][j];

          // Check if point is inside radar beam
          const dx = pt.x - radarCenter.x;
          const dy = pt.y - radarCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let angle = Math.atan2(dy, dx);
          let diff = (sweepAngle - angle) % (Math.PI * 2);
          if (diff < 0) diff += Math.PI * 2;
          const isUnderRadar = dist <= radarRadius && diff <= sectorAngle;
          pt.isUnderRadar = isUnderRadar;

          // Connect to right neighbor (i+1, j)
          if (i < COLS - 1) {
            const nextPt = points[i + 1][j];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            if (isUnderRadar && nextPt.isUnderRadar) {
              ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = "rgba(100, 130, 160, 0.22)";
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }

          // Connect to bottom neighbor (i, j+1)
          if (j < ROWS - 1) {
            const nextPt = points[i][j + 1];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            if (isUnderRadar && nextPt.isUnderRadar) {
              ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = "rgba(100, 130, 160, 0.22)";
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // 3. Draw Grid Nodes / Dots
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const pt = points[i][j];
          ctx.beginPath();
          if (pt.isUnderRadar) {
            ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = "#a5f3fc";
            ctx.shadowColor = "#00f0ff";
            ctx.shadowBlur = 8;
          } else {
            ctx.arc(pt.x, pt.y, 1.0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      // 4. Draw Glowing Cyan Shoreline Path across the mesh
      ctx.save();
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < COLS; i++) {
        // Find shoreline point for row
        for (let j = 0; j < ROWS; j++) {
          if (points[i][j].isShore) {
            if (first) {
              ctx.moveTo(points[i][j].x, points[i][j].y);
              first = false;
            } else {
              ctx.lineTo(points[i][j].x, points[i][j].y);
            }
            break;
          }
        }
      }
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 3.2;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="terrain-radar-wrapper">
      <canvas ref={canvasRef} className="terrain-radar-canvas" />
    </div>
  );
};

export default TerrainRadarCanvas;
