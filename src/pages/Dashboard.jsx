import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Waves, 
    Sliders, 
    HelpCircle, 
    ShieldAlert, 
    MapPin, 
    TrendingDown, 
    TrendingUp, 
    BarChart3,
    Activity,
    Locate,
    Database,
    RotateCcw
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import ChartsComponent from '../components/ChartsComponent';
import ShorelineBackground from '../components/ShorelineBackground';

export default function Dashboard() {
    // 1. Sliders & Interactive State
    const [tanBeta, setTanBeta] = useState(0.030);
    const [HMean, setHMean] = useState(0.8);
    const [tideHeight, setTideHeight] = useState(0.7);

    // 2. Layer Toggle Controls
    const [showTransects, setShowTransects] = useState(true);
    const [showS2020, setShowS2020] = useState(true);
    const [showS2024, setShowS2024] = useState(true);
    const [showSpred, setShowSpred] = useState(true);

    // 3. Map Tracking States
    const [mapLat, setMapLat] = useState(13.4826);
    const [mapLon, setMapLon] = useState(74.7312);

    // 4. Data Loading State
    const [rawData, setRawData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load CSV dataset once on initialization
    useEffect(() => {
        fetch('./coastal_environmental_dataset.csv')
            .then(res => {
                if (!res.ok) throw new Error("Dataset file not found");
                return res.text();
            })
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setRawData(results.data);
                        setIsLoading(false);
                    }
                });
            })
            .catch(err => {
                console.error("Error fetching master environmental dataset:", err);
                setIsLoading(false);
            });
    }, []);

    // 5. Dynamic Rate Recalculation Loop (Triggers on Slider Adjustments)
    const metrics = useMemo(() => {
        if (rawData.length === 0) return null;

        let totalRateDLV3 = 0;
        let sumAbsError = 0;
        let numActive = 0;

        // Class severity counts for Ground Truth (GT)
        let severeGT = 0;
        let moderateGT = 0;
        let stableGT = 0;

        // Class severity counts for DeepLabV3+
        let severeDLV3 = 0;
        let moderateDLV3 = 0;
        let stableDLV3 = 0;

        const chartLabels = [];
        const chartRateGT = [];
        const chartRateDLV3 = [];
        const tableRows = [];

        // dy = (H_mean - tide_height) / tan_beta (in meters)
        const dy = (HMean - tideHeight) / tanBeta;

        rawData.forEach((row, index) => {
            const id = row.Transect_ID;
            const d2020 = row.Dist_2020;
            const d2024_gt = row.Dist_2024_GT;
            const d2024_dlv3 = row.Dist_2024_DLV3;

            if (d2020 == null || d2024_gt == null || d2024_dlv3 == null) return;

            numActive++;

            // Calculate tide height corrected distance values
            const d2024_gt_corrected = d2024_gt - dy;
            const d2024_dlv3_corrected = d2024_dlv3 - dy;

            // Recalculate annual change rates (m/yr)
            const rateGT = (d2024_gt_corrected - d2020) / 4.0;
            const rateDLV3 = (d2024_dlv3_corrected - d2020) / 4.0;

            totalRateDLV3 += rateDLV3;
            sumAbsError += Math.abs(rateDLV3 - rateGT);

            // Group GT Severity classes
            if (rateGT < -2.0) severeGT++;
            else if (rateGT < -0.5) moderateGT++;
            else stableGT++;

            // Group DLV3 Severity classes
            if (rateDLV3 < -2.0) severeDLV3++;
            else if (rateDLV3 < -0.5) moderateDLV3++;
            else stableDLV3++;

            // Select line chart data points (first 500 transects)
            if (index < 500) {
                chartLabels.push(id);
                chartRateGT.push(parseFloat(rateGT.toFixed(3)));
                chartRateDLV3.push(parseFloat(rateDLV3.toFixed(3)));
            }

            // Select table data rows (first 100 transects)
            if (index < 100) {
                tableRows.push({
                    id,
                    d2020,
                    d2024_gt_corrected,
                    d2024_dlv3_corrected,
                    rateGT,
                    rateDLV3
                });
            }
        });

        const avgRateDLV3 = totalRateDLV3 / numActive;
        const mae = sumAbsError / numActive;

        return {
            numActive,
            avgRateDLV3,
            mae,
            severeGT,
            moderateGT,
            stableGT,
            severeDLV3,
            moderateDLV3,
            stableDLV3,
            chartLabels,
            chartRateGT,
            chartRateDLV3,
            tableRows
        };
    }, [rawData, tanBeta, HMean, tideHeight]);

    // Handle Coordinate Tracker Moves
    const handleCoordinateChange = (lat, lon) => {
        setMapLat(lat);
        setMapLon(lon);
    };

    // Reset Sliders Helper
    const handleResetSliders = () => {
        setTanBeta(0.030);
        setHMean(0.8);
        setTideHeight(0.7);
    };

    return (
        <React.Fragment>
            {/* 1. Page Load Entrance Spinner */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        className="loading-overlay"
                        exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    >
                        <div className="loader-spinner" />
                        <div className="loader-text">Loading GIS Datasets & ML Models...</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && metrics && (
                <div className="app-container">
                    <ShorelineBackground />
                    
                    {/* 2. Interactive Sidebar Panel */}
                    <motion.aside 
                        className="sidebar"
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                        <div className="logo-area">
                            <div className="logo-wrapper">
                                <Waves className="logo-icon" />
                            </div>
                            <div>
                                <h2>Coastline AI</h2>
                                <span className="sub-logo">Udupi Erosion Monitoring</span>
                            </div>
                        </div>
                        
                        <hr className="divider" />
                        
                        <div className="sidebar-section">
                            <h3>
                                <Sliders size={16} className="text-cyan" /> 
                                Adjust Coastal Factors
                            </h3>
                            <p className="section-desc">
                                Move the sliders below to dynamically simulate how beach slope angles, tide heights, and sea level baselines displace the shoreline location.
                            </p>
                            
                            {/* Beach Slope Slider */}
                            <div className="control-group">
                                <div className="control-label">
                                    <span>Beach Slope (Angle)</span>
                                    <motion.span 
                                        key={tanBeta}
                                        initial={{ scale: 0.7, y: -5 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 600, damping: 15 }}
                                        className="val-badge"
                                    >
                                        {tanBeta.toFixed(3)}
                                    </motion.span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-slider" 
                                    min="0.010" 
                                    max="0.100" 
                                    step="0.005" 
                                    value={tanBeta}
                                    onChange={(e) => setTanBeta(parseFloat(e.target.value))}
                                />
                                <span className="slider-helper">A lower value represents a flatter beach; a higher value represents a steeper beach.</span>
                            </div>
                            
                            {/* Average Sea Level Slider */}
                            <div className="control-group">
                                <div className="control-label">
                                    <span>Average Sea Level</span>
                                    <motion.span 
                                        key={HMean}
                                        initial={{ scale: 0.7, y: -5 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 600, damping: 15 }}
                                        className="val-badge"
                                    >
                                        {HMean.toFixed(1)} m
                                    </motion.span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-slider" 
                                    min="0.1" 
                                    max="2.5" 
                                    step="0.1" 
                                    value={HMean}
                                    onChange={(e) => setHMean(parseFloat(e.target.value))}
                                />
                                <span className="slider-helper">The historical average baseline sea level.</span>
                            </div>
                            
                            {/* Tide Height Slider */}
                            <div className="control-group">
                                <div className="control-label">
                                    <span>Current Tide Height</span>
                                    <motion.span 
                                        key={tideHeight}
                                        initial={{ scale: 0.7, y: -5 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 600, damping: 15 }}
                                        className="val-badge"
                                    >
                                        {tideHeight.toFixed(1)} m
                                    </motion.span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-slider" 
                                    min="0.1" 
                                    max="2.5" 
                                    step="0.1" 
                                    value={tideHeight}
                                    onChange={(e) => setTideHeight(parseFloat(e.target.value))}
                                />
                                <span className="slider-helper">The sea height at the time of remote sensing acquisition.</span>
                            </div>

                            <motion.button 
                                className="role-badge"
                                style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
                                onClick={handleResetSliders}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RotateCcw size={13} /> Reset Baseline Parameters
                            </motion.button>
                        </div>
                        
                        <div className="sidebar-section info-section">
                            <h3>
                                <HelpCircle size={16} className="text-indigo" /> 
                                Dynamic Physics Engine
                            </h3>
                            <p>
                                Shoreline positions fluctuate with sea heights. The system calculates horizontal displacements via localized beach slope equations, adjusting satellite predictions automatically.
                            </p>
                            <div className="status-indicator">
                                <span className="pulse-dot green" />
                                <span>Master Database Active</span>
                            </div>
                        </div>
                    </motion.aside>
                    
                    {/* 3. Main Dashboard Board */}
                    <main className="main-content">
                        <motion.header 
                            className="top-nav"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <div>
                                <h1>Udupi Coastal Erosion Analysis</h1>
                                <p className="subtitle">An interactive AI dashboard mapping land change patterns along the Udupi coastline (2020-2024)</p>
                            </div>
                            <div className="user-meta">
                                <span className="role-badge">Phase 4 Active Server</span>
                            </div>
                        </motion.header>
                        
                        {/* Interactive Warning Alert Panel */}
                        <motion.section 
                            className="intro-card-panel"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                        >
                            <div className="intro-card">
                                <div className="intro-icon">
                                    <ShieldAlert className="text-rose" />
                                </div>
                                <div className="intro-text">
                                    <strong>Real-time Physics Correction:</strong> Adjusting sea level baselines models shoreline shift. Flatter slopes expand wave run-up, displacing vectors inland (erosion). Steeper slopes compress displacement. Move the sliders to view updated change rates instantly.
                                </div>
                            </div>
                        </motion.section>
                        
                        {/* Metrics Grid Layout */}
                        <motion.section 
                            className="metrics-grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                        >
                            {/* Card 1: Monitored Locations */}
                            <motion.div 
                                className="stat-card accent-cyan" 
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-header">
                                    <span>MONITORED LOCATIONS</span>
                                    <MapPin size={15} className="text-cyan" />
                                </div>
                                <div className="card-value">{metrics.numActive.toLocaleString()}</div>
                                <div className="card-footer">Total active measurement points</div>
                            </motion.div>
                            
                            {/* Card 2: AI Model Accuracy */}
                            <motion.div 
                                className="stat-card accent-indigo" 
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-header">
                                    <span>AI MODEL ACCURACY</span>
                                    <Activity size={15} className="text-indigo" />
                                </div>
                                <div className="card-value">85.48%</div>
                                <div className="card-footer">DeepLabV3+ validation accuracy</div>
                            </motion.div>
                            
                            {/* Card 3: Margin of Error */}
                            <motion.div 
                                className="stat-card accent-magenta" 
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-header">
                                    <span>AI MARGIN OF ERROR</span>
                                    <TrendingDown size={15} className="text-magenta" />
                                </div>
                                <div className="card-value">{metrics.mae.toFixed(2)} m/yr</div>
                                <div className="card-footer">Mean absolute prediction difference</div>
                            </motion.div>
                            
                            {/* Card 4: Coastline Status */}
                            <motion.div 
                                className="stat-card accent-emerald" 
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-header">
                                    <span>COASTLINE STATUS</span>
                                    <TrendingUp size={15} className="text-emerald" />
                                </div>
                                <div 
                                    className="card-value" 
                                    style={{ color: metrics.avgRateDLV3 < 0 ? '#ff2a6d' : '#00ff87' }}
                                >
                                    {Math.abs(metrics.avgRateDLV3).toFixed(2)} m/yr
                                </div>
                                <div className="card-footer">
                                    {metrics.avgRateDLV3 < 0 ? "Average rate of land loss" : "Average rate of accretion"}
                                </div>
                            </motion.div>
                        </motion.section>
                        
                        {/* Map & Chart Row */}
                        <motion.section 
                            className="dashboard-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
                        >
                            {/* Leaflet Map Card */}
                            <motion.div 
                                className="dashboard-card map-card"
                                whileHover={{ y: -4, scale: 1.005 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-title-bar">
                                    <h3>
                                        <Locate size={18} className="text-cyan" /> 
                                        Interactive Coastline Map
                                    </h3>
                                    <div className="layer-control">
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={showTransects} 
                                                onChange={() => setShowTransects(!showTransects)}
                                            /> 
                                            Transects
                                        </label>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={showS2020} 
                                                onChange={() => setShowS2020(!showS2020)}
                                            /> 
                                            2020
                                        </label>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={showS2024} 
                                                onChange={() => setShowS2024(!showS2024)}
                                            /> 
                                            2024
                                        </label>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={showSpred} 
                                                onChange={() => setShowSpred(!showSpred)}
                                            /> 
                                            AI Prediction
                                        </label>
                                    </div>
                                </div>
                                
                                <MapComponent 
                                    showTransects={showTransects}
                                    showS2020={showS2020}
                                    showS2024={showS2024}
                                    showSpred={showSpred}
                                    onCoordinateChange={handleCoordinateChange}
                                    tanBeta={tanBeta}
                                    HMean={HMean}
                                    tideHeight={tideHeight}
                                />
                                
                                <div className="map-coord-tracker">
                                    Lat: {mapLat.toFixed(4)}, Lon: {mapLon.toFixed(4)}
                                </div>
                            </motion.div>
                            
                            {/* Chart Component Card */}
                            <ChartsComponent 
                                chartLabels={metrics.chartLabels}
                                chartRateGT={metrics.chartRateGT}
                                chartRateDLV3={metrics.chartRateDLV3}
                                severeGT={metrics.severeGT}
                                moderateGT={metrics.moderateGT}
                                stableGT={metrics.stableGT}
                                severeDLV3={metrics.severeDLV3}
                                moderateDLV3={metrics.moderateDLV3}
                                stableDLV3={metrics.stableDLV3}
                            />
                        </motion.section>
                        
                        {/* Table and Summary Bottom Layout Grid */}
                        <motion.section 
                            className="dashboard-grid-bottom"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
                        >
                            {/* Dynamic Transect Data Table */}
                            <motion.div 
                                className="dashboard-card table-card"
                                whileHover={{ y: -4, scale: 1.005 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className="card-title-bar">
                                    <h3>
                                        <Database size={18} className="text-cyan" /> 
                                        Transect Measurement Log
                                    </h3>
                                    <span className="role-badge" style={{ fontSize: '0.65rem' }}>First 100 Measurement Points</span>
                                </div>
                                
                                <div className="table-scroller">
                                    <table className="custom-data-table">
                                        <thead>
                                            <tr>
                                                <th>Transect ID</th>
                                                <th>2020 Position</th>
                                                <th>2024 Ground Truth</th>
                                                <th>2024 AI Prediction</th>
                                                <th>GT Rate</th>
                                                <th>AI Prediction Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metrics.tableRows.map((row) => (
                                                <tr key={row.id}>
                                                    <td><strong>#{row.id}</strong></td>
                                                    <td>{row.d2020.toFixed(2)} m</td>
                                                    <td>{row.d2024_gt_corrected.toFixed(2)} m</td>
                                                    <td>{row.d2024_dlv3_corrected.toFixed(2)} m</td>
                                                    <td className={row.rateGT < 0 ? 'text-red' : 'text-green'}>
                                                        {row.rateGT.toFixed(2)} m/yr
                                                    </td>
                                                    <td className={row.rateDLV3 < 0 ? 'text-red' : 'text-green'}>
                                                        {row.rateDLV3.toFixed(2)} m/yr
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                            
                            {/* Summary Vulnerability Panels */}
                            <div className="summary-panel">
                                <motion.div 
                                    className="dashboard-card"
                                    whileHover={{ y: -4, scale: 1.005 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <div className="summary-heading">
                                        <BarChart3 size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
                                        Severity Category Summaries
                                    </div>
                                    <div className="summary-card-group">
                                        <div className="summary-row">
                                            <div className="summary-item">
                                                <span className="summary-label text-rose">Severe Erosion (GT)</span>
                                                <span className="summary-val text-rose">{metrics.severeGT.toLocaleString()}</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-label text-rose">Severe Erosion (AI)</span>
                                                <span className="summary-val text-rose">{metrics.severeDLV3.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="summary-card-group" style={{ marginTop: '12px' }}>
                                        <div className="summary-row">
                                            <div className="summary-item">
                                                <span className="summary-label text-magenta">Moderate Erosion (GT)</span>
                                                <span className="summary-val text-magenta">{metrics.moderateGT.toLocaleString()}</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-label text-magenta">Moderate Erosion (AI)</span>
                                                <span className="summary-val text-magenta">{metrics.moderateDLV3.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="summary-card-group" style={{ marginTop: '12px' }}>
                                        <div className="summary-row">
                                            <div className="summary-item">
                                                <span className="summary-label text-green">Stable / Growing (GT)</span>
                                                <span className="summary-val text-green">{metrics.stableGT.toLocaleString()}</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-label text-green">Stable / Growing (AI)</span>
                                                <span className="summary-val text-green">{metrics.stableDLV3.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>
                    </main>
                    
                </div>
            )}
        </React.Fragment>
    );
}
