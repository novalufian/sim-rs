"use client";
import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePegawaiAgama } from '@/hooks/fetch/pegawai/usePegawaiState'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Legend,
    Tooltip,
);

interface AgamaStats {
    count: number;
    agama: string;
}

export default function AgamaStats() {
    const { data, isLoading, isError } = usePegawaiAgama();
    
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
    
    // Generate colors for each agama
    const colors = [
        'rgba(255, 159, 64, 0.8)',   // Orange
        'rgba(153, 102, 255, 0.8)',  // Purple
        'rgba(75, 192, 192, 0.8)',   // Teal
        'rgba(255, 99, 132, 0.8)',   // Red
        'rgba(54, 162, 235, 0.8)',   // Blue
        'rgba(255, 205, 86, 0.8)',   // Yellow
    ];

    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'Agama',
                data: data.data.map(item => item.count),
                backgroundColor: colors.slice(0, data.data.length),
                borderColor: colors.slice(0, data.data.length).map(color => color.replace('0.8', '1')),
                borderWidth: 5,
                circumference: 360,
                rotation: 280,
                borderRadius: 10,
                spacing: 20,
            },
        ],
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '50%',
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const percentage = ((value / totalCount) * 100).toFixed(1);
                        return `${data.data[context.dataIndex].agama} : ${value} (${percentage}%)`;
                    }
                }
            }
        },
    };
    
    return (
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 flex flex-row">
            <div className=" bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between flex-col">
                    <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
                    Agama
                    </h3>
                    <p className=" font-normal text-gray-500 text-theme-sm dark:text-gray-400 mb-10">
                    keseluruhan pegawai
                    </p>
                </div>
                <div className="relative">
                    <div className="max-h-[330px] pb-10 flex justify-center items-center">
                        <Doughnut data={chartData} options={chartOptions}></Doughnut>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-left justify-end py-3.5 sm:py-5 w-full">

                {data.data.map((item, index) => {
                    const percentage = ((item.count / totalCount) * 100).toFixed(1);
                    const colorClasses = [
                        'text-pink-600',
                        'text-blue-500',
                        'text-yellow-500',
                        'text-teal-500',
                        'text-purple-500',
                        'text-orange-500'
                    ];
                    
                    return (
                        <div key={item.agama} className='mb-3'>
                            <p className={`text-left text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm ${colorClasses[index]}`}>
                                {item.agama}
                            </p>
                            <p className="text-left text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                            <span className="">{item.count}</span> : {percentage}%
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
        
        // </div>
    );
}