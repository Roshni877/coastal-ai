import React, { useRef, useEffect } from "react";

const TerrainRadarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.clientWidth || 620;
    let height = canvas.clientHeight || 440;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Grid dimensions
    const COLS = 28;
    const ROWS = 28;
    const gridSpacing = Math.min(width, height) / 30;

    // 12D Multi-harmonic elevation function
    const get12DElevation = (i, j, time) => {
      const u = (i - COLS / 2) * 0.35;
      const v = (j - ROWS / 2) * 0.35;

      // Complex multidimensional interference waves (12 harmonic terms)
      const term1 = Math.sin(u + time * 1.6) * Math.cos(v - time * 1.2) * 14;
      const term2 = Math.sin((u - v) * 1.2 + time * 2.0) * 8;
      const term3 = Math.cos((u * u + v * v) * 0.28 - time * 2.4) * 6;
      const term4 = Math.sin(u * 2.1 - time * 1.1) * 4;
      const term5 = Math.cos(v * 2.1 + time * 1.4) * 4;
      const ridge = (v * 1.2 - u * 0.9) * 2.5;

      return term1 + term2 + term3 + term4 + term5 + ridge;
    };

    // Shoreline contour test: points where elevation crosses threshold
    const isShorelinePoint = (i, j) => {
      const val = j - i * 0.78;
      return Math.abs(val - 2.5) < 1.2;
    };

    let time = 0;

    // Helper: 3D to 2D projection with Yaw, Pitch, Roll & 4D-W Stereographic warp
    const projectPoint = (x0, y0, z0, yaw, pitch, roll, wWarp, cx, cy, cameraDist) => {
      // 4D W-coordinate warp (tesseract projection)
      const wPersp = 1 / (1 - wWarp / 500);
      const x1 = x0 * wPersp;
      const y1 = y0 * wPersp;
      const z1 = z0 * wPersp;

      // 1. Yaw rotation (Y axis)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x2 = x1 * cosY - y1 * sinY;
      const y2 = x1 * sinY + y1 * cosY;
      const z2 = z1;

      // 2. Pitch rotation (X axis)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y3 = y2 * cosP - z2 * sinP;
      const z3 = y2 * sinP + z2 * cosP;
      const x3 = x2;

      // 3. Roll rotation (Z axis)
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);
      const x4 = x3 * cosR - y3 * sinR;
      const y4 = x3 * sinR + y3 * cosR;
      const z4 = z3;

      // Perspective projection
      const scale = cameraDist / (cameraDist + z4);
      return {
        x: cx + x4 * scale,
        y: cy + y4 * scale,
        z: z4,
        scale,
      };
    };

    const render = () => {
      time += 0.024;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.52;
      const centerY = height * 0.52;
      const cameraDist = 420;

      // 12D Multidimensional Rotation Angles (Continuous dynamic 3D/4D precession)
      const yaw = time * 0.65; // Continuous 360° spin
      const pitch = 0.88 + Math.sin(time * 0.45) * 0.32; // Harmonic inclination bobbing
      const roll = Math.cos(time * 0.38) * 0.22; // Gyroscopic roll tilt
      const wWarp = Math.sin(time * 1.2) * 28; // 4D hypercube dimensional pulse

      // 1. Draw Multidimensional Gyroscope Gimbal Rings (Nested Rings orbiting in 3D)
      const ringRadius = Math.min(width, height) * 0.44;

      const drawGyroRing = (radius, rYaw, rPitch, rRoll, strokeStyle, shadowColor, dashArray = []) => {
        ctx.save();
        ctx.beginPath();
        const segments = 60;
        let first = true;
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const rx = Math.cos(theta) * radius;
          const ry = Math.sin(theta) * radius;
          const rz = 0;
          const p = projectPoint(rx, ry, rz, rYaw, rPitch, rRoll, 0, centerX, centerY, cameraDist);
          if (first) {
            ctx.moveTo(p.x, p.y);
            first = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.2;
        if (shadowColor) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = 12;
        }
        if (dashArray.length) {
          ctx.setLineDash(dashArray);
        }
        ctx.stroke();

        // Draw orbital node beacon on ring
        const beaconTheta = time * 1.5;
        const bx = Math.cos(beaconTheta) * radius;
        const by = Math.sin(beaconTheta) * radius;
        const bp = projectPoint(bx, by, 0, rYaw, rPitch, rRoll, 0, centerX, centerY, cameraDist);
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
      };

      // Ring 1: Equatorial Gyro Ring (Cyan)
      drawGyroRing(
        ringRadius,
        yaw * 0.8,
        pitch * 0.6,
        time * 0.4,
        "rgba(56, 189, 248, 0.45)",
        "#00f0ff",
        [6, 8]
      );

      // Ring 2: Polar Gyro Ring (Amber/Gold accent)
      drawGyroRing(
        ringRadius * 0.9,
        -time * 0.5,
        Math.PI * 0.5 + Math.sin(time * 0.4) * 0.3,
        time * 0.3,
        "rgba(245, 158, 11, 0.35)",
        "#f59e0b",
        [4, 6]
      );

      // Ring 3: Oblique Hyperspace Ring (Emerald/Cyan)
      drawGyroRing(
        ringRadius * 1.05,
        time * 0.4,
        Math.PI * 0.25,
        -time * 0.6,
        "rgba(16, 185, 129, 0.3)",
        "#10b981",
        [10, 10]
      );

      // 2. Compute 12D Rotating Terrain Mesh Points
      const points = [];
      for (let i = 0; i < COLS; i++) {
        points[i] = [];
        for (let j = 0; j < ROWS; j++) {
          const x0 = (i - COLS / 2) * gridSpacing;
          const y0 = (j - ROWS / 2) * gridSpacing;
          const z0 = get12DElevation(i, j, time);

          const proj = projectPoint(
            x0,
            y0,
            z0,
            yaw,
            pitch,
            roll,
            wWarp,
            centerX,
            centerY,
            cameraDist
          );

          points[i][j] = {
            ...proj,
            origZ: z0,
            isShore: isShorelinePoint(i, j),
          };
        }
      }

      // Radar Sweep Calculation
      const sweepAngle = time * 1.8;
      const sectorAngle = Math.PI * 0.55;
      const radarCenter = points[Math.floor(COLS / 2)][Math.floor(ROWS / 2)];
      const radarRadius = Math.min(width, height) * 0.46;

      // 3. Draw Semicircular Radar Arc Sweep
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

      const radarGrad = ctx.createRadialGradient(
        radarCenter.x,
        radarCenter.y,
        0,
        radarCenter.x,
        radarCenter.y,
        radarRadius
      );
      radarGrad.addColorStop(0, "rgba(0, 240, 255, 0.5)");
      radarGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.2)");
      radarGrad.addColorStop(1, "rgba(0, 240, 255, 0.0)");
      ctx.fillStyle = radarGrad;
      ctx.fill();

      // Outer radar rim
      ctx.beginPath();
      ctx.arc(
        radarCenter.x,
        radarCenter.y,
        radarRadius,
        sweepAngle - sectorAngle,
        sweepAngle,
        false
      );
      ctx.strokeStyle = "rgba(0, 240, 255, 0.95)";
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Leading radar scan line
      ctx.beginPath();
      ctx.moveTo(radarCenter.x, radarCenter.y);
      ctx.lineTo(
        radarCenter.x + Math.cos(sweepAngle) * radarRadius,
        radarCenter.y + Math.sin(sweepAngle) * radarRadius
      );
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.8;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 22;
      ctx.stroke();
      ctx.restore();

      // 4. Draw Rotating 3D Terrain Grid Wireframe
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const pt = points[i][j];

          // Check if point is inside radar sweep arc
          const dx = pt.x - radarCenter.x;
          const dy = pt.y - radarCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let angle = Math.atan2(dy, dx);
          let diff = (sweepAngle - angle) % (Math.PI * 2);
          if (diff < 0) diff += Math.PI * 2;
          const isUnderRadar = dist <= radarRadius && diff <= sectorAngle;
          pt.isUnderRadar = isUnderRadar;

          // Connect to neighbor (i + 1, j)
          if (i < COLS - 1) {
            const nextPt = points[i + 1][j];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            if (isUnderRadar && nextPt.isUnderRadar) {
              ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
              ctx.lineWidth = 1.4;
            } else {
              // Depth-shaded wireframe
              const depthAlpha = Math.max(0.12, Math.min(0.35, (pt.scale + nextPt.scale) * 0.22));
              ctx.strokeStyle = `rgba(100, 145, 185, ${depthAlpha})`;
              ctx.lineWidth = 0.85;
            }
            ctx.stroke();
          }

          // Connect to neighbor (i, j + 1)
          if (j < ROWS - 1) {
            const nextPt = points[i][j + 1];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            if (isUnderRadar && nextPt.isUnderRadar) {
              ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
              ctx.lineWidth = 1.4;
            } else {
              const depthAlpha = Math.max(0.12, Math.min(0.35, (pt.scale + nextPt.scale) * 0.22));
              ctx.strokeStyle = `rgba(100, 145, 185, ${depthAlpha})`;
              ctx.lineWidth = 0.85;
            }
            ctx.stroke();
          }
        }
      }

      // 5. Draw 3D Grid Nodes (Dots)
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const pt = points[i][j];
          ctx.beginPath();
          if (pt.isUnderRadar) {
            ctx.arc(pt.x, pt.y, 2.2 * pt.scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#00f0ff";
            ctx.shadowBlur = 10;
          } else {
            ctx.arc(pt.x, pt.y, 1.2 * pt.scale, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      // 6. Draw Glowing Electric-Cyan Coastline Path Rotating with Terrain
      ctx.save();
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < COLS; i++) {
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
      ctx.lineWidth = 3.6;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.restore();

      // 7. 12D Telemetry Coordinate HUD Overlay in Corner of 3D Canvas
      ctx.save();
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
      ctx.fillText(
        `12D ROT_MATRIX // YAW: ${Math.round(((yaw % (Math.PI * 2)) / (Math.PI * 2)) * 360)}°  PITCH: ${Math.round(pitch * 57.3)}°  ROLL: ${Math.round(roll * 57.3)}°`,
        14,
        22
      );
      ctx.fillStyle = "rgba(245, 158, 11, 0.85)";
      ctx.fillText(
        `HYPERSPACE W-WARP: ${wWarp.toFixed(2)} | GYRO-GIMBAL: ACTIVE`,
        14,
        36
      );
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
