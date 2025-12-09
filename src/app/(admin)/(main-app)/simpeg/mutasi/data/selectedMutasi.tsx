"use client";
import React from "react";
import { PermohonanMutasiWithRelations } from "@/hooks/fetch/mutasi/useMutasiPermohonan";
import { usePersetujuanMutasiByPermohonan, PersetujuanMutasiWithApprover } from "@/hooks/fetch/mutasi/useMutasiPersetujuan";
import { FiCheckCircle, FiXCircle, FiMinusCircle, FiClock, FiFileText, FiUser } from "react-icons/fi";

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
            colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
            break;
        case "DISETUJUI_KA_UNIT":
        case "DISETUJUI_KA_BIDANG":
        case "VALIDASI_KEPEGAWAIAN":
            colorClass = "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900";
            break;
        case "DISETUJUI_AKHIR":
        case "SELESAI":
        case "DISETUJUI":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
            break;
        case "DITOLAK":
        case "DIBATALKAN":
            colorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
            break;
        case "DIREVISI":
            colorClass = "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900";
            break;
        case "MENUNGGU":
            colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
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

// Helper untuk ikon status persetujuan
const renderApprovalStatusIcon = (status: string) => {
    const s = status.toUpperCase();
    let Icon = FiMinusCircle;
    let color = "text-gray-400";

    switch (s) {
        case "DISETUJUI":
        case "DISETUJUI_AKHIR":
            Icon = FiCheckCircle;
            color = "text-green-500";
            break;
        case "DITOLAK":
            Icon = FiXCircle;
            color = "text-red-500";
            break;
        case "MENUNGGU":
        case "DIAJUKAN":
            Icon = FiClock;
            color = "text-blue-500";
            break;
        case "DIREVISI":
            Icon = FiFileText;
            color = "text-orange-500";
            break;
    }

    return <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />;
};

export default function SelectedMutasi({ mutasi }: SelectedMutasiProps) {
    // Fetch persetujuan mutasi untuk permohonan ini
    const { data: persetujuanData, isLoading: isLoadingPersetujuan } = usePersetujuanMutasiByPermohonan(
        mutasi?.id || '',
        !!mutasi?.id
    );

    // Handle response structure: bisa berupa array langsung atau object dengan property data
    const persetujuanList: PersetujuanMutasiWithApprover[] = Array.isArray(persetujuanData) 
        ? persetujuanData 
        : ((persetujuanData as any)?.data || []);

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

            {/* Section: Riwayat Persetujuan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Riwayat Persetujuan ({persetujuanList.length})
                </h3>
                {isLoadingPersetujuan ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat riwayat persetujuan...</p>
                    </div>
                ) : persetujuanList.length > 0 ? (
                    <div className="space-y-4">
                        {persetujuanList
                            .sort((a, b) => (a.urutan_persetujuan || 0) - (b.urutan_persetujuan || 0))
                            .map((step, index) => (
                                <div key={step.id || index} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 py-2">
                                    <div className="flex items-start space-x-2">
                                        {renderApprovalStatusIcon(step.status_persetujuan)}
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                Langkah {step.urutan_persetujuan}: {step.role_approver}
                                            </p>
                                            <div className="mt-2 text-xs space-y-1">
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Approver:</span> {step.approver_nama || 'N/A'}
                                                    {step.approver_nip && (
                                                        <span className="text-gray-500 dark:text-gray-500 ml-1">({step.approver_nip})</span>
                                                    )}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Status:</span> {renderStatusBadge(step.status_persetujuan)}
                                                </p>
                                                {step.tanggal_persetujuan && (
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Tanggal:</span> {formatDate(step.tanggal_persetujuan)}
                                                    </p>
                                                )}
                                                {step.catatan_persetujuan && (
                                                    <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan:</p>
                                                        <p className="text-xs italic text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                            {step.catatan_persetujuan}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Belum ada langkah persetujuan yang tercatat.</p>
                )}
            </div>
        </div>
    );
}

