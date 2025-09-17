"use client";
import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {usePegawaiJenisKelamin} from '@/hooks/fetch/pegawai/usePegawaiState'
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
import { HiExternalLink } from 'react-icons/hi';
import Link from 'next/link';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface GenderStats {
    perempuan: number;
    lakiLaki: number;
    total: number;
    perempuanPercentage: number;
    lakiLakiPercentage: number;
}

export default function GenderStats() {
    const [stats, setStats] = useState<GenderStats | null>(null);
    // const [loading, setLoading] = useState(true);
    const { data, isLoading, isError } = usePegawaiJenisKelamin();

    

    useEffect(() => {
        if(data){
            setStats(data.data.state)
        }
    }, [data]);
    
    
    if (isLoading) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[450px] flex justify-center items-center flex-col'>
        <AiOutlineLoading3Quarters className='dark:text-white w-10 h-10 mb-3 animate-spin'/>
        <p className='text-xl dark:text-white'>Loading...</p>
    </div>;
    if (!stats) return <div>No data available</div>;
    
    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'Perempuan',
                data: [stats.perempuan, stats.lakiLaki],
                backgroundColor: ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)'],
                borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)'],
                borderWidth: 5,
                circumference : 160,
                rotation :280,
                borderRadius : 10,
                spacing : 10,
            },
            
        ],
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const total = stats?.total || 0;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.dataset.label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
    };
    
    return (
        
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className=" bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6 mb-10">
                <div className="flex justify-between flex-row">
                    <div className="flex flex-col sm:items-left sm:justify-between items-left">
                        <h3 className="text-3xl font-bold dark:text-white">Gender</h3>
                        <p className=" font-normal text-gray-500 text-theme-sm dark:text-gray-400 ">keseluruhan pegawai</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between items-center">
                    <Link href="/simpeg/cuti" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">lihat detail <HiExternalLink/></Link>
                </div>
                    
                </div>
                <div className="relative ">
                    <div className="max-h-[330px]">
                        <Doughnut data={chartData} options={chartOptions}></Doughnut>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-around gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    Total Pegawai
                    </p>
                    <p className="flex items-center justify-center gap-1 font-semibold text-gray-800 dark:text-white/90 text-title-md">{stats.total}</p>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    {100}%
                    </p>
                </div>

                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    Perempuan
                    </p>
                    <p className="flex items-center justify-center gap-1 font-semibold text-title-md text-pink-600">
                    {stats.perempuan}
                    </p>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    {stats.perempuanPercentage}%
                    </p>
                </div>
            
                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    Laki - laki
                    </p>
                    <p className="flex items-center justify-center gap-1 text-title-md font-semibold text-blue-500 ">
                    {stats.lakiLaki}
                    </p>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                    {stats.lakiLakiPercentage}%
                    </p>
                </div>
            </div>
        </div>
        
        // </div>
    );
}