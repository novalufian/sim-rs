"use client";

import SpinerLoading from '@/components/loading/spiner';
import { useAduanBidang } from '@/hooks/fetch/useAduanStat';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsCloudSlash } from "react-icons/bs";

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

// Register ChartJS components
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

interface FilterState {
    startDate?: string;
    endDate?: string;
}

interface BidangData {
    nama_bidang: string | null;
    total_aduan: number;
    tindak_lanjut_id?: string | null;
}

function LaporanBidangChart({ filters }: { filters: FilterState }) {
    const { data, isLoading, refetch, isError } = useAduanBidang(filters);
    const [bidang, setBidang] = useState<BidangData[]>([]);

    useEffect(() => {
        refetch();
    }, [filters, refetch]);

    useEffect(() => {
        if (data?.data?.totalAduanBidang) {
            setBidang(data.data.totalAduanBidang.map((item: { nama_bidang: string | null; total_aduan: number }) => ({
                nama_bidang: item.nama_bidang || "Unknown",
                total_aduan: Number(item.total_aduan) || 0
            })));
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title="Laporan per Bidang" />
            </div>
        );
    }

    if(isError){
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full flex flex-col justify-center items-center text-gray-400">
                <BsCloudSlash className='w-15 h-15'/>
                <p>server bermasalah</p>
            </div>
        )
    }

    const sortedBidang = [...bidang].sort((a: BidangData, b: BidangData) => b.total_aduan - a.total_aduan);

    const chartData = {
        labels: sortedBidang.map((item: BidangData) => item.nama_bidang),
        datasets: [
            {
                label: "Jumlah Laporan",
                data: sortedBidang.map((item: BidangData) => item.total_aduan),
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                tension: 0.4,
                fill: true,
                borderRadius: 10,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw as number;
                        return `${label}: ${value}`;
                    }
                }
            },
            datalabels: {
                color: "#111827",
                anchor: "end",
                align: "start",
                offset: -10,
                font: {
                    weight: "bold",
                    size: 12,
                },
                formatter: (value: number) => value > 0 ? value.toString() : '',
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
                    precision: 0
                }
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[400px] flex flex-col">
            <h1 className="text-lg font-bold mb-4">Bar Chart: Jumlah Laporan per Bidang</h1>
            <div className="flex-1">
                <Bar
                    data={chartData}
                    options={options}
                    height={400}
                />
            </div>
        </div>
    );
}

export default LaporanBidangChart;
