"use client";
import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStatistikJenisPensiun } from "@/hooks/fetch/pensiun/usePensiunState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatistikJenisPensiunChart() {
    const { data, isLoading, isError } = useStatistikJenisPensiun();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Statistik Jenis Pensiun" />
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

    if (statistik.data.length === 0) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <p>Tidak ada data</p>
            </div>
        );
    }

    const colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

    const chartData = {
        labels: statistik.data.map((item) => item.jenis.replace(/_/g, ' ')),
        datasets: [
            {
                data: statistik.data.map((item) => item.jumlah),
                backgroundColor: colors.slice(0, statistik.data.length),
                borderWidth: 1,
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
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const item = statistik.data[context.dataIndex];
                        return `${item.jenis.replace(/_/g, ' ')}: ${value}${item.persentase ? ` (${item.persentase}%)` : ''}`;
                    }
                }
            }
        },
    };

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Statistik Jenis Pensiun</h2>
            
            <div className="flex-1 flex gap-4">
                {/* Kolom utama - Chart */}
                <div className="flex-1 flex items-center justify-center min-w-0">
                    <div className="w-full h-full max-h-[300px] flex items-center justify-center">
                        <Doughnut data={chartData} options={options as any} />
                    </div>
                </div>
                
                {/* Kolom kanan - Custom List Label */}
                <div className="flex-shrink-0 w-[200px] flex flex-col justify-center">
                    <div className="space-y-3">
                        {statistik.data.map((item, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.jenis.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.jumlah} {item.persentase ? `(${item.persentase}%)` : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.total}</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tahun: {statistik.tahun}</p>
            </div>
        </div>
    );
}

