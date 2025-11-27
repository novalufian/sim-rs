"use client";
import React, { useState } from "react";
import { usePerbandinganPernikahanVsPerceraian, StatistikTahunFilter } from "@/hooks/fetch/kawin/useKawinState";

export default function PerbandinganPernikahanVsPerceraian() {
    const [filters, setFilters] = useState<StatistikTahunFilter>({});
    const { data, isLoading, isError, error } = usePerbandinganPernikahanVsPerceraian(filters);

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
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Perbandingan Pernikahan Vs Perceraian</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Perbandingan Pernikahan Vs Perceraian</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Perbandingan Pernikahan Vs Perceraian</h2>

            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Mulai</label>
                    <input
                        type="number"
                        name="startYear"
                        value={filters.startYear || ''}
                        onChange={handleFilterChange}
                        placeholder="Tahun mulai"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Selesai</label>
                    <input
                        type="number"
                        name="endYear"
                        value={filters.endYear || ''}
                        onChange={handleFilterChange}
                        placeholder="Tahun selesai"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {statistik && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tahun</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{statistik.tahun}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Pernikahan</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistik.total_pernikahan}</p>
                        </div>
                        <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Perceraian</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{statistik.total_perceraian}</p>
                        </div>
                        <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Rasio Perceraian</p>
                            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{statistik.rasio_perceraian}%</p>
                        </div>
                        <div className={`border rounded-lg p-4 ${
                            statistik.selisih >= 0
                                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                : 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Selisih</p>
                            <p className={`text-3xl font-bold ${
                                statistik.selisih >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {statistik.selisih >= 0 ? '+' : ''}{statistik.selisih}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

