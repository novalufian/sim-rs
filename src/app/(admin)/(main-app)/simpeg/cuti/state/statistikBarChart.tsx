// src/components/charts/StatistikBarChart.tsx
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
// import { StatistikItem } from '@/hooks/useStatistik'; 

interface StatistikItem { label: string; value: number; }
interface StatistikChartProps {
    title: string;
    data: StatistikItem[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
}

const StatistikBarChart: React.FC<StatistikChartProps> = ({
    title, data, isLoading, isError, error,
}) => {
    if (isLoading) return <div className="p-4 border rounded text-center">Memuat data {title}...</div>;
    if (isError) return <div className="p-4 border border-red-400 bg-red-100 rounded">❌ Gagal memuat: {error?.message}</div>;
    if (!data || data.length === 0) return <div className="p-4 border rounded text-center">Data {title} tidak ditemukan.</div>;

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Jumlah',
            data: data.map(item => item.value),
            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Warna biru Tailwind
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: title, font: { size: 18 } }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border h-[450px]">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default StatistikBarChart;