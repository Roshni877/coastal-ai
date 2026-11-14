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
    meshRef.current.position.x = -12; // Original side position
    meshRef.current.position.y = -5.2 + Math.sin(time) * 0.12; // Floating gracefully in the sea
    meshRef.current.position.z = -14.5; // Deeper in the background
  });

  // Premium Realistic Materials
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#30180d", // Rich deep mahogany polished wood
    roughness: 0.38,
    metalness: 0.08,
  }), []);

  const woodPlankMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#221008", // Darker aged wood for plank recessed grooves
    roughness: 0.5,
    metalness: 0.05,
  }), []);

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#e5a93c", // Antique polished gold
    roughness: 0.22,
    metalness: 0.88,
  }), []);

  const darkGoldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#b88328", // Burnished antique bronze/gold for hinges and brackets
    roughness: 0.32,
    metalness: 0.82,
  }), []);

  const ironKeyholeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#120e0a", // Dark antique iron keyhole interior
    roughness: 0.7,
    metalness: 0.6,
  }), []);

  const treasureGoldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#fbbf24", // Vibrant shimmering pirate gold
    emissive: "#d97706",
    emissiveIntensity: 0.7,
    roughness: 0.18,
    metalness: 0.95,
  }), []);

  const rubyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ef4444",
    emissive: "#b91c1c",
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.3,
  }), []);

  const emeraldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#10b981",
    emissive: "#047857",
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.3,
  }), []);

  const sapphireMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    emissive: "#1d4ed8",
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.3,
  }), []);

  return (
    <group ref={meshRef} scale={0.76}>
      {/* ============================================================== */}
      {/* 1. CHEST BASE (Dark Polished Hardwood Timber & Golden Bands)   */}
      {/* ============================================================== */}
      <group>
        {/* Main Polished Wood Body */}
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[4.9, 2.5, 3.1]} />
        </mesh>

        {/* Horizontal Wooden Plank Grooves (Shipbuilder Timber Craft) */}
        <mesh position={[0, 0.45, 1.56]} material={woodPlankMaterial}>
          <boxGeometry args={[4.88, 0.05, 0.02]} />
        </mesh>
        <mesh position={[0, -0.45, 1.56]} material={woodPlankMaterial}>
          <boxGeometry args={[4.88, 0.05, 0.02]} />
        </mesh>

        {/* Heavy Antique Gold Reinforcement Straps (Vertical Bands) */}
        {/* Left Strap */}
        <mesh position={[-1.6, 0, 0]} material={goldMaterial} castShadow>
          <boxGeometry args={[0.38, 2.54, 3.16]} />
        </mesh>
        {/* Center Strap */}
        <mesh position={[0, 0, 0]} material={goldMaterial} castShadow>
          <boxGeometry args={[0.46, 2.54, 3.16]} />
        </mesh>
        {/* Right Strap */}
        <mesh position={[1.6, 0, 0]} material={goldMaterial} castShadow>
          <boxGeometry args={[0.38, 2.54, 3.16]} />
        </mesh>

        {/* Heavy Gold Corner Reinforcements & Rim Protectors */}
        {/* Top Rim Collar */}
        <mesh position={[0, 1.25, 0]} material={darkGoldMaterial}>
          <boxGeometry args={[5.0, 0.08, 3.2]} />
        </mesh>
        {/* Bottom Base Rim */}
        <mesh position={[0, -1.25, 0]} material={darkGoldMaterial}>
          <boxGeometry args={[5.02, 0.1, 3.22]} />
        </mesh>

        {/* 4 Vertical Corner L-Brackets */}
        <mesh position={[-2.45, 0, 1.55]} material={darkGoldMaterial}>
          <boxGeometry args={[0.12, 2.54, 0.12]} />
        </mesh>
        <mesh position={[2.45, 0, 1.55]} material={darkGoldMaterial}>
          <boxGeometry args={[0.12, 2.54, 0.12]} />
        </mesh>
        <mesh position={[-2.45, 0, -1.55]} material={darkGoldMaterial}>
          <boxGeometry args={[0.12, 2.54, 0.12]} />
        </mesh>
        <mesh position={[2.45, 0, -1.55]} material={darkGoldMaterial}>
          <boxGeometry args={[0.12, 2.54, 0.12]} />
        </mesh>

        {/* Metallic Gold Rivets / Studs along Front Straps */}
        {[-1.6, 0, 1.6].map((xPos, idx) => (
          <React.Fragment key={`stud-col-${idx}`}>
            {[-1.0, -0.6, 0.6, 1.0].map((yPos, sIdx) => (
              <mesh key={`stud-${idx}-${sIdx}`} position={[xPos, yPos, 1.6]} material={goldMaterial}>
                <sphereGeometry args={[0.07, 10, 10]} />
              </mesh>
            ))}
          </React.Fragment>
        ))}

        {/* ============================================================== */}
        {/* 2. ANTIQUE ORNATE PIRATE LOCK & CLASP (Front Center)           */}
        {/* ============================================================== */}
        <group position={[0, 0.55, 1.62]}>
          {/* Detailed Golden Escutcheon Lock Plate */}
          <mesh material={darkGoldMaterial} castShadow>
            <boxGeometry args={[0.75, 0.65, 0.08]} />
          </mesh>
          {/* Inner Golden Lock Core */}
          <mesh position={[0, 0, 0.05]} material={goldMaterial}>
            <boxGeometry args={[0.55, 0.45, 0.05]} />
          </mesh>
          {/* Antique Keyhole */}
          <mesh position={[0, 0.04, 0.08]} material={ironKeyholeMaterial}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
          <mesh position={[0, -0.06, 0.08]} material={ironKeyholeMaterial}>
            <boxGeometry args={[0.05, 0.12, 0.02]} />
          </mesh>
          {/* Heavy Antique Padlock Loop / Clasp */}
          <mesh position={[0, 0.18, 0.09]} material={goldMaterial}>
            <torusGeometry args={[0.16, 0.04, 12, 24, Math.PI]} rotation={[Math.PI, 0, 0]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* 3. GLOWING PIRATE TREASURE INSIDE THE CHEST                    */}
        {/* ============================================================== */}
        <group position={[0, 0.8, 0]}>
          {/* Glowing Mound of Pirate Gold & Bullion */}
          <mesh material={treasureGoldMaterial} castShadow>
            <boxGeometry args={[4.4, 0.7, 2.6]} />
          </mesh>
          {/* Stacked Gold Ingots / Bars */}
          <mesh position={[-0.8, 0.45, 0.2]} rotation={[0, 0.2, 0]} material={treasureGoldMaterial}>
            <boxGeometry args={[0.9, 0.22, 0.45]} />
          </mesh>
          <mesh position={[0.7, 0.45, -0.3]} rotation={[0, -0.35, 0]} material={treasureGoldMaterial}>
            <boxGeometry args={[1.0, 0.22, 0.5]} />
          </mesh>
          <mesh position={[0.1, 0.48, 0.4]} rotation={[0, 0.1, 0]} material={treasureGoldMaterial}>
            <boxGeometry args={[0.85, 0.22, 0.42]} />
          </mesh>

          {/* Shimmering Pirate Gems & Jewels */}
          <mesh position={[-1.2, 0.48, -0.5]} material={rubyMaterial}>
            <octahedronGeometry args={[0.18]} />
          </mesh>
          <mesh position={[1.3, 0.48, 0.3]} material={emeraldMaterial}>
            <octahedronGeometry args={[0.16]} />
          </mesh>
          <mesh position={[-0.2, 0.52, -0.4]} material={sapphireMaterial}>
            <octahedronGeometry args={[0.17]} />
          </mesh>
          <mesh position={[0.9, 0.52, -0.6]} material={rubyMaterial}>
            <octahedronGeometry args={[0.15]} />
          </mesh>

          {/* Radiant Golden Glow illuminating inside and lid */}
          <pointLight position={[0, 0.8, 0]} intensity={6.5} color="#fbbf24" distance={9} decay={2} />
        </group>
      </group>

      {/* ============================================================== */}
      {/* 4. OPENED VAULTED PIRATE CHEST LID (Curved Barrel Vault Top)   */}
      {/* ============================================================== */}
      {/* Hinge axis placed at top-back rim: y = 1.25, z = -1.55 */}
      <group position={[0, 1.25, -1.55]} rotation={[-Math.PI / 2.7, 0, 0]}>
        {/* Curved Vaulted Lid Wood Body (Half-Cylinder Barrel Arch) */}
        <mesh 
          position={[0, 0, 1.55]} 
          rotation={[0, 0, -Math.PI / 2]} 
          material={woodMaterial}
          castShadow
        >
          <cylinderGeometry args={[1.56, 1.56, 4.96, 32, 1, false, -Math.PI / 2, Math.PI]} />
        </mesh>

        {/* Flat Wood Endcaps on Left and Right of Lid */}
        <mesh position={[-2.48, 0, 1.55]} rotation={[0, -Math.PI / 2, 0]} material={woodMaterial}>
          <circleGeometry args={[1.56, 32, 0, Math.PI]} />
        </mesh>
        <mesh position={[2.48, 0, 1.55]} rotation={[0, Math.PI / 2, 0]} material={woodMaterial}>
          <circleGeometry args={[1.56, 32, 0, Math.PI]} />
        </mesh>

        {/* Curved Antique Gold Straps Hugging the Lid Vault */}
        {[-1.6, 0, 1.6].map((xPos, idx) => (
          <mesh 
            key={`lid-strap-${idx}`}
            position={[xPos, 0, 1.55]} 
            rotation={[0, 0, -Math.PI / 2]} 
            material={goldMaterial}
            castShadow
          >
            <cylinderGeometry args={[1.59, 1.59, idx === 1 ? 0.44 : 0.38, 32, 1, false, -Math.PI / 2, Math.PI]} />
          </mesh>
        ))}

        {/* Lid Gilded Perimeter Rim Collar */}
        <mesh position={[0, 0, 1.55]} material={darkGoldMaterial}>
          <boxGeometry args={[5.04, 0.12, 3.2]} />
        </mesh>

        {/* Heavy Antique Hinges Connecting Base and Lid */}
        <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={darkGoldMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.45, 16]} />
        </mesh>
        <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={darkGoldMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.45, 16]} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 5. FRONT EMBOSSED PIRATE GOLD PLAQUE (Readable, Centered Text) */}
      {/* ============================================================== */}
      <Html position={[0, -0.22, 1.72]} center transform>
        <motion.button 
          className="unlock-btn pro-archive-btn pirate-chest-plaque"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          onPointerOver={() => setHovered(true)} 
          onPointerOut={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '12px',
            fontFamily: "'Outfit', 'Cinzel', Georgia, serif",
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: hovered ? '#ffffff' : '#fef08a',
            background: hovered 
              ? 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)' 
              : 'linear-gradient(135deg, #2b180d 0%, #170d05 50%, #2b180d 100%)',
            border: '2px solid #e5a93c',
            borderRadius: '12px',
            boxShadow: hovered 
              ? '0 0 25px rgba(245, 158, 11, 0.8), inset 0 0 15px rgba(254, 240, 138, 0.5), 0 8px 30px rgba(0, 0, 0, 0.9)'
              : '0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.2), 0 6px 20px rgba(0, 0, 0, 0.8)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: hovered 
              ? '0 0 12px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)' 
              : '0 0 10px rgba(245, 158, 11, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)',
            position: 'relative',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
        >
          <span style={{ fontSize: '13px', color: '#f59e0b', filter: 'drop-shadow(0 0 4px #fbbf24)' }}>✦</span>
          <span>{hovered ? "EXPLORE ARCHIVE" : "UNLOCK THE CAVE"}</span>
          <span style={{ fontSize: '13px', color: '#f59e0b', filter: 'drop-shadow(0 0 4px #fbbf24)' }}>✦</span>
        </motion.button>
      </Html>

      {/* Warm Fill Light Highlighting Front Antique Metal & Carvings */}
      <pointLight position={[0, -0.5, 3.2]} intensity={2.8} color="#fed7aa" distance={7} />
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
          
          <ambientLight intensity={0.35} />
          
          {/* Dramatic Light from Cave Entrance Shining on the Pirate Chest */}
          <SpotLight 
            position={[-12, 11, -12]} 
            angle={0.45} 
            penumbra={0.9} 
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
