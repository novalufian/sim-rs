import * as XLSX from 'xlsx';
import { PermohonanBelajarWithRelations } from '@/hooks/fetch/belajar/useBelajarPermohonan';

/**
 * Format tanggal ke format Indonesia
 */
const formatDateIndonesian = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(d);
    } catch {
        return '';
    }
};

/**
 * Get label untuk status
 */
const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        'DIAJUKAN': 'Diajukan',
        'DISETUJUI_KA_UNIT': 'Disetujui KA Unit',
        'DISETUJUI_KA_BIDANG': 'Disetujui KA Bidang',
        'VALIDASI_KEPEGAWAIAN': 'Validasi Kepegawaian',
        'DISETUJUI_AKHIR': 'Disetujui Akhir',
        'DITOLAK': 'Ditolak',
        'DIREVISI': 'Direvisi',
        'DIBATALKAN': 'Dibatalkan',
        'SELESAI': 'Selesai',
    };
    return statusMap[status] || status;
};

/**
 * Get label untuk jenis permohonan
 */
const getJenisPermohonanLabel = (jenis: string): string => {
    const jenisMap: Record<string, string> = {
        'TUGAS_BELAJAR': 'Tugas Belajar',
        'IZIN_BELAJAR': 'Izin Belajar',
    };
    return jenisMap[jenis] || jenis;
};

/**
 * Convert data Belajar ke format untuk Excel
 */
const convertBelajarToExcelRow = (belajar: PermohonanBelajarWithRelations, index: number): any => {
    return {
        'No': index + 1,
        'NIP': belajar.pegawai_nip || '',
        'Nama Pegawai': belajar.pegawai_nama || '',
        'Jenis Permohonan': getJenisPermohonanLabel(belajar.jenis_permohonan || ''),
        'Institusi Pendidikan': belajar.institusi_pendidikan_nama || '',
        'Program Studi': belajar.program_studi_nama || '',
        'Jenjang': belajar.program_studi_jenjang || '',
        'Gelar yang Diperoleh': belajar.gelar_yang_diperoleh || '',
        'Tanggal Mulai Belajar': formatDateIndonesian(belajar.tanggal_mulai_belajar),
        'Tanggal Selesai Belajar': formatDateIndonesian(belajar.tanggal_selesai_belajar),
        'Lama Studi (Bulan)': belajar.lama_studi_bulan || '',
        'Biaya Ditanggung': belajar.biaya_ditanggung || '',
        'Status Pegawai Selama Belajar': belajar.status_pegawai_selama_belajar || '',
        'Tanggal Pengajuan': formatDateIndonesian(belajar.tanggal_pengajuan),
        'Status': getStatusLabel(belajar.status || ''),
        'No SK Belajar': belajar.no_sk_belajar || '',
        'Tanggal SK Belajar': formatDateIndonesian(belajar.tanggal_sk_belajar),
    };
};

/**
 * Export data belajar ke file Excel
 */
export const exportBelajarToExcel = (data: PermohonanBelajarWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const excelData = data.map((belajar, index) => convertBelajarToExcelRow(belajar, index));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // NIP
        { wch: 30 },  // Nama Pegawai
        { wch: 20 },  // Jenis Permohonan
        { wch: 35 },  // Institusi Pendidikan
        { wch: 30 },  // Program Studi
        { wch: 15 },  // Jenjang
        { wch: 20 },  // Gelar yang Diperoleh
        { wch: 20 },  // Tanggal Mulai Belajar
        { wch: 20 },  // Tanggal Selesai Belajar
        { wch: 15 },  // Lama Studi
        { wch: 20 },  // Biaya Ditanggung
        { wch: 25 },  // Status Pegawai
        { wch: 20 },  // Tanggal Pengajuan
        { wch: 20 },  // Status
        { wch: 20 },  // No SK Belajar
        { wch: 20 },  // Tanggal SK Belajar
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Data Ijin Belajar');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Ijin_Belajar_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data belajar dengan filter tertentu
 */
export const exportBelajarToExcelWithFilters = (
    data: PermohonanBelajarWithRelations[],
    filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
    },
    filename?: string
): void => {
    let filteredData = [...data];

    if (filters) {
        if (filters.status) {
            filteredData = filteredData.filter(item => item.status === filters.status);
        }
        if (filters.startDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_pengajuan);
                const startDate = new Date(filters.startDate!);
                return itemDate >= startDate;
            });
        }
        if (filters.endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_pengajuan);
                const endDate = new Date(filters.endDate!);
                endDate.setHours(23, 59, 59, 999);
                return itemDate <= endDate;
            });
        }
    }

    let finalFilename = filename;
    if (!finalFilename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filterParts: string[] = [];
        
        if (filters?.status) filterParts.push(`Status-${getStatusLabel(filters.status)}`);
        if (filters?.startDate) filterParts.push(`Dari-${filters.startDate}`);
        if (filters?.endDate) filterParts.push(`Sampai-${filters.endDate}`);
        
        const filterStr = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
        finalFilename = `Data_Ijin_Belajar${filterStr}_${timestamp}.xlsx`;
    }

    exportBelajarToExcel(filteredData, finalFilename);
};

