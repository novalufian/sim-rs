"use client";
import React from "react";
import { useRataRataUsiaPernikahan } from "@/hooks/fetch/kawin/useKawinState";

export default function RataRataUsiaPernikahan() {
    const { data, isLoading, isError, error } = useRataRataUsiaPernikahan();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Rata-Rata Usia Pernikahan</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Rata-Rata Usia Pernikahan</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Rata-Rata Usia Pernikahan</h2>

            {statistik && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tahun</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{statistik.tahun}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Data: {statistik.total_data}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Rata-Rata Usia</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistik.rata_rata_usia} tahun</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Usia Minimum</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistik.min_usia} tahun</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Usia Maksimum</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistik.max_usia} tahun</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pria</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                Rata-rata: {statistik.pria.rata_rata} tahun
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Jumlah: {statistik.pria.jumlah}</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Wanita</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                Rata-rata: {statistik.wanita.rata_rata} tahun
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Jumlah: {statistik.wanita.jumlah}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

