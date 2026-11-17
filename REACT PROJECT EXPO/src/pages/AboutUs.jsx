import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  Layers, 
  Cpu, 
  MapPin, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Code,
  Satellite,
  Compass,
  FileText
} from 'lucide-react';

const TEAM_MEMBERS = [
  { name: "Roshni", usn: "4MW23CS122", role: "Remote Sensing & AI Lead", stamp: "/team/roshni-stamp.png" },
  { name: "Maithri Shetty", usn: "4MW23CS063", role: "Machine Learning & GIS Modeling", stamp: "/team/maithri-stamp.png" },
  { name: "Raksha", usn: "4MW23CS111", role: "Data Processing & Spatial Analytics", stamp: "/team/raksha-stamp.png" },
  { name: "Rashmi Salvankar", usn: "4MW23CS115", role: "Full-Stack Dashboard Architecture", stamp: "/team/rashmi-stamp.png" }
];

const TECHNOLOGIES = [
  { name: "React 19 & Vite", category: "Frontend Framework", desc: "Interactive GIS and dashboard visualization components." },
  { name: "JavaScript (ES6+)", category: "Core Development", desc: "Client-side telemetry, dynamic equations, and spatial state." },
  { name: "Python 3.13", category: "Data Science & Backend", desc: "Preprocessing pipelines, OpenCV edge extraction, and modeling scripts." },
  { name: "Google Earth Engine", category: "Cloud Remote Sensing", desc: "Automated acquisition and cloud masking for multi-temporal Sentinel scenes." },
  { name: "Sentinel-1 & Sentinel-2", category: "Satellite Imagery", desc: "10m multispectral (MSI) and C-band Synthetic Aperture Radar (SAR)." },
  { name: "DeepLabV3+ (ResNet-34)", category: "Deep Learning", desc: "Atrous Spatial Pyramid Pooling (ASPP) for sub-pixel boundary segmentation." },
  { name: "XGBoost & Scikit-learn", category: "Machine Learning", desc: "Feature importance weighting: wave height, tidal range, and monsoon index." },
  { name: "OpenCV & NumPy", category: "Computer Vision", desc: "NDWI water-land thresholding, morphological thinning, and contour vectors." },
  { name: "Leaflet & GIS Vectors", category: "Spatial Mapping", desc: "EPSG:32643 UTM-43N multi-layer GeoJSON projection and transect overlays." }
];

export default function AboutUs() {
  return (
    <div className="about-page" style={{ maxWidth: '1380px', margin: '0 auto', padding: '90px 24px 60px' }}>
      
      {/* Page Header */}
      <header style={{ marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>
          <BookOpen size={16} /> ACADEMIC MAJOR PROJECT DOCUMENTATION
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          About the Project: Coastal Erosion Intelligence Platform
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginTop: '6px', maxWidth: '900px' }}>
          A final-year engineering major project dedicated to automated coastal erosion detection, multi-decadal change assessment, and participatory environmental decision support along the Karnataka coastline.
        </p>
      </header>

      {/* Grid: Overview & Problem Statement */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        
        {/* Project Overview */}
        <div style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#38bdf8' }}>
            <Compass size={22} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Project Overview</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
            Coastal erosion is a severe geo-environmental hazard resulting in permanent land loss, saline contamination of freshwater wells, and infrastructural destabilization. Along the Arabian Sea western coast of India, high-energy monsoonal swells and anthropogenic pressures have intensified shoreline recession. This platform provides an automated remote-sensing and machine-learning intelligence framework to quantify coastal displacement and support timely environmental interventions.
          </p>
        </div>

        {/* Problem Statement */}
        <div style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '14px', padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#ef4444' }}>
            <AlertCircle size={22} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Problem Statement</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
            Traditional coastal monitoring relies heavily on manual ground-theodolite surveys, GPS beach profiling, and physical pegging. These conventional methods are labor-intensive, logistically hazardous during stormy monsoon seasons, and temporally sparse. Cloud cover, tidal variances, and delayed satellite scene processing further hamper decision-making. There is an urgent necessity for an automated, multi-temporal platform fusing optical and radar satellite imagery with deep segmentation networks to provide reliable, repeatable coastline measurements.
          </p>
        </div>
      </section>

      {/* Project Objectives */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: '#10b981' }}>
          <Target size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Key Research Objectives</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { title: "Automated Coastline Extraction", text: "Derive precise, sub-pixel water-land boundaries using optical Normalized Difference Water Index (NDWI) and SAR backscatter thresholding." },
            { title: "Quantify Erosion & Accretion Rates", text: "Calculate signed Endpoint Rates (EPR) and Net Shoreline Movement (NSM) across 3,321 transects spaced at 50-meter intervals." },
            { title: "Deep Learning Segmentation", text: "Implement and validate DeepLabV3+ neural network with ResNet-34 backbone to achieve over 85% validation accuracy against reference observations." },
            { title: "Identify Vulnerability Hotspots", text: "Map critical risk zones such as Bengre sandspit and Maravanthe NH-66 barrier beach to alert disaster management bodies." },
            { title: "Multi-Temporal Decadal Tracking", text: "Benchmark historical shorelines (2015–2024) and establish calibrated 5-year forward scenario modeling." },
            { title: "Participatory Decision Support", text: "Provide structured citizen-reporting workflows and scientifically responsible nature-based protection guidelines." }
          ].map((obj, i) => (
            <div key={i} style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
                <CheckCircle2 size={16} />
                <span>{obj.title}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: '#818cf8' }}>
          <Layers size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Technical Methodology</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>STEP 01</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '6px 0 8px' }}>Satellite Ingestion</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Automated ingestion of Sentinel-2 MSI (10m optical) and Sentinel-1 C-band SAR via Google Earth Engine with automated QA60 cloud masking.
            </p>
          </div>

          <div style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>STEP 02</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '6px 0 8px' }}>Index & Edge Extraction</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              NDWI calculation: <code>(Green - NIR) / (Green + NIR)</code>. Otsu adaptive thresholding and Canny sub-pixel edge detection in OpenCV.
            </p>
          </div>

          <div style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>STEP 03</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '6px 0 8px' }}>DeepLabV3+ AI Training</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              ResNet-34 encoder with Atrous Spatial Pyramid Pooling (ASPP). Trained on 9-channel multi-sensor image chips with Cross-Entropy + Dice Loss.
            </p>
          </div>

          <div style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>STEP 04</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '6px 0 8px' }}>GIS Transect Analysis</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Calculates intersection coordinates across 3,321 transects in EPSG:32643 UTM-43N projection to derive rates of change in m/year.
            </p>
          </div>
        </div>
      </section>

      {/* Technologies Actually Used */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: '#38bdf8' }}>
          <Code size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Technologies Used</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {TECHNOLOGIES.map((t, idx) => (
            <div key={idx} style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>{t.name}</strong>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{t.category}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Study Area: Udupi Coastal Region */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#f59e0b' }}>
          <MapPin size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Study Area: Udupi Coastal Corridor</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 16px 0' }}>
          The study area covers the <strong>97.2-kilometer coastal corridor of Udupi and Dakshina Kannada districts</strong> on the western coast of Karnataka, India (extending from Baindur in the north to Ullal in the south, centered at 13.4826° N, 74.7312° E). This shoreline is characterized by dynamic river estuaries (Swarna, Sita, Gangolli), narrow sandy spits, pocket barrier beaches, and rocky promontories at Kaup and St. Mary's Islands. Key vulnerable stretches include Bengre sand spit, Padubidri end point, and the Maravanthe barrier beach where National Highway 66 runs parallel to the Arabian Sea within 25 meters.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem' }}>
          <span style={{ padding: '6px 12px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            📍 Extent: 97.2 km Shoreline
          </span>
          <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            📐 Coordinate Reference System: EPSG:32643 (UTM Zone 43N)
          </span>
          <span style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            🌊 Tides: Semi-diurnal regime (0.4m to 1.8m)
          </span>
        </div>
      </section>

      {/* Target Applications & Stakeholders */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#38bdf8' }}>
          <Users size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Practical Applications & Stakeholders</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { title: "Environmental Researchers", desc: "Access verified multi-decadal shoreline vectors, erosion matrices, and calibrated training datasets for further climate studies." },
            { title: "Coastal Communities", desc: "Gain visibility into historical beach erosion trends, submit local ground photo reports, and learn about sustainable bio-shield protection." },
            { title: "Local Municipal Bodies", desc: "Prioritize infrastructure stabilization funds and implement informed building setback buffers under CRZ guidelines." },
            { title: "Disaster Management Teams", desc: "Identify pre-monsoon breach vulnerabilities early to stage emergency flood response measures and safeguard fishing hamlets." }
          ].map((app, i) => (
            <div key={i} style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>{app.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations and Future Scope */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#f59e0b' }}>
          <AlertCircle size={22} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Current Limitations & Future Development Scope</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', margin: '0 0 8px 0' }}>Prototype Capabilities & Limitations:</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
              <li>Satellite pixel resolution is bounded by Sentinel-2 (10 meters) and Sentinel-1 SAR (10–20 meters). Smaller micro-retreats (&lt;2.5 m) require sub-pixel extrapolation.</li>
              <li>Tidal height corrections currently utilize an empirical 1D slope equilibrium equation <code>Δx = (H - Tide)/tan(β)</code> rather than continuous bathymetric hydrodynamic gauges.</li>
              <li>Citizen-uploaded ground photographs are preserved for human validation; automatic ground feature classification is not yet linked to the satellite weights.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: '0 0 8px 0' }}>Future Scope:</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
              <li>Integration of high-resolution commercial PlanetScope (3m) and airborne LiDAR point clouds for millimeter-level bluff elevation modeling.</li>
              <li>Multi-modal Vision Transformer (ViT) backend to automatically analyze user-uploaded smartphone beach photos for sand scarp height and armor boulder displacement.</li>
              <li>Direct authorized webhook dispatch to the Karnataka State Natural Disaster Monitoring Centre (KSNDMC) spatial alerting network.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Academic Project Team */}
      <section style={{ background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px' }}>ACADEMIC CREDITS</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
            Engineering Project Development Team
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Department of Computer Science & Engineering · Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Udupi
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {TEAM_MEMBERS.map((m, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)'
              }}
            >
              {m.stamp && (
                <div style={{ width: '64px', height: '64px', margin: '0 auto 12px auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid #38bdf8' }}>
                  <img src={m.stamp} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>{m.name}</h4>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, fontFamily: 'monospace' }}>USN: {m.usn}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
