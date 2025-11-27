"use client";
import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { PermohonanGajiWithRelations } from "@/hooks/fetch/gaji/useGajiPermohonan";

interface SelectedGajiProps {
    gaji: PermohonanGajiWithRelations | null;
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

const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `${value.toFixed(2)}%`;
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

export default function SelectedGaji({ gaji }: SelectedGajiProps) {
    if (!gaji) {
        return (
            <div className="p-4 text-center text-gray-500">
                Pilih permohonan kenaikan gaji untuk melihat detail
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
                        <p className="text-gray-900 dark:text-white font-medium">{gaji.pegawai_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            NIP
                        </label>
                        <p className="text-gray-900 dark:text-white">{gaji.pegawai_nip || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Section: Detail Kenaikan Gaji */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Detail Kenaikan Gaji Berkala
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Status
                        </label>
                        <div>{renderStatusBadge(gaji.status)}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Tanggal Pengajuan
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(gaji.tanggal_pengajuan)}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Gaji Pokok Lama
                        </label>
                        <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(gaji.gaji_pokok_lama)}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Gaji Pokok Baru
                        </label>
                        <p className="text-green-600 dark:text-green-400 font-semibold">{formatCurrency(gaji.gaji_pokok_baru)}</p>
                    </div>

                    {gaji.selisih_gaji !== null && gaji.selisih_gaji !== undefined && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Selisih Gaji
                            </label>
                            <div className={`flex items-center gap-2 font-semibold ${gaji.selisih_gaji > 0 ? 'text-green-600 dark:text-green-400' : gaji.selisih_gaji < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {gaji.selisih_gaji > 0 ? (
                                    <FiTrendingUp className="h-5 w-5" />
                                ) : gaji.selisih_gaji < 0 ? (
                                    <FiTrendingDown className="h-5 w-5" />
                                ) : null}
                                <span>{formatCurrency(gaji.selisih_gaji)}</span>
                            </div>
                        </div>
                    )}

                    {gaji.persentase_kenaikan !== null && gaji.persentase_kenaikan !== undefined && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Persentase Kenaikan
                            </label>
                            <div className={`flex items-center gap-2 font-semibold ${gaji.persentase_kenaikan > 0 ? 'text-blue-600 dark:text-blue-400' : gaji.persentase_kenaikan < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {gaji.persentase_kenaikan > 0 ? (
                                    <FiTrendingUp className="h-5 w-5" />
                                ) : gaji.persentase_kenaikan < 0 ? (
                                    <FiTrendingDown className="h-5 w-5" />
                                ) : null}
                                <span>{formatPercentage(gaji.persentase_kenaikan)}</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            TMT KGB Lama
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(gaji.tmt_kgb_lama)}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            TMT KGB Baru
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(gaji.tmt_kgb_baru)}</p>
                    </div>

                    {gaji.masa_kerja_gol_lama && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Masa Kerja Golongan Lama
                            </label>
                            <p className="text-gray-900 dark:text-white">{gaji.masa_kerja_gol_lama}</p>
                        </div>
                    )}

                    {gaji.masa_kerja_gol_baru && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Masa Kerja Golongan Baru
                            </label>
                            <p className="text-gray-900 dark:text-white">{gaji.masa_kerja_gol_baru}</p>
                        </div>
                    )}

                    {gaji.no_sk_kgb && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                No. SK KGB
                            </label>
                            <p className="text-gray-900 dark:text-white">{gaji.no_sk_kgb}</p>
                        </div>
                    )}

                    {gaji.tanggal_sk_kgb && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal SK KGB
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(gaji.tanggal_sk_kgb)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Catatan Kepegawaian */}
            {gaji.catatan_kepegawaian && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Catatan Kepegawaian
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {gaji.catatan_kepegawaian}
                    </p>
                </div>
            )}

            {/* Section: Catatan Penolakan */}
            {gaji.catatan_penolakan && (
                <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">
                        Catatan Penolakan
                    </h3>
                    <p className="text-red-700 dark:text-red-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {gaji.catatan_penolakan}
                    </p>
                </div>
            )}
        </div>
    );
}

