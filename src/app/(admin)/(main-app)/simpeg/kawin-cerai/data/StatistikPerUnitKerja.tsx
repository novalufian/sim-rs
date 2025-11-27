"use client";
import React, { useState } from "react";
import { useStatistikPerUnitKerja, StatistikUnitKerjaFilter } from "@/hooks/fetch/kawin/useKawinState";

export default function StatistikPerUnitKerja() {
    const [filters, setFilters] = useState<StatistikUnitKerjaFilter>({});
    const { data, isLoading, isError, error } = useStatistikPerUnitKerja(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Per Unit Kerja</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Per Unit Kerja</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const statistik = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Statistik Per Unit Kerja</h2>

            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Kerja</label>
                    <input
                        type="text"
                        name="unit_kerja"
                        value={filters.unit_kerja || ''}
                        onChange={handleFilterChange}
                        placeholder="Cari unit kerja"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Unit Kerja</label>
                    <input
                        type="text"
                        name="id_unit_kerja"
                        value={filters.id_unit_kerja || ''}
                        onChange={handleFilterChange}
                        placeholder="Cari ID unit kerja"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {statistik && statistik.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Unit Kerja</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Total Pegawai</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jumlah Pernikahan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jumlah Perceraian</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">% Pernikahan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">% Perceraian</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {statistik.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.unit_kerja}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.total_pegawai}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jumlah_pernikahan}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jumlah_perceraian}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.persentase_pernikahan}%</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.persentase_perceraian}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {statistik && statistik.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data statistik untuk unit kerja yang dicari.
                </div>
            )}
        </div>
    );
}

