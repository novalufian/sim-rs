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
import { useTrendBiayaPerBulan, StatistikBulanFilter } from "@/hooks/fetch/gaji/useGajiState";
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

export default function TrendBiayaPerBulanChart() {
    const [filters, setFilters] = useState<StatistikBulanFilter>({});
    const { data, isLoading, isError } = useTrendBiayaPerBulan(filters);
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
                <SpinerLoading title="Trend Biaya Per Bulan" />
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

    const trendData = Array.isArray(statistik.trend_bulanan) ? statistik.trend_bulanan : [];

    const chartData = {
        labels: trendData.map((item) => item.nama_bulan),
        datasets: [
            {
                label: 'Total Biaya Tahunan',
                data: trendData.map((item) => parseFloat(item.total_biaya_tahunan)),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Total Selisih Bulanan',
                data: trendData.map((item) => parseFloat(item.total_selisih_bulanan)),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
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
                        return `${context.dataset.label}: ${formatRupiah(value)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    callback: function(value: any) {
                        return formatRupiah(value);
                    }
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
            <div className="mb-4">
                <input
                    type="number"
                    name="tahun"
                    value={filters.tahun || ''}
                    onChange={handleFilterChange}
                    placeholder="Masukkan tahun"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Trend Biaya Per Bulan</h2>
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

