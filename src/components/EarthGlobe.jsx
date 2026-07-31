import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const RealisticSatellite = ({ radius, speed, offset }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    meshRef.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.5) * (radius * 0.3),
      Math.sin(t) * radius
    );
    meshRef.current.rotation.y = t * 2;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={1}
          roughness={0.1}
          emissive="#443300"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.005]} />
        <meshStandardMaterial color="#001a33" emissive="#003366" emissiveIntensity={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.005]} />
        <meshStandardMaterial color="#001a33" emissive="#003366" emissiveIntensity={0.5} metalness={0.8} />
      </mesh>
      <pointLight color="#FFD700" intensity={0.2} distance={1} />
    </group>
  );
};

const Moon = () => {
  const moonRef = useRef();
  const [moonMap] = useLoader(THREE.TextureLoader, [
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg",
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    moonRef.current.position.set(Math.cos(t) * 10, 0, Math.sin(t) * 10);
    moonRef.current.rotation.y = t;
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial map={moonMap} />
    </mesh>
  );
};

const CoastlineHighlight = ({ onExplore }) => {
  const { camera, controls } = useThree();
  const [hovered, setHovered] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const ringRef = useRef();
  const markerRef = useRef();
  const flareRef = useRef();

  // Precise coordinates for India's Western Coastline (Western Ghats)
  const lat = 14.5 * (Math.PI / 180);
  const lon = 165.0 * (Math.PI / 180); 
  const radius = 3.5;

  useFrame(({ clock }) => {
    if (ringRef.current && !isExploring) {
      ringRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.1);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onExplore || !markerRef.current || isExploring) return;

    setIsExploring(true);
    if (controls) controls.enabled = false;

    // Get the current world position of the marker to account for Earth's rotation
    const markerWorldPos = new THREE.Vector3();
    markerRef.current.getWorldPosition(markerWorldPos);
    
    // Calculate the direction from center to marker
    const direction = markerWorldPos.clone().normalize();

    const timeline = gsap.timeline({
      onComplete: () => onExplore()
    });

    const midDist = radius * 1.5;
    const midPos = direction.clone().multiplyScalar(midDist);

    const finalDist = 0.1; 
    const finalPos = direction.clone().multiplyScalar(finalDist);

    // Initial Flare expansion
    if (flareRef.current) {
        timeline.to(flareRef.current.scale, { x: 50, y: 50, z: 1, duration: 2, ease: "power2.in" }, 0);
        timeline.to(flareRef.current.material, { opacity: 1, duration: 1.5, ease: "power1.in" }, 0);
    }

    // Sequence
    timeline.to(camera.position, {
      x: midPos.x,
      y: midPos.y,
      z: midPos.z,
      duration: 1,
      ease: "power2.in",
      onUpdate: () => camera.lookAt(0, 0, 0)
    }, 0);

    timeline.to(camera.position, {
      x: finalPos.x,
      y: finalPos.y,
      z: finalPos.z,
      duration: 1.5,
      ease: "expo.in",
      onUpdate: () => camera.lookAt(0, 0, 0)
    }, 1);
  };

  return (
    <group rotation={[0, lon, 0]}>
      <group rotation={[-lat, 0, 0]}>
        <group ref={markerRef} position={[0, 0, radius + 0.05]} rotation={[0, 0, 0.25]}>
          {/* Warp Flare Effect - Engulfs the screen in white */}
          <mesh ref={flareRef} scale={[0.1, 0.1, 1]} position={[0, 0, 0.1]}>
            <circleGeometry args={[1, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>

          {/* Main Oval Marker - Hidden during exploration */}
          <mesh
            onClick={handleClick}
            onPointerOver={() => !isExploring && setHovered(true)}
            onPointerOut={() => !isExploring && setHovered(false)}
            scale={[0.18, 0.9, 1]}
            visible={!isExploring}
          >
            <circleGeometry args={[0.6, 64]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
            <mesh position={[0, 0, 0.01]}>
              <ringGeometry args={[0.55, 0.6, 64]} />
              <meshBasicMaterial color={hovered ? "#ffffff" : "#4ade80"} transparent opacity={0.9} />
            </mesh>
            <mesh ref={ringRef} position={[0, 0, 0.02]}>
              <ringGeometry args={[0.65, 0.85, 64]} />
              <meshBasicMaterial color="#4ade80" transparent opacity={0.5} />
            </mesh>
          </mesh>

          {/* Dynamic Label - Hidden during exploration */}
          {!isExploring && (
            <Html distanceFactor={10} position={[0.5, 0, 0]}>
              <div style={{
                background: 'rgba(74, 222, 128, 0.95)',
                color: '#000',
                padding: '10px 24px',
                borderRadius: '60px',
                fontSize: '11px',
                fontWeight: '900',
                whiteSpace: 'nowrap',
                border: '1px solid #4ade80',
                fontFamily: "'Outfit', sans-serif",
                transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                pointerEvents: 'none',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 50px rgba(74, 222, 128, 0.5)',
                transform: `scale(${hovered ? 1 : 0}) translateX(${hovered ? '0' : '-10px'})`,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                opacity: hovered ? 1 : 0,
                visibility: hovered ? 'visible' : 'hidden'
              }}>
                ENTER COASTAL AI
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
};

const Earth = ({ onExplore }) => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const [map, bumpMap, specularMap, cloudMap] = useLoader(THREE.TextureLoader, [
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.03;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.04;
  });

  return (
    <group>
      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshPhongMaterial
          color="#aaddff"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={earthRef}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshPhongMaterial
          map={map}
          bumpMap={bumpMap}
          bumpScale={0.2}
          specularMap={specularMap}
          specular={new THREE.Color("#ffffff")}
          shininess={35}
        />
        <CoastlineHighlight onExplore={onExplore} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[3.55, 64, 64]} />
        <meshPhongMaterial map={cloudMap} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      <RealisticSatellite radius={4.2} speed={0.3} offset={0} />
      <RealisticSatellite radius={5.0} speed={0.2} offset={Math.PI} />
      <RealisticSatellite radius={5.8} speed={0.4} offset={1.5} />
      <Moon />
    </group>
  );
};

const EarthGlobe = ({ onExplore }) => {
  return (
    <div className="earth-globe-wrapper" style={{ width: '100vw', height: '100vh', cursor: 'default', position: 'fixed', top: 0, left: 0 }}>
      <Canvas camera={{ position: [8, 3.5, 6], fov: 45 }} style={{ width: '100%', height: '100%', background: '#000' }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[30, 20, -40]} intensity={25} color="#fffcf5" />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <Stars radius={300} depth={60} count={12000} factor={7} saturation={0} fade speed={0.8} />

        <Suspense fallback={null}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <Earth onExplore={onExplore} />
          </Float>
        </Suspense>

        <OrbitControls makeDefault enableZoom={true} enablePan={false} rotateSpeed={0.3} minDistance={5} maxDistance={25} />
      </Canvas>
    </div>
  );
};

export default EarthGlobe;
