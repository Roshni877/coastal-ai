import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Shield, UserCheck, LogIn } from "lucide-react";
import LoginModal from "./LoginModal";

function Navbar({ user, setUser }) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem("coastal_ai_user", JSON.stringify(authenticatedUser));
    } catch (e) {
      console.warn("Storage not available", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("coastal_ai_user");
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  return (
    <>
      <header className="nav-pill-container" style={{ position: "sticky", top: "12px", zIndex: 9000 }}>
        <nav
          className="nav-pill"
          style={{
            background: "rgba(11, 19, 41, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(56, 189, 248, 0.22)",
            borderRadius: "50px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)"
          }}
        >
          {/* Logo & Platform Name */}
          <NavLink to="/" className="logo-group" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 0 12px rgba(14, 165, 233, 0.5)"
              }}
            >
              <Shield size={18} />
            </div>
            <div className="logo-text-stack">
              <span className="logo-text-bold" style={{ letterSpacing: "1px", color: "#38bdf8" }}>COASTAL</span>
              <span className="logo-text-bold" style={{ letterSpacing: "1px", color: "#10b981" }}>AI</span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "active-link" : ""}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
              Dashboard
            </NavLink>
            <NavLink to="/visualization" className={({ isActive }) => isActive ? "active-link" : ""}>
              Visualizations
            </NavLink>
            <NavLink to="/comparison" className={({ isActive }) => isActive ? "active-link" : ""}>
              Comparison
            </NavLink>
            <NavLink to="/reporting" className={({ isActive }) => isActive ? "active-link" : ""}>
              Reporting & Protection
            </NavLink>
            <NavLink to="/methodology" className={({ isActive }) => isActive ? "active-link" : ""}>
              Methodology
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
              About Us
            </NavLink>
          </div>

          {/* Demonstration Access / Login Button */}
          <div style={{ marginLeft: "8px" }}>
            {user ? (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#34d399",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <UserCheck size={14} />
                <span>{user.role}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(13, 148, 136, 0.3) 100%)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "#e0f2fe",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <LogIn size={14} />
                <span>Access Portal</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Login / Demo Access Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;
