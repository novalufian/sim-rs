"use client";
import React from "react";
import { useRataRataUsiaPernikahan } from "@/hooks/fetch/kawin/useKawinState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function RataRataUsiaPernikahanCard() {
    const { data, isLoading, isError } = useRataRataUsiaPernikahan();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Rata-Rata Usia Pernikahan" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Rata-Rata Usia Pernikahan</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{statistik.rata_rata_usia} tahun</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min: {statistik.min_usia} tahun</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max: {statistik.max_usia} tahun</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pria: {statistik.pria.rata_rata} tahun ({statistik.pria.jumlah})</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Wanita: {statistik.wanita.rata_rata} tahun ({statistik.wanita.jumlah})</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tahun: {statistik.tahun}</p>
        </div>
    );
}

