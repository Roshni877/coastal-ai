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
    const [activeTab, setActiveTab] = useState('rates'); // 'rates' or 'distribution'
    const canvasRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Destroy existing chart instance to prevent canvas rendering conflicts
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = canvasRef.current.getContext('2d');
            
            if (activeTab === 'rates') {
                chartInstance.current = new Chart(ctx, {
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
                                labels: { color: '#7f90b0', font: { family: 'Inter', size: 11 } }
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                                ticks: { color: '#7f90b0', maxTicksLimit: 12 }
                            },
                            y: {
                                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                                ticks: { color: '#7f90b0' }
                            }
                        }
                    }
                });
            } else {
                chartInstance.current = new Chart(ctx, {
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
                                labels: { color: '#7f90b0', font: { family: 'Inter', size: 11 } }
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: '#7f90b0' }
                            },
                            y: {
                                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                                ticks: { color: '#7f90b0', precision: 0 }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [activeTab, chartLabels, chartRateGT, chartRateDLV3, severeGT, moderateGT, stableGT, severeDLV3, moderateDLV3, stableDLV3]);

    return (
        <div className="dashboard-card chart-card" style={{ width: '100%' }}>
            <div className="card-title-bar">
                <h3>
                    <i className="fa-solid fa-chart-line text-magenta"></i>{' '}
                    {activeTab === 'rates' ? 'Shoreline Change Rates Comparison' : 'Erosion Severity Distribution'}
                </h3>
                <div className="layer-control">
                    <label 
                        style={{ background: activeTab === 'rates' ? 'rgba(0, 240, 255, 0.15)' : '', color: activeTab === 'rates' ? '#fff' : '' }}
                        onClick={() => setActiveTab('rates')}
                    >
                        Change Rates (m/yr)
                    </label>
                    <label 
                        style={{ background: activeTab === 'distribution' ? 'rgba(0, 240, 255, 0.15)' : '', color: activeTab === 'distribution' ? '#fff' : '' }}
                        onClick={() => setActiveTab('distribution')}
                    >
                        Vulnerability Distribution
                    </label>
                </div>
            </div>
            
            <div className="chart-wrapper">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
