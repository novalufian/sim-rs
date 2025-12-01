"use client";
import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { usePerbandinganPernikahanVsPerceraian, StatistikTahunFilter } from "@/hooks/fetch/kawin/useKawinState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function PerbandinganPernikahanVsPerceraianChart() {
    const [filters, setFilters] = useState<StatistikTahunFilter>({});
    const { data, isLoading, isError } = usePerbandinganPernikahanVsPerceraian(filters);
    const statistik = data?.data;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Perbandingan Pernikahan Vs Perceraian" />
            </div>
        );
    }

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    const chartData = {
        labels: ['Pernikahan', 'Perceraian'],
        datasets: [
            {
                label: 'Jumlah',
                data: [statistik.total_pernikahan, statistik.total_perceraian],
                backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            },
        ],
    };

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <div className="mb-4 flex gap-2">
                <input
                    type="number"
                    name="startYear"
                    value={filters.startYear || ''}
                    onChange={handleFilterChange}
                    placeholder="Tahun mulai"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                    type="number"
                    name="endYear"
                    value={filters.endYear || ''}
                    onChange={handleFilterChange}
                    placeholder="Tahun selesai"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Perbandingan Pernikahan Vs Perceraian</h2>
            <div className="w-full h-[200px]">
                <Bar data={chartData} options={options as any} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rasio Perceraian</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{statistik.rasio_perceraian}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selisih</p>
                    <p className={`text-xl font-bold ${statistik.selisih >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {statistik.selisih >= 0 ? '+' : ''}{statistik.selisih}
                    </p>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Tahun: {statistik.tahun}</p>
        </div>
    );
}

