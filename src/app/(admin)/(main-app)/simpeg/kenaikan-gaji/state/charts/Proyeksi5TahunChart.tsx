"use client";
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useProyeksi5Tahun } from "@/hooks/fetch/gaji/useGajiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
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

export default function Proyeksi5TahunChart() {
    const { data, isLoading, isError } = useProyeksi5Tahun();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Proyeksi 5 Tahun" />
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

    const proyeksiData = Array.isArray(statistik.proyeksi) ? statistik.proyeksi : [];

    const chartData = {
        labels: proyeksiData.map((item) => item.tahun.toString()),
        datasets: [
            {
                label: 'Aktual',
                data: proyeksiData.map((item) => item.tipe === 'aktual' ? parseFloat(item.total_biaya_tahunan) : null),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: 'Proyeksi',
                data: proyeksiData.map((item) => item.tipe === 'proyeksi' ? parseFloat(item.total_biaya_tahunan) : null),
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
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
                        if (value === null) return '';
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
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-start">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Proyeksi 5 Tahun</h2>
            <div className="w-full h-[260px]">
                <Line data={chartData} options={options as any} />
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rata-Rata Historis: <span className="font-bold text-blue-600 dark:text-blue-400">{formatRupiah(statistik.rata_rata_biaya_tahunan_historis)}</span>
                </p>
            </div>
        </div>
    );
}

