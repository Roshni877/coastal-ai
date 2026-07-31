import React from "react";
import { motion } from "framer-motion";
import PageReveal from "../components/PageReveal";
import TiltCard from "../components/TiltCard";
import WorkflowIllustration from "../components/WorkflowIllustration";

const teamMembers = [
  { id: "01", name: "Roshni", usn: "4MW23CS122", stampSrc: "/team/roshni-stamp.png" },
  { id: "02", name: "Maithri Shetty", usn: "4MW23CS063", stampSrc: "/team/maithri-stamp.png" },
  { id: "03", name: "Raksha", usn: "4MW23CS111", stampSrc: "/team/raksha-stamp.png" },
  { id: "04", name: "Rashmi Salvankar", usn: "4MW23CS115", stampSrc: "/team/rashmi-stamp.png" },
];

function Team() {
  return (
    <PageReveal>
      <motion.main 
        className="page" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        {/* 🔬 IMMERSIVE BACKGROUND */}
        <div className="team-immersive-bg"></div>

        <section className="section-header">
          <span className="tech-tag">Engineering // Intelligence // Unit</span>
          <h1 className="hero-title">Core Development</h1>
        </section>

        <div className="team-node-container">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: "backOut" }}
            >
              <TiltCard>
                <div className="member-node working-effect">
                  <div className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="status-text">TEAMMATE</span>
                  </div>
                  {member.stampSrc && (
                    <div className="member-stamp-wrap">
                      <img src={member.stampSrc} alt={`${member.name} stamp`} className="member-stamp-img" />
                    </div>
                  )}
                  <h3>{member.name}</h3>
                  <p className="usn-tag">COASTAL_ID: {member.usn}</p>
                  
                  {/* Floating Screen Decoration */}
                  <div className="floating-data-bit"></div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <section className="team-workflow-section" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <div className="section-header">
            <h2 style={{ fontSize: '3rem', textAlign: 'center', fontWeight: '800', letterSpacing: '-1px' }}>SYSTEM COLLABORATION</h2>
          </div>
          <WorkflowIllustration />
        </section>

        {/* Global Metadata Footer for Team Page */}
        <div className="team-footer">
          <span>COASTAL_AI // VERSION_1.0.4</span>
          <span>STATION_ID // 74.74.21.E</span>
        </div>
      </motion.main>
    </PageReveal>
  );
}

export default Team;