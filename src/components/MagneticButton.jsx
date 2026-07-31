import React, { useRef } from "react";
import gsap from "gsap";

function MagneticButton({ children, className = "" }) {
  const ref = useRef();

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const reset = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={`magnetic-wrap ${className}`}
      style={{ display: "inline-block" }}
    >
      {children}
    </div>
  );
}

export default MagneticButton;
