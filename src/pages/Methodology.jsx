import React, { Suspense } from "react";
import { motion } from "framer-motion";
import PageReveal from "../components/PageReveal";
import Beach3D from "../components/Beach3D";
import MethodologyCarousel from "../components/MethodologyCarousel";

function Methodology() {
  return (
    <PageReveal>
      <motion.main className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Suspense fallback={null}>
          <Beach3D />
        </Suspense>

        <section className="full-screen-center" style={{ marginTop: '20px', marginBottom: '0px', paddingBottom: '0px' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', lineHeight: '1.1' }}
          >
            <motion.span 
              className="tech-meta"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: '#ffd700', fontFamily: 'Arial, sans-serif', letterSpacing: '3px', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}
            >
              ECO-SYSTEM // PROTECTION
            </motion.span>

            {/* CUTE BISCUIT-SHAPED HEADING */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {/* DIVE - Row 1 */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {['D','I','V','E'].map((char, i) => (
                  <motion.div
                    key={`dive-${i}`}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6 + i * 0.18, duration: 0.5, type: 'spring', stiffness: 200 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '22px',
                      background: 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 40%, #90caf9 100%)',
                      boxShadow: `
                        inset 2px 2px 4px rgba(255,255,255,0.8),
                        inset -2px -2px 4px rgba(25,118,210,0.15),
                        4px 6px 0px #5c9fd6,
                        6px 8px 15px rgba(25,118,210,0.25)
                      `,
                      border: '3px solid #e1f5fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'default'
                    }}
                  >
                    {/* Tiny animal ears on D */}
                    {char === 'D' && (
                      <>
                        <div style={{ position: 'absolute', top: '-10px', left: '10px', width: '14px', height: '18px', borderRadius: '50% 50% 40% 40%', background: 'linear-gradient(180deg, #bbdefb, #90caf9)', boxShadow: '2px 2px 0px #5c9fd6', border: '2px solid #e1f5fe' }} />
                        <div style={{ position: 'absolute', top: '-10px', right: '10px', width: '14px', height: '18px', borderRadius: '50% 50% 40% 40%', background: 'linear-gradient(180deg, #bbdefb, #90caf9)', boxShadow: '2px 2px 0px #5c9fd6', border: '2px solid #e1f5fe' }} />
                      </>
                    )}
                    {/* Tiny tail on E */}
                    {char === 'E' && (
                      <div style={{ position: 'absolute', bottom: '-6px', right: '-8px', width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(180deg, #bbdefb, #90caf9)', boxShadow: '2px 2px 0px #5c9fd6', border: '2px solid #e1f5fe' }} />
                    )}
                    <span style={{
                      fontSize: '2.6rem',
                      fontWeight: '800',
                      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif",
                      color: '#1565c0',
                      textShadow: '1px 2px 0px #e3f2fd, -1px -1px 0px rgba(255,255,255,0.8)',
                      position: 'relative',
                      zIndex: 2
                    }}>{char}</span>
                    {/* Tiny face on V */}
                    {char === 'V' && (
                      <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1565c0' }} />
                        <div style={{ width: '3px', height: '2px', borderRadius: '50%', background: '#ff8a80' }} />
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1565c0' }} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* INTO - Row 2 */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {'INTO'.split('').map((char, i) => (
                  <motion.div
                    key={`into-${i}`}
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.12, duration: 0.45, type: 'spring', stiffness: 180 }}
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '18px',
                      background: 'linear-gradient(145deg, #f3e5f5 0%, #e1bee7 30%, #ce93d8 100%)',
                      boxShadow: `
                        inset 2px 2px 3px rgba(255,255,255,0.7),
                        inset -2px -2px 3px rgba(106,27,154,0.12),
                        3px 4px 0px #ba68c8,
                        4px 6px 12px rgba(106,27,154,0.2)
                      `,
                      border: '2.5px solid #f3e5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Tiny face on O */}
                    {char === 'O' && (
                      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6a1b9a' }} />
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6a1b9a' }} />
                      </div>
                    )}
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif",
                      color: '#4a148c',
                      textShadow: '1px 1px 0px #f3e5f5, -1px -1px 0px rgba(255,255,255,0.7)',
                      position: 'relative',
                      zIndex: 2
                    }}>{char}</span>
                  </motion.div>
                ))}
              </div>

              {/* PROCESS - Row 3 */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {'PROCESS'.split('').map((char, i) => (
                  <motion.div
                    key={`process-${i}`}
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.9 + i * 0.12, duration: 0.45, type: 'spring', stiffness: 180 }}
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '18px',
                      background: 'linear-gradient(145deg, #f3e5f5 0%, #e1bee7 30%, #ce93d8 100%)',
                      boxShadow: `
                        inset 2px 2px 3px rgba(255,255,255,0.7),
                        inset -2px -2px 3px rgba(106,27,154,0.12),
                        3px 4px 0px #ba68c8,
                        4px 6px 12px rgba(106,27,154,0.2)
                      `,
                      border: '2.5px solid #f3e5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Tiny face on O */}
                    {char === 'O' && (
                      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6a1b9a' }} />
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6a1b9a' }} />
                      </div>
                    )}
                    {/* Tiny ears on P */}
                    {char === 'P' && (
                      <>
                        <div style={{ position: 'absolute', top: '-8px', left: '8px', width: '10px', height: '12px', borderRadius: '50% 50% 30% 30%', background: 'linear-gradient(180deg, #e1bee7, #ce93d8)', boxShadow: '1px 2px 0px #ba68c8', border: '1.5px solid #f3e5f5' }} />
                        <div style={{ position: 'absolute', top: '-8px', right: '8px', width: '10px', height: '12px', borderRadius: '50% 50% 30% 30%', background: 'linear-gradient(180deg, #e1bee7, #ce93d8)', boxShadow: '1px 2px 0px #ba68c8', border: '1.5px solid #f3e5f5' }} />
                      </>
                    )}
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif",
                      color: '#4a148c',
                      textShadow: '1px 1px 0px #f3e5f5, -1px -1px 0px rgba(255,255,255,0.7)',
                      position: 'relative',
                      zIndex: 2
                    }}>{char}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="carousel-section">
           <MethodologyCarousel />
        </section>
      </motion.main>
    </PageReveal>
  );
}

export default Methodology;