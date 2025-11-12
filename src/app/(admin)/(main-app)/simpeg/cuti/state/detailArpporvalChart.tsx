"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStatistikDetailApprover, StatistikFilters } from "@/hooks/fetch/cuti/useCutiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

interface DetailApproverStackedBarChartProps {
  filters?: StatistikFilters;
}

export function DetailApproverStackedBarChart({ filters = {} }: DetailApproverStackedBarChartProps) {
  const { data, isLoading, isError } = useStatistikDetailApprover(filters);
  // ApiListResponse structure: data.data.items
  const dataset = (data?.data as any)?.items || data?.data || [];

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const labels = dataset.map((item: { role: string }) => item.role);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Disetujui",
        data: dataset.map((item: { disetujui: number }) => item.disetujui),
        backgroundColor: "rgba(34,197,94,0.4)", // hijau
        borderRadius: 12,
        barPercentage: 1,
      },
      {
        label: "Ditolak",
        data: dataset.map((item: { ditolak: number }) => item.ditolak),
        backgroundColor: "rgba(239,68,68,0.4)", // merah
        borderRadius: 12,
        barPercentage: 1,
      },
      {
        label: "Direvisi",
        data: dataset.map((item: { direvisi: number }) => item.direvisi),
        backgroundColor: "rgba(245,158,11,0.4)", // kuning
        borderRadius: 12,
        barPercentage: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: isDark ? "#d1d5db" : "#374151",
          font: { size: 12, weight: "600" },
        },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          stepSize: 10,
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "#d1d5db" : "#374151",
          boxWidth: 14,
          padding: 14,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#1f2937",
        titleColor: isDark ? "#f3f4f6" : "#fff",
        bodyColor: isDark ? "#e5e7eb" : "#f3f4f6",
        borderColor: "#2563eb",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <div className="rounded-4xl bg-white dark:bg-white/[0.03] border dark:border-gray-800 box-border p-5 min-h-[420px] h-full flex flex-col items-center justify-start">
      <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">
        Grafik
      </h2>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Perbandingan Persetujuan per Role
      </h2>

      {isLoading ? (
        <div className="w-full h-[350px] flex items-center justify-center">
          <SpinerLoading title="Detail Approver" />
        </div>
      ) : isError ? (
        <div className="w-full h-[350px] flex flex-col justify-center items-center text-gray-400 dark:text-gray-500">
          <BsCloudSlash className="w-10 h-10" />
          <p>Server bermasalah</p>
        </div>
      ) : dataset.length === 0 ? (
        <div className="w-full h-[350px] flex items-center justify-center text-gray-400 dark:text-gray-500">
          Tidak ada data
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-[350px] w-full">
            <Bar data={chartData} options={options as any} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Menunjukkan <span className="font-semibold">jumlah disetujui, ditolak, dan direvisi</span> berdasarkan masing-masing{" "}
            <span className="font-semibold">role approver</span>.
          </p>
        </>
      )}
    </div>
  );
}

export default DetailApproverStackedBarChart;
