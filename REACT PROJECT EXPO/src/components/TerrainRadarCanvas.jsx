import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const TerrainRadarCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 640;
    let height = mount.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080e18, 0.018);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 24, 32);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Realistic Oceanic Lighting
    const ambientLight = new THREE.AmbientLight(0x072b4a, 1.6);
    scene.add(ambientLight);

    // Main sun/satellite specular light (creates liquid glints on water crests)
    const sunLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    sunLight.position.set(18, 30, 22);
    scene.add(sunLight);

    // Secondary warm ambient light for coastal contrast
    const warmLight = new THREE.PointLight(0xf59e0b, 2.0, 70);
    warmLight.position.set(-22, 12, -18);
    scene.add(warmLight);

    // Deep water bottom glow
    const deepGlow = new THREE.PointLight(0x0284c7, 3.0, 50);
    deepGlow.position.set(0, -8, 0);
    scene.add(deepGlow);

    // 3. Central 12D Rotational Group (Contains Swirling Ocean Water + Coastline + Radar)
    const oceanGroup = new THREE.Group();
    scene.add(oceanGroup);

    // 4. High-Resolution 3D Fluid Ocean Water Surface Mesh
    const WATER_SIZE = 28;
    const WATER_SEGS = 64; // 64x64 = 4,225 fluid vertices
    const waterGeom = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE, WATER_SEGS, WATER_SEGS);
    waterGeom.rotateX(-Math.PI / 2);

    const posAttr = waterGeom.attributes.position;
    const vertexCount = posAttr.count;

    // Store base horizontal coordinates (x, z)
    const baseCoords = new Float32Array(vertexCount * 2);
    for (let i = 0; i < vertexCount; i++) {
      baseCoords[i * 2] = posAttr.getX(i);
      baseCoords[i * 2 + 1] = posAttr.getZ(i);
    }

    // Dynamic vertex colors for water illumination under radar
    const waterColors = new Float32Array(vertexCount * 3);
    const colorAttr = new THREE.BufferAttribute(waterColors, 3);
    waterGeom.setAttribute("color", colorAttr);

    // Real Liquid Water Material (Glossy, translucent with specular glints)
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.78,
      vertexColors: true,
      side: THREE.DoubleSide,
    });
    const waterMesh = new THREE.Mesh(waterGeom, waterMaterial);
    oceanGroup.add(waterMesh);

    // Holographic Cyber Wireframe Overlay on Water (For the high-tech 12D AI feel)
    const waterWireMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const waterWireMesh = new THREE.Mesh(waterGeom, waterWireMaterial);
    oceanGroup.add(waterWireMesh);

    // 5. Swirling Water Foam / Spray Particle Cloud (240 Particles rotating in vortex)
    const FOAM_COUNT = 240;
    const foamGeom = new THREE.BufferGeometry();
    const foamPositions = new Float32Array(FOAM_COUNT * 3);
    const foamRadii = new Float32Array(FOAM_COUNT);
    const foamAngles = new Float32Array(FOAM_COUNT);
    const foamSpeeds = new Float32Array(FOAM_COUNT);

    for (let i = 0; i < FOAM_COUNT; i++) {
      const r = 2.0 + Math.random() * 12.0;
      const th = Math.random() * Math.PI * 2;
      foamRadii[i] = r;
      foamAngles[i] = th;
      foamSpeeds[i] = (1.5 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);

      foamPositions[i * 3] = Math.cos(th) * r;
      foamPositions[i * 3 + 1] = 0;
      foamPositions[i * 3 + 2] = Math.sin(th) * r;
    }
    foamGeom.setAttribute("position", new THREE.BufferAttribute(foamPositions, 3));

    const foamMaterial = new THREE.PointsMaterial({
      color: 0xa5f3fc,
      size: 0.32,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const foamParticles = new THREE.Points(foamGeom, foamMaterial);
    oceanGroup.add(foamParticles);

    // 6. Glowing Electric-Cyan 3D Coastline Boundary
    const COAST_NODES = 60;
    const coastPoints = [];
    for (let i = 0; i < COAST_NODES; i++) {
      coastPoints.push(new THREE.Vector3(0, 0, 0));
    }
    const coastGeom = new THREE.BufferGeometry().setFromPoints(coastPoints);
    const coastMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 3.5,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const coastLine = new THREE.Line(coastGeom, coastMat);
    oceanGroup.add(coastLine);

    // 7. Volumetric Radar Scanner Fan (Semicircular Glowing Arc)
    const RADAR_RADIUS = 13.8;
    const SECTOR_ANGLE = Math.PI * 0.58;
    const radarGeom = new THREE.RingGeometry(0.2, RADAR_RADIUS, 36, 1, 0, SECTOR_ANGLE);
    radarGeom.rotateX(-Math.PI / 2);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const radarFan = new THREE.Mesh(radarGeom, radarMat);
    oceanGroup.add(radarFan);

    // Leading laser ray of radar
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(RADAR_RADIUS, 0.2, 0),
    ]);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const laserLine = new THREE.Line(laserGeom, laserMat);
    oceanGroup.add(laserLine);

    // 8. 3D Multidimensional Gyroscope Rings (Orbiting in 3D around the swirling ocean)
    const gyroGroup = new THREE.Group();
    scene.add(gyroGroup);

    const createGyroRing = (radius, tube, color, opacity) => {
      const ringGeom = new THREE.TorusGeometry(radius, tube, 16, 90);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.55,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(ringGeom, ringMat);
    };

    const ring1 = createGyroRing(16.5, 0.08, 0x00f0ff, 0.65); // Cyan Equatorial
    const ring2 = createGyroRing(15.2, 0.07, 0xf59e0b, 0.55); // Amber Polar
    const ring3 = createGyroRing(13.8, 0.06, 0x10b981, 0.45); // Emerald Oblique
    gyroGroup.add(ring1);
    gyroGroup.add(ring2);
    gyroGroup.add(ring3);

    // Orbiting Satellite Beacon on Ring 1
    const beaconGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    ring1.add(beacon);

    // 9. Realistic 3D Water Rotation & 12D Vortex Simulation Loop
    let time = 0;
    let animationFrameId;

    const animate = () => {
      time += 0.024;

      // 12D Multi-Axis Gyroscopic Rotation on the whole Ocean System
      const yaw = time * 0.45; // Smooth continuous 360° orbital rotation
      const pitch = Math.sin(time * 0.35) * 0.28 - 0.12; // Harmonic orbital inclination
      const roll = Math.cos(time * 0.28) * 0.18; // Precession roll tilt
      const wWarp = Math.sin(time * 1.5) * 0.15; // 4D Hyperspace breathing

      oceanGroup.rotation.y = yaw;
      oceanGroup.rotation.x = pitch;
      oceanGroup.rotation.z = roll;

      // Gyro Rings rotate on independent 3D planes
      ring1.rotation.y = time * 0.35;
      ring1.rotation.x = Math.sin(time * 0.25) * 0.35;

      ring2.rotation.x = -time * 0.45;
      ring2.rotation.z = Math.cos(time * 0.3) * 0.45;

      ring3.rotation.z = time * 0.55;
      ring3.rotation.y = -time * 0.35;

      const bAngle = time * 1.4;
      beacon.position.set(Math.cos(bAngle) * 16.5, Math.sin(bAngle) * 16.5, 0);

      // Radar rotation angle
      const sweepAngle = time * 1.7;
      radarFan.rotation.y = sweepAngle;
      laserLine.rotation.y = sweepAngle;

      // ========================================================
      // REALISTIC 3D WATER ROTATION & VORTEX WAVE MATHEMATICS
      // ========================================================
      const pos = waterGeom.attributes.position;
      const col = waterGeom.attributes.color;

      for (let i = 0; i < vertexCount; i++) {
        const bx = baseCoords[i * 2];
        const bz = baseCoords[i * 2 + 1];

        // Polar coordinates from center
        const r = Math.sqrt(bx * bx + bz * bz);
        const theta = Math.atan2(bz, bx);

        // Water Swirling Vortex Motion (Fluid angular rotation)
        const vortexAngle = theta + time * (1.1 / (1 + r * 0.18));

        // 12-Harmonic Multi-directional Water Waves
        // 1. Swirling rotational tidal wave
        const waveVortex = Math.sin(r * 0.85 - time * 2.8 + vortexAngle * 2.0) * 1.45;
        // 2. Transverse ocean swell
        const waveSwell = Math.sin(bx * 0.45 + time * 1.8) * Math.cos(bz * 0.45 - time * 1.4) * 1.1;
        // 3. High-frequency caustic water ripples
        const waveChop = Math.sin(r * 1.6 - time * 3.4) * 0.5;
        // 4. Coastal land elevation shelf (sloping rocky coast on one side)
        const coastalLand = Math.max(0, (bz * 0.8 - bx * 0.6 - 1.5)) * 1.5;

        // Total 3D water displacement
        const yWater = (waveVortex + waveSwell + waveChop + coastalLand) * (1 + wWarp);
        pos.setY(i, yWater);

        // Radar Illumination Logic
        let diff = (sweepAngle - theta) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;
        const isUnderRadar = r <= RADAR_RADIUS && diff <= SECTOR_ANGLE;

        if (isUnderRadar) {
          // Blazing illuminated turquoise/neon-cyan water crests
          const crestGlint = Math.max(0, yWater / 3.0);
          col.setXYZ(i, 0.1 + crestGlint * 0.8, 0.9 + crestGlint * 0.1, 1.0);
        } else {
          // Deep glassy ocean water colors with depth gradient
          const depthShade = Math.max(0.15, Math.min(0.85, (yWater + 3.5) / 7.0));
          col.setXYZ(i, 0.01 * depthShade, 0.35 * depthShade, 0.75 * depthShade);
        }
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
      waterGeom.computeVertexNormals(); // Recalculate normals so water specular light shines realistically!

      // ========================================================
      // SWIRLING FOAM / WATER DROPLETS ROTATION
      // ========================================================
      const foamPos = foamGeom.attributes.position;
      for (let i = 0; i < FOAM_COUNT; i++) {
        foamAngles[i] += foamSpeeds[i] * 0.02;
        const r = foamRadii[i];
        const a = foamAngles[i];

        const fx = Math.cos(a) * r;
        const fz = Math.sin(a) * r;
        // Float on top of water wave crest
        const fy = Math.sin(r * 0.85 - time * 2.8 + a * 2.0) * 1.45 + 0.25;

        foamPos.setXYZ(i, fx, fy, fz);
      }
      foamPos.needsUpdate = true;

      // ========================================================
      // 3D GLOWING COASTLINE CURVE DYNAMICS
      // ========================================================
      const coastPos = coastGeom.attributes.position;
      for (let s = 0; s < COAST_NODES; s++) {
        const tNorm = (s / (COAST_NODES - 1)) * 2 - 1; // -1 to 1
        const cx = tNorm * 11.5;
        const cz = tNorm * 8.5 + Math.sin(tNorm * 3.5 + time * 1.5) * 1.4;
        const cy = Math.sin(cx * 0.4 + time) * 0.8 + 0.6;
        coastPos.setXYZ(s, cx, cy, cz);
      }
      coastPos.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Responsive resize handler
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 640;
      height = mount.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      waterGeom.dispose();
      waterMaterial.dispose();
      waterWireMaterial.dispose();
      foamGeom.dispose();
      foamMaterial.dispose();
      coastGeom.dispose();
      coastMat.dispose();
      radarGeom.dispose();
      radarMat.dispose();
      laserGeom.dispose();
      laserMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="terrain-radar-wrapper">
      <div
        ref={mountRef}
        className="terrain-radar-webgl-container"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default TerrainRadarCanvas;
