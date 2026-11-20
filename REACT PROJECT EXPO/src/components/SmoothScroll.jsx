import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 50);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return <div id="scroll-container">{children}</div>;
}

export default SmoothScroll;
