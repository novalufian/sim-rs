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
import { usePegawaiAkanPensiunPerUnit, StatistikPeriodeFilter } from "@/hooks/fetch/pensiun/usePensiunState";
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

export default function PegawaiAkanPensiunPerUnitChart() {
    const [filters, setFilters] = useState<StatistikPeriodeFilter>({ periode: '1tahun' });
    const { data, isLoading, isError } = usePegawaiAkanPensiunPerUnit(filters);
    const statistik = data?.data;

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({
            ...prev,
            periode: e.target.value || undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Pegawai Akan Pensiun Per Unit" />
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
        labels: statistik.data.map((item) => item.unit_kerja.length > 20 ? item.unit_kerja.substring(0, 20) + '...' : item.unit_kerja),
        datasets: [
            {
                label: 'Jumlah Pegawai',
                data: statistik.data.map((item) => item.jumlah),
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
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
            <div className="mb-4">
                <select
                    value={filters.periode || ''}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="1tahun">1 Tahun</option>
                    <option value="6bulan">6 Bulan</option>
                    <option value="3bulan">3 Bulan</option>
                </select>
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Pegawai Akan Pensiun Per Unit</h2>
            <div className="w-full h-[260px]">
                <Bar data={chartData} options={options as any} />
            </div>
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">Periode: {statistik.periode} | Total Unit: {statistik.total_unit}</p>
            </div>
        </div>
    );
}

