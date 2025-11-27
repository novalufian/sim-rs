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
import { useStatistikPerUnitKerja, StatistikUnitKerjaFilter } from "@/hooks/fetch/kawin/useKawinState";
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

export default function StatistikPerUnitKerjaChart() {
    const [filters, setFilters] = useState<StatistikUnitKerjaFilter>({});
    const { data, isLoading, isError } = useStatistikPerUnitKerja(filters);
    const statistik = Array.isArray(data?.data) ? data.data : [];

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Statistik Per Unit Kerja" />
            </div>
        );
    }

    if (isError || !statistik || statistik.length === 0) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    // Limit to top 10 for better visualization
    const top10 = statistik.slice(0, 10);

    const chartData = {
        labels: top10.map((item) => item.unit_kerja.length > 20 ? item.unit_kerja.substring(0, 20) + '...' : item.unit_kerja),
        datasets: [
            {
                label: 'Pernikahan',
                data: top10.map((item) => item.jumlah_pernikahan),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Perceraian',
                data: top10.map((item) => item.jumlah_perceraian),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
            },
        ],
    };

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: isDark ? '#d1d5db' : '#374151',
                    padding: 15,
                    font: { size: 12 },
                    usePointStyle: true,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                stacked: false,
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
                    maxRotation: 45,
                    minRotation: 45,
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
                    type="text"
                    name="unit_kerja"
                    value={filters.unit_kerja || ''}
                    onChange={handleFilterChange}
                    placeholder="Cari unit kerja"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Statistik Per Unit Kerja (Top 10)</h2>
            <div className="w-full h-[260px]">
                <Bar data={chartData} options={options as any} />
            </div>
        </div>
    );
}

