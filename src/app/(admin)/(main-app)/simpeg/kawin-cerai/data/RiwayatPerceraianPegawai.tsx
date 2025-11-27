"use client";
import React, { useState } from "react";
import { useRiwayatPerceraianPegawai, StatistikPegawaiFilter } from "@/hooks/fetch/kawin/useKawinState";

export default function RiwayatPerceraianPegawai() {
    const [filters, setFilters] = useState<StatistikPegawaiFilter>({});
    const [searchFilters, setSearchFilters] = useState<StatistikPegawaiFilter>({});
    const { data, isLoading, isError, error } = useRiwayatPerceraianPegawai(searchFilters, !!searchFilters.id_pegawai || !!searchFilters.nip);

    const handleSearch = () => {
        setSearchFilters(filters);
    };

    const formatDate = (date: string) => {
        if (!date) return "-";
        try {
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(new Date(date));
        } catch {
            return date;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Riwayat Perceraian Pegawai</h2>
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Riwayat Perceraian Pegawai</h2>
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    Error: {error?.message || 'Gagal memuat data'}
                </div>
            </div>
        );
    }

    const riwayat = data?.data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Riwayat Perceraian Pegawai</h2>

            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Pegawai</label>
                    <input
                        type="text"
                        value={filters.id_pegawai || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, id_pegawai: e.target.value }))}
                        placeholder="Masukkan ID Pegawai"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIP</label>
                    <input
                        type="text"
                        value={filters.nip || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, nip: e.target.value }))}
                        placeholder="Masukkan NIP"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cari
                    </button>
                </div>
            </div>

            {riwayat && riwayat.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama Pegawai</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">NIP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tanggal Cerai</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Alasan Perceraian</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {riwayat.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.pegawai_nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.pegawai_nip}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(item.tanggal_cerai)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.alasan_perceraian}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.status_saat_ini}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {riwayat && riwayat.length === 0 && (searchFilters.id_pegawai || searchFilters.nip) && (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data riwayat perceraian untuk pegawai yang dicari.
                </div>
            )}
        </div>
    );
}

