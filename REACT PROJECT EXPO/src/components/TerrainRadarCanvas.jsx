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
    scene.fog = new THREE.FogExp2(0x0b121c, 0.015);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 22, 34);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0a2540, 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    cyanLight.position.set(15, 25, 20);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 1.8, 60);
    amberLight.position.set(-20, 10, -15);
    scene.add(amberLight);

    // 3. 12D Rotational Group (Contains Terrain + Shoreline + Radar)
    const terrainGroup = new THREE.Group();
    scene.add(terrainGroup);

    // 4. Create High-Density Coastal Topography (PlaneGeometry)
    const GRID_SIZE = 26;
    const SEGMENTS = 52;
    const geometry = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, SEGMENTS, SEGMENTS);
    geometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;

    // Store base (x, z) positions
    const baseCoords = new Float32Array(vertexCount * 2);
    for (let i = 0; i < vertexCount; i++) {
      baseCoords[i * 2] = posAttr.getX(i);
      baseCoords[i * 2 + 1] = posAttr.getZ(i);
    }

    // Colors for point cloud / wireframe
    const colors = new Float32Array(vertexCount * 3);
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    geometry.setAttribute("color", colorAttr);

    // Wireframe Mesh Material
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      roughness: 0.2,
      metalness: 0.8,
    });
    const terrainMesh = new THREE.Mesh(geometry, meshMaterial);
    terrainGroup.add(terrainMesh);

    // Point Cloud Material on top of vertices
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const terrainPoints = new THREE.Points(geometry, pointsMaterial);
    terrainGroup.add(terrainPoints);

    // 5. Glowing Cyan Coastline Spline Curve (Dynamic Line)
    const SHORELINE_NODES = 48;
    const shorelinePoints = [];
    for (let i = 0; i < SHORELINE_NODES; i++) {
      shorelinePoints.push(new THREE.Vector3(0, 0, 0));
    }
    const shorelineGeom = new THREE.BufferGeometry().setFromPoints(shorelinePoints);
    const shorelineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const shorelineLine = new THREE.Line(shorelineGeom, shorelineMat);
    terrainGroup.add(shorelineLine);

    // 6. Volumetric Radar Sector Fan (Semicircular Glowing Fan)
    const RADAR_RADIUS = 13.5;
    const SECTOR_ANGLE = Math.PI * 0.58;
    const radarGeom = new THREE.RingGeometry(0.2, RADAR_RADIUS, 32, 1, 0, SECTOR_ANGLE);
    radarGeom.rotateX(-Math.PI / 2);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const radarFan = new THREE.Mesh(radarGeom, radarMat);
    terrainGroup.add(radarFan);

    // Leading laser line of radar
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(RADAR_RADIUS, 0.1, 0),
    ]);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const laserLine = new THREE.Line(laserGeom, laserMat);
    terrainGroup.add(laserLine);

    // 7. 3D Multidimensional Gyroscope Gimbal Rings (Nested Toruses)
    const gyroGroup = new THREE.Group();
    scene.add(gyroGroup);

    const createGimbalRing = (radius, tube, color, opacity) => {
      const ringGeom = new THREE.TorusGeometry(radius, tube, 16, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.9,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(ringGeom, ringMat);
    };

    // Outer Cyan Ring (Equatorial)
    const ring1 = createGimbalRing(16.5, 0.08, 0x00f0ff, 0.65);
    gyroGroup.add(ring1);

    // Middle Amber/Gold Ring (Polar)
    const ring2 = createGimbalRing(15.2, 0.07, 0xf59e0b, 0.55);
    gyroGroup.add(ring2);

    // Inner Emerald Ring (Hyperspace Oblique)
    const ring3 = createGimbalRing(13.8, 0.06, 0x10b981, 0.45);
    gyroGroup.add(ring3);

    // Orbiting Satellite Beacon on Ring 1
    const beaconGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    ring1.add(beacon);

    // 8. Atmospheric Floating Data Particles (Quantum Dust)
    const DUST_COUNT = 180;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 45;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.22,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    scene.add(dustParticles);

    // 9. Animation Loop (Realistic 12D Harmonic Gyroscope Rotation)
    let time = 0;
    let animationFrameId;

    const animate = () => {
      time += 0.022;

      // 12D Multi-Axis Complex Rotation on Terrain
      const yaw = time * 0.55; // Continuous 360° smooth spin
      const pitch = Math.sin(time * 0.4) * 0.32 - 0.15; // Harmonic orbital inclination
      const roll = Math.cos(time * 0.32) * 0.22; // Precession roll tilt
      const wWarp = Math.sin(time * 1.4) * 0.18; // 4D Hyperspace dimensional breathing

      terrainGroup.rotation.y = yaw;
      terrainGroup.rotation.x = pitch;
      terrainGroup.rotation.z = roll;

      // Gimbal Rings rotate on independent 3D planes
      ring1.rotation.y = time * 0.4;
      ring1.rotation.x = Math.sin(time * 0.3) * 0.4;

      ring2.rotation.x = -time * 0.5;
      ring2.rotation.z = Math.cos(time * 0.35) * 0.5;

      ring3.rotation.z = time * 0.6;
      ring3.rotation.y = -time * 0.4;

      // Orbiting beacon moves along ring perimeter
      const bAngle = time * 1.6;
      beacon.position.set(Math.cos(bAngle) * 16.5, Math.sin(bAngle) * 16.5, 0);

      // Radar rotation angle
      const sweepAngle = time * 1.7;
      radarFan.rotation.y = sweepAngle;
      laserLine.rotation.y = sweepAngle;

      // 12D Harmonic Terrain Vertex Elevation Calculation
      const pos = geometry.attributes.position;
      const col = geometry.attributes.color;

      for (let i = 0; i < vertexCount; i++) {
        const bx = baseCoords[i * 2];
        const bz = baseCoords[i * 2 + 1];

        // 12 harmonic interference terms for realistic coastal DEM
        const u = bx * 0.22;
        const v = bz * 0.22;

        const mountain = Math.sin(u * 0.6 + time * 0.8) * Math.cos(v * 0.6 - time * 0.6) * 3.2;
        const ridges = Math.sin((u - v) * 0.8 + time * 1.2) * 1.5;
        const valley = Math.cos((u * u + v * v) * 0.04 - time * 1.5) * 1.2;
        const coastalSlope = (v * 0.9 - u * 0.7) * 2.2;
        const microWave = Math.sin(u * 1.5 + time * 2.0) * 0.4;

        // Apply 4D-W warp breathing
        const totalHeight = (mountain + ridges + valley + coastalSlope + microWave) * (1 + wWarp);
        pos.setY(i, totalHeight);

        // Check if vertex is inside the radar sweep
        const dist = Math.sqrt(bx * bx + bz * bz);
        let angle = Math.atan2(bz, bx);
        let diff = (sweepAngle - angle) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;
        const isUnderRadar = dist <= RADAR_RADIUS && diff <= SECTOR_ANGLE;

        if (isUnderRadar) {
          // Intense electric cyan highlight
          col.setXYZ(i, 0.1, 0.95, 1.0);
        } else {
          // Subtle deep atmospheric blue
          const depth = (totalHeight + 8) / 16;
          col.setXYZ(i, 0.05 * depth, 0.25 * depth, 0.45 * depth);
        }
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;

      // Update 3D Coastline Spline
      const shorePos = shorelineGeom.attributes.position;
      for (let s = 0; s < SHORELINE_NODES; s++) {
        const tNorm = (s / (SHORELINE_NODES - 1)) * 2 - 1; // -1 to 1
        const sx = tNorm * 11;
        const sz = tNorm * 8 + Math.sin(tNorm * 4 + time) * 1.2;
        const sy = (Math.sin(sx * 0.3) + Math.cos(sz * 0.3)) * 0.8 + 0.4;
        shorePos.setXYZ(s, sx, sy, sz);
      }
      shorePos.needsUpdate = true;

      // Slowly rotate dust particles for deep spatial volume
      dustParticles.rotation.y = time * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle responsive resize
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
      geometry.dispose();
      meshMaterial.dispose();
      pointsMaterial.dispose();
      shorelineGeom.dispose();
      shorelineMat.dispose();
      radarGeom.dispose();
      radarMat.dispose();
      laserGeom.dispose();
      laserMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="terrain-radar-wrapper">
      <div ref={mountRef} className="terrain-radar-webgl-container" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default TerrainRadarCanvas;
