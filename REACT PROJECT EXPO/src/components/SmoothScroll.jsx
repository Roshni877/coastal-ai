import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function SmoothScroll({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [location.pathname]);

  // Ensure html and body have smooth scrolling enabled and no overflow lock
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.documentElement.classList.remove("has-scroll-smooth");
    document.body.classList.remove("has-scroll-smooth");
  }, []);

  return (
    <div id="scroll-container" style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {children}
    </div>
  );
}

export default SmoothScroll;
