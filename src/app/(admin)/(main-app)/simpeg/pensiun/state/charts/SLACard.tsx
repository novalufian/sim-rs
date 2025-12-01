"use client";
import React from "react";
import { useSLA } from "@/hooks/fetch/pensiun/usePensiunState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function SLACard() {
    const { data, isLoading, isError } = useSLA();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="SLA Pensiun" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">SLA Pensiun</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{statistik.rata_rata_waktu_hari} hari</p>
            <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tercepat: {statistik.tercepat_hari} hari</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Terlambat: {statistik.terlambat_hari} hari</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Proses: {statistik.total_proses}</p>
                    </div>
                </div>
                {statistik.waktu_per_level && statistik.waktu_per_level.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Per Level:</p>
                        {statistik.waktu_per_level.map((item, index) => (
                            <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                                Level {item.level}: {item.rata_rata_hari} hari ({item.jumlah} proses)
                            </p>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tahun: {statistik.tahun}</p>
        </div>
    );
}

