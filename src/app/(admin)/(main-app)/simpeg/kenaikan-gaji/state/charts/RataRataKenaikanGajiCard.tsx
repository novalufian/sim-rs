"use client";
import React from "react";
import { useRataRataKenaikanGaji } from "@/hooks/fetch/gaji/useGajiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const formatPercentage = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num.toFixed(2)}%`;
};

export default function RataRataKenaikanGajiCard() {
    const { data, isLoading, isError } = useRataRataKenaikanGaji();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Rata-Rata Kenaikan Gaji" />
            </div>
        );
    }

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col">
            <p className="text-sm text-gray-500 dark:text-gray-400">Rata-Rata Kenaikan Gaji</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{formatRupiah(statistik.rata_rata_selisih_gaji)}</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">{formatPercentage(statistik.rata_rata_persentase_kenaikan)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min: {formatRupiah(statistik.min_kenaikan)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max: {formatRupiah(statistik.max_kenaikan)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total KGB: {statistik.total_kgb}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tahun: {statistik.tahun}</p>
                </div>
            </div>
        </div>
    );
}

