"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetPermohonanCutiDetail } from '@/hooks/fetch/cuti/useCutiPermohonan';
import { usePersetujuanCutiByPermohonan } from '@/hooks/fetch/cuti/useCutiPersetujuan';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import { downloadCutiDocument, CutiExportData } from '@/components/export/doc/cuti.export';
import { 
    FiUser, 
    FiCalendar, 
    FiFileText, 
    FiMapPin, 
    FiPhone, 
    FiClock, 
    FiInfo, 
    FiCheckCircle, 
    FiXCircle, 
    FiMinusCircle,
    FiArrowLeft,
    FiDownload
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Helper function untuk format tanggal
const formatDate = (dateStr?: Date | string | null): string => {
    if (!dateStr) return "-";
    try {
        const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(d);
    } catch {
        return "Tanggal Invalid";
    }
};

// Helper function untuk render status badge
const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let colorClass = "text-gray-700 bg-gray-100";
    let Icon = FiMinusCircle;

    switch (s) {
        case "DIAJUKAN":
        case "MENUNGGU":
            colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
            Icon = FiClock;
            break;
        case "DISETUJUI":
        case "DISETUJUI_AKHIR":
        case "SELESAI":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
            Icon = FiCheckCircle;
            break;
        case "DITOLAK":
        case "DIBATALKAN":
            colorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
            Icon = FiXCircle;
            break;
        case "DIREVISI":
            colorClass = "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900";
            Icon = FiFileText;
            break;
        default:
            colorClass = "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700";
            break;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            <Icon className="mr-1.5 h-4 w-4" />
            {s.replace(/_/g, ' ')}
        </span>
    );
};

// Helper function untuk render approval status icon
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

// Helper component untuk Detail Item
const DetailItem: React.FC<{ 
    icon: React.ReactElement<any>, 
    label: string, 
    fullWidth?: boolean, 
    children: React.ReactNode 
}> = ({ icon, label, fullWidth, children }) => (
    <div className={`flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {React.cloneElement(icon, { className: 'mr-2 h-4 w-4' })}
            {label}
        </div>
        <div className="text-base text-gray-900 dark:text-white">
            {children}
        </div>
    </div>
);

export default function PermohonanCutiDetailPage() {
    const params = useParams();
    const router = useRouter();
    const idCuti = params?.idCuti as string;
    const [isExporting, setIsExporting] = useState(false);

    // Fetch detail permohonan cuti
    const { data: permohonanData, isLoading: isLoadingPermohonan } = useGetPermohonanCutiDetail(
        idCuti,
        !!idCuti
    );

    const permohonan = permohonanData?.data;

    // Fetch data pegawai lengkap untuk export (jika diperlukan)
    // Hanya fetch jika id_pegawai tersedia
    const shouldFetchPegawai = !!permohonan?.id_pegawai;
    const { data: pegawaiData } = useGetPegawaiById(
        shouldFetchPegawai ? permohonan.id_pegawai : ''
    );

    const pegawai = shouldFetchPegawai && pegawaiData?.data ? pegawaiData.data : null;

    // Fetch persetujuan cuti untuk permohonan
    const { data: persetujuanData, isLoading: isLoadingPersetujuan } = usePersetujuanCutiByPermohonan(
        idCuti,
        !!idCuti
    );

    // Handle response structure: bisa berupa array langsung atau object dengan property data
    const persetujuanList = Array.isArray(persetujuanData) 
        ? persetujuanData 
        : ((persetujuanData as any)?.data || []);

    if (isLoadingPermohonan) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat data permohonan cuti...</p>
                </div>
            </div>
        );
    }

    if (!permohonan) {
        return (
            <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
                <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center py-8">
                        <p className="text-red-600 dark:text-red-400 mb-4">❌ Permohonan cuti tidak ditemukan</p>
                        <Link
                            href="/simpeg/cuti/permohonan"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiArrowLeft />
                            Kembali ke Form Permohonan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Sort persetujuan list by urutan
    const sortedPersetujuanList = [...persetujuanList].sort(
        (a, b) => (a.urutan_persetujuan || 0) - (b.urutan_persetujuan || 0)
    );

    // Handler untuk export dokumen cuti
    const handleExportCuti = async () => {
        if (!permohonan) {
            toast.error('Data permohonan cuti tidak tersedia');
            return;
        }

        setIsExporting(true);
        try {
            // Siapkan data export
            const exportData: CutiExportData = {
                cuti: permohonan,
                // Data pegawai dari API atau dari data yang sudah ada
                pangkat: (pegawai as any)?.pangkat_tmt || null,
                golongan: null, // Jika ada field golongan terpisah, bisa ditambahkan
                jabatan: (pegawai as any)?.jabatan || null,
                unit_ruangan: null, // Jika ada field unit_ruangan, bisa ditambahkan
                satuan_organisasi: 'RSUD dr. Abdul Rivai Kabupaten Berau',
                // Data surat
                nomor_surat: permohonan.nomor_surat_cuti || undefined,
                tanggal_surat: permohonan.tanggal_surat_cuti || new Date(),
                // Data penandatangan (default, bisa diubah sesuai kebutuhan)
                nama_penandatangan: 'Arif Rudi Hermawan, S.Si.,M.Si.,Apt',
                nip_penandatangan: '197310102003121014',
                jabatan_penandatangan: 'Plh. Direktur',
                pangkat_penandatangan: 'Pembina',
            };

            await downloadCutiDocument(exportData);
            toast.success('Dokumen cuti berhasil diunduh!');
        } catch (error) {
            console.error('Error exporting cuti document:', error);
            toast.error('Gagal mengunduh dokumen cuti');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
            <div className="w-11/12 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card Utama - Detail Permohonan (2 kolom) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    📋 Detail Permohonan Cuti
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Informasi lengkap permohonan cuti
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportCuti}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <FiDownload className={isExporting ? 'animate-spin' : ''} />
                                    {isExporting ? 'Mengunduh...' : 'Export Dokumen'}
                                </button>
                                <Link
                                    href="/simpeg/cuti/permohonan"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiArrowLeft />
                                    Kembali
                                </Link>
                            </div>
                        </div>

                        {/* Status Permohonan */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FiInfo className="text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Status Permohonan
                                    </h2>
                                </div>
                                {renderStatusBadge(permohonan.status)}
                            </div>
                        </div>

                        {/* Informasi Data Pribadi */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FiUser className="text-gray-600 dark:text-gray-400" />
                                Informasi Pemohon
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <FiUser className="text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {permohonan.nama || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiFileText className="text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">NIP</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {permohonan.nip || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Permohonan Cuti */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">
                                Detail Permohonan Cuti
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={<FiFileText />} label="Jenis Cuti">
                                    {permohonan.jenis_cuti_nama || '-'}
                                </DetailItem>
                                <DetailItem icon={<FiCalendar />} label="Tanggal Awal Cuti">
                                    {formatDate(permohonan.tanggal_mulai_cuti)}
                                </DetailItem>
                                <DetailItem icon={<FiCalendar />} label="Tanggal Akhir Cuti">
                                    {formatDate(permohonan.tanggal_selesai_cuti)}
                                </DetailItem>
                                <DetailItem icon={<FiClock />} label="Jumlah Hari">
                                    {permohonan.jumlah_hari} hari
                                </DetailItem>
                                <DetailItem icon={<FiMapPin />} label="Alamat Selama Cuti">
                                    {permohonan.alamat_selama_cuti || '-'}
                                </DetailItem>
                                <DetailItem icon={<FiPhone />} label="Nomor HP Selama Cuti">
                                    {permohonan.no_hp_selama_cuti || '-'}
                                </DetailItem>
                                <DetailItem icon={<FiFileText />} label="Alasan Cuti" fullWidth>
                                    <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 italic">
                                        {permohonan.alasan_cuti || '-'}
                                    </p>
                                </DetailItem>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Kedua - Timeline Approval Progress (1 kolom) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FiClock className="text-green-600 dark:text-green-400" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Approval Progress
                            </h3>
                        </div>

                        {isLoadingPersetujuan ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ) : sortedPersetujuanList.length > 0 ? (
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                
                                {/* Timeline Items */}
                                <div className="space-y-6">
                                    {sortedPersetujuanList.map((step, index) => {
                                        const isLast = index === sortedPersetujuanList.length - 1;
                                        const status = step.status_persetujuan?.toUpperCase() || 'MENUNGGU';
                                        const isCompleted = status === 'DISETUJUI' || status === 'DISETUJUI_AKHIR';
                                        const isRejected = status === 'DITOLAK';
                                        const isWaiting = status === 'MENUNGGU' || status === 'DIAJUKAN';
                                        const isRevised = status === 'DIREVISI';

                                        let lineColor = 'bg-gray-200 dark:bg-gray-700';
                                        let dotColor = 'bg-gray-400 dark:bg-gray-600';
                                        
                                        if (isCompleted) {
                                            lineColor = isLast ? '' : 'bg-green-500 dark:bg-green-600';
                                            dotColor = 'bg-green-500 dark:bg-green-600';
                                        } else if (isRejected) {
                                            lineColor = 'bg-red-500 dark:bg-red-600';
                                            dotColor = 'bg-red-500 dark:bg-red-600';
                                        } else if (isWaiting) {
                                            lineColor = 'bg-blue-500 dark:bg-blue-600';
                                            dotColor = 'bg-blue-500 dark:bg-blue-600';
                                        } else if (isRevised) {
                                            lineColor = 'bg-orange-500 dark:bg-orange-600';
                                            dotColor = 'bg-orange-500 dark:bg-orange-600';
                                        }

                                        return (
                                            <div key={index} className="relative pl-12">
                                                {/* Timeline Dot */}
                                                <div className={`absolute left-3 top-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${dotColor} z-10 flex items-center justify-center`}>
                                                    {isCompleted && (
                                                        <FiCheckCircle className="w-3 h-3 text-white" />
                                                    )}
                                                    {isRejected && (
                                                        <FiXCircle className="w-3 h-3 text-white" />
                                                    )}
                                                    {isWaiting && (
                                                        <FiClock className="w-3 h-3 text-white" />
                                                    )}
                                                    {isRevised && (
                                                        <FiFileText className="w-3 h-3 text-white" />
                                                    )}
                                                    {!isCompleted && !isRejected && !isWaiting && !isRevised && (
                                                        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className={`rounded-lg p-4 border-2 ${
                                                    isCompleted 
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                                        : isRejected
                                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                        : isWaiting
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                                        : isRevised
                                                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                                                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                                }`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                Langkah {step.urutan_persetujuan}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                {step.role_approver}
                                                            </p>
                                                            {(step as any).approver_nama && (
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <FiUser className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        {(step as any).approver_nama}
                                                                        {(step as any).approver_nip && (
                                                                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                                                                                ({(step as any).approver_nip})
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {renderApprovalStatusIcon(step.status_persetujuan)}
                                                    </div>
                                                    
                                                    <div className="mt-3">
                                                        {renderStatusBadge(step.status_persetujuan)}
                                                    </div>

                                                    {step.tanggal_persetujuan && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                            {formatDate(step.tanggal_persetujuan)}
                                                        </p>
                                                    )}

                                                    {step.catatan_persetujuan && (
                                                        <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                                                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Catatan:
                                                            </p>
                                                            <p className="text-gray-600 dark:text-gray-400 italic">
                                                                {step.catatan_persetujuan}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Connecting Line */}
                                                {!isLast && (
                                                    <div className={`absolute left-5 top-8 w-0.5 h-6 ${lineColor} z-0`}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FiClock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Belum ada langkah persetujuan yang tercatat.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

