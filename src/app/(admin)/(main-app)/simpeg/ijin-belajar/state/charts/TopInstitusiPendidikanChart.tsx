"use client";
import React from "react";
import { useTopInstitusiPendidikan } from "@/hooks/fetch/belajar/useBelajarState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function TopInstitusiPendidikanChart() {
    const { data, isLoading, isError } = useTopInstitusiPendidikan();
    const statistik = data?.data;

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Top Institusi Pendidikan" />
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
    const top10 = [...statistik.top_institusi]
        .sort((a, b) => b.jumlah_permohonan - a.jumlah_permohonan)
        .slice(0, 10);

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Leaderboard</h2>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Top Institusi Pendidikan</h2>
            
            <div className="flex-1 overflow-y-auto">
                <ol className="space-y-2 px-1">
                    {top10.length === 0 && (
                        <li className="text-center text-gray-400 dark:text-gray-500 py-4">
                            Tidak ada data
                        </li>
                    )}
                    {top10.map((item, idx) => (
                        <li
                            key={item.institusi_id + idx}
                            className={
                                "flex items-center px-4 py-3 rounded-xl border " +
                                (idx === 0
                                    ? "bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent border-yellow-300 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-transparent dark:border-yellow-700"
                                    : idx === 1
                                    ? "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent border-gray-300 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-transparent dark:border-gray-600"
                                    : idx === 2
                                    ? "bg-gradient-to-r from-orange-100 via-orange-50 to-transparent border-orange-200 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-transparent dark:border-orange-700"
                                    : "bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700")
                            }
                        >
                            {/* Peringkat */}
                            <div className="flex-shrink-0 w-8 text-center text-xl font-extrabold text-gray-600 dark:text-gray-300">
                                {idx === 0 && <span>🥇</span>}
                                {idx === 1 && <span>🥈</span>}
                                {idx === 2 && <span>🥉</span>}
                                {idx > 2 && <span className="text-base">{idx + 1}</span>}
                            </div>
                            
                            {/* Nama Institusi dan Info */}
                            <div className="flex-1 ml-3 min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                    {item.nama_institusi}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.kota}, {item.negara}
                                </div>
                            </div>
                            
                            {/* Jumlah Permohonan */}
                            <div className="flex-shrink-0 ml-4 text-right">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {item.jumlah_permohonan}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    permohonan
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
            
            <div className="mt-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500">Tahun: {statistik.tahun}</p>
            </div>
        </div>
    );
}
