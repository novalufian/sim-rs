import React from "react";
import { PermohonanCutiWithRelations } from "@/hooks/fetch/cuti/useCutiPermohonan";
import { FiCalendar, FiClock, FiFileText, FiUser, FiHome, FiCheckCircle, FiXCircle, FiMinusCircle } from "react-icons/fi";
import Link from "next/link";

interface SelectedCutiProps {
    cuti: PermohonanCutiWithRelations | null;
}

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


export default function SelectedCuti({ cuti }: SelectedCutiProps) {
    if (!cuti) {
        return <div className="p-4 text-center text-gray-500">Pilih permohonan cuti untuk melihat detail.</div>;
    }

    const approvalSteps = cuti.persetujuan_cuti || [];

    return (
        <div className="space-y-6 p-4">
            
            {/* 1. Status Utama */}
            <div className="border-b pb-4 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Status Permohonan</h3>
                {renderStatusBadge(cuti.status)}
            </div>

            {/* 2. Ringkasan Cuti */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Ringkasan</h3>
                
                {/* Tambahkan Grid untuk mendukung col-span-2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    <DetailItem icon={<FiUser />} label="Pemohon">
                        <span className="font-medium">{cuti.nama}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({cuti.nip})</span>
                    </DetailItem>
                    <DetailItem icon={<FiFileText />} label="Jenis Cuti">{cuti.jenis_cuti_nama || '-'}</DetailItem>
                    <DetailItem icon={<FiCalendar />} label="Periode Cuti">
                        {formatDate(cuti.tanggal_mulai_cuti)} - {formatDate(cuti.tanggal_selesai_cuti)}
                    </DetailItem>
                    <DetailItem icon={<FiClock />} label="Durasi">{cuti.jumlah_hari} Hari</DetailItem>
                    <DetailItem icon={<FiHome />} label="Alamat Selama Cuti">{cuti.alamat_selama_cuti || '-'}</DetailItem>
                    
                    {/* Menggunakan fullWidth agar memanjang dua kolom */}
                    <DetailItem icon={<FiFileText />} label="Alasan Cuti" fullWidth>
                        <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 italic">{cuti.alasan_cuti || '-'}</p>
                    </DetailItem>
                </div>
            </div>

            {/* 3. Riwayat Persetujuan */}
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Riwayat Persetujuan ({approvalSteps.length})</h3>
                {approvalSteps.length > 0 ? (
                    <div className="space-y-4">
                        {approvalSteps
                            // Asumsi ada field urutan_persetujuan di PersetujuanCutiWithApprover
                            .sort((a, b) => (a.urutan_persetujuan || 0) - (b.urutan_persetujuan || 0))
                            .map((step, index) => (
                                <div key={index} className="border-l-2 pl-4 dark:border-gray-700">
                                    <div className="flex items-start space-x-2">
                                        {renderApprovalStatusIcon(step.status_persetujuan)}
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                Langkah {step.urutan_persetujuan}: {step.role_approver}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ml-5 text-sm space-y-1 mt-1">
                                        {/* KOREKSI: Menggunakan approver_nama dari API response */}
                                        <p>
                                            <span className="font-medium">Approver:</span> {step.approver_nama || 'N/A'}
                                            {/* KOREKSI: Menambahkan NIP */}
                                            {step.approver_nip && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({step.approver_nip})</span>
                                            )}
                                        </p>
                                        {/* END KOREKSI */}
                                        <p>
                                            <span className="font-medium">Status:</span> {renderStatusBadge(step.status_persetujuan)}
                                        </p>
                                        {step.tanggal_persetujuan && (
                                            <p>
                                                <span className="font-medium">Tgl:</span> {formatDate(step.tanggal_persetujuan)}
                                            </p>
                                        )}
                                        {step.catatan_persetujuan && (
                                            <p className="italic text-gray-600 dark:text-gray-400">
                                                Catatan: {step.catatan_persetujuan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Belum ada langkah persetujuan yang tercatat.</p>
                )}
            </div>
            
            {/* Aksi Opsional: Lihat Halaman Detail */}
             <div className="pt-4 border-t dark:border-gray-700">
                <Link 
                    href={`/simpeg/cuti/permohonan/${cuti.id}`} 
                    className="flex items-center justify-center text-white transition-colors bg-blue-600 border border-blue-600 rounded-lg hover:text-blue-600 h-11 w-full hover:border-blue-600 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4"
                >
                    Buka Halaman Detail Penuh
                </Link>
            </div>
        </div>
    );
}

// Helper untuk Detail Item
// KOREKSI UTAMA: Mengubah tipe icon menjadi React.ReactElement<any> untuk mengatasi error React.cloneElement
const DetailItem: React.FC<{ icon: React.ReactElement<any>, label: string, fullWidth?: boolean, children: React.ReactNode }> = ({ icon, label, fullWidth, children }) => (
    <div className={`flex flex-col ${fullWidth ? 'sm:col-span-2' : ''}`}> 
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {/* KOREKSI: Tambahkan className agar ikon memiliki ukuran */}
            {React.cloneElement(icon, { className: 'mr-2 h-4 w-4' })}
            {label}
        </div>
        <div className="text-base text-gray-900 dark:text-white">
            {children}
        </div>
    </div>
);

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
        case "DIAJUKAN": // Menambahkan DIAJUKAN
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