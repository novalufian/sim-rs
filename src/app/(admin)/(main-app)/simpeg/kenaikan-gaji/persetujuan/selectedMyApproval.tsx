import React from "react";
import { MyApprovalGajiItem } from "@/hooks/fetch/gaji/useGajiPersetujuan";
import { FiCalendar, FiFileText, FiUser, FiDollarSign, FiCheckCircle, FiXCircle, FiMinusCircle, FiClock, FiTrendingUp } from "react-icons/fi";

interface SelectedMyApprovalProps {
    item: MyApprovalGajiItem | null;
    onAction?: (item: MyApprovalGajiItem, action: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI') => void;
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

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let colorClass = "text-gray-700 bg-gray-100";
    let Icon = FiMinusCircle;

    switch (s) {
        case "DIAJUKAN":
        case "MENUNGGU":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
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

const DetailItem: React.FC<{ icon: React.ReactElement<any>, label: string, fullWidth?: boolean, children: React.ReactNode }> = ({ icon, label, fullWidth, children }) => (
    <div className={`flex flex-col ${fullWidth ? 'sm:col-span-2' : ''}`}> 
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {React.cloneElement(icon, { className: 'mr-2 h-4 w-4' })}
            {label}
        </div>
        <div className="text-base text-gray-900 dark:text-white">
            {children}
        </div>
    </div>
);

export default function SelectedMyApproval({ item, onAction }: SelectedMyApprovalProps) {
    if (!item) {
        return <div className="p-4 text-center text-gray-500">Pilih permohonan kenaikan gaji untuk melihat detail.</div>;
    }

    const selisihGaji = (item.gaji_pokok_baru || 0) - (item.gaji_pokok_lama || 0);
    const persentaseKenaikan = item.gaji_pokok_lama > 0 ? ((selisihGaji / item.gaji_pokok_lama) * 100).toFixed(2) : '0.00';

    return (
        <div className="space-y-6 p-4">
            {/* Status Persetujuan */}
            <div className="border-b pb-4 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Status Persetujuan</h3>
                {renderStatusBadge(item.status_persetujuan)}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Role Approver: <span className="font-medium">{item.role_approver}</span>
                </p>
                {item.tanggal_persetujuan && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tanggal: {formatDate(item.tanggal_persetujuan)}
                    </p>
                )}
                {item.catatan_persetujuan && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Catatan:</p>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">{item.catatan_persetujuan}</p>
                    </div>
                )}
            </div>

            {/* Informasi Pemohon */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Informasi Pemohon</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={<FiUser />} label="Nama Pemohon">
                        <span className="font-medium">{item.pemohon_nama || '-'}</span>
                    </DetailItem>
                    <DetailItem icon={<FiUser />} label="NIP Pemohon">
                        <span className="text-sm">{item.pemohon_nip || '-'}</span>
                    </DetailItem>
                </div>
            </div>

            {/* Detail Permohonan Kenaikan Gaji */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Detail Permohonan Kenaikan Gaji Berkala</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    <DetailItem icon={<FiCalendar />} label="Tanggal Pengajuan">
                        {formatDate(item.tanggal_pengajuan)}
                    </DetailItem>
                    <DetailItem icon={<FiCalendar />} label="TMT KGB Lama">
                        {formatDate(item.tmt_kgb_lama)}
                    </DetailItem>
                    <DetailItem icon={<FiCalendar />} label="TMT KGB Baru">
                        {formatDate(item.tmt_kgb_baru)}
                    </DetailItem>
                    <DetailItem icon={<FiDollarSign />} label="Gaji Pokok Lama">
                        <span className="font-medium">{formatCurrency(item.gaji_pokok_lama || 0)}</span>
                    </DetailItem>
                    <DetailItem icon={<FiDollarSign />} label="Gaji Pokok Baru">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(item.gaji_pokok_baru || 0)}
                        </span>
                    </DetailItem>
                    <DetailItem icon={<FiTrendingUp />} label="Selisih Gaji">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(selisihGaji)}
                        </span>
                    </DetailItem>
                    <DetailItem icon={<FiTrendingUp />} label="Persentase Kenaikan">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {persentaseKenaikan}%
                        </span>
                    </DetailItem>
                    <DetailItem icon={<FiFileText />} label="Masa Kerja Golongan Lama">
                        {item.masa_kerja_gol_lama || '-'}
                    </DetailItem>
                    <DetailItem icon={<FiFileText />} label="Masa Kerja Golongan Baru">
                        {item.masa_kerja_gol_baru || '-'}
                    </DetailItem>
                </div>
            </div>

            {/* Action Buttons */}
            {item.status_persetujuan === 'MENUNGGU' && onAction && (
                <div className="pt-4 border-t dark:border-gray-700 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Aksi Persetujuan</h3>
                    <button
                        onClick={() => onAction(item, 'DISETUJUI')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiCheckCircle />
                        Setujui
                    </button>
                    <button
                        onClick={() => onAction(item, 'DITOLAK')}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiXCircle />
                        Tolak
                    </button>
                    <button
                        onClick={() => onAction(item, 'DIREVISI')}
                        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiFileText />
                        Revisi
                    </button>
                </div>
            )}
        </div>
    );
}

