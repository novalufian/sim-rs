"use client";
import React from "react";
import { useStatistikDisetujuiVsPending } from "@/hooks/fetch/gaji/useGajiState";
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

export default function StatistikDisetujuiVsPendingCard() {
    const { data, isLoading, isError } = useStatistikDisetujuiVsPending();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[200px] flex flex-col items-center justify-center">
                <SpinerLoading title="Statistik Disetujui Vs Pending" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{statistik.approval_rate}%</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Disetujui</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{statistik.disetujui.jumlah}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{statistik.disetujui.persentase}%</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{statistik.pending.jumlah}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{statistik.pending.persentase}%</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ditolak</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{statistik.ditolak.jumlah}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{statistik.ditolak.persentase}%</p>
                </div>
            </div>
            {statistik.disetujui.total_biaya_tahunan && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Total Biaya: {formatRupiah(statistik.disetujui.total_biaya_tahunan)}
                </p>
            )}
        </div>
    );
}

