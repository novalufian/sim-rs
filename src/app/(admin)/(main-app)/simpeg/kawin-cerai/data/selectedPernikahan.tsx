"use client";
import React from "react";
import { RiwayatPernikahanWithRelations } from "@/hooks/fetch/kawin/useKawinPermohonan";

interface SelectedPernikahanProps {
    pernikahan: RiwayatPernikahanWithRelations | null;
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

const renderStatusBadge = (status: string | null | undefined) => {
    if (!status) {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700">
                -
            </span>
        );
    }
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
        case "KAWIN":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
            break;
        case "DITOLAK":
        case "DIBATALKAN":
        case "CERAI_MATI":
        case "CERAI_HIDUP":
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

export default function SelectedPernikahan({ pernikahan }: SelectedPernikahanProps) {
    if (!pernikahan) {
        return (
            <div className="p-4 text-center text-gray-500">
                Pilih riwayat pernikahan untuk melihat detail
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
                        <p className="text-gray-900 dark:text-white font-medium">{pernikahan.pegawai_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            NIP
                        </label>
                        <p className="text-gray-900 dark:text-white">{pernikahan.pegawai_nip || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Section: Detail Pernikahan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Detail Pernikahan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Status Saat Ini
                        </label>
                        <div>{renderStatusBadge(pernikahan.status_saat_ini)}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Nama Pasangan
                        </label>
                        <p className="text-gray-900 dark:text-white">{pernikahan.pasangan_nama || '-'}</p>
                    </div>

                    {pernikahan.pasangan_jenis_kelamin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Jenis Kelamin Pasangan
                            </label>
                            <p className="text-gray-900 dark:text-white">{pernikahan.pasangan_jenis_kelamin}</p>
                        </div>
                    )}

                    {pernikahan.pasangan_tanggal_lahir && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal Lahir Pasangan
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(pernikahan.pasangan_tanggal_lahir)}</p>
                        </div>
                    )}

                    {pernikahan.pasangan_tempat_lahir && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tempat Lahir Pasangan
                            </label>
                            <p className="text-gray-900 dark:text-white">{pernikahan.pasangan_tempat_lahir}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Tanggal Menikah
                        </label>
                        <p className="text-gray-900 dark:text-white">{formatDate(pernikahan.pernikahan_tanggal)}</p>
                    </div>

                    {pernikahan.pernikahan_tempat && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tempat Menikah
                            </label>
                            <p className="text-gray-900 dark:text-white">{pernikahan.pernikahan_tempat}</p>
                        </div>
                    )}

                    {pernikahan.pernikahan_no_akta && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                No Akta Nikah
                            </label>
                            <p className="text-gray-900 dark:text-white">{pernikahan.pernikahan_no_akta}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Catatan */}
            {pernikahan.catatan && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Catatan
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {pernikahan.catatan}
                    </p>
                </div>
            )}
        </div>
    );
}

