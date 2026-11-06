const EARTH_RADIUS_METERS = 6371008.8
const GRID_SIZE_METERS = 100
const MAX_SAMPLE_SPACING_METERS = 40

function visitCoordinates(value, callback) {
  if (!Array.isArray(value)) return
  if (typeof value[0] === 'number') {
    callback(value)
    return
  }
  value.forEach((child) => visitCoordinates(child, callback))
}

export function validateGeoJSON(data) {
  const features = data?.type === 'FeatureCollection'
    ? data.features
    : data?.type === 'Feature'
      ? [data]
      : data?.type
        ? [{ type: 'Feature', properties: {}, geometry: data }]
        : null

  if (!Array.isArray(features) || features.length === 0) {
    throw new Error('No GeoJSON features were found in this file.')
  }

  const crsName = data?.crs?.properties?.name?.toUpperCase()
  if (crsName && !/(EPSG(?::|::|\/|\s*)4326|CRS:?84|CRS84)/.test(crsName)) {
    throw new Error(`Unsupported coordinate system (${data.crs.properties.name}). Export as WGS 84 / CRS84 (EPSG:4326).`)
  }

  let coordinateCount = 0
  for (const feature of features) {
    if (!feature?.geometry?.coordinates) continue
    visitCoordinates(feature.geometry.coordinates, ([longitude, latitude]) => {
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
        throw new Error('Coordinates are not valid longitude/latitude values. Export as WGS 84 / CRS84 (EPSG:4326).')
      }
      coordinateCount += 1
    })
  }

  if (coordinateCount < 2) throw new Error('The file needs at least two valid coordinates.')
  return normalizeFeatureCollection(features)
}

function normalizeFeatureCollection(features) {
  return {
    type: 'FeatureCollection',
    features: features.filter((feature) => feature?.geometry?.coordinates),
  }
}

export function mergeShapefileResult(result) {
  if (Array.isArray(result)) {
    return { type: 'FeatureCollection', features: result.flatMap((item) => item.features || []) }
  }
  if (result?.type === 'FeatureCollection') return result
  const collections = Object.values(result || {}).filter((item) => item?.type === 'FeatureCollection')
  if (collections.length) {
    return { type: 'FeatureCollection', features: collections.flatMap((item) => item.features || []) }
  }
  throw new Error('The ZIP must contain a readable .shp, .shx, and .dbf shapefile set.')
}

function collectBoundaryRings(geojson) {
  const rings = []
  const addGeometry = (geometry) => {
    if (!geometry) return
    if (geometry.type === 'GeometryCollection') {
      geometry.geometries.forEach(addGeometry)
    } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
      const lines = geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates
      lines.forEach((line) => { if (line.length > 1) rings.push(line) })
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
      polygons.forEach((polygon) => polygon.forEach((ring) => { if (ring.length > 1) rings.push(ring) }))
    }
  }
  geojson.features.forEach((feature) => addGeometry(feature.geometry))
  return rings
}

function sampleProjectedRings(rings, originLongitude, originLatitude) {
  const latitudeScale = Math.cos(originLatitude * Math.PI / 180)
  const project = ([longitude, latitude]) => ({
    x: EARTH_RADIUS_METERS * (longitude - originLongitude) * Math.PI / 180 * latitudeScale,
    y: EARTH_RADIUS_METERS * (latitude - originLatitude) * Math.PI / 180,
  })
  const points = []

  rings.forEach((ring) => {
    for (let index = 1; index < ring.length; index += 1) {
      const start = project(ring[index - 1])
      const end = project(ring[index])
      const startCoordinate = ring[index - 1]
      const endCoordinate = ring[index]
      const length = Math.hypot(end.x - start.x, end.y - start.y)
      const steps = Math.max(1, Math.ceil(length / MAX_SAMPLE_SPACING_METERS))
      for (let step = 0; step < steps; step += 1) {
        const fraction = step / steps
        points.push({
          x: start.x + (end.x - start.x) * fraction,
          y: start.y + (end.y - start.y) * fraction,
          longitude: startCoordinate[0] + (endCoordinate[0] - startCoordinate[0]) * fraction,
          latitude: startCoordinate[1] + (endCoordinate[1] - startCoordinate[1]) * fraction,
        })
      }
    }
  })
  return points
}

function createSpatialIndex(points) {
  const cells = new Map()
  points.forEach((point) => {
    const column = Math.floor(point.x / GRID_SIZE_METERS)
    const row = Math.floor(point.y / GRID_SIZE_METERS)
    const key = `${column}:${row}`
    if (!cells.has(key)) cells.set(key, [])
    cells.get(key).push(point)
  })
  return cells
}

function nearestDistance(point, index, searchRadius) {
  const column = Math.floor(point.x / GRID_SIZE_METERS)
  const row = Math.floor(point.y / GRID_SIZE_METERS)
  let nearest = null
  for (let radius = 0; radius <= searchRadius; radius += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        if (radius > 0 && Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue
        const candidates = index.get(`${column + dx}:${row + dy}`)
        if (!candidates) continue
        for (const candidate of candidates) {
          const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y)
          if (!nearest || distance < nearest.distance) nearest = { point: candidate, distance }
        }
      }
    }
    if (nearest && (nearest.distance <= radius * GRID_SIZE_METERS || radius === searchRadius)) break
  }
  return nearest
}

function getCenter(rings) {
  let longitudeTotal = 0
  let latitudeTotal = 0
  let count = 0
  rings.forEach((ring) => ring.forEach(([longitude, latitude]) => {
    longitudeTotal += longitude
    latitudeTotal += latitude
    count += 1
  }))
  if (!count) throw new Error('No line or polygon boundary geometry was found.')
  return [longitudeTotal / count, latitudeTotal / count]
}

function metricBounds(points) {
  return points.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxX: Math.max(bounds.maxX, point.x),
    maxY: Math.max(bounds.maxY, point.y),
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })
}

export function compareShorelines(reference, predicted) {
  const referenceRings = collectBoundaryRings(reference)
  const predictedRings = collectBoundaryRings(predicted)
  if (!referenceRings.length || !predictedRings.length) {
    throw new Error('Both files must contain line or polygon geometries.')
  }

  const [originLongitude, originLatitude] = getCenter([...referenceRings, ...predictedRings])
  const referencePoints = sampleProjectedRings(referenceRings, originLongitude, originLatitude)
  const predictedPoints = sampleProjectedRings(predictedRings, originLongitude, originLatitude)
  const referenceBounds = metricBounds(referencePoints)
  const predictedBounds = metricBounds(predictedPoints)
  const gapX = Math.max(0, referenceBounds.minX - predictedBounds.maxX, predictedBounds.minX - referenceBounds.maxX)
  const gapY = Math.max(0, referenceBounds.minY - predictedBounds.maxY, predictedBounds.minY - referenceBounds.maxY)
  if (Math.hypot(gapX, gapY) > 5000) {
    throw new Error('The shoreline extents are more than 5 km apart. Confirm that both files cover the same area and year.')
  }

  const referenceIndex = createSpatialIndex(referencePoints)
  const predictedIndex = createSpatialIndex(predictedPoints)
  const searchRadius = Math.ceil(Math.max(
    referenceBounds.maxX - referenceBounds.minX,
    referenceBounds.maxY - referenceBounds.minY,
    predictedBounds.maxX - predictedBounds.minX,
    predictedBounds.maxY - predictedBounds.minY,
  ) / GRID_SIZE_METERS) + 1
  let sum = 0
  let sumSquares = 0
  let offsetX = 0
  let offsetY = 0
  let offsetCount = 0
  let count = 0
  const samples = []

  const measure = (sourcePoints, targetIndex, direction) => {
    sourcePoints.forEach((point, pointIndex) => {
      const nearest = nearestDistance(point, targetIndex, searchRadius)
      if (!nearest) return
      sum += nearest.distance
      sumSquares += nearest.distance * nearest.distance
      count += 1
      if (direction === 'reference-to-predicted') {
        offsetX += nearest.point.x - point.x
        offsetY += nearest.point.y - point.y
        offsetCount += 1
      }
      if (samples.length < 500 && pointIndex % Math.max(1, Math.floor(sourcePoints.length / 250)) === 0) {
        samples.push({
          point: { longitude: point.longitude, latitude: point.latitude },
          nearest: { longitude: nearest.point.longitude, latitude: nearest.point.latitude },
          distance: nearest.distance,
          direction,
        })
      }
    })
  }

  measure(referencePoints, predictedIndex, 'reference-to-predicted')
  measure(predictedPoints, referenceIndex, 'predicted-to-reference')

  if (!count) throw new Error('No comparable shoreline boundaries were found.')
  return {
    meanDisplacement: offsetCount ? Math.hypot(offsetX / offsetCount, offsetY / offsetCount) : 0,
    mae: sum / count,
    rmse: Math.sqrt(sumSquares / count),
    sampleCount: count,
    errorSamples: samples,
  }
}