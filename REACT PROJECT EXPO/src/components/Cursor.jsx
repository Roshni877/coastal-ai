import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function Cursor() {
  const dotRef = useRef();
  const glowRef = useRef();

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;

    // Set initial positions off-screen
    gsap.set([dot, glow], { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      // Small hand follows immediately
      gsap.to(dot, {
        x: clientX,
        y: clientY,
        duration: 0.1,
      });

      // Glow follows with drag
      gsap.to(glow, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: "power2.out",
      });

      // Detect if hovering over clickable element
      const target = e.target;
      const isClickable = target.closest('a, button, .interactive, .btn-premium-explore, .nav-links a');
      
      if (isClickable) {
        dot.classList.add('pointer-active');
      } else {
        dot.classList.remove('pointer-active');
      }
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-hand-cursor">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3V11M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V11M13 3C13 3.55228 13.4477 4 14 4C14.5523 4 15 3.55228 15 3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3ZM11 3C11 3.55228 10.5523 4 10 4C9.44772 4 9 3.55228 9 3C9 2.44772 9.44772 2 10 2C10.5523 2 11 2.44772 11 3ZM15 3V11M9 3V11M17 6V11M17 6C17 5.44772 16.5523 5 16 5C15.4477 5 15 5.44772 15 6V11M17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5C17.4477 5 17 5.44772 17 6ZM19 6V11M7 8V14L10 17H16L19 14V11M7 8C7 7.44772 6.55228 7 6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44771 9 6 9C6.55228 9 7 8.55228 7 8ZM7 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div ref={glowRef} className="cursor-glow"></div>
    </>
  );
}

export default Cursor;
