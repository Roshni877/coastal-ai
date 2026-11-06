import { useEffect, useMemo, useRef, useState } from 'react'
import Papa from 'papaparse'
import L from 'leaflet'
import shp from 'shpjs'
import Chart from 'chart.js/auto'
import { AlertTriangle, ArrowDownUp, Download, FileArchive, FileSpreadsheet, FileUp, Info, MapPinned, Waves } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import '../styles/Comparison.css'
import { mergeShapefileResult, validateGeoJSON } from '../utils/shorelineValidation'
import { calculateIntervalComparison } from '../utils/intervalValidation'

const AVAILABLE_YEARS = Array.from({ length: 10 }, (_, index) => 2015 + index)
const MEASUREMENT_TEMPLATE = 'transect_id,reference_start_m,reference_end_m,predicted_start_m,predicted_end_m,spacing_m\n'

function displayKm(value) {
  return Number.isFinite(value) ? value.toFixed(3) : 'Awaiting data'
}

function displayAgreement(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : 'Awaiting validation'
}

function emptyYear(year) {
  return { year, status: 'awaiting', intervalLabel: 'No matched interval data' }
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function validateMetadata(metadata) {
  const required = [
    ['referenceSource', 'Reference data source'],
    ['modelSource', 'ML output source'],
    ['coverage', 'Geographic coverage'],
    ['actualStartDate', 'Reference interval start date'],
    ['actualEndDate', 'Reference interval end date'],
    ['predictedStartDate', 'ML interval start date'],
    ['predictedEndDate', 'ML interval end date'],
  ]
  const missing = required.filter(([key]) => !String(metadata[key] || '').trim())
  if (missing.length) throw new Error(`Complete the metadata fields: ${missing.map(([, label]) => label).join(', ')}.`)
  if (metadata.crs.trim().toUpperCase() !== 'EPSG:32643') {
    throw new Error('For this study area, export transect distances in UTM zone 43N meters (EPSG:32643).')
  }
  const dates = [metadata.actualStartDate, metadata.actualEndDate, metadata.predictedStartDate, metadata.predictedEndDate]
  if (!dates.every(isValidDate)) throw new Error('Enter all acquisition dates in YYYY-MM-DD format.')
  if (metadata.actualStartDate !== metadata.predictedStartDate || metadata.actualEndDate !== metadata.predictedEndDate) {
    throw new Error('Reference and ML measurements must use the same start and end observation dates.')
  }
  if (Number(metadata.actualStartDate.slice(0, 4)) !== Number(metadata.startYear)
    || Number(metadata.actualEndDate.slice(0, 4)) !== Number(metadata.endYear)) {
    throw new Error('Observation dates must match the selected start and end years.')
  }
}

function csvEscape(value) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function Comparison() {
  const [records, setRecords] = useState({})
  const [selectedYear, setSelectedYear] = useState(2024)
  const [filter, setFilter] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [sortDirection, setSortDirection] = useState('desc')
  const [showWhyBlank, setShowWhyBlank] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [sourceFile, setSourceFile] = useState('')
  const [statusMessage, setStatusMessage] = useState('No historical interval is currently validated.')
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [spatialEvidence, setSpatialEvidence] = useState({})
  const [metadata, setMetadata] = useState({
    startYear: 2020,
    endYear: 2021,
    referenceSource: '',
    modelSource: '',
    coverage: '',
    crs: 'EPSG:32643',
    actualStartDate: '',
    actualEndDate: '',
    predictedStartDate: '',
    predictedEndDate: '',
  })
  const mapElement = useRef(null)
  const mapRef = useRef(null)
  const mapLayers = useRef([])
  const chartRefs = useRef([])
  const chartCanvases = useRef([])

  const allRows = useMemo(() => AVAILABLE_YEARS.map((year) => records[year] || emptyYear(year)), [records])
  const visibleRows = useMemo(() => {
    const filtered = allRows.filter((record) => (filterYear === 'all' || record.year === Number(filterYear))
      && (filter === 'all' || (filter === 'available' ? record.status === 'computed' : record.status !== 'computed')))
    return filtered.sort((left, right) => (left.year - right.year) * (sortDirection === 'asc' ? 1 : -1))
  }, [allRows, filter, filterYear, sortDirection])
  const completedRows = useMemo(() => allRows.filter((record) => record.status === 'computed'), [allRows])
  const selectedRecord = records[selectedYear]
  const summary = useMemo(() => {
    if (!completedRows.length) return { years: 0, erosion: null, accretion: null, agreement: null }
    const mean = (key) => completedRows.reduce((total, record) => total + record[key], 0) / completedRows.length
    return {
      years: completedRows.length,
      erosion: mean('actualErosionKm'),
      accretion: mean('actualAccretionKm'),
      agreement: mean('overallAgreement'),
    }
  }, [completedRows])

  function updateMetadata(key, value) {
    setMetadata((current) => ({ ...current, [key]: value }))
  }

  async function importMeasurements(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setIsProcessing(true)
    setErrorMessage('')
    try {
      validateMetadata(metadata)
      const parsed = Papa.parse(await file.text(), { header: true, dynamicTyping: true, skipEmptyLines: true })
      if (parsed.errors.length) throw new Error(`CSV parsing failed: ${parsed.errors[0].message}`)
      const result = calculateIntervalComparison(parsed.data, {
        ...metadata,
        startYear: Number(metadata.startYear),
        endYear: Number(metadata.endYear),
        intervalLabel: `${metadata.startYear}–${metadata.endYear}`,
        sourceFile: file.name,
        status: 'computed',
      })
      if (result.endYear <= result.startYear) throw new Error('The interval end year must be later than its start year.')
      if (!AVAILABLE_YEARS.includes(result.endYear)) throw new Error('The interval end year must be between 2015 and 2024 for this table.')
      setRecords((current) => ({ ...current, [result.endYear]: result }))
      setSelectedYear(result.endYear)
      setSourceFile(file.name)
      setStatusMessage(`Calculated ${result.intervalLabel} from ${result.transectCount.toLocaleString()} paired transects. Source metadata is user-provided and not independently verified.`)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to process this measurements file.')
    } finally {
      setIsProcessing(false)
      event.target.value = ''
    }
  }

  async function importSpatialEvidence(kind, event) {
    const file = event.target.files?.[0]
    if (!file) return
    setErrorMessage('')
    try {
      const parsed = file.name.toLowerCase().endsWith('.zip')
        ? mergeShapefileResult(await shp(await file.arrayBuffer()))
        : JSON.parse(await file.text())
      const geometry = validateGeoJSON(parsed)
      setSpatialEvidence((current) => ({
        ...current,
        [selectedYear]: { ...(current[selectedYear] || {}), [kind]: { geometry, fileName: file.name } },
      }))
      setStatusMessage(`${file.name} loaded as spatial evidence for ${selectedYear}. Geometry by itself does not calculate signed erosion/accretion.`)
    } catch (error) {
      setErrorMessage(error instanceof SyntaxError ? 'Invalid GeoJSON. Choose a valid .geojson file or complete shapefile ZIP.' : error.message)
    } finally {
      event.target.value = ''
    }
  }

  function exportCsv() {
    const columns = [
      'Interval end year', 'Interval', 'Actual erosion (km)', 'ML predicted erosion (km)', 'Erosion agreement (%)',
      'Actual accretion (km)', 'ML predicted accretion (km)', 'Accretion agreement (%)', 'Overall agreement (%)',
      'Reference source', 'ML output source', 'Reference start date', 'Reference end date', 'ML start date', 'ML end date',
      'Geographic coverage', 'CRS', 'Measurement CSV', 'Transect count',
    ]
    const lines = [columns.map(csvEscape).join(',')]
    completedRows.forEach((record) => lines.push([
      record.endYear, record.intervalLabel, record.actualErosionKm, record.predictedErosionKm, record.erosionAgreement,
      record.actualAccretionKm, record.predictedAccretionKm, record.accretionAgreement, record.overallAgreement,
      record.referenceSource, record.modelSource, record.actualStartDate, record.actualEndDate,
      record.predictedStartDate, record.predictedEndDate, record.coverage, record.crs, record.sourceFile, record.transectCount,
    ].map(csvEscape).join(',')))
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }))
    link.download = 'coastal-interval-validation.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function downloadTemplate() {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([MEASUREMENT_TEMPLATE], { type: 'text/csv;charset=utf-8' }))
    link.download = 'transect-interval-measurements-template.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return undefined
    const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true }).setView([13.5, 74.75], 9)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    mapLayers.current.forEach((layer) => map.removeLayer(layer))
    mapLayers.current = []
    const evidence = spatialEvidence[selectedYear]
    for (const [kind, color] of [['reference', '#2878d0'], ['predicted', '#e54885']]) {
      const geometry = evidence?.[kind]?.geometry
      if (!geometry) continue
      const layer = L.geoJSON(geometry, {
        style: { color, weight: 2, opacity: 0.9, fillOpacity: 0.08 },
        pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 3, color, fillOpacity: 0.7 }),
      }).addTo(map)
      mapLayers.current.push(layer)
      if (layer.getBounds().isValid()) map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 14 })
    }
  }, [spatialEvidence, selectedYear])

  useEffect(() => {
    chartRefs.current.forEach((chart) => chart.destroy())
    chartRefs.current = []
    if (!completedRows.length) return undefined
    const color = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#475569'
    const gridColor = 'rgba(100, 116, 139, 0.15)'
    const definitions = [
      { title: 'Actual vs ML-predicted erosion', keys: ['actualErosionKm', 'predictedErosionKm'], labels: ['Actual', 'ML-predicted'], colors: ['#16864b', '#e54885'], unit: 'km' },
      { title: 'Actual vs ML-predicted accretion', keys: ['actualAccretionKm', 'predictedAccretionKm'], labels: ['Actual', 'ML-predicted'], colors: ['#16864b', '#e54885'], unit: 'km' },
      { title: 'Erosion measurement agreement', keys: ['erosionAgreement'], labels: ['Agreement'], colors: ['#16864b'], unit: '%' },
      { title: 'Accretion measurement agreement', keys: ['accretionAgreement'], labels: ['Agreement'], colors: ['#e54885'], unit: '%' },
      { title: 'Overall measurement agreement', keys: ['overallAgreement'], labels: ['Agreement'], colors: ['#167447'], unit: '%' },
    ]
    definitions.forEach((definition, index) => {
      const canvas = chartCanvases.current[index]
      if (!canvas) return
      chartRefs.current.push(new Chart(canvas, {
        type: definition.keys.length === 2 ? 'bar' : 'line',
        data: {
          labels: completedRows.map((record) => record.intervalLabel),
          datasets: definition.keys.map((key, datasetIndex) => ({
            label: definition.labels[datasetIndex],
            data: completedRows.map((record) => record[key]),
            borderColor: definition.colors[datasetIndex],
            backgroundColor: `${definition.colors[datasetIndex]}2b`,
            borderWidth: 2,
            borderRadius: 4,
            pointRadius: 3,
            tension: 0.2,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color, usePointStyle: true } } },
          scales: {
            x: { ticks: { color }, grid: { display: false } },
            y: { beginAtZero: true, max: definition.unit === '%' ? 100 : undefined, title: { display: true, text: definition.unit, color }, ticks: { color }, grid: { color: gridColor } },
          },
        },
      }))
    })
    return () => {
      chartRefs.current.forEach((chart) => chart.destroy())
      chartRefs.current = []
    }
  }, [completedRows])

  return (
    <main className="comparison-page">
      <header className="comparison-heading">
        <div>
          <div className="comparison-kicker"><Waves size={15} /> COASTAL AI / HISTORICAL VALIDATION</div>
          <h1>Historical Shoreline Validation</h1>
          <p>Year-by-year comparison of observed and DeepLabV3+ predicted erosion and accretion along Udupi and Dakshina Kannada.</p>
        </div>
        <span className="comparison-period"><span /> 2015–2024 · Matched intervals only</span>
      </header>

      <section className="comparison-section table-section hero-table-section" aria-labelledby="interval-table-title">
        <div className="hero-table-heading">
          <div><span className="section-index">PRIMARY RESULT / INTERVAL VALIDATION</span><h2 id="interval-table-title">Year-wise actual vs ML-predicted coastal erosion and accretion</h2></div>
          <button className="export-button" onClick={exportCsv} disabled={!completedRows.length} title="Export completed interval results as CSV"><Download size={17} /> Export CSV</button>
        </div>
        <div className="table-toolbar">
          <p><Info size={15} /> {completedRows.length ? `${completedRows.length} comparison${completedRows.length === 1 ? '' : 's'} calculated from uploaded files. Check each source before reporting results.` : 'No verified comparison data is loaded. Missing values are left blank.'}</p>
          <div className="table-actions">
            <label>Year
              <select value={filterYear} onChange={(event) => setFilterYear(event.target.value)}>
                <option value="all">All</option>
                {AVAILABLE_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label>Show
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All years</option>
                <option value="available">Validated records</option>
                <option value="awaiting">Awaiting validation</option>
              </select>
            </label>
            <button className="sort-button" onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')}><ArrowDownUp size={15} /> Year {sortDirection === 'asc' ? 'ascending' : 'descending'}</button>
          </div>
        </div>
        <div className="comparison-table-wrap hero-table-wrap">
          <table className="comparison-table hero-table">
            <thead><tr>
              <th><button onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')}>Year / interval <ArrowDownUp size={13} /></button></th>
              <th className="actual-column">Actual erosion (km)</th>
              <th className="predicted-column">ML predicted erosion (km)</th>
              <th>Erosion agreement (%)</th>
              <th className="actual-column">Actual accretion (km)</th>
              <th className="predicted-column">ML predicted accretion (km)</th>
              <th>Accretion agreement (%)</th>
              <th>Overall agreement (%)</th>
            </tr></thead>
            <tbody>{visibleRows.map((record) => <tr key={record.year} className={record.status === 'computed' ? 'validated-row' : ''} onClick={() => setSelectedYear(record.year)}>
              <td><button className="year-select" onClick={(event) => { event.stopPropagation(); setSelectedYear(record.year) }}>{record.year}<small>{record.status === 'computed' ? record.intervalLabel : 'Awaiting data'}</small></button></td>
              <td className="numeric-cell actual-value">{displayKm(record.actualErosionKm)}</td>
              <td className="numeric-cell predicted-value">{displayKm(record.predictedErosionKm)}</td>
              <td className="numeric-cell">{displayAgreement(record.erosionAgreement)}</td>
              <td className="numeric-cell actual-value">{displayKm(record.actualAccretionKm)}</td>
              <td className="numeric-cell predicted-value">{displayKm(record.predictedAccretionKm)}</td>
              <td className="numeric-cell">{displayAgreement(record.accretionAgreement)}</td>
              <td className="numeric-cell overall-value">{displayAgreement(record.overallAgreement)}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="table-footer"><span>{visibleRows.length} of 10 years · select a year to review its details when data is available</span><span className="no-data-badge"><i /> {completedRows.length ? 'Review uploaded sources before reporting' : 'Awaiting comparison data'}</span></div>
      </section>

      {completedRows.length > 0 && <section className="comparison-summary" aria-label="Validated interval summary">
        <article className="comparison-stat"><span>Intervals validated</span><strong>{summary.years || 'None yet'}</strong><small>Matched reference and model observation dates</small></article>
        <article className="comparison-stat"><span>Mean actual erosion</span><strong>{summary.erosion === null ? 'Data Not Available' : `${summary.erosion.toFixed(3)} km`}</strong><small>Mean across completed uploaded intervals</small></article>
        <article className="comparison-stat"><span>Mean actual accretion</span><strong>{summary.accretion === null ? 'Data Not Available' : `${summary.accretion.toFixed(3)} km`}</strong><small>Mean across completed uploaded intervals</small></article>
        <article className="comparison-stat status-stat"><span>Mean overall agreement</span><strong>{summary.agreement === null ? 'Awaiting validation' : `${summary.agreement.toFixed(1)}%`}</strong><small>Combined erosion + accretion measurement agreement</small></article>
      </section>}

      <section className="comparison-section plain-details data-integrity-note">
        <button className="plain-disclosure-toggle" aria-expanded={showWhyBlank} aria-controls="comparison-data-note" onClick={() => setShowWhyBlank((open) => !open)}><strong>Why are the results blank?</strong><span>{showWhyBlank ? 'Hide' : 'Short answer'}</span></button>
        {showWhyBlank && <div className="source-status-content" id="comparison-data-note">
          <p>I found official reference material for this coast, but not ready-to-compare yearly shoreline files. The VEDAS Karnataka/Kerala atlas editions are PDFs; NCCR lists a 1990–2016 regional assessment map. These products need to be reviewed and digitized with dates, scale, and coverage recorded. They do not provide matching DeepLabV3+ predictions.</p>
          <div className="source-links">
            <a href="https://vedas.sac.gov.in/content/vcms/pdf/atlas/Seashore/Vol-3-Full.pdf" target="_blank" rel="noreferrer">VEDAS atlas · Karnataka/Kerala · 2014 PDF</a>
            <a href="https://vedas.sac.gov.in/content/vcms/atlas/slc/Shoreline_Change_Atlas_Vol-III.pdf" target="_blank" rel="noreferrer">VEDAS atlas · Karnataka/Kerala · 2021 PDF</a>
            <a href="https://www.nccr.gov.in/sites/default/files/schangenew.pdf" target="_blank" rel="noreferrer">NCCR national shoreline assessment · 1990–2016</a>
          </div>
          <p>To complete the table, digitize dated reference shorelines in QGIS, generate matching-year ML shorelines using the trained checkpoint, then provide paired transect distances, acquisition dates, coast coverage, and projected CRS. No such checkpoint or source imagery is in this workspace yet.</p>
        </div>}
      </section>

      <section className="comparison-section interval-upload-section plain-details">
        <button className="plain-disclosure-toggle" aria-expanded={showUploadForm} aria-controls="interval-upload-content" onClick={() => setShowUploadForm((open) => !open)}><strong>Add comparison data</strong><span>{showUploadForm ? 'Close upload form' : 'Upload paired transect measurements'}</span></button>
        {showUploadForm && <div className="interval-upload-content" id="interval-upload-content">
        <div className="section-heading-row">
          <div><span className="section-index">UPLOAD FILES</span><h2>Choose a matching time interval</h2></div>
          <button className="template-button" onClick={downloadTemplate}><FileSpreadsheet size={16} /> CSV template</button>
        </div>
        <p className="upload-intro">For each transect, include reference and ML shoreline positions at both ends of the same interval. The date, coast area, and projected CRS must match.</p>
        <div className="interval-metadata-grid">
          <label>Start year<select value={metadata.startYear} onChange={(event) => updateMetadata('startYear', Number(event.target.value))}>{AVAILABLE_YEARS.slice(0, -1).map((year) => <option key={year}>{year}</option>)}</select></label>
          <label>End year<select value={metadata.endYear} onChange={(event) => updateMetadata('endYear', Number(event.target.value))}>{AVAILABLE_YEARS.slice(1).map((year) => <option key={year}>{year}</option>)}</select></label>
          <label>Reference source<input value={metadata.referenceSource} onChange={(event) => updateMetadata('referenceSource', event.target.value)} placeholder="e.g. Sentinel-2 scene ID or Google Earth observation" /></label>
          <label>ML output source<input value={metadata.modelSource} onChange={(event) => updateMetadata('modelSource', event.target.value)} placeholder="e.g. DeepLabV3+ checkpoint/run identifier" /></label>
          <label className="date-field">Reference start date<input type="date" value={metadata.actualStartDate} onChange={(event) => updateMetadata('actualStartDate', event.target.value)} /></label>
          <label className="date-field">ML start date<input type="date" value={metadata.predictedStartDate} onChange={(event) => updateMetadata('predictedStartDate', event.target.value)} /></label>
          <label className="date-field">Reference end date<input type="date" value={metadata.actualEndDate} onChange={(event) => updateMetadata('actualEndDate', event.target.value)} /></label>
          <label className="date-field">ML end date<input type="date" value={metadata.predictedEndDate} onChange={(event) => updateMetadata('predictedEndDate', event.target.value)} /></label>
          <label>Geographic coverage<input value={metadata.coverage} onChange={(event) => updateMetadata('coverage', event.target.value)} placeholder="Coast segment / municipalities / bounds" /></label>
          <label>Projected CRS<input value={metadata.crs} onChange={(event) => updateMetadata('crs', event.target.value)} placeholder="EPSG:32643" /></label>
        </div>
        <div className="measurement-csv-row">
          <p>The CSV template shows the required columns. Distances and transect spacing must be in meters.</p>
          <label className="upload-button reference-upload"><FileUp size={17} /> {isProcessing ? 'Calculating…' : 'Upload measurements CSV'}<input type="file" accept=".csv,text/csv" disabled={isProcessing} onChange={importMeasurements} /></label>
        </div>
        <div className="upload-feedback" role="status">{statusMessage}{sourceFile && <span className="temporary-note">{sourceFile} · retained in this browser session only</span>}{errorMessage && <span className="upload-error"><AlertTriangle size={15} /> {errorMessage}</span>}</div>
        <div className="geometry-upload-grid">
          <div><strong>Reference shoreline map layer</strong><span>Optional preview. It does not calculate erosion by itself.</span><label className="geometry-upload-button"><FileArchive size={16} /> Add GeoJSON / ZIP<input type="file" accept=".geojson,.json,.zip,application/geo+json,application/zip" onChange={(event) => importSpatialEvidence('reference', event)} /></label></div>
          <div><strong>ML shoreline map layer</strong><span>Optional preview for the same selected year.</span><label className="geometry-upload-button pink-outline"><FileArchive size={16} /> Add GeoJSON / ZIP<input type="file" accept=".geojson,.json,.zip,application/geo+json,application/zip" onChange={(event) => importSpatialEvidence('predicted', event)} /></label></div>
        </div>
        </div>}
      </section>

      {(selectedRecord?.status === 'computed' || spatialEvidence[selectedYear]) && <section className="comparison-section detailed-section">
        <div className="section-heading-row"><div><span className="section-index">SELECTED YEAR / SOURCE RECORD</span><h2>{selectedYear} interval details</h2></div><span className="table-count">{selectedRecord?.status === 'computed' ? selectedRecord.intervalLabel : 'Awaiting matched data'}</span></div>
        {selectedRecord?.status === 'computed' ? <div className="year-detail-grid">
          <div><span>Reference source</span><strong>{selectedRecord.referenceSource}</strong><small>{selectedRecord.actualStartDate} → {selectedRecord.actualEndDate}</small></div>
          <div><span>ML output source</span><strong>{selectedRecord.modelSource}</strong><small>{selectedRecord.predictedStartDate} → {selectedRecord.predictedEndDate}</small></div>
          <div><span>Coverage / CRS</span><strong>{selectedRecord.coverage}</strong><small>{selectedRecord.crs} · meters</small></div>
          <div><span>Measurement file</span><strong>{selectedRecord.sourceFile}</strong><small>{selectedRecord.transectCount.toLocaleString()} transects · {selectedRecord.excludedStableRows} stable pairs</small></div>
        </div> : <p className="detail-empty">No paired reference and model measurements for {selectedYear}. Add the same-year interval record above. Imagery source, exact dates, geographic coverage, and transect measurement CSV will be listed here once supplied.</p>}
        <div className="source-geometry-status"><span><i className="legend-blue" /> Reference geometry: {spatialEvidence[selectedYear]?.reference?.fileName || 'not uploaded'}</span><span><i className="legend-pink" /> ML geometry: {spatialEvidence[selectedYear]?.predicted?.fileName || 'not uploaded'}</span></div>
      </section>}

      {completedRows.length > 0 && <section className="comparison-section visualization-section">
        <div className="section-heading-row"><div><span className="section-index">INTERVAL TRENDS</span><h2>Actual and predicted measurements</h2></div><span className="table-count">Charts use completed table records only</span></div>
        <div className="validation-charts">
          {[
            'Actual vs ML-predicted erosion', 'Actual vs ML-predicted accretion', 'Erosion measurement agreement',
            'Accretion measurement agreement', 'Overall measurement agreement',
          ].map((title, index) => <article className="metric-chart" key={title}>
            <h3>{title}</h3>
            {completedRows.length ? <div className="chart-canvas"><canvas ref={(element) => { chartCanvases.current[index] = element }} /></div> : <div className="chart-empty"><span>Awaiting validated interval data</span><small>No values plotted</small></div>}
          </article>)}
        </div>
      </section>}

      {spatialEvidence[selectedYear] && <section className="comparison-section evidence-map-section">
        <div className="section-heading-row"><div><span className="section-index">SPATIAL EVIDENCE</span><h2>Uploaded shoreline layers</h2></div><span className="table-count">Year {selectedYear}</span></div>
        <div className="map-frame"><div className="comparison-map" ref={mapElement} aria-label="Uploaded reference and predicted shoreline evidence map" />
          <div className="map-legend"><span><i className="legend-blue" /> Reference shoreline</span><span><i className="legend-pink" /> ML shoreline</span></div>
          {!spatialEvidence[selectedYear] && <div className="map-empty"><MapPinned size={23} /><span>Upload spatial files for {selectedYear} to preview</span></div>}
        </div>
      </section>}

      <section className="comparison-section methodology-section">
        <button className="plain-disclosure-toggle" aria-expanded={showMethodology} aria-controls="comparison-methodology" onClick={() => setShowMethodology((open) => !open)}><strong>How the comparison works</strong><span>{showMethodology ? 'Hide steps and sources' : 'View steps and sources'}</span></button>
        {showMethodology && <div className="methodology-content" id="comparison-methodology">
          <ol className="method-steps">
            <li><span>01</span><div><h3>Install tools and find imagery</h3><p>Install <a href="https://www.google.com/earth/about/versions/" target="_blank" rel="noreferrer">Google Earth Pro</a> and <a href="https://qgis.org/download/" target="_blank" rel="noreferrer">QGIS</a>. Use Historical Imagery or a documented satellite scene, and record the acquisition date. Imagery is a reference observation, not field-survey ground truth.</p></div></li>
            <li><span>02</span><div><h3>Choose matching dates</h3><p>Select reference and model observations for the same interval and coast segment. Note tide, season, clouds, and waterline proxy differences.</p></div></li>
            <li><span>03</span><div><h3>Digitize in QGIS</h3><p>Prepare dated shorelines and transects/baseline in QGIS. <a href="https://youtu.be/xLa0JFSWyA4" target="_blank" rel="noreferrer">Tutorial 1</a> · <a href="https://youtu.be/GA1SEHovUq0" target="_blank" rel="noreferrer">Tutorial 2</a>.</p></div></li>
            <li><span>04</span><div><h3>Export interval measurements</h3><p>Measure reference and ML shoreline positions along identical transects, with per-transect spacing, in EPSG:32643 meters. Upload the paired CSV and optional GeoJSON/shapefile layers.</p></div></li>
            <li><span>05</span><div><h3>Calculate measurement agreement</h3><p>Classify signed displacement by transect spacing, sum erosion/accretion lengths, and compare the same start/end observations. Review the file source and coverage before interpreting results.</p></div></li>
          </ol>
          <div className="metric-notes">
            <p><strong>Erosion/accretion (km):</strong> sum of the spacing weights for transects whose signed endpoint displacement is below −0.5 m or above +0.5 m respectively. The 0.5 m tolerance is a stability threshold, not an uncertainty estimate.</p>
            <p><strong>Separate agreements:</strong> for non-zero actual totals, max(0, 100 × (1 − |actual − predicted| / |actual|)). If actual and predicted are both zero, agreement is 100%; if actual is zero and prediction is non-zero, it is 0%.</p>
            <p><strong>Overall agreement:</strong> max(0, 100 × (1 − (|actual erosion − predicted erosion| + |actual accretion − predicted accretion|) / (actual erosion + actual accretion))). If both actual totals are zero, it is 100% only when both predicted totals are also zero.</p>
            <p><strong>Model Dice:</strong> the project’s existing DeepLabV3+ Dice score of 0.8548 (85.48%) evaluates segmentation overlap. It is not historical measurement agreement and is not changed by this page.</p>
          </div>
          <div className="source-links"><a href="https://www.google.com/earth/about/versions/" target="_blank" rel="noreferrer">Google Earth Pro download</a><a href="https://qgis.org/download/" target="_blank" rel="noreferrer">QGIS download</a><a href="https://vedas.sac.gov.in/content/vcms/pdf/atlas/Seashore/Vol-3-Full.pdf" target="_blank" rel="noreferrer">VEDAS Karnataka/Kerala atlas · 2014 PDF</a><a href="https://vedas.sac.gov.in/content/vcms/atlas/slc/Shoreline_Change_Atlas_Vol-III.pdf" target="_blank" rel="noreferrer">VEDAS Karnataka/Kerala atlas · 2021 PDF</a><a href="https://www.nccr.gov.in/sites/default/files/schangenew.pdf" target="_blank" rel="noreferrer">NCCR national assessment · 1990–2016</a><a href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED" target="_blank" rel="noreferrer">Sentinel-2 · Earth Engine</a><a href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD" target="_blank" rel="noreferrer">Sentinel-1 · Earth Engine</a><a href="https://qscat.github.io/" target="_blank" rel="noreferrer">QSCAT · QGIS shoreline-change tool</a><span>These sources are references and tools; no NCCR/VEDAS measurements have been digitized here and QSCAT has not been run.</span></div>
          <p className="source-limitation">VEDAS provides atlas PDFs, not ready-to-use annual GIS shoreline layers. The NCCR PDF link timed out during this check. Earth Engine catalogs offer Sentinel-1 GRD from 2014 and Sentinel-2 SR Harmonized from 2017; this project has neither the imagery exports nor the trained checkpoint needed to generate matching annual predictions. In particular, 2015–2016 need an alternate input strategy because this model expects both sensors. No verified USGS Udupi measurement series is included here.</p>
        </div>}
      </section>
    </main>
  )
}

export default Comparison
