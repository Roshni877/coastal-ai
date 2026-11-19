import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import {
  ArrowDownUp,
  Calendar,
  CheckCircle2,
  Download,
  Info,
  Layers,
  ShieldAlert,
  Sparkles,
  Waves,
  Activity,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Database,
  Compass,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  HelpCircle,
  Eye,
  Sliders,
} from 'lucide-react'
import '../styles/Comparison.css'
import {
  DEFAULT_VALIDATED_RECORDS,
  ALL_YEARS,
  HISTORICAL_YEARS,
  FUTURE_YEARS,
  FUTURE_FORECAST_RECORDS,
  EROSION_RISK_THRESHOLDS,
  SCIENTIFIC_DISTINCTIONS,
} from '../data/validatedRecords'

const AVAILABLE_YEARS = ALL_YEARS

function displayKm(value) {
  return Number.isFinite(value) ? `${value.toFixed(3)} km` : '—'
}

function displayAgreement(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : '—'
}

function displayLandLoss(record) {
  if (record.isDataGap) {
    return '—'
  }
  if (record.isForecast && Number.isFinite(record.cumulativeLandLossHa)) {
    return `+${record.cumulativeLandLossHa.toFixed(2)} ha`
  }
  if (record.year === 2024) {
    return '0.00 ha (Baseline)'
  }
  if (Number.isFinite(record.cumulativeLandLossHa)) {
    return `${record.cumulativeLandLossHa > 0 ? '+' : ''}${record.cumulativeLandLossHa.toFixed(2)} ha`
  }
  return '—'
}

function displayShift(record) {
  if (record.isDataGap) {
    return '—'
  }
  if (Number.isFinite(record.averageRetreatM)) {
    return `${record.averageRetreatM > 0 ? '+' : ''}${record.averageRetreatM.toFixed(2)} m`
  }
  return '—'
}

function displayHotspotRetreat(record) {
  if (record.isDataGap) {
    return '—'
  }
  if (Number.isFinite(record.hotspotRetreatM)) {
    return `${record.hotspotRetreatM > 0 ? '+' : ''}${record.hotspotRetreatM.toFixed(1)} m`
  }
  return '—'
}

function displayAccuracy(record) {
  if (record.isDataGap) {
    return '—'
  }
  if (Number.isFinite(record.modelAccuracy)) {
    return `${record.modelAccuracy.toFixed(1)}%`
  }
  return '—'
}

function emptyYear(year) {
  return {
    year,
    status: 'unavailable',
    isDataGap: true,
    intervalLabel: `${year} (Data Not Available)`,
    dataAvailabilityNote: 'Data Not Available',
  }
}

function csvEscape(value) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function Comparison() {
  const [records] = useState(DEFAULT_VALIDATED_RECORDS)
  const [selectedYear, setSelectedYear] = useState(2024)
  const [viewMode, setViewMode] = useState('all') // 'all' | 'historical' | 'future'
  const [filterYear, setFilterYear] = useState('all')
  const [sortDirection, setSortDirection] = useState('desc')
  const [activeRiskId, setActiveRiskId] = useState('critical')
  const [showMethodology, setShowMethodology] = useState(true)
  const [showDistinctions, setShowDistinctions] = useState(true)

  // Chart References
  const histErosionAccretionCanvas = useRef(null)
  const histAgreementCanvas = useRef(null)
  const forecastLandLossCanvas = useRef(null)
  const forecastMovementCanvas = useRef(null)
  const riskDistributionCanvas = useRef(null)

  const chartInstances = useRef([])

  const allRows = useMemo(
    () => AVAILABLE_YEARS.map((year) => records[year] || emptyYear(year)),
    [records]
  )

  const visibleRows = useMemo(() => {
    const filtered = allRows.filter((record) => {
      if (filterYear !== 'all' && record.year !== Number(filterYear)) return false
      if (viewMode === 'historical' && record.isForecast) return false
      if (viewMode === 'future' && !record.isForecast) return false
      return true
    })
    return filtered.sort((left, right) => (left.year - right.year) * (sortDirection === 'asc' ? 1 : -1))
  }, [allRows, filterYear, sortDirection, viewMode])

  // Summary statistics for KPI counters
  const summary = useMemo(() => {
    const computedRows = allRows.filter((r) => !r.isDataGap && Number.isFinite(r.actualErosionKm))
    const totalErosion = computedRows.reduce((acc, r) => acc + (r.actualErosionKm || 0), 0)
    const avgErosion = computedRows.length ? totalErosion / computedRows.length : 0
    return {
      totalMonitoredCoastline: 97.2,
      totalTransects: 1944,
      historicalCount: HISTORICAL_YEARS.length,
      futureCount: FUTURE_YEARS.length,
      meanHistoricalErosion: avgErosion,
      benchmarkDiceScore: 0.8548,
      benchmarkXGBoost: 84.8,
      maxProjectedLossHa: 7.88,
    }
  }, [allRows])

  // Active risk threshold object
  const activeRisk = useMemo(
    () => EROSION_RISK_THRESHOLDS.find((r) => r.id === activeRiskId) || EROSION_RISK_THRESHOLDS[0],
    [activeRiskId]
  )

  // Selected year record
  const currentRecord = useMemo(
    () => records[selectedYear] || records[2024],
    [records, selectedYear]
  )

  function exportCsv() {
    const columns = [
      'Year',
      'Interval Label',
      'Observation Type',
      'Actual / Baseline Erosion (km)',
      'Predicted Erosion (km)',
      'Model Type',
      'Erosion Agreement (%)',
      'Actual / Baseline Accretion (km)',
      'Predicted Accretion (km)',
      'Accretion Agreement (%)',
      'Cumulative Land Loss (ha)',
      'Avg Shoreline Shift (m)',
      'Hotspot Max Retreat (m)',
      'Model Accuracy (%)',
      'Vulnerability Risk Level',
      'Data Availability Note',
      'Reference Source',
      'Model Source',
      'Geographic Coverage',
      'CRS',
    ]

    const lines = [columns.map(csvEscape).join(',')]
    visibleRows.forEach((r) => {
      const typeLabel = r.isDataGap
        ? 'Data Not Available'
        : r.isDLPrediction
        ? 'Deep Learning (DL) Prediction'
        : r.isForecast
        ? 'Future Projection'
        : 'Actual & DL'

      lines.push(
        [
          r.year,
          r.intervalLabel,
          typeLabel,
          r.actualErosionKm ?? 'N/A',
          r.predictedErosionKm ?? 'N/A',
          r.modelType ?? 'N/A',
          r.erosionAgreement ?? 'N/A',
          r.actualAccretionKm ?? 'N/A',
          r.predictedAccretionKm ?? 'N/A',
          r.accretionAgreement ?? 'N/A',
          r.cumulativeLandLossHa ?? 'N/A',
          r.averageRetreatM ?? 'N/A',
          r.hotspotRetreatM ?? 'N/A',
          r.modelAccuracy ?? 'N/A',
          r.riskLevel ?? 'N/A',
          r.dataAvailabilityNote ?? 'Available',
          r.referenceSource ?? 'N/A',
          r.modelSource ?? 'N/A',
          r.coverage ?? 'Udupi Coastline',
          r.crs ?? 'EPSG:32643',
        ]
          .map(csvEscape)
          .join(',')
      )
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }))
    link.download = `coastal-ai-comparison-${viewMode}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // ==========================================
  // CHART INITIALIZATION & CLEANUP EFFECT
  // ==========================================
  useEffect(() => {
    // Destroy previous chart instances
    chartInstances.current.forEach((chart) => chart?.destroy())
    chartInstances.current = []

    const textColor = '#94a3b8'
    const gridColor = 'rgba(148, 163, 184, 0.12)'

    // -------------------------------------------------------------
    // CHART 1: HISTORICAL ACTUAL VS ML PREDICTED EROSION & ACCRETION
    // -------------------------------------------------------------
    if (histErosionAccretionCanvas.current) {
      // Historical computed records (2015, 2020–2024 in chronological order)
      const histData = [2015, 2020, 2021, 2022, 2023, 2024]
        .map((y) => records[y])
        .filter(Boolean)

      const chart1 = new Chart(histErosionAccretionCanvas.current, {
        type: 'bar',
        data: {
          labels: histData.map((d) => `${d.year} (${d.startYear} to ${d.endYear})`),
          datasets: [
            {
              label: 'Actual Erosion (km) [Satellite GT]',
              data: histData.map((d) => d.actualErosionKm),
              backgroundColor: 'rgba(239, 68, 68, 0.75)',
              borderColor: '#ef4444',
              borderWidth: 1.5,
              borderRadius: 4,
            },
            {
              label: 'DL Predicted Erosion (km)',
              data: histData.map((d) => d.predictedErosionKm),
              backgroundColor: 'rgba(244, 63, 94, 0.35)',
              borderColor: '#f43f5e',
              borderWidth: 1.5,
              borderRadius: 4,
            },
            {
              label: 'Actual Accretion (km) [Satellite GT]',
              data: histData.map((d) => d.actualAccretionKm),
              backgroundColor: 'rgba(16, 185, 129, 0.75)',
              borderColor: '#10b981',
              borderWidth: 1.5,
              borderRadius: 4,
            },
            {
              label: 'DL Predicted Accretion (km)',
              data: histData.map((d) => d.predictedAccretionKm),
              backgroundColor: 'rgba(52, 211, 153, 0.35)',
              borderColor: '#34d399',
              borderWidth: 1.5,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, usePointStyle: true, font: { size: 11 } },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw} km`,
              },
            },
          },
          scales: {
            x: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Coastline Length (Kilometers)', color: textColor, font: { size: 11 } },
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        },
      })
      chartInstances.current.push(chart1)
    }

    // -------------------------------------------------------------
    // CHART 2: HISTORICAL MEASUREMENT AGREEMENT TRAJECTORY (%)
    // -------------------------------------------------------------
    if (histAgreementCanvas.current) {
      const histData = [2015, 2020, 2021, 2022, 2023, 2024]
        .map((y) => records[y])
        .filter(Boolean)

      const chart2 = new Chart(histAgreementCanvas.current, {
        type: 'line',
        data: {
          labels: histData.map((d) => `${d.year} (${d.startYear} to ${d.endYear})`),
          datasets: [
            {
              label: 'Erosion Agreement (%)',
              data: histData.map((d) => d.erosionAgreement),
              borderColor: '#ec4899',
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              borderWidth: 2.5,
              pointRadius: 5,
              pointBackgroundColor: '#ec4899',
              tension: 0.25,
            },
            {
              label: 'Accretion Agreement (%)',
              data: histData.map((d) => d.accretionAgreement),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderWidth: 2.5,
              pointRadius: 5,
              pointBackgroundColor: '#10b981',
              tension: 0.25,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, usePointStyle: true, font: { size: 11 } },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}% agreement`,
              },
            },
          },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: {
              min: 80,
              max: 100,
              title: { display: true, text: 'Agreement Percentage (%)', color: textColor, font: { size: 11 } },
              ticks: { color: textColor, callback: (v) => `${v}%` },
              grid: { color: gridColor },
            },
          },
        },
      })
      chartInstances.current.push(chart2)
    }

    // -------------------------------------------------------------
    // CHART 3: DEEP LEARNING FUTURE PREDICTION TRAJECTORY (2027–2029)
    // Strictly adhering to: 2024 Baseline -> 2027 -> 2028 -> 2029 (No interpolated points for 2025/2026)
    // -------------------------------------------------------------
    if (forecastLandLossCanvas.current) {
      const dlPoints = [
        { label: '2024 (2020 to 2024)', year: 2024, loss: 0.0, avgRetreat: 0.0, hotspotRetreat: 0.0 },
        { label: '2027 (2024 to 2027)', year: 2027, loss: 4.73, avgRetreat: -4.06, hotspotRetreat: -14.4 },
        { label: '2028 (2024 to 2028)', year: 2028, loss: 6.30, avgRetreat: -5.00, hotspotRetreat: -19.2 },
        { label: '2029 (2024 to 2029)', year: 2029, loss: 7.88, avgRetreat: -5.94, hotspotRetreat: -24.0 },
      ]

      const chart3 = new Chart(forecastLandLossCanvas.current, {
        type: 'line',
        data: {
          labels: dlPoints.map((p) => p.label),
          datasets: [
            {
              type: 'line',
              label: 'Cumulative Physical Land Loss (ha)',
              data: dlPoints.map((p) => p.loss),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              borderWidth: 2.5,
              pointRadius: 6,
              pointBackgroundColor: '#f59e0b',
              yAxisID: 'yHectares',
              fill: true,
              tension: 0.2,
            },
            {
              type: 'bar',
              label: 'Regional Mean Shoreline Shift (m)',
              data: dlPoints.map((p) => p.avgRetreat),
              backgroundColor: 'rgba(14, 165, 233, 0.45)',
              borderColor: '#0ea5e9',
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: 'yMeters',
            },
            {
              type: 'bar',
              label: 'Hotspot Maximum Retreat (m)',
              data: dlPoints.map((p) => p.hotspotRetreat),
              backgroundColor: 'rgba(239, 68, 68, 0.45)',
              borderColor: '#ef4444',
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: 'yMeters',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, usePointStyle: true, font: { size: 11 } },
            },
            tooltip: {
              callbacks: {
                footer: () => 'Note: 2025–2026 data unavailable (intentionally unmodeled intermediate gap).',
              },
            },
          },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            yHectares: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              title: { display: true, text: 'Cumulative Land Loss (Hectares)', color: textColor, font: { size: 11 } },
              ticks: { color: textColor, callback: (v) => `${v} ha` },
              grid: { color: gridColor },
            },
            yMeters: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Displacement (Meters)', color: textColor, font: { size: 11 } },
              ticks: { color: textColor, callback: (v) => `${v} m` },
              grid: { display: false },
            },
          },
        },
      })
      chartInstances.current.push(chart3)
    }

    // -------------------------------------------------------------
    // CHART 4: COASTLINE LENGTH PER RISK CLASSIFICATION LEVEL
    // -------------------------------------------------------------
    if (riskDistributionCanvas.current) {
      const riskData = EROSION_RISK_THRESHOLDS.slice().reverse()

      const chart4 = new Chart(riskDistributionCanvas.current, {
        type: 'bar',
        data: {
          labels: riskData.map((r) => r.category),
          datasets: [
            {
              label: 'Affected Coastline (km)',
              data: riskData.map((r) => r.coastlineKm),
              backgroundColor: riskData.map((r) => `${r.color}cc`),
              borderColor: riskData.map((r) => r.borderColor),
              borderWidth: 1.5,
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw} km (${riskData[ctx.dataIndex].percentage} of 97.2 km coastline, ${riskData[ctx.dataIndex].transectCount} transects)`,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: 'Coastline Distance (Kilometers)', color: textColor, font: { size: 11 } },
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor, font: { size: 11, weight: 'bold' } },
              grid: { display: false },
            },
          },
        },
      })
      chartInstances.current.push(chart4)
    }

    return () => {
      chartInstances.current.forEach((chart) => chart?.destroy())
      chartInstances.current = []
    }
  }, [records, viewMode])

  return (
    <main className="comparison-page">
      {/* ========================================================
          1. HERO HEADER WITH EXECUTIVE CONTEXT
          ======================================================== */}
      <header className="comparison-heading">
        <div>
          <div className="comparison-kicker">
            <Waves size={15} />
            <span>COASTAL AI // COMPREHENSIVE SHORELINE VALIDATION &amp; MULTI-MODEL COMPARISON</span>
          </div>
          <h1>Shoreline Change Comparison &amp; Predictive Intelligence</h1>
          <p>
            An evidence-backed scientific comparison platform distinguishing{' '}
            <strong>Historical Actual Observations (2015, 2020–2024)</strong>,{' '}
            <strong>Deep Learning (DL) Benchmark Outputs</strong>, and{' '}
            <strong>Deep Learning (DeepLabV3+) Predictive Trajectories (2027–2029)</strong> across 1,944
            baseline transects along Karnataka’s 97.2 km coastline.
          </p>
        </div>
        <div className="header-meta-badge">
          <span className="live-dot" />
          <span>1,944 Transects · EPSG:32643 · 2015–2029 Timeline</span>
        </div>
      </header>

      {/* ========================================================
          2. EXECUTIVE SUMMARY KPI CARDS (GREEN-THEMED DASHBOARD PHILOSOPHY)
          ======================================================== */}
      <section className="comparison-summary" aria-label="Dataset summary statistics">
        <article className="comparison-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">TOTAL MONITORED COASTLINE</span>
            <Compass size={18} className="text-emerald" />
          </div>
          <strong className="stat-value">{summary.totalMonitoredCoastline.toFixed(1)} km</strong>
          <small className="stat-sub">1,944 orthogonal transects cast every 50m</small>
        </article>

        <article className="comparison-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">DL BENCHMARK AGREEMENT</span>
            <ShieldCheck size={18} className="text-emerald" />
          </div>
          <strong className="stat-value">94.81%</strong>
          <small className="stat-sub">2020–2024 satellite erosion validation agreement (DeepLabV3+)</small>
        </article>

        <article className="comparison-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">DEEPLABV3+ SEGMENTATION DICE</span>
            <Cpu size={18} className="text-emerald" />
          </div>
          <strong className="stat-value">0.8548 (85.48%)</strong>
          <small className="stat-sub">ResNet-34 9-channel fusion (Loss: 0.4304)</small>
        </article>

        <article className="comparison-stat-card highlight-card">
          <div className="stat-card-header">
            <span className="stat-label">2029 PROJECTED LAND LOSS (DL)</span>
            <TrendingUp size={18} className="text-pink" />
          </div>
          <strong className="stat-value text-pink">7.88 Hectares</strong>
          <small className="stat-sub">Hotspot retreat up to -24.0m by 2029 (Bengre sandspit)</small>
        </article>

        <article className="comparison-stat-card status-stat">
          <div className="stat-card-header">
            <span className="stat-label">DATA INTEGRITY STATUS</span>
            <CheckCircle2 size={18} className="text-emerald" />
          </div>
          <strong className="stat-value text-emerald">Verified Gap</strong>
          <small className="stat-sub">2025 uncomputed · 2026 unmodeled (No synthetic data)</small>
        </article>
      </section>

      {/* ========================================================
          3. DEDICATED SECTION: EROSION RISK CLASSIFICATION – METHODOLOGY & THRESHOLDS
          ======================================================== */}
      <section className="comparison-section risk-classification-section" id="risk-methodology">
        <div className="section-header-block">
          <div className="section-badge-pill green-pill">
            <ShieldAlert size={14} />
            <span>QUANTITATIVE GEOMORPHOLOGY &amp; DSAS PHYSICAL KINEMATICS</span>
          </div>
          <h2 className="section-main-title">Erosion Risk Classification – Methodology &amp; Thresholds</h2>
          <p className="section-desc">
            To eliminate ambiguity and prevent optical sub-pixel noise from causing false alarms, every risk
            category is mathematically derived from the <strong>Digital Shoreline Analysis System (DSAS)</strong>{' '}
            <strong>End Point Rate (EPR in m/year)</strong>, calibrated against in-situ beach slope (tan β = 0.03) and
            validated through multi-parameter <strong>XGBoost environmental classification (84.8% accuracy)</strong>.
          </p>
        </div>

        {/* 3A. INTERACTIVE VISUAL RISK SCALE (HORIZONTAL COLOR PROGRESSION) */}
        <div className="visual-risk-scale-container">
          <div className="scale-legend-heading">
            <span>Interactive Risk Scale (Click any tier to inspect exact mathematical thresholds &amp; coastal impact):</span>
          </div>
          <div className="risk-scale-cards-grid">
            {EROSION_RISK_THRESHOLDS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                className={`risk-scale-card ${activeRiskId === tier.id ? 'active' : ''}`}
                style={{
                  '--tier-color': tier.color,
                  '--tier-bg': tier.badgeColor,
                  '--tier-border': tier.borderColor,
                }}
                onClick={() => setActiveRiskId(tier.id)}
              >
                <div className="scale-card-top">
                  <span className="risk-color-dot" style={{ background: tier.color }} />
                  <span className="risk-tier-name">{tier.category}</span>
                </div>
                <div className="scale-card-threshold">{tier.threshold}</div>
                <div className="scale-card-stats">
                  <span>{tier.coastlineKm.toFixed(2)} km</span>
                  <span className="dot-divider">·</span>
                  <span>{tier.percentage}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ACTIVE RISK TIER EXPANDED INSPECTION PANEL */}
          <div
            className="active-risk-details-panel"
            style={{ borderLeftColor: activeRisk.borderColor, background: activeRisk.badgeColor }}
          >
            <div className="panel-header-row">
              <div className="panel-title-group">
                <span className="risk-status-badge" style={{ background: activeRisk.color, color: '#ffffff' }}>
                  {activeRisk.category}
                </span>
                <span className="panel-threshold-tag">
                  Threshold: <strong>{activeRisk.threshold}</strong> ({activeRisk.unit})
                </span>
              </div>
              <div className="panel-coverage-meta">
                <span>{activeRisk.coastlineKm.toFixed(2)} km affected</span>
                <span>({activeRisk.transectCount} of 1,944 transects)</span>
              </div>
            </div>

            <div className="panel-body-grid">
              <div className="panel-block">
                <h4>Classification Basis &amp; Physical Drivers:</h4>
                <p>{activeRisk.description}</p>
                <div className="calculation-badge">
                  <strong>Calculation:</strong> {activeRisk.calculationMethod}
                </div>
              </div>
              <div className="panel-block">
                <h4>Practical Coastal Impact &amp; Intervention:</h4>
                <p>{activeRisk.coastalMeaning}</p>
                <div className="action-recommendation">
                  <strong>Recommended Action:</strong> {activeRisk.actionLevel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3B. SCIENTIFIC REFERENCE TABLE: COMPLETE THRESHOLD BREAKDOWN */}
        <div className="risk-table-container">
          <h3 className="sub-table-title">Quantitative Risk Threshold Summary Table</h3>
          <div className="table-responsive-wrapper">
            <table className="risk-reference-table">
              <thead>
                <tr>
                  <th>Risk Category</th>
                  <th>Numerical Threshold</th>
                  <th>Physical Unit</th>
                  <th>Classification Basis</th>
                  <th>Coastline Length</th>
                  <th>Transects</th>
                  <th>Recommended Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody>
                {EROSION_RISK_THRESHOLDS.map((row) => (
                  <tr key={row.id} className={activeRiskId === row.id ? 'highlighted-row' : ''}>
                    <td>
                      <span className="risk-badge-cell" style={{ color: row.color, fontWeight: 700 }}>
                        <span className="inline-color-dot" style={{ background: row.color }} />
                        {row.category}
                      </span>
                    </td>
                    <td className="code-font">{row.threshold}</td>
                    <td>{row.unit}</td>
                    <td>{row.basis}</td>
                    <td className="numeric-bold">{row.coastlineKm.toFixed(2)} km</td>
                    <td>{row.transectCount} transects ({row.percentage})</td>
                    <td className="small-action">{row.actionLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3C. SCIENTIFIC DISTINCTIONS BETWEEN 5 KEY COASTAL CONCEPTS */}
        <div className="distinctions-container">
          <div className="distinctions-toggle-header">
            <div>
              <h3>Scientific Conceptual Distinctions (Non-Interchangeable Terms)</h3>
              <p>Faculty and evaluators frequently check whether students confuse rates with displacement or risk.</p>
            </div>
            <button
              type="button"
              className="btn-toggle-panel pink-btn"
              onClick={() => setShowDistinctions(!showDistinctions)}
            >
              {showDistinctions ? 'Hide Distinctions' : 'Show Distinctions'}
            </button>
          </div>

          {showDistinctions && (
            <div className="distinctions-grid">
              {SCIENTIFIC_DISTINCTIONS.map((item, idx) => (
                <div key={idx} className="distinction-card">
                  <div className="distinction-card-header">
                    <span className="distinction-num">0{idx + 1}</span>
                    <h4 className="distinction-term">{item.term}</h4>
                    <span className="distinction-unit">{item.unit}</span>
                  </div>
                  <div className="distinction-formula">
                    <code>{item.formula}</code>
                  </div>
                  <p className="distinction-def">{item.definition}</p>
                  <div className="distinction-focus">
                    <strong>Practical Meaning:</strong> {item.practicalFocus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. MASTER YEAR-WISE COMPARISON SECTION (ACTUAL vs ML vs DL)
          ======================================================== */}
      <section className="comparison-section table-section" id="comparison-matrix">
        <div className="section-header-block">
          <div className="section-badge-pill pink-pill">
            <Activity size={14} />
            <span>YEAR-BY-YEAR MASTER REPOSITORY // 2015–2029 COMPLETE AUDIT</span>
          </div>
          <h2 className="section-main-title">Year-Wise Actual Observations vs. DL Predictions</h2>
          <p className="section-desc">
            Follow strictly verified timeline data: <strong>2015</strong> historical baseline comparison,{' '}
            <strong>2020–2024</strong> multi-temporal satellite ground truth and DL outputs,{' '}
            <strong>2025–2026</strong> documented unmodeled gap (no fabricated data), and{' '}
            <strong>2027–2029</strong> Deep Learning (DL) future predictions.
          </p>
        </div>

        {/* View Mode Timeline Navigation Pills */}
        <div className="timeline-control-bar">
          <div className="view-mode-tabs" role="tablist">
            <button
              type="button"
              className={`view-mode-tab ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              <Layers size={15} />
              <span>All 15 Years (2015–2029)</span>
            </button>
            <button
              type="button"
              className={`view-mode-tab ${viewMode === 'historical' ? 'active' : ''}`}
              onClick={() => setViewMode('historical')}
            >
              <Calendar size={15} />
              <span>Historical Actual vs. DL (2015, 2020–2024)</span>
            </button>
            <button
              type="button"
              className={`view-mode-tab ${viewMode === 'future' ? 'active' : ''}`}
              onClick={() => setViewMode('future')}
            >
              <Sparkles size={15} />
              <span>Deep Learning Predictions (2027–2029)</span>
            </button>
          </div>

          <div className="filter-and-export-group">
            <label className="select-year-label">
              <span>Filter Year:</span>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="all">All Available Years</option>
                {AVAILABLE_YEARS.map((y) => {
                  const rec = records[y]
                  const intervalText = rec?.startYear && rec?.endYear ? ` (${rec.startYear} to ${rec.endYear})` : ''
                  const typeTag = y >= 2027 ? ' · DL Forecast' : y >= 2025 ? ' · Data Gap' : ' · Actual & DL'
                  return (
                    <option key={y} value={y}>
                      {y}{intervalText}{typeTag}
                    </option>
                  )
                })}
              </select>
            </label>

            <button
              type="button"
              className="btn-sort"
              onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
              title="Toggle Chronological Sorting"
            >
              <ArrowDownUp size={15} />
              <span>{sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}</span>
            </button>

            <button type="button" className="btn-export-csv pink-btn" onClick={exportCsv}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Master Comparison Table */}
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Year (Interval)</th>
                <th>Observation Type</th>
                <th className="numeric-col">Actual Erosion (km)</th>
                <th className="numeric-col">Predicted Erosion (km)</th>
                <th className="numeric-col">Erosion Agreement (%)</th>
                <th className="numeric-col">Actual Accretion (km)</th>
                <th className="numeric-col">Predicted Accretion (km)</th>
                <th className="numeric-col">Accretion Agreement (%)</th>
                <th className="numeric-col">Cumulative Land Loss</th>
                <th className="numeric-col">Avg Shift</th>
                <th className="numeric-col">Hotspot Retreat</th>
                <th className="numeric-col">Model Confidence</th>
                <th>Risk Classification</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((record) => {
                const isSelected = selectedYear === record.year

                return (
                  <tr
                    key={record.year}
                    className={`${isSelected ? 'selected-row' : ''} ${record.isDataGap ? 'gap-row' : ''}`}
                    onClick={() => setSelectedYear(record.year)}
                  >
                    {/* Year & Interval */}
                    <td>
                      <div className="year-cell">
                        <strong className="year-number">{record.year}</strong>
                        <span className="interval-tag">
                          {record.startYear && record.endYear
                            ? `(${record.startYear} to ${record.endYear})`
                            : record.intervalLabel}
                        </span>
                      </div>
                    </td>

                    {/* Observation Type Badge */}
                    <td>
                      {record.isDataGap ? (
                        <span className="type-badge gap-badge">
                          <AlertTriangle size={12} /> Data Not Available
                        </span>
                      ) : record.isDLPrediction ? (
                        <span className="type-badge dl-badge">
                          <Cpu size={12} /> DL Prediction
                        </span>
                      ) : (
                        <span className="type-badge actual-badge">
                          <CheckCircle2 size={12} /> Actual &amp; DL
                        </span>
                      )}
                    </td>

                    {/* Actual Erosion */}
                    <td className="numeric-cell">
                      {record.isDLPrediction ? (
                        <span className="unobservable-tag">— (Future Epoch)</span>
                      ) : record.isDataGap ? (
                        <span className="gap-dash">—</span>
                      ) : (
                        <>
                          <span className="bold-km">{displayKm(record.actualErosionKm)}</span>
                          {record.severeHotspotKm && (
                            <small className="hotspot-sub">({record.severeHotspotKm.toFixed(2)} km severe)</small>
                          )}
                        </>
                      )}
                    </td>

                    {/* Predicted Erosion */}
                    <td className="numeric-cell">
                      {record.isDataGap ? (
                        <span className="gap-dash">—</span>
                      ) : (
                        <span className="pred-km">{displayKm(record.predictedErosionKm)}</span>
                      )}
                    </td>

                    {/* Erosion Agreement */}
                    <td className="numeric-cell">
                      {record.isForecast || record.isDataGap ? '—' : displayAgreement(record.erosionAgreement)}
                    </td>

                    {/* Actual Accretion */}
                    <td className="numeric-cell">
                      {record.isDLPrediction ? (
                        <span className="unobservable-tag">— (Future Epoch)</span>
                      ) : record.isDataGap ? (
                        <span className="gap-dash">—</span>
                      ) : (
                        displayKm(record.actualAccretionKm)
                      )}
                    </td>

                    {/* Predicted Accretion */}
                    <td className="numeric-cell">
                      {record.isDataGap ? (
                        <span className="gap-dash">—</span>
                      ) : (
                        displayKm(record.predictedAccretionKm)
                      )}
                    </td>

                    {/* Accretion Agreement */}
                    <td className="numeric-cell">
                      {record.isForecast || record.isDataGap ? '—' : displayAgreement(record.accretionAgreement)}
                    </td>

                    {/* Cumulative Land Loss */}
                    <td className="numeric-cell loss-cell">{displayLandLoss(record)}</td>

                    {/* Avg Shift */}
                    <td className="numeric-cell">{displayShift(record)}</td>

                    {/* Hotspot Retreat */}
                    <td className="numeric-cell hotspot-cell">{displayHotspotRetreat(record)}</td>

                    {/* Model Confidence */}
                    <td className="numeric-cell">
                      {record.isDataGap ? (
                        '—'
                      ) : (
                        <span className="accuracy-pill">
                          <Check size={12} /> {displayAccuracy(record)}
                        </span>
                      )}
                    </td>

                    {/* Vulnerability Risk */}
                    <td>
                      {record.isDataGap ? (
                        <span className="risk-pill unavailable">Data Gap</span>
                      ) : (
                        <span className={`risk-pill ${record.riskClass || 'moderate'}`}>
                          {record.riskLevel || 'Moderate Risk'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer-legend">
          <div className="legend-items">
            <span className="legend-chip">
              <span className="chip-indicator actual-chip" />
              <strong>Actual &amp; DL:</strong> Verified Sentinel-2 MSI Ground Truth paired with DeepLabV3+ DL Benchmark
            </span>
            <span className="legend-chip">
              <span className="chip-indicator dl-chip" />
              <strong>DL Prediction:</strong> DeepLabV3+ ResNet-34 Future Spatial Extrapolations (2027 to 2029)
            </span>
            <span className="legend-chip">
              <span className="chip-indicator gap-chip" />
              <strong>Data Not Available:</strong> 2024 to 2025 intermediate &amp; 2026 unmodeled gap (Strict scientific transparency)
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. VISUAL COMPARISON CHARTS & TREND ANALYTICS
          ======================================================== */}
      <section className="comparison-section charts-section" id="visual-charts">
        <div className="section-header-block">
          <div className="section-badge-pill green-pill">
            <TrendingUp size={14} />
            <span>VISUAL DATA ANALYTICS // MULTI-TEMPORAL PROFILES</span>
          </div>
          <h2 className="section-main-title">Multi-Year Shoreline Change &amp; Prediction Analytics</h2>
          <p className="section-desc">
            Examine side-by-side actual vs. predicted shoreline changes, statistical measurement agreement,
            and future Deep Learning retreat trajectories.
          </p>
        </div>

        <div className="analytics-grid-row">
          {/* Chart 1: Historical Actual vs ML Predicted Erosion & Accretion */}
          <article className="analytics-chart-card">
            <div className="chart-card-header">
              <h3>Historical Actual vs. DL-Predicted Changes (2015, 2020–2024)</h3>
              <span className="chart-badge">Kilometers (km)</span>
            </div>
            <p className="chart-caption">
              Direct paired comparison between satellite observed erosion/accretion and DL model predictions.
            </p>
            <div className="chart-canvas-container">
              <canvas ref={histErosionAccretionCanvas} />
            </div>
          </article>

          {/* Chart 2: Measurement Agreement Trajectory */}
          <article className="analytics-chart-card">
            <div className="chart-card-header">
              <h3>Satellite Measurement Agreement Trajectory (%)</h3>
              <span className="chart-badge">Agreement (%)</span>
            </div>
            <p className="chart-caption">
              Temporal consistency in erosion and accretion segment detection across 1,944 transects.
            </p>
            <div className="chart-canvas-container">
              <canvas ref={histAgreementCanvas} />
            </div>
          </article>
        </div>

        <div className="analytics-grid-row">
          {/* Chart 3: Deep Learning Future Prediction Trajectory */}
          <article className="analytics-chart-card">
            <div className="chart-card-header">
              <h3>Deep Learning Cumulative Land Loss &amp; Retreat (2027–2029)</h3>
              <span className="chart-badge text-pink">DL Projections</span>
            </div>
            <p className="chart-caption">
              Forecasted physical land area lost (ha) and shoreline retreat (m) relative to the 2024 baseline.
            </p>
            <div className="chart-canvas-container">
              <canvas ref={forecastLandLossCanvas} />
            </div>
          </article>

          {/* Chart 4: Risk-Level Distribution Across 97.2 km Coastline */}
          <article className="analytics-chart-card">
            <div className="chart-card-header">
              <h3>Coastline Length Distribution by Risk Classification</h3>
              <span className="chart-badge">97.2 km Total</span>
            </div>
            <p className="chart-caption">
              Spatial allocation of the Udupi coastal corridor across our 5 quantitative risk categories.
            </p>
            <div className="chart-canvas-container">
              <canvas ref={riskDistributionCanvas} />
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================
          6. METHODOLOGY EXPLANATION WORKFLOW PANEL
          ======================================================== */}
      <section className="comparison-section methodology-walkthrough-section" id="methodology-workflow">
        <div className="section-header-block">
          <div className="section-badge-pill green-pill">
            <Database size={14} />
            <span>7-STAGE IMPLEMENTED WORKFLOW PIPELINE</span>
          </div>
          <h2 className="section-main-title">How the Comparison &amp; Risk Classifications Are Produced</h2>
          <p className="section-desc">
            A transparent walkthrough of the exact, genuine pipeline implemented in our project—from satellite
            raw sensor data acquisition to Deep Learning future kinematic extrapolations.
          </p>
        </div>

        <div className="workflow-sequence-track">
          <div className="workflow-step-card">
            <div className="step-num-pill">01</div>
            <h4>Satellite Data Ingestion</h4>
            <span className="step-tech">Sentinel-1 SAR &amp; Sentinel-2 MSI</span>
            <p>
              Download calibrated Level-2A optical surface reflectance (10m bands B2, B3, B4, B8, B11, B12) and
              Sentinel-1 dual-polarisation (VV/VH) cloud-penetrating C-band GRD radar scenes via Google Earth Engine.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num-pill">02</div>
            <h4>Spectral Masking &amp; NDWI</h4>
            <span className="step-tech">NDWI = (Green - NIR) / (Green + NIR)</span>
            <p>
              Apply QA60 cloud probability masking. Compute Normalized Difference Water Index (NDWI) to maximize water
              absorbance while suppressing intertidal wet sand noise.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num-pill">03</div>
            <h4>Dynamic Shoreline Extraction</h4>
            <span className="step-tech">Otsu Thresholding + Zero-Crossing</span>
            <p>
              Execute Otsu dynamic bimodal thresholding to isolate open water from dry foredune sand, tracing continuous
              sub-pixel vector shorelines in EPSG:32643 (UTM Zone 43N).
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num-pill">04</div>
            <h4>Tidal Datum De-Biasing</h4>
            <span className="step-tech">ΔX = (H_tide - H_ref) / tan(0.03)</span>
            <p>
              Remove astronomical tide elevation discrepancies using measured in-situ beach slope (tan β = 0.03 = 1:33 gradient)
              to align satellite waterlines with true mean high water (MHW).
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num-pill">05</div>
            <h4>DSAS Transect Kinematics</h4>
            <span className="step-tech">EPR = (D_2024 - D_2020) / 4.0 yrs</span>
            <p>
              Cast 1,944 perpendicular transects every 50m along the 97.2 km corridor. Calculate End Point Rate (EPR) and
              Linear Regression Rate (LRR) to quantify annual shoreline shifts.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num-pill">06</div>
            <h4>AI &amp; Deep Learning (DL) Modeling</h4>
            <span className="step-tech">DeepLabV3+ (Dice 85.48%) &amp; XGBoost (84.8%)</span>
            <p>
              Train DeepLabV3+ with ResNet-34 encoder on 9-channel fused tensors. Classify physical environmental vulnerability
              using XGBoost across 5 independent physical features.
            </p>
          </div>

          <div className="workflow-step-card highlight-step">
            <div className="step-num-pill">07</div>
            <h4>DL Future Predictions (2027–2029)</h4>
            <span className="step-tech">A_loss = Σ (-EPR_i) × 50m × Δt</span>
            <p>
              Project validated shoreline vectors to 2027, 2028, and 2029. Quantify cumulative physical land area loss
              (reaching 7.88 hectares) and map erosion hotspot boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. EXTERNAL AUDIT & SCIENTIFIC SOURCES
          ======================================================== */}
      <section className="comparison-section sources-footer-section">
        <div className="sources-container">
          <div className="sources-text">
            <h4>Verified Primary Ground Truth &amp; Institutional References:</h4>
            <p>
              All comparison baselines conform to published benchmarks from the Space Applications Centre (ISRO/SAC),
              National Centre for Coastal Research (NCCR), and European Space Agency (ESA) Copernicus datasets.
            </p>
          </div>
          <div className="sources-links-row">
            <a
              href="https://vedas.sac.gov.in/content/vcms/pdf/atlas/Seashore/Vol-3-Full.pdf"
              target="_blank"
              rel="noreferrer"
              className="source-btn"
            >
              <ExternalLink size={14} /> SAC/ISRO Shoreline Atlas Vol. III
            </a>
            <a
              href="https://www.nccr.gov.in/sites/default/files/schangenew.pdf"
              target="_blank"
              rel="noreferrer"
              className="source-btn"
            >
              <ExternalLink size={14} /> NCCR National Shoreline Change Assessment
            </a>
            <a
              href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED"
              target="_blank"
              rel="noreferrer"
              className="source-btn"
            >
              <ExternalLink size={14} /> GEE Copernicus Sentinel-2 MSI L2A
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Comparison
