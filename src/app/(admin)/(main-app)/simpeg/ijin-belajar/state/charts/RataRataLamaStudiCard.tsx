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
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Rata-Rata Lama Studi" />
            </div>
        );
    }

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    // Sort per jenjang by rata_rata_bulan (convert to number for sorting)
    const sortedJenjang = [...statistik.per_jenjang].sort((a, b) => {
        const aValue = parseFloat(a.rata_rata_bulan) || 0;
        const bValue = parseFloat(b.rata_rata_bulan) || 0;
        return bValue - aValue; // Descending order
    });

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-6 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">Leaderboard</h2>
            <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">Rata-Rata Lama Studi</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Keseluruhan</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{statistik.rata_rata_keseluruhan} bln</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tugas Belajar</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{statistik.rata_rata_tugas_belajar} bln</p>
                </div>
            </div>
            <div className="mb-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Izin Belajar</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{statistik.rata_rata_izin_belajar} bln</p>
                </div>
            </div>

            {/* Leaderboard Per Jenjang */}
            <div className="flex-1 overflow-y-auto">
                <p className="text-lg text-center font-semibold text-gray-600 dark:text-gray-300 my-5">Per Jenjang:</p>
                <ol className="space-y-2 px-1">
                    {sortedJenjang.length === 0 && (
                        <li className="text-center text-gray-400 dark:text-gray-500 py-4">
                            Tidak ada data
                        </li>
                    )}
                    {sortedJenjang.map((item, idx) => {
                        const rataRata = parseFloat(item.rata_rata_bulan) || 0;
                        return (
                            <li
                                key={idx}
                                className={
                                    "flex items-center px-3 py-2 rounded-xl border " +
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
                                <div className="flex-shrink-0 w-6 text-center text-lg font-extrabold text-gray-600 dark:text-gray-300">
                                    {idx === 0 && <span>🥇</span>}
                                    {idx === 1 && <span>🥈</span>}
                                    {idx === 2 && <span>🥉</span>}
                                    {idx > 2 && <span className="text-sm">{idx + 1}</span>}
                                </div>
                                
                                {/* Nama Jenjang */}
                                <div className="flex-1 ml-2 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {item.jenjang_pendidikan}
                                    </div>
                                </div>
                                
                                {/* Rata-Rata Bulan */}
                                <div className="flex-shrink-0 ml-3 text-right">
                                    <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                                        {item.rata_rata_bulan}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        bulan
                                    </div>
                                </div>
                                
                                {/* Jumlah Data */}
                                <div className="flex-shrink-0 ml-2 text-right">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        ({item.jumlah_data} data)
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
            
            <div className="mt-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500">Tahun: {statistik.tahun}</p>
            </div>
        </div>
    );
}
