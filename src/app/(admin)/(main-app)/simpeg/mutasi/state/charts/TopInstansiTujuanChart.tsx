"use client";
import React from "react";
import { useTopInstansiTujuan } from "@/hooks/fetch/mutasi/useMutasiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function TopInstansiTujuanChart() {
    const { data, isLoading, isError } = useTopInstansiTujuan();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Top Instansi Tujuan" />
            </div>
        );
    }

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    // Limit to top 10 and sort by jumlah_permohonan descending
    const top10 = [...statistik.top_instansi]
        .sort((a, b) => b.jumlah_permohonan - a.jumlah_permohonan)
        .slice(0, 10);

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Leaderboard</h2>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Top Instansi Tujuan</h2>
            
            <div className="flex-1 overflow-y-auto min-h-0">
                <ol className="space-y-2 px-1">
                    {top10.length === 0 && (
                        <li className="text-center text-gray-400 dark:text-gray-500 py-4">
                            Tidak ada data
                        </li>
                    )}
                    {top10.map((item, idx) => (
                        <li
                            key={item.instansi_tujuan + idx}
                            className={
                                "flex items-center px-4 py-3 rounded-xl border transition-all " +
                                (idx === 0
                                    ? "bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent border-yellow-300 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-transparent dark:border-yellow-700 shadow-sm"
                                    : idx === 1
                                    ? "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent border-gray-300 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-transparent dark:border-gray-600 shadow-sm"
                                    : idx === 2
                                    ? "bg-gradient-to-r from-orange-100 via-orange-50 to-transparent border-orange-200 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-transparent dark:border-orange-700 shadow-sm"
                                    : "bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50")
                            }
                        >
                            {/* Peringkat */}
                            <div className="flex-shrink-0 w-10 text-center text-xl font-extrabold text-gray-600 dark:text-gray-300">
                                {idx === 0 && <span className="text-2xl">🥇</span>}
                                {idx === 1 && <span className="text-2xl">🥈</span>}
                                {idx === 2 && <span className="text-2xl">🥉</span>}
                                {idx > 2 && <span className="text-base font-bold">{idx + 1}</span>}
                            </div>
                            
                            {/* Nama Instansi */}
                            <div className="flex-1 ml-3 min-w-0 pr-3">
                                <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                    {item.instansi_tujuan}
                                </div>
                            </div>
                            
                            {/* Jumlah Permohonan */}
                            <div className="flex-shrink-0 text-right">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {item.jumlah_permohonan}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    permohonan
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
            
            <div className="mt-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <p className="text-xs text-gray-400 dark:text-gray-500">Tahun: {statistik.tahun}</p>
            </div>
        </div>
    );
}
