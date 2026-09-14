import React, { useMemo } from "react";
import { motion } from "framer-motion";

const WaterDroplets = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.3,
      size: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="water-droplets-container" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, drop.opacity, 0] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 15}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}
      
      {/* Subtle Ripple/Glow Effect */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default WaterDroplets;
