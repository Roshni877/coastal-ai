import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiLock, FiShield, FiInfo, FiCheckCircle } from "react-icons/fi";

export default function LoginModal({ isOpen, onClose, user, onLogin, onLogout }) {
  const [role, setRole] = useState("Research Analyst");
  const [username, setUsername] = useState("researcher@coastal-ai.org");
  const [institution, setInstitution] = useState("SMVITM Coastal Research Unit");

  if (!isOpen) return null;

  const handleDemoLogin = (e) => {
    e.preventDefault();
    const demoUser = {
      username: username || "researcher@coastal-ai.org",
      role: role,
      institution: institution,
      authenticatedAt: new Date().toISOString(),
      isDemo: true
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="login-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(3, 7, 18, 0.75)",
          backdropFilter: "blur(8px)",
          zIndex: 100000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}
      >
        <motion.div
          className="login-modal-box"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--card-bg, #0b1329)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "16px",
            width: "min(460px, 94vw)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(14, 165, 233, 0.15)",
            color: "var(--text-main, #f8fafc)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(14, 165, 233, 0.08)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8"
                }}
              >
                <FiShield size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
                  {user ? "Research Session Active" : "Portal Access"}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  Coastal Erosion Intelligence Platform
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                display: "flex"
              }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "24px" }}>
            {user ? (
              <div>
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "10px",
                    marginBottom: "20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981", fontWeight: 600, fontSize: "0.9rem" }}>
                    <FiCheckCircle size={16} /> Signed in as {user.username}
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "#cbd5e1" }}>
                    <div><strong>Role:</strong> {user.role}</div>
                    <div><strong>Affiliation:</strong> {user.institution}</div>
                    <div><strong>Session:</strong> Academic Evaluation Protocol</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  End Session (Sign Out)
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoLogin}>
                {/* Transparent Academic Notice */}
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(14, 165, 233, 0.08)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: "#93c5fd",
                    lineHeight: "1.45",
                    marginBottom: "18px",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <FiInfo size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong>Demonstration Access:</strong> This prototype provides structured access for academic reviewers and environmental researchers. Backend JWT/OAuth2 integration is architected for production institutional SSO.
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "#cbd5e1" }}>
                    Access Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "0.88rem"
                    }}
                  >
                    <option value="Research Analyst">Research Analyst (Full Analysis & GIS)</option>
                    <option value="Field Investigator">Field Investigator (Reporting & Ground Validation)</option>
                    <option value="Disaster Management Officer">Disaster Management Officer (Risk & Recommendations)</option>
                    <option value="Academic Reviewer">Academic Reviewer (Methodology & Model Evaluation)</option>
                  </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "#cbd5e1" }}>
                    Researcher ID / Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <FiUser style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. researcher@coastal-ai.org"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "#cbd5e1" }}>
                    Institution / Department
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Dept of Computer Science & Engineering"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    border: "1px solid #38bdf8",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(2, 132, 199, 0.3)"
                  }}
                >
                  Enter Research Dashboard
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
