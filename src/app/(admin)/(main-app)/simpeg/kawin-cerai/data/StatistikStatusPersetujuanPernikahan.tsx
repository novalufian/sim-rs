"use client";
import React from "react";
import { useStatistikStatusPersetujuanPernikahan } from "@/hooks/fetch/kawin/useKawinState";

export default function StatistikStatusPersetujuanPernikahan() {
    const { data, isLoading, isError, error } = useStatistikStatusPersetujuanPernikahan();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Status Persetujuan Pernikahan</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Status Persetujuan Pernikahan</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Status Persetujuan Pernikahan</h2>

            {statistik && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statistik.map((item, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                {item.status.replace(/_/g, ' ')}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{item.jumlah}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.persentase}%</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

