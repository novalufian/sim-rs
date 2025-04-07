"use client";
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface UmurData {
    umur: number;
    count: number;
}

interface UmurStats {
    data: UmurData[];
    total: number;
}

export default function UmurStats() {
    const [stats, setStats] = useState<UmurStats>({ data: [], total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/duk?umur=true');
                const result = await response.json();
                setStats(result);
            } catch (error) {
                console.error('Error fetching umur stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>No data available</div>;

    const data = {
        labels: ["20-29","30-39","40-49","50-59","60-69"],
        datasets: [{
            label: 'Jumlah',
            data: [65,228,2,220,78],
            borderColor: 'rgba(75, 192, 192, 1)', // Teal border color
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light teal fill color
            borderWidth: 2,
            fill: true, // Fill area under the line
            pointRadius: 4, // Size of points on the line
            pointHoverRadius: 6, // Hover effect on points
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                text: 'Distribusi Umur Pegawai',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                
            },
            legends: {
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#000'
                },
                title: {
                    display: false,
                    text: 'Umur'
                }
            },
            y: {
                grid: {
                    display: true,
                    color: '#e0e0e0'
                },
                ticks: {
                    color: '#000'
                },
                title: {
                    display: false,
                    text: 'Jumlah'
                }
            },
        },
    };

    return (
        <div className="container mx-auto flex overflow-hidden bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800">
            <div className="w-full box-border p-6 overflow-hidden">
                <h3 className="text-gray-800 text-3xl font-semibold dark:text-white">
                    Distribusi Umur Pegawai
                </h3>
                <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400 mb-10">
                    keseluruhan pegawai
                </p>
                <div className="w-full h-[400px]">
                    <Line options={options} data={data} />
                </div>
            </div>
        </div>
    );
}
