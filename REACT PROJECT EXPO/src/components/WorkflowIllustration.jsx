import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./WorkflowIllustration.css";

const WorkflowIllustration = () => {
  const [membersWithGuide, setMembersWithGuide] = useState([]);

  const toggleMeeting = (id) => {
    setMembersWithGuide((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const members = [
    { id: 1, homePos: { x: 200, y: 250 }, color: "#D8B4FE" }, // Pastel Purple
    { id: 2, homePos: { x: 400, y: 250 }, color: "#99F6E4" }, // Mint
    { id: 3, homePos: { x: 200, y: 350 }, color: "#FDA4AF" }, // Rose
    { id: 4, homePos: { x: 400, y: 350 }, color: "#BAE6FD" }, // Sky Blue
  ];

  const meetingArea = { x: 550, y: 200 };

  return (
    <div className="workflow-container">
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="workflow-svg-3d"
      >
        <defs>
          <linearGradient id="tableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* --- GUIDE TABLE (3D) --- */}
        <g className="guide-table">
          <path d="M550 150 L750 150 L780 180 L520 180 Z" fill="url(#tableGradient)" filter="url(#shadow)" />
          <path d="M520 180 L780 180 L780 190 L520 190 Z" fill="#0F172A" />
          {/* Table Legs */}
          <rect x="530" y="190" width="6" height="40" fill="#334155" />
          <rect x="764" y="190" width="6" height="40" fill="#334155" />
          <rect x="560" y="185" width="4" height="20" fill="#0F172A" opacity="0.4" />
          <rect x="740" y="185" width="4" height="20" fill="#0F172A" opacity="0.4" />
        </g>

        {/* --- MAIN TABLE (3D) --- */}
        <g className="main-table">
          <path d="M150 300 L450 300 L500 400 L100 400 Z" fill="url(#tableGradient)" filter="url(#shadow)" />
          <path d="M100 400 L500 400 L500 415 L100 415 Z" fill="#0F172A" />
          {/* Table Legs - Properly Visible */}
          <rect x="110" y="415" width="10" height="70" fill="#334155" />
          <rect x="480" y="415" width="10" height="70" fill="#334155" />
          <rect x="160" y="405" width="8" height="40" fill="#0F172A" opacity="0.4" />
          <rect x="430" y="405" width="8" height="40" fill="#0F172A" opacity="0.4" />
        </g>

        {/* Guide Character (Simple Iconic) */}
        <g transform="translate(635, 110)">
          <circle cx="15" cy="0" r="12" fill="#94A3B8" />
          <rect x="0" y="15" width="30" height="30" rx="5" fill="#94A3B8" />
        </g>

        {/* Members (Colorful Iconic) */}
        {members.map((m) => {
          const isAtMeeting = membersWithGuide.includes(m.id);
          const meetingOffset = {
            1: { x: -60, y: 30 },
            2: { x: -20, y: 30 },
            3: { x: 20, y: 30 },
            4: { x: 60, y: 30 }
          }[m.id];

          return (
            <motion.g
              key={m.id}
              animate={{
                x: isAtMeeting ? meetingArea.x + meetingOffset.x : m.homePos.x,
                y: isAtMeeting ? meetingArea.y + meetingOffset.y : m.homePos.y,
                scale: isAtMeeting ? 0.8 : 1,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={() => toggleMeeting(m.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Colorful Iconic Persona */}
              <circle cx="15" cy="0" r="12" fill={m.color} />
              <rect x="0" y="15" width="30" height="30" rx="6" fill={m.color} />
              
              {/* Laptop */}
              <rect x="5" y="30" width="20" height="12" rx="1" fill="#1E293B" />
            </motion.g>
          );
        })}
      </svg>
      
      <div className="workflow-status-hud">
        <p>TEAM WORK IN PROGRESS</p>
        <div className="status-dots">
          {members.map(m => (
            <div key={m.id} className={`status-dot ${membersWithGuide.includes(m.id) ? "meeting" : "working"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowIllustration;
