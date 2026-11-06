const REQUIRED_FIELDS = [
  'transect_id',
  'reference_start_m',
  'reference_end_m',
  'predicted_start_m',
  'predicted_end_m',
  'spacing_m',
]
const STABILITY_TOLERANCE_METERS = 0.5

export function calculateAgreement(actual, predicted) {
  if (actual === 0) return predicted === 0 ? 100 : 0
  return Math.max(0, 100 * (1 - Math.abs(actual - predicted) / Math.abs(actual)))
}

export function calculateIntervalComparison(rows, metadata) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('The measurements CSV has no transect rows.')
  }

  const fieldNames = Object.keys(rows[0] || {}).map((name) => name.replace(/^\uFEFF/, '').trim().toLowerCase())
  const missing = REQUIRED_FIELDS.filter((field) => !fieldNames.includes(field))
  if (missing.length) {
    throw new Error(`Missing CSV columns: ${missing.join(', ')}.`)
  }

  const transects = new Set()
  const totals = {
    actualErosionMeters: 0,
    predictedErosionMeters: 0,
    actualAccretionMeters: 0,
    predictedAccretionMeters: 0,
  }
  let validRows = 0
  let excludedStableRows = 0

  for (const rawRow of rows) {
    const row = Object.fromEntries(Object.entries(rawRow).map(([key, value]) => [key.replace(/^\uFEFF/, '').trim().toLowerCase(), value]))
    const id = String(row.transect_id ?? '').trim()
    if (!id) throw new Error('Every row must have a transect_id.')
    if (transects.has(id)) throw new Error(`Duplicate transect_id "${id}". Each transect must occur once per interval.`)
    transects.add(id)

    const values = REQUIRED_FIELDS.slice(1).map((field) => row[field] === '' || row[field] == null ? NaN : Number(row[field]))
    if (values.some((value) => !Number.isFinite(value))) {
      throw new Error(`Transect ${id} has a missing or non-numeric distance/spacing.`)
    }
    const [referenceStart, referenceEnd, predictedStart, predictedEnd, spacing] = values
    if (spacing <= 0) throw new Error(`Transect ${id} must have spacing_m greater than zero.`)

    const actualChange = referenceEnd - referenceStart
    const predictedChange = predictedEnd - predictedStart
    if (Math.abs(actualChange) <= STABILITY_TOLERANCE_METERS && Math.abs(predictedChange) <= STABILITY_TOLERANCE_METERS) {
      excludedStableRows += 1
      validRows += 1
      continue
    }

    if (actualChange < -STABILITY_TOLERANCE_METERS) totals.actualErosionMeters += spacing
    if (predictedChange < -STABILITY_TOLERANCE_METERS) totals.predictedErosionMeters += spacing
    if (actualChange > STABILITY_TOLERANCE_METERS) totals.actualAccretionMeters += spacing
    if (predictedChange > STABILITY_TOLERANCE_METERS) totals.predictedAccretionMeters += spacing
    validRows += 1
  }

  if (validRows === 0) throw new Error('No valid paired transect measurements were found.')

  const actualErosionKm = totals.actualErosionMeters / 1000
  const predictedErosionKm = totals.predictedErosionMeters / 1000
  const actualAccretionKm = totals.actualAccretionMeters / 1000
  const predictedAccretionKm = totals.predictedAccretionMeters / 1000
  const combinedActualKm = actualErosionKm + actualAccretionKm
  const combinedAbsoluteErrorKm = Math.abs(actualErosionKm - predictedErosionKm)
    + Math.abs(actualAccretionKm - predictedAccretionKm)
  const overallAgreement = combinedActualKm === 0
    ? (combinedAbsoluteErrorKm === 0 ? 100 : 0)
    : Math.max(0, 100 * (1 - combinedAbsoluteErrorKm / combinedActualKm))

  return {
    ...metadata,
    year: metadata.endYear,
    actualErosionKm,
    predictedErosionKm,
    erosionAgreement: calculateAgreement(actualErosionKm, predictedErosionKm),
    actualAccretionKm,
    predictedAccretionKm,
    accretionAgreement: calculateAgreement(actualAccretionKm, predictedAccretionKm),
    overallAgreement,
    transectCount: validRows,
    excludedStableRows,
  }
}
