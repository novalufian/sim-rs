import * as XLSX from 'xlsx';
import { PermohonanCutiWithRelations } from '@/hooks/fetch/cuti/useCutiPermohonan';

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
 * Convert data Cuti ke format untuk Excel
 */
const convertCutiToExcelRow = (cuti: PermohonanCutiWithRelations, index: number): any => {
    return {
        'No': index + 1,
        'NIP': cuti.nip || '',
        'Nama Pegawai': cuti.nama || '',
        'Jenis Cuti': cuti.jenis_cuti_nama || '',
        'Tanggal Mulai Cuti': formatDateIndonesian(cuti.tanggal_mulai_cuti),
        'Tanggal Selesai Cuti': formatDateIndonesian(cuti.tanggal_selesai_cuti),
        'Jumlah Hari': cuti.jumlah_hari || 0,
        'Alasan Cuti': cuti.alasan_cuti || '',
        'Alamat Selama Cuti': cuti.alamat_selama_cuti || '',
        'No HP Selama Cuti': cuti.no_hp_selama_cuti || '',
        'Status': getStatusLabel(cuti.status || ''),
        'Nomor Surat Cuti': cuti.nomor_surat_cuti || '',
        'Tanggal Surat Cuti': formatDateIndonesian(cuti.tanggal_surat_cuti),
    };
};

/**
 * Export data cuti ke file Excel
 */
export const exportCutiToExcel = (data: PermohonanCutiWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const excelData = data.map((cuti, index) => convertCutiToExcelRow(cuti, index));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // NIP
        { wch: 30 },  // Nama Pegawai
        { wch: 20 },  // Jenis Cuti
        { wch: 20 },  // Tanggal Mulai Cuti
        { wch: 20 },  // Tanggal Selesai Cuti
        { wch: 12 },  // Jumlah Hari
        { wch: 40 },  // Alasan Cuti
        { wch: 40 },  // Alamat Selama Cuti
        { wch: 18 },  // No HP Selama Cuti
        { wch: 20 },  // Status
        { wch: 20 },  // Nomor Surat Cuti
        { wch: 20 },  // Tanggal Surat Cuti
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Data Cuti');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Cuti_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data cuti dengan filter tertentu
 */
export const exportCutiToExcelWithFilters = (
    data: PermohonanCutiWithRelations[],
    filters?: {
        status?: string;
        id_jenis_cuti?: number;
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
        if (filters.id_jenis_cuti) {
            filteredData = filteredData.filter(item => item.id_jenis_cuti === filters.id_jenis_cuti);
        }
        if (filters.startDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_mulai_cuti);
                const startDate = new Date(filters.startDate!);
                return itemDate >= startDate;
            });
        }
        if (filters.endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_mulai_cuti);
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
        finalFilename = `Data_Cuti${filterStr}_${timestamp}.xlsx`;
    }

    exportCutiToExcel(filteredData, finalFilename);
};

