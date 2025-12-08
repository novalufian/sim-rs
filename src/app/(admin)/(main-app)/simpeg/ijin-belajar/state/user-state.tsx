"use client";
import React, { useState, useMemo } from 'react';
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from '@/libs/store';
import { usePermohonanBelajarList, PermohonanBelajarWithRelations } from '@/hooks/fetch/belajar/useBelajarPermohonan';
import { usePersetujuanBelajarByPermohonan, PersetujuanBelajarWithApprover } from '@/hooks/fetch/belajar/useBelajarPersetujuan';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
    LuFileText, 
    LuClock, 
    LuCheck, 
    LuX, 
    LuInfo,
    LuRefreshCw,
    LuMessageSquare,
    LuHistory
} from 'react-icons/lu';
import SpinerLoading from '@/components/loading/spiner';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';

// Helper function untuk menghitung hari antara dua tanggal
const calculateDays = (startDate: Date | string, endDate: Date | string | null): number => {
    if (!endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function untuk format status
const getStatusColor = (status: string): string => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'DIAJUKAN':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'PERSETUJUAN_ATASAN':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'VALIDASI_KEPEGAWAIAN':
            return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
        case 'PERSETUJUAN_AKHIR':
            return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
        case 'SELESAI':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'DITOLAK':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        case 'DIREVISI':
            return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
        case 'DIBATALKAN':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
};

const getStatusLabel = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function UserState() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [selectedPermohonan, setSelectedPermohonan] = useState<PermohonanBelajarWithRelations | null>(null);

    // Fetch semua permohonan user
    const { data: permohonanData, isLoading: isLoadingPermohonan } = usePermohonanBelajarList({
        id_pegawai: user?.id_pegawai,
        limit: 100, // Ambil semua untuk statistik
    });

    // Fetch riwayat persetujuan untuk permohonan yang dipilih
    const { data: persetujuanData, isLoading: isLoadingPersetujuan } = usePersetujuanBelajarByPermohonan(
        selectedPermohonan?.id || '',
        !!selectedPermohonan
    );

    const permohonanList = permohonanData?.data?.items || [];
    const persetujuanList = persetujuanData || [];

    // Statistik Status Permohonan
    const statusStats = useMemo(() => {
        const stats: Record<string, number> = {};
        permohonanList.forEach((item) => {
            const status = item.status.toUpperCase();
            stats[status] = (stats[status] || 0) + 1;
        });

        return Object.entries(stats).map(([status, count]) => ({
            status,
            label: getStatusLabel(status),
            count,
            percentage: permohonanList.length > 0 ? (count / permohonanList.length) * 100 : 0,
            color: getStatusColor(status),
        })).sort((a, b) => b.count - a.count);
    }, [permohonanList]);

    // Statistik SLA (hanya untuk yang sudah selesai)
    const slaStats = useMemo(() => {
        const selesaiList = permohonanList.filter(p => 
            p.status === 'SELESAI' && p.tanggal_pengajuan && p.updated_at
        );

        if (selesaiList.length === 0) {
            return {
                rataRata: 0,
                tercepat: 0,
                terlambat: 0,
                total: 0,
            };
        }

        const hariList = selesaiList.map(p => 
            calculateDays(p.tanggal_pengajuan, p.updated_at)
        );

        return {
            rataRata: Math.round(hariList.reduce((a, b) => a + b, 0) / hariList.length),
            tercepat: Math.min(...hariList),
            terlambat: Math.max(...hariList),
            total: selesaiList.length,
        };
    }, [permohonanList]);

    // Permohonan terbaru (untuk timeline)
    const latestPermohonan = useMemo(() => {
        return [...permohonanList]
            .sort((a, b) => {
                const dateA = new Date(a.tanggal_pengajuan).getTime();
                const dateB = new Date(b.tanggal_pengajuan).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [permohonanList]);

    // Permohonan dengan catatan/revisi
    const permohonanDenganCatatan = useMemo(() => {
        return permohonanList.filter(p => 
            p.catatan_kepegawaian || p.catatan_penolakan || p.status === 'DIREVISI'
        ).slice(0, 5);
    }, [permohonanList]);

    if (isLoadingPermohonan) {
        return (
            <div className="grid grid-cols-12 gap-2 col-span-12">
                <div className="col-span-12">
                    <PathBreadcrumb defaultTitle="Statistik Permohonan Ijin Belajar Saya" />
                </div>
                <div className="col-span-12 flex items-center justify-center min-h-[400px]">
                    <SpinerLoading />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-2 col-span-12">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Statistik Permohonan Ijin Belajar Saya" />
            </div>

            {/* Card: Status Permohonan */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <LuFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Status Permohonan
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {statusStats.length > 0 ? (
                            statusStats.map((stat) => (
                                <div key={stat.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${stat.color}`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {stat.count}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.percentage.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                Belum ada permohonan
                            </p>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            Total: {permohonanList.length} permohonan
                        </p>
                    </div>
                </div>
            </div>

            {/* Card: SLA Pemrosesan */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <LuClock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            SLA Pemrosesan
                        </h3>
                    </div>
                    {slaStats.total > 0 ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {slaStats.rataRata}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Rata-rata hari
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tercepat</p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {slaStats.tercepat} hari
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Terlambat</p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {slaStats.terlambat} hari
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Total proses selesai: {slaStats.total}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Belum ada permohonan yang selesai
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Card: Ringkasan */}
            <div className="col-span-12 md:col-span-12 lg:col-span-4">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <LuCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Ringkasan
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Permohonan</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                {permohonanList.length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Selesai</span>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {permohonanList.filter(p => p.status === 'SELESAI').length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Dalam Proses</span>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {permohonanList.filter(p => 
                                    ['DIAJUKAN', 'PERSETUJUAN_ATASAN', 'VALIDASI_KEPEGAWAIAN', 'PERSETUJUAN_AKHIR'].includes(p.status)
                                ).length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Perlu Tindakan</span>
                            <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                {permohonanList.filter(p => 
                                    ['DIREVISI', 'DITOLAK'].includes(p.status)
                                ).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Riwayat Pengajuan (Timeline) */}
            <div className="col-span-12">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <LuHistory className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Riwayat Pengajuan Terbaru
                        </h3>
                    </div>
                    {latestPermohonan.length > 0 ? (
                        <div className="space-y-4">
                            {latestPermohonan.map((permohonan) => (
                                <div
                                    key={permohonan.id}
                                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                    onClick={() => setSelectedPermohonan(permohonan)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(permohonan.status)}`}>
                                                    {getStatusLabel(permohonan.status)}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {permohonan.jenis_permohonan.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                                                {permohonan.institusi_pendidikan_nama}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {permohonan.program_studi_nama} - {permohonan.program_studi_jenjang}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Diajukan: {format(new Date(permohonan.tanggal_pengajuan), 'dd MMM yyyy', { locale: id })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {permohonan.tanggal_pengajuan && permohonan.updated_at && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {calculateDays(permohonan.tanggal_pengajuan, permohonan.updated_at)} hari
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                            Belum ada riwayat pengajuan
                        </p>
                    )}
                </div>
            </div>

            {/* Notifikasi/Revisi/Catatan */}
            <div className="col-span-12">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <LuMessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Notifikasi & Catatan
                        </h3>
                    </div>
                    {permohonanDenganCatatan.length > 0 ? (
                        <div className="space-y-4">
                            {permohonanDenganCatatan.map((permohonan) => (
                                <div
                                    key={permohonan.id}
                                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                >
                                    <div className="flex items-start gap-3">
                                        {permohonan.status === 'DIREVISI' && (
                                            <LuRefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        {permohonan.catatan_penolakan && (
                                            <LuX className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        {permohonan.catatan_kepegawaian && !permohonan.catatan_penolakan && (
                                            <LuInfo className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(permohonan.status)}`}>
                                                    {getStatusLabel(permohonan.status)}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {format(new Date(permohonan.updated_at), 'dd MMM yyyy', { locale: id })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                                                {permohonan.institusi_pendidikan_nama}
                                            </p>
                                            {permohonan.catatan_penolakan && (
                                                <div className="mb-2">
                                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                                                        Catatan Penolakan:
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {permohonan.catatan_penolakan}
                                                    </p>
                                                </div>
                                            )}
                                            {permohonan.catatan_kepegawaian && (
                                                <div>
                                                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                                                        Catatan Kepegawaian:
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {permohonan.catatan_kepegawaian}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                            Tidak ada notifikasi atau catatan
                        </p>
                    )}
                </div>
            </div>

            {/* Timeline Detail Modal (jika permohonan dipilih) */}
            {selectedPermohonan && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Timeline Persetujuan
                                </h3>
                                <button
                                    onClick={() => setSelectedPermohonan(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <LuX className="w-6 h-6" />
                                </button>
                            </div>
                            {isLoadingPersetujuan ? (
                                <div className="flex items-center justify-center py-8">
                                    <SpinerLoading />
                                </div>
                            ) : persetujuanList.length > 0 ? (
                                <div className="space-y-4">
                                    {persetujuanList
                                        .sort((a, b) => a.urutan_persetujuan - b.urutan_persetujuan)
                                        .map((persetujuan, index) => (
                                            <div key={persetujuan.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        persetujuan.status_persetujuan === 'DISETUJUI' ? 'bg-green-500' :
                                                        persetujuan.status_persetujuan === 'DITOLAK' ? 'bg-red-500' :
                                                        'bg-gray-400'
                                                    }`} />
                                                    {index < persetujuanList.length - 1 && (
                                                        <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                            {persetujuan.role_approver}
                                                        </p>
                                                        {persetujuan.approver_nama && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                ({persetujuan.approver_nama})
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs px-2 py-1 rounded inline-block mb-2 ${
                                                        persetujuan.status_persetujuan === 'DISETUJUI' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        persetujuan.status_persetujuan === 'DITOLAK' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                        {persetujuan.status_persetujuan}
                                                    </p>
                                                    {persetujuan.tanggal_persetujuan && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                            {format(new Date(persetujuan.tanggal_persetujuan), 'dd MMM yyyy HH:mm', { locale: id })}
                                                        </p>
                                                    )}
                                                    {persetujuan.catatan_persetujuan && (
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                                            {persetujuan.catatan_persetujuan}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                    Belum ada riwayat persetujuan
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

