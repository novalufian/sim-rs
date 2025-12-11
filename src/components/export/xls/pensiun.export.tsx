import * as XLSX from 'xlsx';
import { PermohonanPensiunWithRelations } from '@/hooks/fetch/pensiun/usePensiunPermohonan';

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
 * Get label untuk jenis pensiun
 */
const getJenisPensiunLabel = (jenis: string): string => {
    const jenisMap: Record<string, string> = {
        'PENSIUN_BIASA': 'Pensiun Biasa',
        'PENSIUN_DINI': 'Pensiun Dini',
        'PENSIUN_CAKAR': 'Pensiun Cacat',
        'PENSIUN_JANDA_DUDA': 'Pensiun Janda/Duda',
    };
    return jenisMap[jenis] || jenis;
};

/**
 * Convert data Pensiun ke format untuk Excel
 */
const convertPensiunToExcelRow = (pensiun: PermohonanPensiunWithRelations, index: number): any => {
    return {
        'No': index + 1,
        'NIP': pensiun.pegawai_nip || '',
        'Nama Pegawai': pensiun.pegawai_nama || '',
        'Jenis Pensiun': getJenisPensiunLabel(pensiun.jenis_pensiun || ''),
        'Tanggal Pengajuan': formatDateIndonesian(pensiun.tanggal_pengajuan),
        'Tanggal Pensiun': formatDateIndonesian(pensiun.tanggal_pensiun),
        'Alasan Pensiun': pensiun.alasan_pensiun || '',
        'Status': getStatusLabel(pensiun.status || ''),
    };
};

/**
 * Export data pensiun ke file Excel
 */
export const exportPensiunToExcel = (data: PermohonanPensiunWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const excelData = data.map((pensiun, index) => convertPensiunToExcelRow(pensiun, index));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // NIP
        { wch: 30 },  // Nama Pegawai
        { wch: 20 },  // Jenis Pensiun
        { wch: 20 },  // Tanggal Pengajuan
        { wch: 20 },  // Tanggal Pensiun
        { wch: 50 },  // Alasan Pensiun
        { wch: 20 },  // Status
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Data Pensiun');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Pensiun_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data pensiun dengan filter tertentu
 */
export const exportPensiunToExcelWithFilters = (
    data: PermohonanPensiunWithRelations[],
    filters?: {
        status?: string;
        jenis_pensiun?: string;
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
        if (filters.jenis_pensiun) {
            filteredData = filteredData.filter(item => item.jenis_pensiun === filters.jenis_pensiun);
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
        if (filters?.jenis_pensiun) filterParts.push(`Jenis-${getJenisPensiunLabel(filters.jenis_pensiun)}`);
        if (filters?.startDate) filterParts.push(`Dari-${filters.startDate}`);
        if (filters?.endDate) filterParts.push(`Sampai-${filters.endDate}`);
        
        const filterStr = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
        finalFilename = `Data_Pensiun${filterStr}_${timestamp}.xlsx`;
    }

    exportPensiunToExcel(filteredData, finalFilename);
};

