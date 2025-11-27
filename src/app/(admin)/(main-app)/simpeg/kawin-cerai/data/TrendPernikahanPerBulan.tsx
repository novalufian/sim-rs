"use client";
import React, { useState } from "react";
import { useTrendPernikahanPerBulan, StatistikBulanFilter } from "@/hooks/fetch/kawin/useKawinState";

export default function TrendPernikahanPerBulan() {
    const [filters, setFilters] = useState<StatistikBulanFilter>({});
    const { data, isLoading, isError, error } = useTrendPernikahanPerBulan(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trend Pernikahan Per Bulan</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trend Pernikahan Per Bulan</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trend Pernikahan Per Bulan</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun</label>
                <input
                    type="number"
                    name="tahun"
                    value={filters.tahun || ''}
                    onChange={handleFilterChange}
                    placeholder="Masukkan tahun"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {statistik && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tahun</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{statistik.tahun}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Bulan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama Bulan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {statistik.trend_bulanan.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.bulan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama_bulan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jumlah}</td>
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

