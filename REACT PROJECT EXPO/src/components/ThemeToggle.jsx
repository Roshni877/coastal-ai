import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import gsap from "gsap";

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // Animation on theme change
    gsap.fromTo("body", 
      { opacity: 0.8 }, 
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle-btn ${theme}`} 
        onClick={toggleTheme}
        aria-label="Toggle Theme"
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            {theme === "light" ? <FiSun className="sun-icon" /> : <FiMoon className="moon-icon" />}
          </div>
        </div>
      </button>
    </div>
  );
}

export default ThemeToggle;
