"use client";
import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePegawaiStatusPekerjaan } from '@/hooks/fetch/pegawai/usePegawaiState'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    Tooltip
);

interface StatusPekerjaanStats {
    count: number;
    status_pekerjaan: string;
}

export default function StatusPekerjaanStats() {
    const { data, isLoading, isError } = usePegawaiStatusPekerjaan();
    
    // Calculate total count for percentage calculations
    const totalCount = data?.data ? data.data.reduce((sum, item) => sum + item.count, 0) : 0;
    
    if (isLoading) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <AiOutlineLoading3Quarters className='dark:text-white w-10 h-10 mb-3 animate-spin'/>
        <p className='text-xl dark:text-white'>Loading...</p>
    </div>;
    
    if (isError) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <p className='text-xl dark:text-white text-red-500'>Error loading data</p>
    </div>;
    
    if (!data?.data || data.data.length === 0) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <p className='text-xl dark:text-white'>No data available</p>
    </div>;
    
    // Generate colors for each status pekerjaan
    const colors = [
        '#FF0066',   // Yellow
        '#7ADAA5',   // Blue
        '#C59560',   // Red
    ];

    const chartData = {
        labels: ['Status Pekerjaan'],
        datasets: data.data.map((item, index) => ({
            label: item.status_pekerjaan,
            data: [item.count],
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length].replace('0.8', '1'),
            borderWidth: 2,
            borderRadius: 0,
            borderSkipped: false,
            stack: "stack"
        })),
    };
    
    const chartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                text: 'Status Pekerjaan Pegawai',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rect'
                }
            },
            tooltip: {
                mode: 'point' as const,
                intersect: true,
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const percentage = totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : '0';
                        return ` ${context.dataset.label}: ${value} pegawai (${percentage}%)`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#e0e0e0'
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 12
                    }
                },
                title: {
                    display: true,
                    text: 'Jumlah Pegawai',
                    color: '#666',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                }
            },
            y: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                },
                border: {
                    color: 'transparent'
                }
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between flex-col">
                    <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
                        Status Pekerjaan
                    </h3>
                    <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400 mb-10">
                        keseluruhan pegawai
                    </p>
                </div>
                <div className="w-full h-[200px]">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}