"use client";
import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePegawaiUmur } from '@/hooks/fetch/pegawai/usePegawaiState'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Tooltip
);

export default function UmurStats() {
    const { data, isLoading, isError } = usePegawaiUmur();
    
    // Calculate total count for percentage calculations
    const totalCount = data?.data ? Object.values(data.data).reduce((sum, count) => sum + count, 0) : 0;
    
    if (isLoading) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <AiOutlineLoading3Quarters className='dark:text-white w-10 h-10 mb-3 animate-spin'/>
        <p className='text-xl dark:text-white'>Loading...</p>
    </div>;


    if (isError) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <p className='text-xl dark:text-white text-red-500'>Error loading data</p>
    </div>;
    
    if (!data?.data ) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <p className='text-xl dark:text-white'>No data available</p>
    </div>;

    console.log(data.data["60+"])
    
    // Convert data to array format for chart
    const ageGroups = Object.keys(data.data) as Array<keyof typeof data.data>;
    const ageCounts = Object.values(data.data);

    const chartData = {
        labels: ageGroups.map(group => `${group}`),
        datasets: [
            {
                label: 'Jumlah Pegawai',
                data: ageCounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
            },
        ],
    };
    
    const chartOptions = {
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
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const percentage = totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : '0';
                        return ` ${context.label}: ${value} pegawai (${percentage}%)`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 12
                    }
                },
                title: {
                    display: true,
                    text: 'Kelompok Umur',
                    color: '#666',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                }
            },
            y: {
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
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 grid grid-cols-12 ">
            <div className="bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6 col-span-10">
                <div className="flex justify-between flex-col">
                    <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
                        Distribusi Umur
                </h3>
                <p className="font-normal text-gray-500 text-theme-sm dark:text-yellow-400 mb-10">
                    satuan dalam tahun
                </p>
                </div>
                <div className="w-full h-[200px]">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center ">
                <span className="text-8xl font-semibold tracking-tight text-yellow-600">
                    {data.data["60+"]}
                </span>
                <span className='text-center text-sm '> Mendekati <br/> Pensiun</span>
            </div>
        </div>
    );
}