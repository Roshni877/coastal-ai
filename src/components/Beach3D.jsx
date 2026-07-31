import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useTexture, Sky, Float } from "@react-three/drei";
import * as THREE from "three";

function SandFloor() {
  const meshRef = useRef();
  // Using a realistic sand texture
  const texture = useTexture("https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&w=2000");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = -2 + Math.sin(time * 0.2) * 0.1;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={1} 
        metalness={0.1}
        bumpScale={0.05}
      />
    </mesh>
  );
}

function FloatingShells() {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      {[...Array(15)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[(Math.random() - 0.5) * 20, Math.random() * 5, (Math.random() - 0.5) * 20]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.2, 16, 16]} />
            <meshStandardMaterial color={["#fef3c7", "#fde68a", "#f59e0b"][Math.floor(Math.random() * 3)]} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Beach3D() {
  const [isDark, setIsDark] = React.useState(document.documentElement.getAttribute("data-theme") === "dark");

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="beach-3d-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <Sky 
          distance={450000} 
          sunPosition={isDark ? [0, -1, 0] : [1, 0.5, 1]} 
          inclination={isDark ? 0.6 : 0} 
          azimuth={0.25} 
        />
        <ambientLight intensity={isDark ? 0.4 : 1} />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.5 : 2} />
        <SandFloor />
        <FloatingShells />
        <fog attach="fog" args={[isDark ? "#020a13" : "#fef3c7", 10, 50]} />
      </Canvas>
    </div>
  );
}

export default Beach3D;
