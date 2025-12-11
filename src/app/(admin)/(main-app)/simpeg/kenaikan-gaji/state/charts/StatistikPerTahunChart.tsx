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
import { useStatistikPerTahun, StatistikTahunFilter } from "@/hooks/fetch/gaji/useGajiState";
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

export default function StatistikPerTahunChart() {
    const [filters, setFilters] = useState<StatistikTahunFilter>({});
    const { data, isLoading, isError } = useStatistikPerTahun(filters);
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
                <SpinerLoading title="Statistik Per Tahun" />
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

    const tahunData = Array.isArray(statistik.per_tahun) ? statistik.per_tahun : [];

    const chartData = {
        labels: tahunData.map((item) => item.tahun.toString()),
        datasets: [
            {
                label: 'Jumlah KGB',
                data: tahunData.map((item) => item.jumlah_kgb),
                backgroundColor: 'rgba(186, 225, 255, 0.8)', // Pastel Sky Blue
                borderRadius: 8,
            },
            {
                label: 'Total Biaya Tahunan',
                data: tahunData.map((item) => parseFloat(item.total_biaya_tahunan)),
                backgroundColor: 'rgba(186, 255, 201, 0.8)', // Pastel Mint
                borderRadius: 8,
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
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Statistik Per Tahun</h2>
            <div className="w-full h-[260px]">
                <Bar data={chartData} options={options as any} />
            </div>
            {statistik.periode && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Periode: <span className="font-bold text-blue-600 dark:text-blue-400">
                            {statistik.periode.tahun_mulai} - {statistik.periode.tahun_selesai}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

