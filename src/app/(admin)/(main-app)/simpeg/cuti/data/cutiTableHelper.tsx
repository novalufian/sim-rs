import { PermohonanCuti, StatusCuti } from "./cutiPermohonan";
import React from 'react';

// --- date formatter ---
const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "-";
    try {
        return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        }).format(new Date(dateStr));
    } catch {
        return dateStr;
    }
};

// --- badge helper untuk Status Cuti ---
const renderStatusBadge = (status: StatusCuti): React.ReactNode => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium inline-block whitespace-nowrap";
  const statusLabel = status.replace(/_/g, ' '); // Ganti underscore dengan spasi

  switch (status) {
    case StatusCuti.DISETUJUI_AKHIR:
      return <span className={`${baseClasses} bg-green-700 text-white`}>{statusLabel}</span>;
    case StatusCuti.VALIDASI_KEPEGAWAIAN:
      return <span className={`${baseClasses} bg-teal-500 text-white`}>{statusLabel}</span>;
    case StatusCuti.DIAJUKAN:
      return <span className={`${baseClasses} bg-blue-500 text-white`}>{statusLabel}</span>;
    case StatusCuti.DISETUJUI_KA_UNIT:
    case StatusCuti.DISETUJUI_KA_BIDANG:
      return <span className={`${baseClasses} bg-indigo-500 text-white`}>{statusLabel}</span>;
    case StatusCuti.DITOLAK:
      return <span className={`${baseClasses} bg-red-600 text-white`}>{statusLabel}</span>;
    case StatusCuti.DIBATALKAN:
      return <span className={`${baseClasses} bg-gray-500 text-white`}>{statusLabel}</span>;
    case StatusCuti.DIREVISI:
      return <span className={`${baseClasses} bg-orange-500 text-white`}>{statusLabel}</span>;
    case StatusCuti.SELESAI:
      return <span className={`${baseClasses} bg-green-500 text-white`}>{statusLabel}</span>;
    default:
      return <span className={`${baseClasses} bg-gray-300 text-gray-800`}>{statusLabel}</span>;
  }
};

// --- main renderer ---
export const getColumnValue = (
    permohonan: PermohonanCuti,
    columnId: keyof PermohonanCuti | 'no' | 'actions'
): React.ReactNode => {
switch (columnId) {
    case 'nama_pegawai':
        return permohonan.nama_pegawai;
    case 'nip_pegawai':
        return (
            <span className="text-gray-500 dark:text-gray-300">
            {permohonan.nip_pegawai}
            </span>
        );
    case 'nama_jenis_cuti':
        return permohonan.nama_jenis_cuti;
    case 'jumlah_hari':
        return `${permohonan.jumlah_hari} Hari`;
    
    case 'tanggal_mulai_cuti':
    case 'tanggal_selesai_cuti':
    case 'tanggal_diajukan':
        return formatDate(permohonan[columnId] as string);
        
    case 'status':
        return renderStatusBadge(permohonan.status);
        
    case 'nomor_surat_cuti':
        return permohonan.nomor_surat_cuti || '-';
        
    case 'alasan_cuti':
        // Batasi panjang teks jika terlalu panjang, tambahkan tooltip jika memungkinkan
        return permohonan.alasan_cuti ? permohonan.alasan_cuti.substring(0, 50) + (permohonan.alasan_cuti.length > 50 ? '...' : '') : '-';

    default:
        return "";
}
};