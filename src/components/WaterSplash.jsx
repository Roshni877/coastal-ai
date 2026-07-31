import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";
import glassBackground from "../assets/glass_ocean.png";

function SnowParticle({ index, speed, size }) {
  const meshRef = useRef();
  
  const state = useMemo(() => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15 + 10,
      -15 - Math.random() * 10
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      -speed,
      0.5 + Math.random() * 0.5
    ),
    wobbleOffset: Math.random() * 100,
    life: 1.0
  }), [speed]);

  useFrame((stateObj) => {
    if (!meshRef.current) return;
    const time = stateObj.clock.getElapsedTime();
    
    state.pos.add(state.velocity);
    state.pos.x += Math.sin(time + state.wobbleOffset) * 0.02;
    
    if (state.pos.z > 10) {
      state.pos.z = -15;
      state.life = 1.0;
    }

    meshRef.current.position.copy(state.pos);
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    
    meshRef.current.material.opacity = state.life;
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.8}
        roughness={0}
        metalness={0.5}
      />
    </mesh>
  );
}

function StudioBackground() {
  const texture = useLoader(THREE.TextureLoader, glassBackground);
  return (
    <group position={[0, 0, 4.5]}>
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[50, 40]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color="#1e40af" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function Snowfall() {
  const particles = useMemo(() => 
    Array.from({ length: 250 }, (_, i) => ({
      index: i,
      speed: 0.05 + Math.random() * 0.1,
      size: 0.05 + Math.random() * 0.12
    })), []);

  return (
    <>
      <StudioBackground />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      
      {particles.map((p) => (
        <SnowParticle key={p.index} {...p} />
      ))}
      
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 10, 10]} intensity={2} color="#ffffff" />
    </>
  );
}

export default function WaterSplash() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 10,
      background: '#000'
    }}>
      <Canvas dpr={1} gl={{ antialias: false }}>
        <React.Suspense fallback={null}>
          <Snowfall />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
