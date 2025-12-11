import * as XLSX from 'xlsx';
import { PermohonanMutasiWithRelations } from '@/hooks/fetch/mutasi/useMutasiPermohonan';

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
 * Get label untuk jenis mutasi
 */
const getJenisMutasiLabel = (jenis: string): string => {
    const jenisMap: Record<string, string> = {
        'MUTASI_KELUAR': 'Mutasi Keluar',
        'MUTASI_MASUK': 'Mutasi Masuk',
        'PROMOSI': 'Promosi',
        'DEMOSI': 'Demosi',
        'ROTASI': 'Rotasi',
    };
    return jenisMap[jenis] || jenis;
};

/**
 * Convert data Mutasi ke format untuk Excel
 */
const convertMutasiToExcelRow = (mutasi: PermohonanMutasiWithRelations, index: number): any => {
    return {
        'No': index + 1,
        'NIP': mutasi.pegawai_nip || mutasi.nip || '',
        'Nama Pegawai': mutasi.pegawai_nama || mutasi.nama || '',
        'Jenis Mutasi': getJenisMutasiLabel(mutasi.jenis_mutasi || ''),
        'Instansi Tujuan': mutasi.instansi_tujuan || '',
        'Tanggal Pengajuan': formatDateIndonesian(mutasi.tanggal_pengajuan),
        'Alasan Mutasi': mutasi.alasan_mutasi || '',
        'Status': getStatusLabel(mutasi.status || ''),
    };
};

/**
 * Export data mutasi ke file Excel
 * @param data Array of PermohonanMutasiWithRelations data
 * @param filename Optional filename (default: Data_Mutasi_YYYYMMDD_HHMMSS.xlsx)
 */
export const exportMutasiToExcel = (data: PermohonanMutasiWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Convert data ke format Excel
    const excelData = data.map((mutasi, index) => convertMutasiToExcelRow(mutasi, index));

    // Buat workbook
    const wb = XLSX.utils.book_new();

    // Buat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // NIP
        { wch: 30 },  // Nama Pegawai
        { wch: 18 },  // Jenis Mutasi
        { wch: 30 },  // Instansi Tujuan
        { wch: 20 },  // Tanggal Pengajuan
        { wch: 50 },  // Alasan Mutasi
        { wch: 20 },  // Status
    ];
    ws['!cols'] = columnWidths;

    // Add worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Mutasi');

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Mutasi_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    // Download file
    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data mutasi dengan filter tertentu
 * @param data Array of PermohonanMutasiWithRelations data
 * @param filters Filter yang digunakan (untuk ditambahkan di filename)
 * @param filename Optional filename
 */
export const exportMutasiToExcelWithFilters = (
    data: PermohonanMutasiWithRelations[],
    filters?: {
        status?: string;
        jenis_mutasi?: string;
        startDate?: string;
        endDate?: string;
    },
    filename?: string
): void => {
    let filteredData = [...data];

    // Apply filters jika ada
    if (filters) {
        if (filters.status) {
            filteredData = filteredData.filter(item => item.status === filters.status);
        }
        if (filters.jenis_mutasi) {
            filteredData = filteredData.filter(item => item.jenis_mutasi === filters.jenis_mutasi);
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
                endDate.setHours(23, 59, 59, 999); // Set ke akhir hari
                return itemDate <= endDate;
            });
        }
    }

    // Generate filename dengan info filter
    let finalFilename = filename;
    if (!finalFilename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filterParts: string[] = [];
        
        if (filters?.status) filterParts.push(`Status-${getStatusLabel(filters.status)}`);
        if (filters?.jenis_mutasi) filterParts.push(`Jenis-${getJenisMutasiLabel(filters.jenis_mutasi)}`);
        if (filters?.startDate) filterParts.push(`Dari-${filters.startDate}`);
        if (filters?.endDate) filterParts.push(`Sampai-${filters.endDate}`);
        
        const filterStr = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
        finalFilename = `Data_Mutasi${filterStr}_${timestamp}.xlsx`;
    }

    exportMutasiToExcel(filteredData, finalFilename);
};

