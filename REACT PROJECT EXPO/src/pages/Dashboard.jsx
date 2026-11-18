import React from 'react';
import { motion } from 'framer-motion';
import { 
    MapPin, 
    Cpu, 
    Target, 
    AlertOctagon 
} from 'lucide-react';
import ShorelineBackground from '../components/ShorelineBackground';

export default function Dashboard() {
    return (
        <div className="app-container dashboard-solo">
            <ShorelineBackground />
            
            <main className="main-content dashboard-clean-content">
                <motion.header 
                    className="dashboard-hero-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <h1>Udupi Coastal Erosion Analysis</h1>
                </motion.header>
                
                {/* 4 Large Creative KPI Cards */}
                <motion.section 
                    className="hero-kpi-grid"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                >
                    {/* Card 1: Monitored Locations */}
                    <motion.div 
                        className="hero-kpi-card accent-cyan" 
                        whileHover={{ y: -8, scale: 1.015 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                        <div className="card-glow-bg glow-cyan" />
                        <div>
                            <div className="kpi-card-top">
                                <div className="kpi-title-group">
                                    <div className="kpi-icon-pill pill-cyan">
                                        <MapPin size={22} />
                                    </div>
                                    <span className="kpi-title-text">MONITORED LOCATIONS</span>
                                </div>
                                <span className="kpi-badge">97.2 km Corridor</span>
                            </div>
                            
                            <div className="kpi-value-block">
                                <div className="kpi-giant-value">3,321</div>
                                <p className="kpi-subtitle">Total active measurement points</p>
                            </div>
                        </div>

                        <div className="kpi-footer-chips">
                            <span className="kpi-chip">📏 50m Transect Spacing</span>
                            <span className="kpi-chip">🗺️ EPSG:32643 UTM Grid</span>
                            <span className="kpi-chip">🛰️ Multi-temporal Intersects</span>
                        </div>
                    </motion.div>
                    
                    {/* Card 2: AI Model Accuracy */}
                    <motion.div 
                        className="hero-kpi-card accent-indigo" 
                        whileHover={{ y: -8, scale: 1.015 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                        <div className="card-glow-bg glow-indigo" />
                        <div>
                            <div className="kpi-card-top">
                                <div className="kpi-title-group">
                                    <div className="kpi-icon-pill pill-indigo">
                                        <Cpu size={22} />
                                    </div>
                                    <span className="kpi-title-text">AI MODEL ACCURACY</span>
                                </div>
                                <span className="kpi-badge">ResNet-34 + ASPP</span>
                            </div>
                            
                            <div className="kpi-value-block">
                                <div className="kpi-giant-value">85.48%</div>
                                <p className="kpi-subtitle">DeepLabV3+ validation accuracy</p>
                            </div>
                        </div>

                        <div>
                            <div className="kpi-progress-bar">
                                <motion.div 
                                    className="kpi-progress-fill" 
                                    initial={{ width: 0 }}
                                    animate={{ width: '85.48%' }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                />
                            </div>
                            <div className="kpi-footer-chips">
                                <span className="kpi-chip">🎯 Dice: 92.17%</span>
                                <span className="kpi-chip">📊 IoU: 85.48%</span>
                                <span className="kpi-chip">🛰️ 9-Ch Optical + SAR</span>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Card 3: AI Margin of Error */}
                    <motion.div 
                        className="hero-kpi-card accent-magenta" 
                        whileHover={{ y: -8, scale: 1.015 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                        <div className="card-glow-bg glow-magenta" />
                        <div>
                            <div className="kpi-card-top">
                                <div className="kpi-title-group">
                                    <div className="kpi-icon-pill pill-magenta">
                                        <Target size={22} />
                                    </div>
                                    <span className="kpi-title-text">AI MARGIN OF ERROR</span>
                                </div>
                                <span className="kpi-badge">MAE Baseline</span>
                            </div>
                            
                            <div className="kpi-value-block">
                                <div className="kpi-giant-value">26.20 m/yr</div>
                                <p className="kpi-subtitle">Mean absolute prediction difference</p>
                            </div>
                        </div>

                        <div className="kpi-footer-chips">
                            <span className="kpi-chip">🌊 Tidal Equilibrium: Δx = -3.33 m</span>
                            <span className="kpi-chip">📐 Sub-pixel Contour: ±2.5 m</span>
                            <span className="kpi-chip">🛰️ vs. Sentinel-2 Ground Truth</span>
                        </div>
                    </motion.div>
                    
                    {/* Card 4: Coastline Status */}
                    <motion.div 
                        className="hero-kpi-card accent-rose" 
                        whileHover={{ y: -8, scale: 1.015 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                        <div className="card-glow-bg glow-rose" />
                        <div>
                            <div className="kpi-card-top">
                                <div className="kpi-title-group">
                                    <div className="kpi-icon-pill pill-rose">
                                        <AlertOctagon size={22} />
                                    </div>
                                    <span className="kpi-title-text">COASTLINE STATUS</span>
                                </div>
                                <span className="kpi-badge" style={{ color: '#ff2a6d', borderColor: 'rgba(255,42,109,0.3)' }}>Active Erosion</span>
                            </div>
                            
                            <div className="kpi-value-block">
                                <div className="kpi-giant-value val-rose">24.34 m/yr</div>
                                <p className="kpi-subtitle">Average rate of land loss</p>
                            </div>
                        </div>

                        <div className="kpi-footer-chips">
                            <span className="kpi-chip">🚨 Bengre & Maravanthe Hotspots</span>
                            <span className="kpi-chip">🛑 Max Retreat: -24.0 m</span>
                            <span className="kpi-chip">📉 Cumulative: +7.88 ha Lost</span>
                        </div>
                    </motion.div>
                </motion.section>
            </main>
        </div>
    );
}
