"use client";
import React from 'react'
import {useCutiJatahByPegawai} from '@/hooks/fetch/cuti/useCutiJatah'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
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
export default function UserStateCuti({id_pegawai}:{id_pegawai : string}) {
    const { data: cutiJatahData, isLoading, error } = useCutiJatahByPegawai(id_pegawai);
    const currentYear = new Date().getFullYear();

    if (isLoading) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center'>Loading...</div>
    if (error) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center text-red-500'>Error loading KGB</div>
    if (!cutiJatahData) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center'>No data</div>


    const items = cutiJatahData.data.items || []
    const thisYear = items.find((i) => i.tahun === currentYear)
    const total = thisYear?.jumlah_jatah ?? 0
    const sisa = thisYear?.sisa_jatah ?? 0
    const used = Math.max(total - sisa, 0)

    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'Cuti',
                data: [used, sisa],
                backgroundColor: ['rgba(249, 115, 22, 0.8)', 'rgba(16, 185, 129, 0.8)'],
                borderColor: ['rgba(249, 115, 22, 1)', 'rgba(16, 185, 129, 1)'],
                borderWidth: 4,
                circumference: 180,
                rotation: 270,
                borderRadius: 10,
                spacing: 12,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: { position: 'bottom' as const },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
                        return `${context.label}: ${value} (${pct}%)`;
                    }
                }
            }
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex p-5 flex-col">
            <div className="flex flex-col items-center">
                <h3 className="text-3xl font-bold dark:text-white">Jatah Cuti</h3>
                <h3>{currentYear}</h3>
                
                <div className="w-full mt-4 max-h-[260px] pb-2 flex justify-center items-center">
                    <Doughnut data={chartData} options={chartOptions as any} />
                </div>
                <div className='flex justify-around items-center w-full'>
                    <p className='text-orange-500 text-lg'>Terpakai : {used}</p>
                    <p className='text-teal-500 text-lg'>{sisa} : Sisa</p>
                </div>
            </div>
        </div>
    )
}