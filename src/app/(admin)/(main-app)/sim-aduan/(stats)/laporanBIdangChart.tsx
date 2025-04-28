"use client";

import SpinerLoading from '@/components/loading/spiner';
import { useAduanBidang } from '@/hooks/fetch/useAduanStat';
import ChartDataLabels from "chartjs-plugin-datalabels"; 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

function LaporanBidangChart() {
    const { data, isLoading } = useAduanBidang();
    const [bidang, setBidang] = useState<any[]>([]); // ubah ke any[] biar data array

    useEffect(() => {
        if (data) {
        setBidang(data.data.totalAduanBidang || []);
        }
    }, [data]);

    if (isLoading) {
        return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
            <SpinerLoading title="Laporan per Bidang" />
        </div>
        );
    }

    const chartData = {
        labels: bidang.map((item) => item.nama_bidang ?? "Unknown"),
        datasets: [
        {
            label: "Jumlah Laporan",
            data: bidang.map((item) => item.total_aduan),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.7)", // biru lebih solid
            tension: 0.4,
            fill: true,
            borderRadius: 10,
        },
        ],
    };

    const options: ChartOptions<"bar"> = { // <= tambahin tipe disini!
        responsive: true,
        plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: "index",
            intersect: false,
        },
        datalabels: {
            color: "#111827",
            anchor: "end",
            align: "start",
            offset: -10,
            font: {
            weight: "bold",
            size: 16,
            },
            formatter: (value) => value,
        },
        },
        scales: {
        x: {
            grid: {
            display: false,
            },
        },
        y: {
            beginAtZero: true,
        },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
        <h1 className="text-lg font-bold mb-4">Bar Chart: Jumlah Laporan per Bidang</h1>
        <Bar data={chartData} options={options} />
        </div>
    );
}

export default LaporanBidangChart;
