"use client";

import SpinerLoading from '@/components/loading/spiner';
import { useTrendAduan } from '@/hooks/fetch/useAduanStat'; // Use the correct hook
import ChartDataLabels from "chartjs-plugin-datalabels"; 
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
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

function TrendAduanChart() {
    const { data, isLoading } = useTrendAduan(); // Using useTrendAduan hook
    const [trendAduan, setTrendAduan] = useState<any[]>([]); // Modify state for trendAduan

    useEffect(() => {
        if (data) {
            setTrendAduan(data.data.trendAduanBulanan || []); // Adjust based on your data structure
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title="Trend Aduan Bulanan" />
            </div>
        );
    }

    // Prepare the data for the chart
    const chartData = {
        labels: trendAduan.map((item) => item.bulan ?? "Unknown"), // Use "bulan" as label for each month
        datasets: [
            {
                label: "Jumlah Aduan",
                data: trendAduan.map((item) => item.total_aduan), // Map "total_aduan" to data
                borderColor: "#3B82F6", // Blue color for the line
                backgroundColor: "rgba(59, 130, 246, 0.3)", // Light blue background for fill
                tension: 0.4,
                fill: true, // Fill the area under the line
                borderWidth: 2, // Border width for the line
            },
        ],
    };

    const options: ChartOptions<"line"> = { // Adjust for line chart
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true, // Show legend
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
                ticks: {
                    stepSize: 50, // Set step size to 50
                },
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h1 className="text-lg font-bold mb-4">Line Chart: Jumlah Aduan Bulanan</h1>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default TrendAduanChart;
