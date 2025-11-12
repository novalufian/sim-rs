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
import { Doughnut, Line } from "react-chartjs-2"
import { useStatistikJatahCuti, StatistikFilters } from "@/hooks/fetch/cuti/useCutiState"
import SpinerLoading from "@/components/loading/spiner"
import { BsCloudSlash } from "react-icons/bs"

// ============================================================
// 📦 REGISTER CHART.JS ELEMENTS
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
// 🥇 1️⃣ DISTRIBUSI SISA CUTI (DOUGHNUT CHART)
// ============================================================
interface JatahChartProps {
  filters?: StatistikFilters;
}

export function DistribusiSisaCutiChart({ filters = {} }: JatahChartProps) {
  const { data, isLoading, isError } = useStatistikJatahCuti(filters)
  const statistik = data?.data
  const distribusi = statistik?.distribusiSisaCuti || []

  const doughnutData = {
    labels: distribusi.map((item) => item.range),
    datasets: [
      {
        data: distribusi.map((item) => item.jumlahPegawai),
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
        borderWidth: 1,
        borderRadius: 10,
        spacing: 5,
      },
    ],
  }

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const doughnutOptions = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          boxWidth: 20,
          padding: 10,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  }

  return (
    <div className="rounded-4xl bg-white dark:bg-white/[0.03] border dark:border-gray-800 box-border p-5 h-[400px] flex flex-col justify-start items-center font-inter">
      <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Distribusi Sisa Cuti</h2>

      {isLoading ? (
        <div className="w-full h-[260px] flex items-center justify-center">
          <SpinerLoading title="Distribusi Sisa Cuti" />
        </div>
      ) : isError ? (
        <div className="w-full h-[260px] flex flex-col justify-center items-center text-gray-400 dark:text-gray-500">
          <BsCloudSlash className="w-10 h-10" />
          <p>Server bermasalah</p>
        </div>
      ) : distribusi.length === 0 ? (
        <div className="w-full h-[260px] flex items-center justify-center text-gray-400 dark:text-gray-500">Tidak ada data</div>
      ) : (
        <div className="w-[280px] h-[280px]">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      )}

      {statistik?.rataRataJatahTahunan !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Rata-rata jatah tahunan: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.rataRataJatahTahunan}</span> hari
        </p>
      )}
    </div>
  )
}

// ============================================================
// 🥈 2️⃣ TREND TAHUNAN CUTI (LINE CHART DENGAN FILL AREA)
// ============================================================
export function TrendTahunanCutiChart({ filters = {} }: JatahChartProps) {
  const { data, isLoading, isError } = useStatistikJatahCuti(filters)
  const statistik = data?.data
  const trend = statistik?.trendTahunan || []

  const lineData = {
    labels: trend.map((item) => item.tahun),
    datasets: [
      {
        label: "Total Permohonan",
        data: trend.map((item) => item.totalPermohonan),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.4)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Total Hari Cuti",
        data: trend.map((item) => item.totalHari),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.4)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      },
      y: {
        ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      },
    },
  }

  return (
    <div className="rounded-4xl bg-white dark:bg-white/[0.03] border dark:border-gray-800 box-border p-5 h-[400px] flex flex-row justify-start font-inter">
      <div className="w-9/12 flex flex-col justify-start items-start">
        <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Grafik</h2>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Trend Tahunan & Prediksi</h2>

        {isLoading ? (
          <div className="w-full min-h-[250px] flex items-center justify-center">
            <SpinerLoading title="Trend Tahunan & Prediksi" />
          </div>
        ) : isError ? (
          <div className="w-full min-h-[250px] flex flex-col justify-center items-center text-gray-400 dark:text-gray-500">
            <BsCloudSlash className="w-10 h-10" />
            <p>Server bermasalah</p>
          </div>
        ) : trend.length === 0 ? (
          <div className="w-full min-h-[250px] flex items-center justify-center text-gray-400 dark:text-gray-500">Tidak ada data</div>
        ) : (
          <div className="min-h-[250px] flex-grow w-full">
            <Line data={lineData} options={lineOptions} />
        </div>
        )}
      </div>

      <div className="w-3/12 flex flex-col justify-center items-center">
        {statistik?.prediksiTahunDepan !== undefined && (
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 text-center">
            Prediksi <br /> tahun depan: <br />
            <span className="font-bold text-green-600 dark:text-green-400 text-6xl my-3">{statistik.prediksiTahunDepan}</span> 
            <br /> <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">permohonan</span>
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================
// 🧩 Wrapper agar kompatibel dengan import <JatahCutiChart /> pada page
// ============================================================
export function JatahCutiChart({ filters = {} }: JatahChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DistribusiSisaCutiChart filters={filters} />
      <TrendTahunanCutiChart filters={filters} />
    </div>
  )
}
