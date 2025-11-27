"use client";
import React from "react";
import { PensiunStateWithRelations } from "@/hooks/fetch/pensiun/usePensiunState";

interface PensiunStateDetailProps {
    state: PensiunStateWithRelations | null;
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

export default function PensiunStateDetail({ state }: PensiunStateDetailProps) {
    if (!state) {
        return (
            <div className="p-4 text-center text-gray-500">
                Pilih state pensiun untuk melihat detail
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
                        <p className="text-gray-900 dark:text-white font-medium">{state.pegawai_nama || '-'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            NIP
                        </label>
                        <p className="text-gray-900 dark:text-white">{state.pegawai_nip || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Section: Detail State Pensiun */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Detail State Pensiun
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Status
                        </label>
                        <div>{renderStatusBadge(state.status)}</div>
                    </div>

                    {state.tanggal_efektif && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tanggal Efektif
                            </label>
                            <p className="text-gray-900 dark:text-white">{formatDate(state.tanggal_efektif)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Catatan */}
            {state.catatan && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Catatan
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                        {state.catatan}
                    </p>
                </div>
            )}
        </div>
    );
}

