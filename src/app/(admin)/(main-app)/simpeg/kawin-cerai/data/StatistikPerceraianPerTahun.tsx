"use client";
import React, { useState } from "react";
import { useStatistikPerceraianPerTahun, StatistikTahunFilter } from "@/hooks/fetch/kawin/useKawinState";

export default function StatistikPerceraianPerTahun() {
    const [filters, setFilters] = useState<StatistikTahunFilter>({});
    const { data, isLoading, isError, error } = useStatistikPerceraianPerTahun(filters);

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
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Perceraian Per Tahun</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Perceraian Per Tahun</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Perceraian Per Tahun</h2>

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
                        <p className="text-sm text-gray-600 dark:text-gray-400">Periode</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {statistik.periode.tahun_mulai} - {statistik.periode.tahun_selesai}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tahun</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Cerai Hidup</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Cerai Mati</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Putusan Pengadilan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Kematian</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Lain-lain</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {statistik.per_tahun.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.tahun}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.total}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.cerai_hidup}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.cerai_mati}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.putusan_pengadilan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.kematian}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.lain_lain}</td>
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

