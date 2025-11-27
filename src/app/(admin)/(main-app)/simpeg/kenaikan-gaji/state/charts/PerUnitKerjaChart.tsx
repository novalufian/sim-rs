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
import { usePerUnitKerja, StatistikUnitKerjaFilter } from "@/hooks/fetch/gaji/useGajiState";
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

const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

export default function PerUnitKerjaChart() {
    const [filters, setFilters] = useState<StatistikUnitKerjaFilter>({});
    const { data, isLoading, isError } = usePerUnitKerja(filters);
    const statistik = data?.data;

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

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    const unitData = Array.isArray(statistik.per_unit_kerja) ? statistik.per_unit_kerja.slice(0, 10) : [];

    const chartData = {
        labels: unitData.map((item) => item.nama_unit_kerja.length > 20 ? item.nama_unit_kerja.substring(0, 20) + '...' : item.nama_unit_kerja),
        datasets: [
            {
                label: 'Jumlah KGB',
                data: unitData.map((item) => item.jumlah_kgb),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Total Biaya Tahunan',
                data: unitData.map((item) => parseFloat(item.total_biaya_tahunan)),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                yAxisID: 'y1',
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
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        if (context.datasetIndex === 0) {
                            return `Jumlah KGB: ${value}`;
                        } else {
                            return `Total Biaya: ${formatRupiah(value)}`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                position: 'left' as const,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            y1: {
                beginAtZero: true,
                position: 'right' as const,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    callback: function(value: any) {
                        return formatRupiah(value);
                    }
                },
                grid: {
                    drawOnChartArea: false,
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
                <input
                    type="text"
                    name="unit_kerja"
                    value={filters.unit_kerja || ''}
                    onChange={handleFilterChange}
                    placeholder="Cari unit kerja"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Statistik Per Unit Kerja (Top 10)</h2>
            <div className="w-full h-[260px]">
                <Bar data={chartData} options={options as any} />
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tahun: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.tahun}</span>
                </p>
            </div>
        </div>
    );
}

