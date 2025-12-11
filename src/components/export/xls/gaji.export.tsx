import * as XLSX from 'xlsx';
import { PermohonanGajiWithRelations } from '@/hooks/fetch/gaji/useGajiPermohonan';

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
 * Format currency ke format Rupiah
 */
const formatCurrency = (amount: number | null | undefined): string => {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
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
 * Convert data Gaji ke format untuk Excel
 */
const convertGajiToExcelRow = (gaji: PermohonanGajiWithRelations, index: number): any => {
    return {
        'No': index + 1,
        'NIP': gaji.pegawai_nip || '',
        'Nama Pegawai': gaji.pegawai_nama || '',
        'Tanggal Pengajuan': formatDateIndonesian(gaji.tanggal_pengajuan),
        'Gaji Pokok Lama': formatCurrency(gaji.gaji_pokok_lama),
        'Gaji Pokok Baru': formatCurrency(gaji.gaji_pokok_baru),
        'Selisih Gaji': formatCurrency(gaji.selisih_gaji || (gaji.gaji_pokok_baru - gaji.gaji_pokok_lama)),
        'Persentase Kenaikan': gaji.persentase_kenaikan 
            ? `${gaji.persentase_kenaikan.toFixed(2)}%` 
            : gaji.gaji_pokok_lama > 0 
                ? `${(((gaji.gaji_pokok_baru - gaji.gaji_pokok_lama) / gaji.gaji_pokok_lama) * 100).toFixed(2)}%`
                : '',
        'TMT KGB Lama': gaji.tmt_kgb_lama || '',
        'TMT KGB Baru': gaji.tmt_kgb_baru || '',
        'Masa Kerja Gol Lama': gaji.masa_kerja_gol_lama || '',
        'Masa Kerja Gol Baru': gaji.masa_kerja_gol_baru || '',
        'Status': getStatusLabel(gaji.status || ''),
        'No SK KGB': gaji.no_sk_kgb || '',
        'Tanggal SK KGB': formatDateIndonesian(gaji.tanggal_sk_kgb),
    };
};

/**
 * Export data gaji ke file Excel
 */
export const exportGajiToExcel = (data: PermohonanGajiWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const excelData = data.map((gaji, index) => convertGajiToExcelRow(gaji, index));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // NIP
        { wch: 30 },  // Nama Pegawai
        { wch: 20 },  // Tanggal Pengajuan
        { wch: 18 },  // Gaji Pokok Lama
        { wch: 18 },  // Gaji Pokok Baru
        { wch: 18 },  // Selisih Gaji
        { wch: 18 },  // Persentase Kenaikan
        { wch: 15 },  // TMT KGB Lama
        { wch: 15 },  // TMT KGB Baru
        { wch: 18 },  // Masa Kerja Gol Lama
        { wch: 18 },  // Masa Kerja Gol Baru
        { wch: 20 },  // Status
        { wch: 20 },  // No SK KGB
        { wch: 20 },  // Tanggal SK KGB
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Data Kenaikan Gaji');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Kenaikan_Gaji_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data gaji dengan filter tertentu
 */
export const exportGajiToExcelWithFilters = (
    data: PermohonanGajiWithRelations[],
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
        finalFilename = `Data_Kenaikan_Gaji${filterStr}_${timestamp}.xlsx`;
    }

    exportGajiToExcel(filteredData, finalFilename);
};

