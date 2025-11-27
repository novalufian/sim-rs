"use client";
import React from "react";
import { PermohonanBelajarWithRelations } from "@/hooks/fetch/belajar/useBelajarPermohonan";

interface SelectedBelajarProps {
    belajar: PermohonanBelajarWithRelations | null;
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

export default function SelectedBelajar({ belajar }: SelectedBelajarProps) {
    if (!belajar) {
        return (
            <div className="p-4 text-center text-gray-500">
                Pilih permohonan ijin belajar untuk melihat detail
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
                        <p className="text-gray-900 dark:text-white font-medium">{belajar.pegawai_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            NIP
                        </label>
                        <p className="text-gray-900 dark:text-white">{belajar.pegawai_nip || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Section: Detail Ijin Belajar */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Detail Ijin Belajar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Institusi Pendidikan
                        </label>
                        <p className="text-gray-900 dark:text-white">{belajar.institusi_pendidikan_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Program Studi
                        </label>
                        <p className="text-gray-900 dark:text-white">{belajar.program_studi_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Jenjang
                        </label>
                        <p className="text-gray-900 dark:text-white">{belajar.program_studi_jenjang || '-'}</p>
                    </div>

                    {belajar.program_studi_bidang && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Bidang
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.program_studi_bidang}</p>
                        </div>
                    )}

                    {belajar.gelar_yang_diperoleh && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Gelar yang Diperoleh
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.gelar_yang_diperoleh}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Status
                        </label>
                        <div>{renderStatusBadge(belajar.status)}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Tanggal Pengajuan
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(belajar.tanggal_pengajuan)}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Tanggal Mulai Belajar
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(belajar.tanggal_mulai_belajar)}</p>
                    </div>

                    {belajar.tanggal_selesai_belajar && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal Selesai Belajar
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(belajar.tanggal_selesai_belajar)}</p>
                        </div>
                    )}

                    {belajar.lama_studi_bulan && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Lama Studi
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.lama_studi_bulan} bulan</p>
                        </div>
                    )}

                    {belajar.biaya_ditanggung && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Biaya Ditanggung
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.biaya_ditanggung}</p>
                        </div>
                    )}

                    {belajar.status_pegawai_selama_belajar && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Status Pegawai Selama Belajar
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.status_pegawai_selama_belajar}</p>
                        </div>
                    )}

                    {belajar.institusi_pendidikan_kota && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kota
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.institusi_pendidikan_kota}</p>
                        </div>
                    )}

                    {belajar.institusi_pendidikan_negara && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Negara
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.institusi_pendidikan_negara}</p>
                        </div>
                    )}

                    {belajar.no_sk_belajar && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                No. SK Belajar
                            </label>
                            <p className="text-gray-900 dark:text-white">{belajar.no_sk_belajar}</p>
                        </div>
                    )}

                    {belajar.tanggal_sk_belajar && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal SK Belajar
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(belajar.tanggal_sk_belajar)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Kewajiban Setelah Belajar */}
            {belajar.kewajiban_setelah_belajar && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Kewajiban Setelah Belajar
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {belajar.kewajiban_setelah_belajar}
                    </p>
                </div>
            )}

            {/* Section: Catatan Kepegawaian */}
            {belajar.catatan_kepegawaian && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Catatan Kepegawaian
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {belajar.catatan_kepegawaian}
                    </p>
                </div>
            )}

            {/* Section: Catatan Penolakan */}
            {belajar.catatan_penolakan && (
                <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">
                        Catatan Penolakan
                    </h3>
                    <p className="text-red-700 dark:text-red-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {belajar.catatan_penolakan}
                    </p>
                </div>
            )}
        </div>
    );
}


