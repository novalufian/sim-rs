"use client";
import React, { useState } from "react";
import { useGetPensiunStateByPegawai, PensiunStateWithRelations } from "@/hooks/fetch/pensiun/usePensiunState";

interface PensiunStateByPegawaiProps {
    idPegawai?: string;
}

export default function PensiunStateByPegawai({ idPegawai }: PensiunStateByPegawaiProps) {
    const [pegawaiId, setPegawaiId] = useState(idPegawai || '');
    const [searchId, setSearchId] = useState(idPegawai || '');

    const { data, isLoading, isError, error } = useGetPensiunStateByPegawai(
        searchId,
        !!searchId
    );

    const handleSearch = () => {
        if (pegawaiId.trim()) {
            setSearchId(pegawaiId.trim());
        }
    };

    const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return "-";
        try {
            const d = date instanceof Date ? date : new Date(date);
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(d);
        } catch {
            return "Tanggal Invalid";
        }
    };

    const renderStatusBadge = (status: string | null | undefined) => {
        if (!status) return <span className="text-gray-500">-</span>;
        const s = status.toUpperCase();
        let colorClass = "text-gray-700 bg-gray-100";

        switch (s) {
            case "AKTIF":
                colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
                break;
            case "PENSIUN":
            case "PENSIUNAN":
                colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
                break;
            case "NON_AKTIF":
            case "NONAKTIF":
                colorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
                break;
            default:
                colorClass = "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700";
                break;
        }

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                {s.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">State Pensiun Berdasarkan Pegawai</h2>

            <div className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={pegawaiId}
                        onChange={(e) => setPegawaiId(e.target.value)}
                        placeholder="Masukkan ID Pegawai"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cari
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            )}

            {isError && (
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                    {error?.message || 'Gagal memuat data state pensiun'}
                </div>
            )}

            {data?.data && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Nama Pegawai
                            </label>
                            <p className="text-gray-900 dark:text-white font-medium">{data.data.pegawai_nama || '-'}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                NIP
                            </label>
                            <p className="text-gray-900 dark:text-white">{data.data.pegawai_nip || '-'}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Status
                            </label>
                            <div>{renderStatusBadge(data.data.status)}</div>
                        </div>

                        {data.data.tanggal_efektif && (
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Tanggal Efektif
                                </label>
                                <p className="text-gray-900 dark:text-white">{formatDate(data.data.tanggal_efektif)}</p>
                            </div>
                        )}

                        {data.data.catatan && (
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Catatan
                                </label>
                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                                    {data.data.catatan}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isLoading && !isError && !data?.data && searchId && (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data state pensiun untuk pegawai dengan ID: {searchId}
                </div>
            )}
        </div>
    );
}

