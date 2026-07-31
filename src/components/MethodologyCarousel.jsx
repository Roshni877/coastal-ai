import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Html, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: "01", title: "DATA COLLECTION", desc: "Sourcing multi-temporal Sentinel-2 and Landsat imagery across years (2020-2024)." },
  { id: "02", title: "WATER INDEXING", desc: "Calculating NDWI / MNDWI spectral indices to isolate water boundaries from coastal land." },
  { id: "03", title: "DEEP LEARNING", desc: "Training DeepLabV3+ neural network models to segment land and water pixels automatically." },
  { id: "04", title: "VECTOR EXTRACTION", desc: "Generating high-precision sub-pixel vector lines representing the coastal edge." },
  { id: "05", title: "RATE ANALYSIS", desc: "Running localized transect calculations to achieve 85.48% shoreline prediction accuracy." },
];

function Card({ step, index, activeIndex, onSelect, isDark }) {
  const meshRef = useRef();
  const angle = (index / steps.length) * Math.PI * 2;
  const radius = 5;
  const isActive = activeIndex === index;

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.4;

    if (activeIndex === null) {
      // Normal rotation
      const currentAngle = angle - time;
      meshRef.current.position.x = Math.sin(currentAngle) * radius;
      meshRef.current.position.z = Math.cos(currentAngle) * radius;
      meshRef.current.rotation.y = currentAngle + Math.PI;
      meshRef.current.scale.set(1, 1, 1);
      meshRef.current.visible = true;
    } else if (isActive) {
      // Zoom to focus
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 5), 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.scale.lerp(new THREE.Vector3(0.95, 0.95, 0.95), 0.1);
      meshRef.current.visible = true;
    } else {
      // Push back others and fade
      const currentAngle = angle - time;
      meshRef.current.position.x = Math.sin(currentAngle) * (radius + 2);
      meshRef.current.position.z = Math.cos(currentAngle) * (radius + 2) - 5;
      meshRef.current.rotation.y = currentAngle + Math.PI;
      meshRef.current.scale.lerp(new THREE.Vector3(0.6, 0.6, 0.6), 0.1);
      // Optional: keep them visible but far away
    }
  });

  return (
    <group ref={meshRef}>
      <mesh onClick={() => onSelect(index)}>
        <planeGeometry args={[2.2, 2.9]} />
        <meshStandardMaterial
          color={isDark ? "#1e293b" : "#f0fff4"}
          transparent
          opacity={isActive ? 1 : 0.4}
          roughness={0.3}
          metalness={0.1}
          depthTest={true}
        />
        {/* Postcard border */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.3, 3.0]} />
          <meshStandardMaterial
            color="#86efac"
            transparent
            opacity={isActive ? 0.8 : 0.3}
          />
        </mesh>
        <Html transform position={[0, 0, 0.02]} pointerEvents="none">
          <div 
            className={`postcard-invitation ${isActive ? 'postcard-active' : ''}`} 
            style={{ 
              color: isDark ? '#ffffff' : '#000000', 
              opacity: isActive ? 1 : 0.6,
              width: '195px',
              height: '255px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '4px',
              boxShadow: 'inset 0 0 30px rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)'
            }}
          >
            {/* Postcard Header */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '3px',
                color: '#22c55e',
                textTransform: 'uppercase',
                marginBottom: '10px',
                fontWeight: '500'
              }}>— Step {step.id} —</div>
              
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                letterSpacing: '2px',
                margin: '0',
                lineHeight: '1.2',
                textTransform: 'uppercase',
                color: isDark ? '#ffffff' : '#000000'
              }}>{step.title}</h3>
              
              <div style={{
                width: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                margin: '12px auto',
                opacity: isActive ? 1 : 0.5
              }} />
            </div>

            {/* Postcard Body */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              <p style={{
                fontSize: '0.78rem',
                lineHeight: '1.5',
                fontStyle: 'italic',
                color: isDark ? '#e0e0e0' : '#000000',
                margin: '0',
                padding: '0 8px'
              }}>
                {step.desc}
              </p>
            </div>

            {/* Postcard Footer */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.95rem' }}>🐚</span>
              <div style={{
                width: '24px',
                height: '1px',
                background: '#22c55e',
                opacity: 0.5
              }} />
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '1.5px',
                color: '#22c55e'
              }}>COASTAL</span>
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function MethodologyCarousel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  const handleNext = () => {
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % steps.length));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === null ? 4 : (prev - 1 + steps.length) % steps.length));
  };

  return (
    <div className="methodology-carousel-wrapper">
      {!isOpen ? (
        <motion.div
          className="main-postcard"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          onClick={() => setIsOpen(true)}
        >
          <div className="postcard-seal">🐚</div>
          <h2>THE COASTAL METHOD</h2>
          <p>CLICK TO EXPLORE OUR PROCESS</p>
        </motion.div>
      ) : (
        <div className="carousel-canvas-container">
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} />
            <group position={[0, 0, -2]}>
              {steps.map((step, i) => (
                <Card
                  key={step.id}
                  step={step}
                  index={i}
                  activeIndex={activeIndex}
                  onSelect={(idx) => setActiveIndex(activeIndex === idx ? null : idx)}
                  isDark={isDark}
                />
              ))}
            </group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <mesh position={[0, -7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[10, 32]} />
                <meshStandardMaterial color={isDark ? "#0ea5e9" : "#fde68a"} transparent opacity={0.1} />
              </mesh>
            </Float>
          </Canvas>

          <div className="carousel-navigation">
            <button className="nav-btn prev" onClick={handlePrev}>← PREV</button>
            <button className="nav-btn close" onClick={() => { setIsOpen(false); setActiveIndex(null); }}>CLOSE</button>
            <button className="nav-btn next" onClick={handleNext}>NEXT →</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MethodologyCarousel;
