"use client";
import React from "react";
import { useRataRataDurasiPernikahan } from "@/hooks/fetch/kawin/useKawinState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function RataRataDurasiPernikahanCard() {
    const { data, isLoading, isError } = useRataRataDurasiPernikahan();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Rata-Rata Durasi Pernikahan" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Rata-Rata Durasi Pernikahan</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{statistik.rata_rata_tahun} tahun</p>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mt-1">{statistik.rata_rata_hari} hari</p>
            <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Min: {statistik.min_hari} hari</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Max: {statistik.max_hari} hari</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tahun: {statistik.tahun}</p>
        </div>
    );
}

