"use client"

import React from "react"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
    Filler,
} from "chart.js"
import { Doughnut, Line, Bar } from "react-chartjs-2"
import { useStatistikPermohonanCuti, StatistikFilters } from "@/hooks/fetch/cuti/useCutiState"
import SpinerLoading from "@/components/loading/spiner"
import { BsCloudSlash } from "react-icons/bs"

// ============================================================
// REGISTER CHART.JS MODULES
// ============================================================
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
    Filler
)

// ============================================================
// 🎯 1. DISTRIBUSI STATUS CUTI (DOUGHNUT)
// ============================================================
interface ChartProps {
    filters?: StatistikFilters;
}

export const DistribusiStatusCutiChart = ({ filters = {} }: ChartProps) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const dataset = data?.data?.distribusiStatus || []
    
    const chartData = {
        labels: dataset.map((d) => d.status.replace(/_/g, " ")),
        datasets: [
            {
                data: dataset.map((d) => d.jumlah),
                backgroundColor: ["#FFB6C1", "#ADD8E6", "#90EE90", "#F08080", "#FFD700", "#DDA0DD", "#A9A9A9", "#E0FFFF", "#FAFAD2"],
                borderWidth: 1,
                borderRadius: 10,
                spacing: 5,
            },
        ],
    }

    const options = {
        cutout: '20%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'bottom' as const,
                labels: {
                    boxWidth: 20,
                    padding: 10,
                    font: { size: 12 },
                    color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
        },
    }
    
    return (
        <ChartContainer title="Distribusi Status Cuti" isLoading={isLoading} isError={isError}>
            <div className="w-full h-[260px]">
                <Doughnut data={chartData} options={options as any} />
            </div>
        </ChartContainer>
    )
}

// ============================================================
// 🎯 2. DISTRIBUSI JENIS CUTI (DOUGHNUT)
// ============================================================
export const DistribusiJenisCutiChart = ({ filters = {} }: ChartProps) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const dataset = data?.data?.distribusiJenisCuti || []
    
    const chartData = {
        labels: dataset.map((d) => d.jenisNama),
        datasets: [
            {
                data: dataset.map((d) => d.jumlah),
                backgroundColor: ["#2563eb", "#9333ea", "#f97316", "#22c55e", "#eab308", "#ec4899"],
                borderWidth: 1,
                borderRadius: 10,
                spacing: 5,
            },
        ],
    }

    const options = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    boxWidth: 20,
                    padding: 10,
                    font: { size: 12 },
                    color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
        },
    }
    
    return (
        <ChartContainer title="Distribusi Jenis Cuti" isLoading={isLoading} isError={isError}>
            <div className="w-full h-[260px]">
                <Doughnut data={chartData} options={options as any} />
            </div>
        </ChartContainer>
    )
}

// ============================================================
// 🎯 3. TREND PERMOHONAN PER BULAN (LINE)
// ============================================================
export const TrendPermohonanCutiChart = ({ filters = {} }: ChartProps) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const dataset = data?.data?.trendPermohonanPerBulan || []
    
    const chartData = {
        labels: dataset.map((d) => d.bulan),
        datasets: [
            {
                label: "Jumlah Permohonan",
                data: dataset.map((d) => d.jumlah),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.4)",
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    }

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: { display: false },
        },
        scales: {
            x: {
                ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
                grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            },
            y: {
                ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
                grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                beginAtZero: true,
            }
        }
    }
    
    return (
        <ChartContainer title="Trend Permohonan per Bulan" isLoading={isLoading} isError={isError}>
            <div className="w-full h-[260px]">
                <Line data={chartData} options={options as any} />
            </div>
        </ChartContainer>
    )
}

// ============================================================
// 🎯 4. TOP PEGAWAI CUTI TERBANYAK (BAR)
// ============================================================
export const TopPegawaiCutiChart = ({ filters = {} }: ChartProps) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const dataset = data?.data?.topPegawaiCutiTerbanyak || []

    // Menyusun peringkat, urutan menurun berdasarkan totalHari
    const sortedList = [...dataset].sort((a, b) => b.totalHari - a.totalHari)
    
    return (
        <ChartContainer title="Leaderboard Cuti Terbanyak" isLoading={isLoading} isError={isError}>
            <div className="w-full h-full overflow-y-auto">
                <ol className="space-y-2 px-1">
                    {sortedList.length === 0 && (
                        <li className="text-center text-gray-400 dark:text-gray-500 text-base py-12">Tidak ada data</li>
                    )}
                    {sortedList.map((item, idx) => (
                        <li
                            key={item.nama + idx}
                            className={
                                "flex items-center px-4 py-3 rounded-xl border " +
                                (idx === 0
                                    ? "bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent border-yellow-300 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-transparent dark:border-yellow-700"
                                    : idx === 1
                                    ? "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent border-gray-300 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-transparent dark:border-gray-600"
                                    : idx === 2
                                    ? "bg-gradient-to-r from-orange-100 via-orange-50 to-transparent border-orange-200 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-transparent dark:border-orange-700"
                                    : "bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700")
                            }
                        >
                            {/* Peringkat */}
                            <div className="flex-shrink-0 w-8 text-center text-xl font-extrabold text-gray-600 dark:text-gray-300">
                                {idx === 0 && <span>🥇</span>}
                                {idx === 1 && <span>🥈</span>}
                                {idx === 2 && <span>🥉</span>}
                                {idx > 2 && <span className="text-base">{idx+1}</span>}
                            </div>
                            {/* Nama dan rincian */}
                            <div className="flex-1 ml-3">
                                <div className="text-gray-900 dark:text-gray-100 font-semibold">{item.nama}</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">{item.nip}</div>
                            </div>
                            {/* Total Hari Cuti */}
                            <div className="font-bold text-lg text-green-600 dark:text-green-400 px-2">
                                {item.totalHari} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">hari</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </ChartContainer>
    )
}

// ============================================================
// 🎯 5. RATA-RATA LAMA CUTI (CARD)
// ============================================================
export const RataRataLamaCutiCard = ({ filters = {}, className }: ChartProps & { className?: string }) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const rata = data?.data?.rataRataLamaCuti

    if (isLoading) return <StatCard title="Rata-rata Lama Cuti" value="Loading..." color="text-blue-600" className={className} />
    if (isError) return <StatCard title="Rata-rata Lama Cuti" value="Error" color="text-red-600" className={className} />
    return <StatCard title="Rata-rata Lama Cuti" value={`${rata?.toFixed(2)} hari`} color="text-green-600" className={className} />
}

// ============================================================
// 🎯 6. TOTAL PERMOHONAN (CARD)
// ============================================================
export const TotalPermohonanCard = ({ filters = {}, className }: ChartProps & { className?: string }) => {
    const { data, isLoading, isError } = useStatistikPermohonanCuti(filters)
    const total = data?.data?.totalPermohonan

    if (isLoading) return <StatCard title="Total Permohonan" value="Loading..." color="text-blue-600" className={className} />
    if (isError) return <StatCard title="Total Permohonan" value="Error" color="text-red-600" className={className} />
    return <StatCard title="Total Permohonan" value={`${total?.toLocaleString()} data`} color="text-blue-600" className={className} />
}

// ============================================================
// 🔧 REUSABLE COMPONENTS
// ============================================================
const ChartContainer = ({
    title,
    isLoading,
    isError,
    children,
}: {
    title: string
    isLoading: boolean
    isError: boolean
    children: React.ReactNode
}) => (
    <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-start">
        <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">{title}</h2>
        {isLoading ? (
            <div className="w-full h-[220px] flex items-center justify-center">
                <SpinerLoading title={title} />
            </div>
        ) : isError ? (
            <div className="w-full h-[220px] flex flex-col justify-center items-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        ) : (
            children
        )}
    </div>
)

const StatCard = ({ title, value, color, className }: { title: string; value: string; color: string; className?: string }) => {
    // Map color untuk dark mode
    const darkColorMap: Record<string, string> = {
        'text-blue-600': 'dark:text-blue-400',
        'text-green-600': 'dark:text-green-400',
        'text-red-600': 'dark:text-red-400',
    }
    const darkColor = darkColorMap[color] || color
    
    return (
        <div className={`rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 flex flex-col items-start justify-center ${className}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className={`text-3xl font-bold ${color} ${darkColor} mt-2`}>{value}</p>
    </div>
)
}
