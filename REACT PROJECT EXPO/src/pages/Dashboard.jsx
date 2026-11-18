import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Cpu, 
  Target, 
  AlertOctagon, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  Compass, 
  Waves, 
  Activity, 
  Droplet, 
  TrendingDown, 
  Anchor, 
  Home as HomeIcon, 
  CloudRain, 
  HelpCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import ChartsComponent from '../components/ChartsComponent';

export default function Dashboard() {
  // 1. Interactive Sliders & Dynamics
  const [tanBeta, setTanBeta] = useState(0.030);
  const [HMean, setHMean] = useState(0.8);
  const [tideHeight, setTideHeight] = useState(0.7);

  // 2. Layer Toggle Controls for Map
  const [showTransects, setShowTransects] = useState(true);
  const [showS2020, setShowS2020] = useState(true);
  const [showS2024, setShowS2024] = useState(true);
  const [showSpred, setShowSpred] = useState(true);

  // 3. Map Coordinates Tracking
  const [mapLat, setMapLat] = useState(13.4826);
  const [mapLon, setMapLon] = useState(74.7312);

  // 4. Data Loading State
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load CSV dataset once on initialization
  useEffect(() => {
    fetch('/coastal_environmental_dataset.csv')
      .then(res => {
        if (!res.ok) throw new Error("Dataset not reachable");
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setRawData(results.data);
            }
            setIsLoading(false);
          },
          error: () => setIsLoading(false)
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // 5. Dynamic Rate Recalculation Loop
  const metrics = useMemo(() => {
    if (rawData.length === 0) return null;

    let totalRateDLV3 = 0;
    let sumAbsError = 0;
    let numActive = 0;

    let severeGT = 0;
    let moderateGT = 0;
    let stableGT = 0;

    let severeDLV3 = 0;
    let moderateDLV3 = 0;
    let stableDLV3 = 0;

    const chartLabels = [];
    const chartRateGT = [];
    const chartRateDLV3 = [];

    const dy = (HMean - tideHeight) / tanBeta;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row.Transect_ID === undefined || row.Rate_GT === undefined) continue;

      const rateGT = Number(row.Rate_GT) || 0;
      const baseRateDLV3 = Number(row.Rate_DLV3) || 0;
      const dynRateDLV3 = baseRateDLV3 + (dy * 0.05);

      totalRateDLV3 += dynRateDLV3;
      sumAbsError += Math.abs(rateGT - dynRateDLV3);
      numActive++;

      // Ground truth severity
      if (rateGT < -2.0) severeGT++;
      else if (rateGT >= -2.0 && rateGT < 0) moderateGT++;
      else stableGT++;

      // DeepLabV3+ severity
      if (dynRateDLV3 < -2.0) severeDLV3++;
      else if (dynRateDLV3 >= -2.0 && dynRateDLV3 < 0) moderateDLV3++;
      else stableDLV3++;

      if (i % 25 === 0) {
        chartLabels.push(`T-${row.Transect_ID}`);
        chartRateGT.push(Number(rateGT.toFixed(2)));
        chartRateDLV3.push(Number(dynRateDLV3.toFixed(2)));
      }
    }

    const meanRateDLV3 = numActive > 0 ? (totalRateDLV3 / numActive) : 0;
    const mae = numActive > 0 ? (sumAbsError / numActive) : 0;

    return {
      numActive,
      meanRateDLV3,
      mae,
      dy,
      severeGT,
      moderateGT,
      stableGT,
      severeDLV3,
      moderateDLV3,
      stableDLV3,
      chartLabels,
      chartRateGT,
      chartRateDLV3
    };
  }, [rawData, HMean, tideHeight, tanBeta]);

  return (
    <div className="dashboard-page" style={{ maxWidth: '1440px', margin: '0 auto', padding: '90px 24px 60px' }}>
      
      {/* Page Title & Status Banner */}
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>
              <Compass size={16} /> MONITORING CORRIDOR: UDUPI & DAKSHINA KANNADA (ARABIAN SEA)
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Coastal Environmental Analysis Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '850px' }}>
              Multi-temporal satellite remote sensing, deep neural network coastline segmentation (DeepLabV3+ ResNet-34), and empirical tidal dynamics across 1,944 baseline transects.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg, rgba(15,23,42,0.8))', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>System Telemetry Active</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Baseline Period: 2015–2024</div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          SECTION A: OVERVIEW & VERIFIED SYSTEM STATISTICS
          ======================================================== */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px' }}>SECTION A</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Corridor Overview & Verified Baseline Metrics</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* 1. Total Monitoring Locations */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>MONITORED CORRIDOR</span>
              <MapPin size={16} style={{ color: '#38bdf8' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>97.2 km</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Baindur to Ullal coastline corridor</p>
          </div>

          {/* 2. Total Measurement Points */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>MEASUREMENT POINTS</span>
              <Layers size={16} style={{ color: '#0ea5e9' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>3,321</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>50 m transect spacing (EPSG:32643)</p>
          </div>

          {/* 3. Areas Experiencing Erosion */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>ACTIVE EROSION ZONE</span>
              <TrendingDown size={16} style={{ color: '#ef4444' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ef4444' }}>52.4 km</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>53.9% of corridor (Bengre & Padubidri)</p>
          </div>

          {/* 4. Areas Experiencing Accretion */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>ACTIVE ACCRETION ZONE</span>
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981' }}>34.8 km</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Sand spit gain (Malpe & Gangolli)</p>
          </div>

          {/* 5. High-Risk Coastal Regions */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>CRITICAL HOTSPOTS</span>
              <AlertOctagon size={16} style={{ color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f59e0b' }}>7.65 km</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Max retreat: -24.0 m (Maravanthe)</p>
          </div>

          {/* 6. AI Model Benchmark Accuracy */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700 }}>DEEPLABV3+ ACCURACY</span>
              <Cpu size={16} style={{ color: '#a855f7' }} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#c084fc' }}>85.48%</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Dice: 92.17% · MAE: 26.2 m/yr</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION B: COASTAL EROSION ANALYSIS & GIS INTERACTIVE MAP
          ======================================================== */}
      <section style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px' }}>SECTION B</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Satellite Remote-Sensing Analysis & Interactive GIS Map
          </h2>
        </div>

        {/* GIS Controls & Interactive Map Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Leaflet Map Card */}
          <div style={{ gridColumn: 'span 2', minHeight: '520px', background: 'var(--card-bg, rgba(11, 19, 41, 0.8))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Map Top Bar with Layer Controls */}
            <div style={{ padding: '12px 18px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={17} style={{ color: '#38bdf8' }} />
                <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                  Interactive Shoreline GIS Workspace
                </span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px' }}>
                  WGS84 / EPSG:32643
                </span>
              </div>

              {/* Layer Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#ffc107' }}>
                  <input type="checkbox" checked={showS2020} onChange={(e) => setShowS2020(e.target.checked)} />
                  <span>2020 Shoreline</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#00ff87' }}>
                  <input type="checkbox" checked={showS2024} onChange={(e) => setShowS2024(e.target.checked)} />
                  <span>2024 Shoreline</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#ff007f' }}>
                  <input type="checkbox" checked={showSpred} onChange={(e) => setShowSpred(e.target.checked)} />
                  <span>Predicted Shoreline</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#00f0ff' }}>
                  <input type="checkbox" checked={showTransects} onChange={(e) => setShowTransects(e.target.checked)} />
                  <span>Transects</span>
                </label>
              </div>
            </div>

            {/* Map Canvas Container */}
            <div style={{ flex: 1, minHeight: '440px', position: 'relative' }}>
              <div ref={() => {}} style={{ width: '100%', height: '100%', minHeight: '440px' }}>
                <MapComponent
                  showTransects={showTransects}
                  showS2020={showS2020}
                  showS2024={showS2024}
                  showSpred={showSpred}
                  onCoordinateChange={(lat, lon) => {
                    setMapLat(lat);
                    setMapLon(lon);
                  }}
                  tanBeta={tanBeta}
                  HMean={HMean}
                  tideHeight={tideHeight}
                />
              </div>

              {/* Live Cursor Coordinate Pill */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000, background: 'rgba(3, 7, 18, 0.85)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.3)', fontFamily: 'monospace' }}>
                CURSOR: {mapLat.toFixed(4)}° N, {mapLon.toFixed(4)}° E
              </div>
            </div>
          </div>

          {/* Environmental Hydrodynamic Parameters Box */}
          <div style={{ padding: '22px', background: 'var(--card-bg, rgba(11, 19, 41, 0.8))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sliders size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Hydrodynamic & Slope Tuning
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Equilibrium waterline adjustment equation: <code>Δx = (H_mean - Tide) / tan(β)</code>. Dynamically updates the predicted shoreline layer based on tidal elevation.
              </p>

              {/* Slider 1: Beach Slope */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Beach Slope (tan β):</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{tanBeta.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.015"
                  max="0.060"
                  step="0.005"
                  value={tanBeta}
                  onChange={(e) => setTanBeta(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Mean High Water */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mean Wave Height (H_mean):</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{HMean.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={HMean}
                  onChange={(e) => setHMean(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 3: Current Tide Height */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tidal Height (m):</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{tideHeight.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.8"
                  step="0.1"
                  value={tideHeight}
                  onChange={(e) => setTideHeight(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Calculated Equilibrium Shift Output */}
            <div style={{ padding: '14px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '0.82rem' }}>
              <div style={{ color: '#7dd3fc', fontWeight: 600, marginBottom: '4px' }}>Computed Horizontal Shoreline Shift:</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: metrics?.dy && metrics.dy >= 0 ? '#10b981' : '#f43f5e' }}>
                {metrics?.dy !== undefined ? `${metrics.dy > 0 ? '+' : ''}${metrics.dy.toFixed(2)} meters` : '0.00 m'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                Applies sub-pixel waterline projection to active Sentinel-2 NDWI mask
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Rate Charts (Ground Truth vs DeepLabV3+) */}
        {metrics && (
          <div style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.8))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Transect Rate Distribution: Ground Truth vs DeepLabV3+
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Rates of coastal movement in meters/year across sampled corridor stations. Negative values represent erosion; positive values represent accretion.
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                Sampled: 50+ Key Stations
              </span>
            </div>

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
          </div>
        )}
      </section>

      {/* ========================================================
          SECTION C: SCIENTIFIC RISK ASSESSMENT
          ======================================================== */}
      <section style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px' }}>SECTION C</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Scientific Risk Classification & Vulnerability Thresholds
          </h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '900px' }}>
          Risk tiers are classified using documented End Point Rate (EPR) benchmarks cross-calibrated with the Karnataka State Disaster Management Plan and National Centre for Coastal Research (NCCR) standards.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          
          {/* 1. Low Risk */}
          <div style={{ padding: '22px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981', letterSpacing: '0.5px' }}>LOW RISK</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>&gt; -0.5 m/yr or Accretion</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>Stable Dune & Depositional Coast</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Coastlines experiencing net sand deposition, stable sandbar replenishment, or minimal retreat under 0.5 meters/year. Dune vegetation acts as natural storm surge protection.
            </p>
            <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#94a3b8' }}>
              <strong>Representative Area:</strong> Malpe South Beach, Gangolli sandbar
            </div>
          </div>

          {/* 2. Moderate Risk */}
          <div style={{ padding: '22px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#eab308', letterSpacing: '0.5px' }}>MODERATE RISK</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>-0.5 to -2.0 m/yr</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>Seasonal Cyclic Erosion</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Noticeable beach narrowing occurring during South-West Monsoon surges, partially recovering in post-monsoon calm swell periods with slight net annual deficit.
            </p>
            <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#94a3b8' }}>
              <strong>Representative Area:</strong> Kaup Lighthouse coast, Hejamadi buffer
            </div>
          </div>

          {/* 3. High Risk */}
          <div style={{ padding: '22px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f97316', letterSpacing: '0.5px' }}>HIGH RISK</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>-2.0 to -5.0 m/yr</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>Progressive Sand Scarping</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Permanent loss of beach berm, exposure of root zones of coconut plantations, and direct wave impact reaching coastal roads or boundary fences during spring tides.
            </p>
            <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#94a3b8' }}>
              <strong>Representative Area:</strong> Padubidri End Point, Trasi beach road
            </div>
          </div>

          {/* 4. Critical Risk */}
          <div style={{ padding: '22px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ef4444', letterSpacing: '0.5px' }}>CRITICAL RISK</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>&lt; -5.0 m/yr or Breach</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>Structural Breach & Inundation Threat</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Severe seawall collapsing, narrow spit narrowing threatening estuary breaching, and imminent threat to National Highway 66 and permanent fishing settlements.
            </p>
            <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#94a3b8' }}>
              <strong>Representative Area:</strong> Bengre Sand Spit (-24.0 m), Maravanthe NH-66 corridor
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION D: ENVIRONMENTAL & SOCIO-ECONOMIC IMPACTS
          ======================================================== */}
      <section style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px' }}>SECTION D</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Environmental, Ecological and Socio-Economic Consequences
          </h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '950px' }}>
          Coastal erosion in the Udupi region is not merely a geographic line shift; it triggers cascading ecological degradation and profound economic disruption for vulnerable coastal communities.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* 1. Loss of Coastal Land */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#38bdf8' }}>
              <TrendingDown size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>1. Loss of Coastal Land</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Progressive reduction of coastal landmass, eroding agricultural coconut plantations, public beachfronts, and protective sand dunes. Over 7.88 hectares of cumulative land loss is projected along high-vulnerability stretches.
            </p>
          </div>

          {/* 2. Saltwater Intrusion */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#0ea5e9' }}>
              <Droplet size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>2. Groundwater Salinization</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              As the ocean encroaches inland, seawater infiltrates shallow coastal aquifers. Drinking-water open wells and borewells within 500 meters become saline and non-potable, severely impacting domestic water security.
            </p>
          </div>

          {/* 3. Damage to Marine Ecosystems */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#10b981' }}>
              <Waves size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>3. Marine Ecosystem Disruption</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              High-energy wave action churning up eroded sediments increases turbidity, smothering benthic intertidal flora and destroying critical nesting beaches for endangered Olive Ridley sea turtles along Kodi Bengre.
            </p>
          </div>

          {/* 4. Mangrove Degradation */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#34d399' }}>
              <Compass size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>4. Mangrove Forest Degradation</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Alteration of estuarine hydrodynamics in the Swarna and Sita river mouths leads to root erosion and hypersaline water stagnation, destroying vital mangrove nurseries that shelter commercial fish fingerlings.
            </p>
          </div>

          {/* 5. Coastal Infrastructure Damage */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#f59e0b' }}>
              <AlertOctagon size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>5. Infrastructure Destruction</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Severe scouring destabilizes shoreline protection boulders, breaks concrete seawalls, undermines National Highway 66 (at Maravanthe), and damages local coastal link roads, bridges, and fish-landing jetties.
            </p>
          </div>

          {/* 6. Fishing Community Impacts */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#06b6d4' }}>
              <Anchor size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>6. Impact on Fishing Communities</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Loss of beach space prevents artisanal fishermen from beaching traditional canoes, drying fish nets, and storing outboard motors safely, resulting in direct livelihood losses and safety risks during high tides.
            </p>
          </div>

          {/* 7. Displacement of Coastal Settlements */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#e11d48' }}>
              <HomeIcon size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>7. Settlement Inundation & Displacement</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Dense coastal settlements along narrow spits face structural collapse and flooding during storm surges. Families face forced seasonal relocation, loss of property titles, and psychological distress.
            </p>
          </div>

          {/* 8. Monsoon Storm Surge Vulnerability */}
          <div style={{ padding: '20px', background: 'var(--card-bg, rgba(11, 19, 41, 0.7))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#8b5cf6' }}>
              <CloudRain size={20} />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>8. Heightened Monsoon Vulnerability</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              The South-West Monsoon (June to September) brings intense cyclonic waves exceeding 3.5 meters. Stripped beaches leave inland residential colonies without natural buffer protection against extreme storm surges.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
