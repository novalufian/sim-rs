"use client";
import React from "react";
import { useTotalPengeluaranGaji } from "@/hooks/fetch/gaji/useGajiState";
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

export default function TotalPengeluaranGajiCard() {
    const { data, isLoading, isError } = useTotalPengeluaranGaji();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Total Pengeluaran Gaji" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran Gaji</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{formatRupiah(statistik.total_gaji_pokok_tahunan)}</p>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mt-1">Per bulan: {formatRupiah(statistik.total_gaji_pokok_bulanan)}</p>
            <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata per pegawai: {formatRupiah(statistik.rata_rata_gaji_per_pegawai)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total KGB: {statistik.total_kgb}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tahun: {statistik.tahun}</p>
            </div>
        </div>
    );
}

