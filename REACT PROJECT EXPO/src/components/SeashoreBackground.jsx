import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, SpotLight, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function BeachShoreEnvironment() {
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
          opacity={0.4}
        />
      </mesh>

      {/* Wet Coastal Beach Sand Beneath the Shallow Shoreline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.85}
          metalness={0.1}
          transparent
          opacity={0.65}
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
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

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
        backgroundColor: "#000",
      }}
    >
      {/* 🌊 IMMERSIVE OCEAN GIF BACKGROUND */}
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
        />
        <div className="wave-overlay" />
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
            intensity={24}
            color="#7dd3fc"
            castShadow
            attenuation={5}
          />
          <pointLight
            position={[0, -1.0, -1.5]}
            intensity={3.0}
            color="#fed7aa"
            distance={10}
          />
          <BeachShoreEnvironment />
          <FishSwarm />
          <Sparkles
            count={100}
            scale={20}
            size={2}
            speed={0.4}
            opacity={0.6}
            color="#38bdf8"
          />
          <Environment preset={isDark ? "night" : "city"} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SeashoreBackground;
