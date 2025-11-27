"use client";
import React, { useState } from "react";
import { useRiwayatPengajuan, StatistikPegawaiFilter } from "@/hooks/fetch/belajar/useBelajarState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function RiwayatPengajuanTable() {
    const [filters, setFilters] = useState<StatistikPegawaiFilter>({});
    const [searchFilters, setSearchFilters] = useState<StatistikPegawaiFilter>({ page: 1, limit: 10 });
    const { data, isLoading, isError } = useRiwayatPengajuan(searchFilters, true);

    const handleSearch = () => {
        setSearchFilters({ ...filters, page: 1, limit: 10 });
    };

    const handlePageChange = (page: number) => {
        setSearchFilters(prev => ({ ...prev, page }));
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
                <SpinerLoading title="Riwayat Pengajuan" />
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

    const riwayat = data?.data || { data: [], total: 0, page: 1, limit: 10, total_pages: 0 };

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">Tabel</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Riwayat Pengajuan</h2>
            
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

            {riwayat.data.length > 0 ? (
                <>
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Total: {riwayat.total} | Halaman {riwayat.page} dari {riwayat.total_pages}
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">NIP</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jenis</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Program Studi</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Institusi</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tanggal Pengajuan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {riwayat.data.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nip}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jenis_permohonan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.program_studi}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.institusi_pendidikan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(item.tanggal_pengajuan)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {riwayat.total_pages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(riwayat.page - 1)}
                                disabled={riwayat.page === 1}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sebelumnya
                            </button>
                            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                {riwayat.page} / {riwayat.total_pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(riwayat.page + 1)}
                                disabled={riwayat.page >= riwayat.total_pages}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </>
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

