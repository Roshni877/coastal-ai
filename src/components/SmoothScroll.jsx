import React, { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

function SmoothScroll({ children }) {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("#scroll-container"),
      smooth: true,
      multiplier: 1.2,
      lerp: 0.1,
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return <div id="scroll-container" data-scroll-container>{children}</div>;
}

export default SmoothScroll;