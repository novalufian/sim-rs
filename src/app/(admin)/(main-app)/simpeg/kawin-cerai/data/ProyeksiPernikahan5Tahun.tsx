"use client";
import React from "react";
import { useProyeksiPernikahan5Tahun } from "@/hooks/fetch/kawin/useKawinState";

export default function ProyeksiPernikahan5Tahun() {
    const { data, isLoading, isError, error } = useProyeksiPernikahan5Tahun();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Proyeksi Pernikahan 5 Tahun</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Proyeksi Pernikahan 5 Tahun</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Proyeksi Pernikahan 5 Tahun</h2>

            {statistik && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Rata-Rata Historis</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistik.rata_rata_historis}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tahun</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jumlah Pernikahan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tipe</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {statistik.proyeksi.map((item, index) => (
                                    <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${item.tipe === 'proyeksi' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.tahun}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jumlah_pernikahan}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.tipe === 'aktual'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                                {item.tipe === 'aktual' ? 'Aktual' : 'Proyeksi'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

