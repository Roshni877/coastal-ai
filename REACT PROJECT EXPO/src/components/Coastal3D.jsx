import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useTexture, Sky, Html } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 newPosition = position;
    
    // Smooth natural waves
    float wave = sin(position.x * 0.5 + uTime * 0.5) * 0.3;
    wave += sin(position.y * 0.8 + uTime * 0.7) * 0.2;
    
    // Dynamic mouse interaction
    float dist = distance(position.xy, uMouse * 20.0);
    float mouseInfluence = smoothstep(12.0, 0.0, dist);
    
    // Lift the water and add a "ripple" effect near the mouse
    newPosition.z += wave + (mouseInfluence * 2.5);
    vElevation = newPosition.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uOpacity;
  uniform vec2 uMouse;

  void main() {
    // Natural ocean color grading without texture dependencies
    vec3 lightColor = vec3(0.05, 0.75, 0.95);
    vec3 deepColor = vec3(0.01, 0.12, 0.28);
    vec3 waveTinges = vec3(0.3, 0.9, 1.0);
    
    vec3 finalColor = mix(deepColor, lightColor, vElevation + 0.4);
    finalColor = mix(finalColor, waveTinges, clamp(vElevation * 0.7, 0.0, 1.0));
    
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

function Waves({ isDark }) {
  const meshRef = useRef();

  // Stable uniforms object without texture dependencies
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uOpacity: { value: 0.85 }
  }), []);

  // Update opacity when theme changes
  React.useEffect(() => {
    uniforms.uOpacity.value = isDark ? 0.6 : 0.85;
  }, [isDark, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uMouse.value.lerp(state.mouse, 0.15);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[60, 60, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    camera.position.z = 12 + Math.sin(time * 0.1) * 2;
    camera.position.y = 5 + Math.cos(time * 0.1) * 1;
    camera.lookAt(0, 0, -5);
  });
  return null;
}

function Coastal3D() {
  const [isDark, setIsDark] = React.useState(document.documentElement.getAttribute("data-theme") === "dark");
  const [webglSupported, setWebglSupported] = React.useState(true);

  React.useEffect(() => {
    // Check if WebGL is supported on initialization
    try {
      const canvas = document.createElement("canvas");
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(supported);
    } catch (e) {
      setWebglSupported(false);
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="three-container">
      {webglSupported ? (
        <Canvas dpr={[1, 1.5]}>
          <Suspense fallback={<Html center><div className="loading-text">Loading Scenery...</div></Html>}>
            <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={45} />
            <Sky
              distance={450000}
              sunPosition={isDark ? [0, -1, 0] : [1, 0.2, 1]}
              inclination={isDark ? 0.6 : 0}
              azimuth={0.25}
            />
            <ambientLight intensity={isDark ? 0.3 : 1.2} />
            <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.5 : 2} color={isDark ? "#1e293b" : "#ffffff"} />
            <Waves isDark={isDark} />
            <CameraController />
            <fog attach="fog" args={[isDark ? "#020a13" : "#f0f9ff", 10, 40]} />
          </Suspense>
        </Canvas>
      ) : (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDark 
            ? 'linear-gradient(180deg, #020a13 0%, #07162c 100%)' 
            : 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
          zIndex: -1
        }} />
      )}
      <div className="canvas-overlay" style={{
        background: isDark
          ? 'linear-gradient(180deg, rgba(2, 10, 19, 0) 0%, rgba(2, 10, 19, 0.9) 100%)'
          : 'linear-gradient(180deg, rgba(240, 249, 255, 0) 0%, rgba(240, 249, 255, 0.4) 100%)'
      }}></div>
    </div>
  );
}

export default Coastal3D;
