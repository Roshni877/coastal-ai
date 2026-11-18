import React, { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useLocation } from "react-router-dom";

function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    const scrollContainer = document.querySelector("#scroll-container");
    if (!scrollContainer) return;

    const scroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      multiplier: 1.1,
      lerp: 0.1,
    });

    window.locomotiveScroll = scroll;

    const timer = setTimeout(() => {
      try {
        scroll.update();
      } catch (err) {
        // ignore
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      try {
        scroll.destroy();
      } catch (err) {
        // ignore
      }
      window.locomotiveScroll = null;
    };
  }, [location.pathname]);

  return <div id="scroll-container" data-scroll-container>{children}</div>;
}

export default SmoothScroll;
