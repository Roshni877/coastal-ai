import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, SpotLight, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function BeachShoreEnvironment({ isDark }) {
  return (
    <group>
      {/* Shallow Coastal Water Surface with Ocean Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#0369a1"
          roughness={0.15}
          metalness={0.7}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Gentle Shoreline Water Ripples / Sea Foam Ring under the Center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.58, -5.2]}>
        <ringGeometry args={[1.5, 3.4, 32]} />
        <meshStandardMaterial
          color="#bae6fd"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Wet Coastal Beach Sand Beneath the Shallow Shoreline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color={isDark ? "#0f172a" : "#cbd5e1"}
          roughness={0.85}
          metalness={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
}

function FishSwarm() {
  const meshRef = useRef();
  const count = 30;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 10 + Math.random() * 20;
      const speed = 0.005 + Math.random() / 500;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -5 + Math.random() * 10;
      const zFactor = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed;
      dummy.position.set(
        xFactor + Math.cos(t) * factor,
        yFactor + Math.sin(t) * (factor / 2),
        zFactor + Math.sin(t) * factor
      );
      dummy.rotation.set(0, t, 0);
      dummy.scale.setScalar(0.2 + Math.sin(t) * 0.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <coneGeometry args={[0.1, 0.4, 3]} />
      <meshStandardMaterial color="#38bdf8" />
    </instancedMesh>
  );
}

const SeashoreBackground = () => {
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="seashore-bg-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundColor: isDark ? "#030812" : "#0a1626",
        opacity: isDark ? 0.68 : 0.58, // Richer, darker presence
        transition: "opacity 0.4s ease",
      }}
    >
      {/* 🌊 IMMERSIVE OCEAN GIF BACKGROUND - BALANCED CONTRAST */}
      <div
        className="rotating-wave-section"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <img
          src="https://i.pinimg.com/originals/d3/d6/06/d3d6061eb47bcbb455807d6a15365273.gif"
          alt="Immersive Ocean Waves"
          className="premium-bg-gif"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.75,
            filter: isDark
              ? "brightness(0.85) contrast(1.15)"
              : "brightness(0.92) contrast(1.1)",
          }}
        />
        <div
          className="wave-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: isDark
              ? "radial-gradient(circle, transparent 25%, rgba(2, 6, 15, 0.75) 100%)"
              : "radial-gradient(circle, transparent 25%, rgba(4, 15, 30, 0.65) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>

      {/* 3D Beach Shore, Water Sparkles & Fish Swarm */}
      <Canvas
        shadows
        dpr={[1, 2]}
        style={{
          zIndex: 1,
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0.8, 13]} fov={45} />
          <ambientLight intensity={0.55} />
          <SpotLight
            position={[0, 15, -1]}
            angle={0.55}
            penumbra={0.85}
            intensity={20}
            color="#7dd3fc"
            castShadow
            attenuation={5}
          />
          <pointLight
            position={[0, -1.0, -1.5]}
            intensity={2.6}
            color="#fed7aa"
            distance={10}
          />
          <BeachShoreEnvironment isDark={isDark} />
          <FishSwarm />
          <Sparkles
            count={90}
            scale={20}
            size={2}
            speed={0.4}
            opacity={0.55}
            color="#38bdf8"
          />
          <Environment preset={isDark ? "night" : "city"} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SeashoreBackground;
