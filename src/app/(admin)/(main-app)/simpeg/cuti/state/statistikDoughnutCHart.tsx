// src/components/charts/StatistikDoughnutChart.tsx
'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
// Asumsikan StatistikItem sudah diimpor/tersedia
// import { StatistikItem } from '@/hooks/useStatistik'; 

interface StatistikItem { label: string; value: number; }
interface StatistikChartProps {
    title: string;
    data: StatistikItem[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
}

const defaultColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'];

const StatistikDoughnutChart: React.FC<StatistikChartProps> = ({
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
            backgroundColor: defaultColors.slice(0, data.length),
            hoverOffset: 8,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const, labels: { usePointStyle: true } },
            title: { display: true, text: title, font: { size: 16 } }
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border h-[450px] flex flex-col justify-center items-center">
            <div className="w-full max-w-sm h-full">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default StatistikDoughnutChart;

