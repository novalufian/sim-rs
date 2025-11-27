"use client";
import React from "react";
import { PermohonanMutasiWithRelations } from "@/hooks/fetch/mutasi/useMutasiPermohonan";

interface SelectedMutasiProps {
    mutasi: PermohonanMutasiWithRelations | null;
}

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

const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let colorClass = "text-gray-700 bg-gray-100";

    switch (s) {
        case "DIAJUKAN":
        case "MENUNGGU":
            colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
            break;
        case "DISETUJUI":
        case "DISETUJUI_AKHIR":
        case "SELESAI":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
            break;
        case "DITOLAK":
        case "DIBATALKAN":
            colorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
            break;
        case "DIREVISI":
            colorClass = "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900";
            break;
        case "VALIDASI":
        case "PROSES":
            colorClass = "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900";
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

export default function SelectedMutasi({ mutasi }: SelectedMutasiProps) {
    if (!mutasi) {
        return (
            <div className="p-4 text-center text-gray-500">
                Pilih permohonan mutasi untuk melihat detail
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 w-[600px]">
            {/* Section: Informasi Pegawai */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Informasi Pegawai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Nama Pegawai
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">{mutasi.pegawai_nama || mutasi.nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            NIP
                        </label>
                        <p className="text-gray-900 dark:text-white">{mutasi.pegawai_nip || mutasi.nip || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Section: Detail Mutasi */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Detail Mutasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Jenis Mutasi
                        </label>
                        <p className="text-gray-900 dark:text-white">{mutasi.jenis_mutasi || '-'}</p>
                    </div>

                    {mutasi.instansi_tujuan && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Instansi Tujuan
                            </label>
                            <p className="text-gray-900 dark:text-white">{mutasi.instansi_tujuan}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Status
                        </label>
                        <div>{renderStatusBadge(mutasi.status)}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Tanggal Pengajuan
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(mutasi.tanggal_pengajuan)}</p>
                    </div>

                    {mutasi.tanggal_approval && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal Approval
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(mutasi.tanggal_approval)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Alasan Mutasi */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Alasan Mutasi
                </h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                    {mutasi.alasan_mutasi || '-'}
                </p>
            </div>

            {/* Section: Catatan Kepegawaian */}
            {mutasi.catatan_kepegawaian && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Catatan Kepegawaian
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {mutasi.catatan_kepegawaian}
                    </p>
                </div>
            )}

            {/* Section: Catatan Penolakan */}
            {mutasi.catatan_penolakan && (
                <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">
                        Catatan Penolakan
                    </h3>
                    <p className="text-red-700 dark:text-red-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {mutasi.catatan_penolakan}
                    </p>
                </div>
            )}
        </div>
    );
}

