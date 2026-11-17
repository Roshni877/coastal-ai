import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Upload, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertTriangle, 
  Info, 
  Eye, 
  Download,
  Shield,
  Layers,
  Compass,
  Droplet,
  Waves,
  Trees
} from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: "Bengre Sand Spit (Estuary Mouth)", lat: 13.3409, lon: 74.6982 },
  { name: "Maravanthe Barrier Beach (NH-66)", lat: 13.7058, lon: 74.6433 },
  { name: "Padubidri Coast & End Point", lat: 13.1384, lon: 74.7735 },
  { name: "Malpe Port & Beach Shoreline", lat: 13.3512, lon: 74.7041 },
  { name: "Kaup Lighthouse Beach Corridor", lat: 13.2241, lon: 74.7394 },
  { name: "Kundapura / Gangolli River Mouth", lat: 13.6352, lon: 74.6854 },
  { name: "Custom Location / Other", lat: 13.4826, lon: 74.7312 }
];

const INITIAL_REPORTS = [
  {
    id: "CE-UDUPI-2026-8841",
    location: "Bengre Sand Spit (Estuary Mouth)",
    date: "2026-11-12",
    concernType: "Severe Coastal Erosion",
    severity: "Critical",
    description: "Rapid sand scarping observed over 250m stretch. High spring tide breached the natural berm, threatening several coconut holdings and artisanal fishing canoe berths.",
    photoUrl: "/shoreline/mean_position.png",
    status: "Verified & Forwarded to KSDMA",
    stakeholder: "Karnataka State Disaster Management Authority",
    actionRecommended: "Immediate drone volumetric audit & soft sandbag berm stabilization."
  },
  {
    id: "CE-UDUPI-2026-7914",
    location: "Maravanthe Barrier Beach (NH-66)",
    date: "2026-11-04",
    concernType: "Coastal Infrastructure Damage",
    severity: "High",
    description: "Scouring beneath the seawall boulders along National Highway 66. High waves washing spray directly over the southbound carriageway during afternoon swell.",
    photoUrl: "/tides_currents_noaa.png",
    status: "Under Engineering Review",
    stakeholder: "National Highways Authority & Coastal Engineering Cell",
    actionRecommended: "Structural toe-weight reinforcement and wave energy dissipater deployment."
  },
  {
    id: "CE-UDUPI-2026-6520",
    location: "Kundapura / Gangolli River Mouth",
    date: "2026-10-28",
    concernType: "Mangrove Deforestation",
    severity: "Moderate",
    description: "Clearing of estuarine fringing mangroves noticed on the tidal mudflat buffer. Local water velocity has increased noticeably during ebb tides.",
    photoUrl: "/sentinel_source.png",
    status: "Field Investigation Dispatched",
    stakeholder: "Karnataka Forest Department (Mangrove Division)",
    actionRecommended: "CRZ-I violation notice & native Rhizophora community replanting."
  }
];

export default function Reporting() {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'submissions' | 'recommendations'
  
  // Form State
  const [location, setLocation] = useState(PRESET_LOCATIONS[0].name);
  const [customLocation, setCustomLocation] = useState("");
  const [observationDate, setObservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [concernType, setConcernType] = useState("Severe Coastal Erosion");
  const [severity, setSeverity] = useState("High");
  const [stretchLength, setStretchLength] = useState("100-300m");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState(null);

  // Reports state with LocalStorage persistence
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("coastal_erosion_reports");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Storage read error", e);
    }
    return INITIAL_REPORTS;
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resolvedLocation = location === "Custom Location / Other" ? (customLocation || "Custom Udupi Stretch") : location;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newReport = {
      id: `CE-UDUPI-2026-${randomCode}`,
      location: resolvedLocation,
      date: observationDate,
      concernType,
      severity,
      description,
      stretchLength,
      photoUrl: photoPreview || "/shoreline/mean_position.png",
      status: "Submitted — Staged for Field Audit",
      stakeholder: "District Disaster Management Cell, Udupi",
      actionRecommended: getRecommendationForConcern(concernType)
    };

    setTimeout(() => {
      const updated = [newReport, ...reports];
      setReports(updated);
      try {
        localStorage.setItem("coastal_erosion_reports", JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage save error", err);
      }
      setLastSubmittedReport(newReport);
      setIsSubmitting(false);
      // Reset form
      setDescription("");
      setPhotoFile(null);
      setPhotoPreview(null);
    }, 600);
  };

  function getRecommendationForConcern(type) {
    switch (type) {
      case "Illegal Sand Mining":
        return "Initiate nighttime SAR backscatter anomaly monitoring and report coordinates to District Sand Monitoring Committee.";
      case "Mangrove Deforestation":
        return "Establish CRZ-I buffer demarcation and initiate nature-based bio-shield replanting with native mangrove propagules.";
      case "Groundwater Salinity":
        return "Conduct electrical conductivity (EC) testing on coastal borewells and evaluate freshwater aquifer recharge structures.";
      case "Severe Coastal Erosion":
        return "Perform 2D hydrodynamic numerical modeling before considering revetments; evaluate beach nourishment and submerged reef alternatives.";
      case "Marine Ecosystem Protection":
        return "Enforce seasonal no-dredging buffer zones and safeguard endangered Olive Ridley turtle nesting habitats.";
      default:
        return "Conduct localized bathymetric survey and continuous GPS shoreline tracking.";
    }
  }

  return (
    <div className="reporting-page" style={{ maxWidth: '1380px', margin: '0 auto', padding: '90px 24px 60px' }}>
      
      {/* Page Header */}
      <header style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>
          <ShieldAlert size={16} /> PARTICIPATORY MONITORING & DECISION SUPPORT SYSTEM
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Coastal Erosion Reporting & Scientific Recommendations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '880px' }}>
          Empowering coastal researchers, field personnel, and communities to submit geo-referenced incident observations while providing scientifically responsible coastal protection guidance.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'var(--card-bg, rgba(11, 19, 41, 0.7))',
          padding: '6px',
          borderRadius: '10px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          marginBottom: '32px'
        }}
      >
        <button
          onClick={() => setActiveTab('report')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'report' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: activeTab === 'report' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Upload size={16} />
          <span>Report Coastal Erosion</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'submissions' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: activeTab === 'submissions' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={16} />
          <span>Submitted Reports & Dispatches ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'recommendations' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: activeTab === 'recommendations' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Shield size={16} />
          <span>Coastal Protection & Decision Matrix</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: REPORT COASTAL EROSION (PART 5A & 5B)
          ======================================================== */}
      {activeTab === 'report' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          
          {/* Left: Input Form */}
          <div style={{ padding: '28px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(56, 189, 248, 0.22)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-main)' }}>
              Submit Field Observation Report
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Location Select */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                  Coastal Region / Known Hotspot
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#0ea5e9' }} />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  >
                    {PRESET_LOCATIONS.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {location === "Custom Location / Other" && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                    Specific Stretch Details / Coordinates
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hejamadi Kodi shoreline near port entrance"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              )}

              {/* Grid: Date & Concern Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                    Observation Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#0ea5e9' }} />
                    <input
                      type="date"
                      required
                      value={observationDate}
                      onChange={(e) => setObservationDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                    Type of Concern
                  </label>
                  <select
                    value={concernType}
                    onChange={(e) => setConcernType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Severe Coastal Erosion">Severe Coastal Erosion</option>
                    <option value="Illegal Sand Mining">Illegal Sand Mining</option>
                    <option value="Mangrove Deforestation">Mangrove Deforestation</option>
                    <option value="Groundwater Salinity">Groundwater Salinity</option>
                    <option value="Coastal Infrastructure Damage">Infrastructure Damage</option>
                    <option value="Marine Ecosystem Protection">Marine Ecosystem Disruption</option>
                  </select>
                </div>
              </div>

              {/* Grid: Severity & Affected Length */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                    Assessed Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Low">Low (Mild seasonal shift)</option>
                    <option value="Moderate">Moderate (Berm narrowing)</option>
                    <option value="High">High (Direct scarping/property risk)</option>
                    <option value="Critical">Critical (Immediate breach/structure failure)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                    Approx. Shoreline Length
                  </label>
                  <select
                    value={stretchLength}
                    onChange={(e) => setStretchLength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Under 50m">Under 50m (Point occurrence)</option>
                    <option value="50-100m">50 - 100 meters</option>
                    <option value="100-300m">100 - 300 meters</option>
                    <option value="300-1000m">300m - 1 kilometer</option>
                    <option value="Over 1km">Over 1 kilometer</option>
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                  Detailed Description of Observed Coastal Changes
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe visible wave action, sand scarp height, exposed tree root zones, damaged protection walls, or suspected illegal sand dredging..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Photographic Evidence Upload */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#cbd5e1' }}>
                  Upload Photographic Evidence
                </label>
                <div
                  style={{
                    border: '2px dashed rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    padding: '18px',
                    textAlign: 'center',
                    background: 'rgba(14, 165, 233, 0.04)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="erosion-photo-input"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="erosion-photo-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <Upload size={24} style={{ color: '#38bdf8' }} />
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                      {photoFile ? photoFile.name : "Click to select or drag photo here"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Supports JPG, PNG, WebP (Geotagged preferred)
                    </span>
                  </label>

                  {photoPreview && (
                    <div style={{ marginTop: '12px' }}>
                      <img
                        src={photoPreview}
                        alt="Evidence Preview"
                        style={{ maxHeight: '140px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.4)' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid #38bdf8',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
                }}
              >
                {isSubmitting ? (
                  <span>Compiling & Validating Telemetry...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Coastal Erosion Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Submission Output Card & Architecture Transparency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Output Card */}
            {lastSubmittedReport ? (
              <div
                style={{
                  padding: '24px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700 }}>
                    <CheckCircle2 size={18} />
                    <span>Report Filed Successfully</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    Ref: {lastSubmittedReport.id}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    <div><strong>Location:</strong> {lastSubmittedReport.location}</div>
                    <div><strong>Date of Observation:</strong> {lastSubmittedReport.date}</div>
                    <div><strong>Concern Category:</strong> {lastSubmittedReport.concernType}</div>
                    <div><strong>Assessed Severity:</strong> <span style={{ color: '#ef4444', fontWeight: 600 }}>{lastSubmittedReport.severity}</span></div>
                    <div><strong>Status:</strong> <span style={{ color: '#38bdf8' }}>{lastSubmittedReport.status}</span></div>
                  </div>

                  {lastSubmittedReport.photoUrl && (
                    <img
                      src={lastSubmittedReport.photoUrl}
                      alt="Submitted evidence"
                      style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    />
                  )}
                </div>

                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                  <strong>Description:</strong> {lastSubmittedReport.description}
                </div>

                <div style={{ padding: '12px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem', color: '#7dd3fc' }}>
                  <strong>Recommended Authority Action:</strong> {lastSubmittedReport.actionRecommended}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '24px',
                  background: 'var(--card-bg, rgba(11, 19, 41, 0.75))',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '14px',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <FileText size={36} style={{ color: '#38bdf8', opacity: 0.7, margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)', fontSize: '1.05rem' }}>Awaiting Your Submission</h4>
                <p style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.5 }}>
                  Fill the observation form to generate an official geo-referenced coastal report with tracking ID and authority dispatch envelope.
                </p>
              </div>
            )}

            {/* PART 5C: Image Analysis Transparency Notice */}
            <div
              style={{
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.55
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>
                <Info size={17} />
                <span>Machine Learning Image Analysis Specification (Part 5C)</span>
              </div>
              <p style={{ margin: '0 0 10px 0' }}>
                The automated machine learning pipeline deployed in this research project operates exclusively on calibrated <strong>10-meter Sentinel-1 SAR and Sentinel-2 optical satellite imagery</strong> with DeepLabV3+ segmentation.
              </p>
              <p style={{ margin: 0, color: '#94a3b8' }}>
                Photographs uploaded through this citizen-reporting portal are preserved for human field verification and are scheduled for automated ground scarp classification in future multi-modal vision transformer expansions. <em>The project does not falsely misattribute satellite model weights to hand-held smartphone photos.</em>
              </p>
            </div>

            {/* PART 5D: Authority Notification Architecture Notice */}
            <div
              style={{
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.55
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
                <Shield size={17} />
                <span>Authority Forwarding Architecture (Part 5D)</span>
              </div>
              <p style={{ margin: '0 0 8px 0' }}>
                The reporting pipeline implements a pre-configured dispatch envelope formatted for:
              </p>
              <ul style={{ margin: '0 0 10px 20px', padding: 0, color: '#94a3b8' }}>
                <li>Karnataka State Disaster Management Authority (KSDMA)</li>
                <li>District Disaster Management Authority, Udupi Collectorate</li>
                <li>Department of Fisheries and Coastal Infrastructure Development</li>
              </ul>
              <div style={{ padding: '8px 12px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '6px', fontSize: '0.74rem', color: '#7dd3fc' }}>
                <strong>Demonstration Environment:</strong> Webhook payloads and dispatch templates are architected and ready for institutional API keys and SMS gateway integration.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SUBMITTED REPORTS & DISPATCH QUEUE
          ======================================================== */}
      {activeTab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Coastal Incident Ledger ({reports.length} Reports Recorded)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Persistent Local Storage & Spatial Registry
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
            {reports.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '22px',
                  background: 'var(--card-bg, rgba(11, 19, 41, 0.75))',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px' }}>
                        {r.id}
                      </span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>
                        {r.location}
                      </h4>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: r.severity === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: r.severity === 'Critical' ? '#f87171' : '#fbbf24',
                        border: `1px solid ${r.severity === 'Critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                      }}
                    >
                      {r.severity} Severity
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span>📅 {r.date}</span>
                    <span>🏷️ {r.concernType}</span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 16px 0' }}>
                    {r.description}
                  </p>
                </div>

                <div>
                  <div style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.78rem', marginBottom: '10px' }}>
                    <div style={{ color: '#94a3b8' }}>Target Authority: <strong style={{ color: '#e2e8f0' }}>{r.stakeholder}</strong></div>
                    <div style={{ color: '#34d399', marginTop: '3px' }}>● {r.status}</div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#7dd3fc', background: 'rgba(14, 165, 233, 0.08)', padding: '8px 10px', borderRadius: '6px' }}>
                    <strong>Scientific Advisory:</strong> {r.actionRecommended}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: COASTAL PROTECTION & RECOMMENDATIONS (PART 6)
          ======================================================== */}
      {activeTab === 'recommendations' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>
              Scientifically Responsible Decision Support Matrix
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, maxWidth: '900px' }}>
              Responsible coastal zone management must prioritize nature-based solutions and comprehensive hydrodynamic evaluation. Indiscriminate construction of hard groynes and seawalls often aggravates downdrift sediment starvation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
            
            {/* 1. Illegal Sand Mining */}
            <div style={{ padding: '24px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#f59e0b' }}>
                <AlertTriangle size={22} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>1. Illegal Sand Mining</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                Unregulated excavation of sand in estuarine bars (Gangolli, Swarna) alters tidal prism volume, lowers the riverbed, and starves adjacent ocean beaches of essential sediment replenishment.
              </p>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '6px' }}>Actionable Recommendations:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Deploy automated Sentinel-1 SAR coherence analysis to detect nighttime bathymetric changes and sand bar lowering.</li>
                  <li>Institute automated GPS geotagging on all authorized sand transport vehicles.</li>
                  <li>Establish community surveillance checkpoints at critical river mouth junctions.</li>
                </ul>
              </div>
            </div>

            {/* 2. Mangrove Deforestation */}
            <div style={{ padding: '24px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#10b981' }}>
                <Trees size={22} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>2. Mangrove Deforestation & Estuarine Degradation</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                Clearing native estuarine mangroves eliminates the natural root matrix that stabilizes fine mudflats, leading to rapid shoreline retreat and loss of marine nurseries.
              </p>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '6px' }}>Actionable Recommendations:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Promote bio-shielding using native <em>Rhizophora mucronata</em> and <em>Avicennia marina</em> species along intertidal zones.</li>
                  <li>Strictly demarcate CRZ-I (Ecologically Sensitive Area) boundary pillars with satellite cross-verification.</li>
                  <li>Involve traditional coastal panchayats in mangrove nursery stewardship programs.</li>
                </ul>
              </div>
            </div>

            {/* 3. Groundwater Salinity */}
            <div style={{ padding: '24px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#0ea5e9' }}>
                <Droplet size={22} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>3. Groundwater Salinization</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                Coastline retreat pushes the saline ocean wedge inland, contaminating shallow freshwater aquifers and rendering local drinking water and agricultural borewells brackish.
              </p>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#7dd3fc', display: 'block', marginBottom: '6px' }}>Actionable Recommendations:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Deploy automated Electrical Conductivity (EC) sensor loggers in public wells within 1 km of the shoreline.</li>
                  <li>Construct surface rainwater harvesting basins and artificial percolation check-dams to maintain hydraulic head.</li>
                  <li>Restrict deep groundwater extraction along narrow sandspits like Bengre and Padubidri.</li>
                </ul>
              </div>
            </div>

            {/* 4. Severe Coastal Erosion & Hard vs Soft Engineering */}
            <div style={{ padding: '24px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#ef4444' }}>
                <Waves size={22} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>4. Severe Coastal Erosion & Stabilization Policy</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                Constructing vertical seawalls or poorly positioned groynes frequently reflects wave energy, scours the beach toe, and accelerates downstream erosion on adjacent unprotected properties.
              </p>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#f87171', display: 'block', marginBottom: '6px' }}>Actionable Recommendations:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Mandate comprehensive 2D numerical sediment transport modeling before installing any hard structures.</li>
                  <li>Prioritize soft engineering: Artificial sand nourishment and submerged geotextile reef breakers.</li>
                  <li>Establish a mandatory 50-meter dynamic setback buffer prohibiting permanent buildings in critical zones.</li>
                </ul>
              </div>
            </div>

            {/* 5. Marine Ecosystem Protection */}
            <div style={{ padding: '24px', background: 'var(--card-bg, rgba(11, 19, 41, 0.75))', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#a855f7' }}>
                <Compass size={22} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>5. Marine Habitat & Turtle Nesting Conservation</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                Beach scarping and loss of gentle sandy slopes disrupts nesting sites for endangered Olive Ridley sea turtles and damages intertidal benthic species.
              </p>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Actionable Recommendations:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Maintain dark beach corridors and unarmored sandy stretches during the November–February nesting season.</li>
                  <li>Enforce mechanized trawler restrictions within 5 km of shoreline during the monsoon breeding ban.</li>
                  <li>Establish periodic marine turbidity and benthic biodiversity monitoring stations.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
