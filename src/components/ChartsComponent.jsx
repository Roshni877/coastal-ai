import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

export default function ChartsComponent({
    chartLabels,
    chartRateGT,
    chartRateDLV3,
    severeGT,
    moderateGT,
    stableGT,
    severeDLV3,
    moderateDLV3,
    stableDLV3
}) {
    const lineCanvasRef = useRef(null);
    const barCanvasRef = useRef(null);
    const lineChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    // Dynamic theme listener
    const [isDark, setIsDark] = useState(document.documentElement.getAttribute("data-theme") === "dark");

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)';
        const labelColor = isDark ? '#7f90b0' : '#475569';

        if (lineCanvasRef.current) {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }

            const ctx = lineCanvasRef.current.getContext('2d');
            lineChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Ground Truth Rates (m/yr)',
                            data: chartRateGT,
                            borderColor: '#ffc107',
                            backgroundColor: 'rgba(255, 193, 7, 0.05)',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'DeepLabV3+ Predicted (m/yr)',
                            data: chartRateDLV3,
                            borderColor: '#ff007f',
                            backgroundColor: 'rgba(255, 0, 127, 0.05)',
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: labelColor, font: { family: 'Outfit', size: 11, weight: '600' } }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: labelColor, maxTicksLimit: 12, font: { family: 'Outfit' } }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: { color: labelColor, font: { family: 'Outfit' } }
                        }
                    }
                }
            });
        }

        if (barCanvasRef.current) {
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }

            const ctx = barCanvasRef.current.getContext('2d');
            barChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Severe Erosion', 'Moderate Erosion', 'Stable / Growing'],
                    datasets: [
                        {
                            label: 'Ground Truth (GT)',
                            data: [severeGT, moderateGT, stableGT],
                            backgroundColor: 'rgba(130, 34, 255, 0.65)',
                            borderColor: '#8222ff',
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            label: 'DeepLabV3+ Predicted',
                            data: [severeDLV3, moderateDLV3, stableDLV3],
                            backgroundColor: 'rgba(0, 240, 255, 0.65)',
                            borderColor: '#00f0ff',
                            borderWidth: 1,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: labelColor, font: { family: 'Outfit', size: 11, weight: '600' } }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: labelColor, font: { family: 'Outfit' } }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: { color: labelColor, precision: 0, font: { family: 'Outfit' } }
                        }
                    }
                }
            });
        }

        return () => {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
                lineChartInstance.current = null;
            }
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
                barChartInstance.current = null;
            }
        };
    }, [chartLabels, chartRateGT, chartRateDLV3, severeGT, moderateGT, stableGT, severeDLV3, moderateDLV3, stableDLV3, isDark]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            {/* Bar Chart Card */}
            <div className="dashboard-card chart-card" style={{ width: '100%' }}>
                <div className="card-title-bar">
                    <h3>
                        <i className="fa-solid fa-chart-bar text-cyan"></i>{' '}
                        Erosion Severity Distribution
                    </h3>
                </div>
                <div className="chart-wrapper" style={{ height: '210px' }}>
                    <canvas ref={barCanvasRef} />
                </div>
            </div>

            {/* Line Chart Card */}
            <div className="dashboard-card chart-card" style={{ width: '100%' }}>
                <div className="card-title-bar">
                    <h3>
                        <i className="fa-solid fa-chart-line text-magenta"></i>{' '}
                        Shoreline Change Rates Comparison (m/yr)
                    </h3>
                </div>
                <div className="chart-wrapper" style={{ height: '210px' }}>
                    <canvas ref={lineCanvasRef} />
                </div>
            </div>
        </div>
    );
}
