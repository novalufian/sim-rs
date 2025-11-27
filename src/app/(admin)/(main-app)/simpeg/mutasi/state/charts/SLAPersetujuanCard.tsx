"use client";
import React from "react";
import { useSLAPersetujuan } from "@/hooks/fetch/mutasi/useMutasiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function SLAPersetujuanCard() {
    const { data, isLoading, isError } = useSLAPersetujuan();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="SLA Persetujuan" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">SLA Persetujuan</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{statistik.rata_rata_hari} hari</p>
            <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Min: {statistik.min_hari} hari</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max: {statistik.max_hari} hari</p>
                    </div>
                </div>
                {statistik.per_level && statistik.per_level.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Per Level:</p>
                        {statistik.per_level.map((item, index) => (
                            <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                                Level {item.level}: {item.rata_rata_hari} hari ({item.jumlah} data)
                            </p>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tahun: {statistik.tahun}</p>
        </div>
    );
}

