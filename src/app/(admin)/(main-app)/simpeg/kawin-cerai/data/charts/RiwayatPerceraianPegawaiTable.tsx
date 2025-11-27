"use client";
import React, { useState } from "react";
import { useRiwayatPerceraianPegawai, StatistikPegawaiFilter } from "@/hooks/fetch/kawin/useKawinState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function RiwayatPerceraianPegawaiTable() {
    const [filters, setFilters] = useState<StatistikPegawaiFilter>({});
    const [searchFilters, setSearchFilters] = useState<StatistikPegawaiFilter>({});
    const { data, isLoading, isError } = useRiwayatPerceraianPegawai(searchFilters, !!searchFilters.id_pegawai || !!searchFilters.nip);

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
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Riwayat Perceraian Pegawai" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    const riwayat = data?.data || [];

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">Tabel</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Riwayat Perceraian Pegawai</h2>
            
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={filters.id_pegawai || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, id_pegawai: e.target.value }))}
                    placeholder="ID Pegawai"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                    type="text"
                    value={filters.nip || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, nip: e.target.value }))}
                    placeholder="NIP"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Cari
                </button>
            </div>

            {riwayat.length > 0 ? (
                <div className="overflow-x-auto flex-1">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">NIP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tanggal Cerai</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Alasan</th>
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
            ) : (searchFilters.id_pegawai || searchFilters.nip) ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Tidak ada data
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Masukkan ID Pegawai atau NIP untuk mencari
                </div>
            )}
        </div>
    );
}

