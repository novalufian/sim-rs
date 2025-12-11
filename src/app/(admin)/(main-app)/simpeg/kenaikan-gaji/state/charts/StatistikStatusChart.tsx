"use client";
import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStatistikStatus } from "@/hooks/fetch/gaji/useGajiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatistikStatusChart() {
    const { data, isLoading, isError } = useStatistikStatus();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Statistik Status" />
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

    const statusData = Array.isArray(statistik.per_status) ? statistik.per_status : [];

    // Pastel/Warm color palette
    const pastelColors = [
        "#FFB3BA", // Pastel Pink
        "#FFDFBA", // Pastel Peach
        "#FFFFBA", // Pastel Yellow
        "#BAFFC9", // Pastel Mint
        "#BAE1FF", // Pastel Sky Blue
        "#D4A5FF", // Pastel Lavender
        "#FFCCCB", // Pastel Coral
        "#FFE4B5", // Pastel Cream
        "#E6E6FA", // Lavender
        "#F0E68C", // Khaki
    ];

    const chartData = {
        labels: statusData.map((item) => item.status.replace(/_/g, ' ')),
        datasets: [
            {
                data: statusData.map((item) => item.jumlah),
                backgroundColor: pastelColors.slice(0, statusData.length),
                borderWidth: 2,
                borderColor: "#ffffff",
                borderRadius: 10,
                spacing: 5,
            },
        ],
    };

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const options = {
        cutout: '60%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: isDark ? '#d1d5db' : '#374151',
                    boxWidth: 20,
                    padding: 15,
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const item = statusData[context.dataIndex];
                        return `${item.status.replace(/_/g, ' ')}: ${value} (${item.persentase}%)`;
                    }
                }
            }
        },
    };

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-start">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Statistik Status KGB</h2>
            <div className="w-full h-[260px] flex items-center justify-center">
                <Doughnut data={chartData} options={options as any} />
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total KGB: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.total_kgb}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tahun: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.tahun}</span>
                </p>
            </div>
        </div>
    );
}

