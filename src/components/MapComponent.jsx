import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function MapComponent({ 
    showTransects, 
    showS2020, 
    showS2024, 
    showSpred, 
    onCoordinateChange,
    tanBeta,
    HMean,
    tideHeight
}) {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    
    // Stored raw geojson data
    const [transectsData, setTransectsData] = useState(null);
    const [s2020Data, setS2020Data] = useState(null);
    const [s2024Data, setS2024Data] = useState(null);
    const [spredData, setSpredData] = useState(null);

    // Leaflet layer instances
    const layersRef = useRef({
        transects: null,
        s2020: null,
        s2024: null,
        spred: null
    });

    const tileLayerRef = useRef(null);
    const [isDark, setIsDark] = useState(document.documentElement.getAttribute("data-theme") === "dark");

    // Dynamic theme listener
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observer.disconnect();
    }, []);

    // 1. Fetch GeoJSON files once
    useEffect(() => {
        fetch('./transects.geojson')
            .then(res => res.json())
            .then(data => setTransectsData(data))
            .catch(e => console.error("Error loading transects:", e));

        fetch('./shoreline_2020.geojson')
            .then(res => res.json())
            .then(data => setS2020Data(data))
            .catch(e => console.error("Error loading 2020 shoreline:", e));

        fetch('./shoreline_2024.geojson')
            .then(res => res.json())
            .then(data => setS2024Data(data))
            .catch(e => console.error("Error loading 2024 shoreline:", e));

        fetch('./shoreline_predicted.geojson')
            .then(res => res.json())
            .then(data => setSpredData(data))
            .catch(e => console.error("Error loading predicted shoreline:", e));
    }, []);

    // 2. Initialize Map Instance
    useEffect(() => {
        if (!mapInstance.current && mapContainerRef.current) {
            const centerLat = 13.4826;
            const centerLon = 74.7312;
            
            mapInstance.current = L.map(mapContainerRef.current, {
                zoomControl: true,
                attributionControl: false
            }).setView([centerLat, centerLon], 11);
            
            mapInstance.current.on('mousemove', (e) => {
                if (onCoordinateChange) {
                    onCoordinateChange(e.latlng.lat, e.latlng.lng);
                }
            });
        }
    }, [onCoordinateChange]);

    // 2b. Add/Update Tile Layer based on theme changes
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        if (tileLayerRef.current) {
            map.removeLayer(tileLayerRef.current);
        }

        const tileUrl = isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        tileLayerRef.current = L.tileLayer(tileUrl, {
            maxZoom: 19
        }).addTo(map);
    }, [isDark]);

    // 3. Render/Toggle Static Layers (Transects, 2020, 2024)
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        // --- Transects Layer ---
        if (layersRef.current.transects) map.removeLayer(layersRef.current.transects);
        if (showTransects && transectsData) {
            layersRef.current.transects = L.geoJSON(transectsData, {
                style: { color: '#00f0ff', weight: 1.2, opacity: 0.4 },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`<strong>Point ID:</strong> ${feature.properties.Transect_I || feature.id || 'N/A'}`);
                }
            }).addTo(map);
        }

        // --- 2020 Shoreline Layer ---
        if (layersRef.current.s2020) map.removeLayer(layersRef.current.s2020);
        if (showS2020 && s2020Data) {
            layersRef.current.s2020 = L.geoJSON(s2020Data, {
                style: { color: '#ffc107', weight: 2, opacity: 0.8 }
            }).addTo(map);
        }

        // --- 2024 Shoreline Layer ---
        if (layersRef.current.s2024) map.removeLayer(layersRef.current.s2024);
        if (showS2024 && s2024Data) {
            layersRef.current.s2024 = L.geoJSON(s2024Data, {
                style: { color: '#00ff87', weight: 2.5, opacity: 0.9 }
            }).addTo(map);
        }
    }, [showTransects, showS2020, showS2024, transectsData, s2020Data, s2024Data]);

    // 4. Render & Dynamically Displace Predicted Shoreline Layer
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        if (layersRef.current.spred) {
            map.removeLayer(layersRef.current.spred);
        }

        if (showSpred && spredData) {
            // Recalculate displacement in degrees based on current sliders
            // dy = (H_mean - tide_height) / tan_beta (in meters)
            const dy = (HMean - tideHeight) / tanBeta;
            
            // Conversion factors: 1 degree latitude ~ 111,000 meters.
            const dlat = dy / 111000.0;
            const dlng = dy / (111000.0 * Math.cos(13.48 * Math.PI / 180.0));

            // Deep clone and shift coordinates
            const shiftedData = JSON.parse(JSON.stringify(spredData));
            shiftedData.features.forEach(feature => {
                if (feature.geometry.type === 'LineString') {
                    feature.geometry.coordinates = feature.geometry.coordinates.map(coord => [
                        coord[0] + dlng, 
                        coord[1] + dlat
                    ]);
                } else if (feature.geometry.type === 'MultiLineString') {
                    feature.geometry.coordinates = feature.geometry.coordinates.map(line => 
                        line.map(coord => [coord[0] + dlng, coord[1] + dlat])
                    );
                }
            });

            layersRef.current.spred = L.geoJSON(shiftedData, {
                style: { color: '#ff007f', weight: 2.2, opacity: 0.9, dashArray: '3, 4' }
            }).addTo(map);
        }
    }, [showSpred, spredData, tanBeta, HMean, tideHeight]);

    return (
        <div className="map-wrapper-relative" style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapContainerRef} className="leaflet-map-element" style={{ width: '100%', height: '100%' }} />
            
            {/* Map Legend Box */}
            <div className="map-legend" style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(15, 23, 42, 0.08)',
                padding: '12px',
                borderRadius: '8px',
                color: isDark ? '#f2f5fa' : '#0f172a',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: 'auto'
            }}>
                <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '4px', marginBottom: '2px', fontSize: '0.8rem', letterSpacing: '0.5px' }}>MAP LEGEND</div>
                
                {showTransects && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '3px', backgroundColor: isDark ? '#00f0ff' : '#0891b2', borderRadius: '1.5px' }}></div>
                        <span>Measurement Transects</span>
                    </div>
                )}
                
                {showS2020 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '3px', backgroundColor: '#ffc107', borderRadius: '1.5px' }}></div>
                        <span>2020 Shoreline (Baseline)</span>
                    </div>
                )}
                
                {showS2024 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '3px', backgroundColor: isDark ? '#00ff87' : '#059669', borderRadius: '1.5px' }}></div>
                        <span>2024 Shoreline (Ground Truth)</span>
                    </div>
                )}
                
                {showSpred && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '3px', borderTop: '2.5px dashed #ff007f' }}></div>
                        <span>Predicted Shoreline (Dynamic)</span>
                    </div>
                )}
            </div>
        </div>
    );
}
