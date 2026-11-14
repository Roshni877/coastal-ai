import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, Html, Environment, SpotLight, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function CaveWalls() {
  return (
    <group>
      {/* Cave Ceiling/Walls Enclosure - Dark Rocky Color */}
      <mesh scale={[1, 1, 1]} position={[0, 0, 0]}>
        <sphereGeometry args={[25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          side={THREE.BackSide} 
          roughness={0.9} 
          metalness={0.1} 
          color="#0f172a"
        />
      </mesh>
      {/* Cave Floor - Dark Sand/Rock */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          roughness={1} 
          color="#020617"
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

function AncientBox({ onOpen }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.x = 0; // Centered directly in the middle for mobile and desktop
    meshRef.current.position.y = -3.2 + Math.sin(time * 1.5) * 0.15; // Floating gracefully in the sea
    meshRef.current.position.z = -8; // Optimal distance: clear, centered, and easily tappable
  });

  return (
    <group ref={meshRef} scale={0.8}>
      {/* Ancient Chest Base - Weathered Wood Color */}
      <mesh 
        castShadow 
        receiveShadow 
        onClick={onOpen}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4.5, 2.5, 3]} />
        <meshStandardMaterial color="#2d1b0d" roughness={0.9} metalness={0.2} />
      </mesh>
      
      {/* Open Lid */}
      <mesh 
        position={[0, 1.5, -1.2]} 
        rotation={[-Math.PI / 2.5, 0, 0]} 
        castShadow
        onClick={onOpen}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4.7, 0.6, 3.2]} />
        <meshStandardMaterial color="#1a1108" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Glowing Treasure Inside */}
      <mesh 
        position={[0, 1, 0]}
        onClick={onOpen}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 0.8, 2.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={3} />
      </mesh>

      <Html position={[0, 0, 1.8]} center transform>
        <motion.button 
          className="unlock-btn pro-archive-btn"
          whileHover={{ scale: 1.1, backgroundColor: "#fde68a", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          style={{
            padding: '12px 26px',
            fontSize: '11px',
            backgroundColor: '#f59e0b',
            border: '2px solid #fff',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '25px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            boxShadow: '0 6px 25px rgba(245, 158, 11, 0.6)',
            whiteSpace: 'nowrap'
          }}
        >
          {hovered ? "EXPLORE ARCHIVE" : "UNLOCK THE CAVE"}
        </motion.button>
      </Html>


      <pointLight position={[0, 2, 0]} intensity={5} color="#fbbf24" />
    </group>
  );
}

function Treasure3D({ onOpen }) {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <div className="treasure-3d-container cave-experience" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, backgroundColor: '#000' }}>
      {/* 🌊 IMMERSIVE OCEAN GIF BACKGROUND */}
      <div className="rotating-wave-section" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <img 
          src="https://i.pinimg.com/originals/d3/d6/06/d3d6061eb47bcbb455807d6a15365273.gif" 
          alt="Immersive Ocean Waves" 
          className="premium-bg-gif" 
        />


        <div className="wave-overlay"></div>
      </div>


      <Canvas shadows dpr={[1, 2]} style={{ zIndex: 1, position: 'relative' }}>
        <Suspense fallback={<Html center><div className="loading-text" style={{color: '#f59e0b'}}>Diving into the cave...</div></Html>}>
          <PerspectiveCamera makeDefault position={[0, 2, 18]} fov={50} />
          
          <ambientLight intensity={0.2} />
          
          {/* Dramatic Light from Above Centered Chest */}
          <SpotLight 
            position={[0, 12, -4]} 
            angle={0.6} 
            penumbra={0.8} 
            intensity={20} 
            color="#38bdf8" 
            castShadow 
            attenuation={5}
          />

          <AncientBox onOpen={onOpen} />
          <FishSwarm />
          
          {/* Glowing Plankton / Bubbles */}
          <Sparkles count={150} scale={25} size={2} speed={0.5} opacity={0.6} color="#38bdf8" />
          
          <Environment preset={isDark ? "night" : "city"} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Treasure3D;
