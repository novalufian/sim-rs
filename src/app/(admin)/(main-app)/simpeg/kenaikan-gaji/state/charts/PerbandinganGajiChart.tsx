"use client";
import React from "react";
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
import { usePerbandinganGaji } from "@/hooks/fetch/gaji/useGajiState";
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

export default function PerbandinganGajiChart() {
    const { data, isLoading, isError } = usePerbandinganGaji();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Perbandingan Gaji" />
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
        labels: ['Gaji Lama', 'Gaji Baru', 'Selisih'],
        datasets: [
            {
                label: 'Total',
                data: [
                    parseFloat(statistik.gaji_lama.total),
                    parseFloat(statistik.gaji_baru.total),
                    parseFloat(statistik.selisih.total),
                ],
                backgroundColor: [
                    'rgba(255, 223, 186, 0.8)', // Pastel Peach
                    'rgba(186, 225, 255, 0.8)', // Pastel Sky Blue
                    'rgba(186, 255, 201, 0.8)', // Pastel Mint
                ],
                borderRadius: 8,
            },
            {
                label: 'Rata-Rata',
                data: [
                    parseFloat(statistik.gaji_lama.rata_rata),
                    parseFloat(statistik.gaji_baru.rata_rata),
                    parseFloat(statistik.selisih.rata_rata),
                ],
                backgroundColor: [
                    'rgba(255, 204, 203, 0.8)', // Pastel Coral
                    'rgba(212, 165, 255, 0.8)', // Pastel Lavender
                    'rgba(255, 230, 181, 0.8)', // Pastel Cream
                ],
                borderRadius: 8,
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
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Perbandingan Gaji</h2>
            <div className="w-full h-[200px]">
                <Bar data={chartData} options={options as any} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Persentase Kenaikan</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{parseFloat(statistik.persentase_kenaikan.rata_rata).toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Biaya Tahunan</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatRupiah(statistik.total_biaya_tahunan)}</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Tahun: {statistik.tahun}</p>
        </div>
    );
}

