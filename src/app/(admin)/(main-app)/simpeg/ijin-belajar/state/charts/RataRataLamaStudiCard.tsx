"use client";
import React from "react";
import { useRataRataLamaStudi } from "@/hooks/fetch/belajar/useBelajarState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function RataRataLamaStudiCard() {
    const { data, isLoading, isError } = useRataRataLamaStudi();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Rata-Rata Lama Studi" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Rata-Rata Lama Studi</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{statistik.rata_rata_keseluruhan} bulan</p>
            <div className="mt-4 space-y-2">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tugas Belajar: {statistik.rata_rata_tugas_belajar} bulan</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Izin Belajar: {statistik.rata_rata_izin_belajar} bulan</p>
                </div>
                <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Per Jenjang:</p>
                    {statistik.per_jenjang.map((item, index) => (
                        <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                            {item.jenjang_pendidikan}: {item.rata_rata_bulan} bulan ({item.jumlah_data} data)
                        </p>
                    ))}
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tahun: {statistik.tahun}</p>
        </div>
    );
}

