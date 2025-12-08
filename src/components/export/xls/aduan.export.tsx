import * as XLSX from 'xlsx';
import { Lapor, statusConfig, klasifikasiConfig, priorityConfig } from '@/app/(admin)/(main-app)/sim-aduan/data/laporInterface';

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
 * Get label dari config
 */
const getStatusLabel = (status: string): string => {
    return statusConfig[status as keyof typeof statusConfig]?.label || status;
};

const getKlasifikasiLabel = (klasifikasi: string): string => {
    return klasifikasiConfig[klasifikasi as keyof typeof klasifikasiConfig]?.label || klasifikasi;
};

const getPriorityLabel = (priority: string): string => {
    return priorityConfig[priority as keyof typeof priorityConfig]?.label || priority;
};

/**
 * Convert data Lapor ke format untuk Excel
 */
const convertLaporToExcelRow = (lapor: Lapor, index: number): any => {
    return {
        'No': index + 1,
        'Tanggal Pelaporan': formatDateIndonesian(lapor.tanggal_pelaporan),
        'Judul Laporan': lapor.judul || '',
        'Klasifikasi': getKlasifikasiLabel(lapor.klasifikasi),
        'Status': getStatusLabel(lapor.status),
        'Priority': getPriorityLabel(lapor.priority),
        'Alamat': lapor.alamat || '',
        'Isi Laporan': lapor.uraian || '',
        'Email': lapor.masked_email || '',
        'NIK': lapor.masked_nik || '',
        'No HP': lapor.masked_no_hp || '',
        'Nama': lapor.nama || '',
        'Skrining Masalah': lapor.skrining_masalah_nama || '',
        'Tindak Lanjut': lapor.tindak_lanjut_nama || '',
        'Dibuat Pada': formatDateIndonesian(lapor.created_at),
    };
};

/**
 * Export data aduan ke file Excel
 * @param data Array of Lapor data
 * @param filename Optional filename (default: Data_Aduan_YYYYMMDD_HHMMSS.xlsx)
 */
export const exportAduanToExcel = (data: Lapor[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Convert data ke format Excel
    const excelData = data.map((lapor, index) => convertLaporToExcelRow(lapor, index));

    // Buat workbook
    const wb = XLSX.utils.book_new();

    // Buat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
        { wch: 5 },   // No
        { wch: 20 },  // Tanggal Pelaporan
        { wch: 30 },  // Judul Laporan
        { wch: 18 },  // Klasifikasi
        { wch: 15 },  // Status
        { wch: 12 },  // Priority
        { wch: 40 },  // Alamat
        { wch: 50 },  // Isi Laporan
        { wch: 25 },  // Email
        { wch: 20 },  // NIK
        { wch: 15 },  // No HP
        { wch: 25 },  // Nama
        { wch: 25 },  // Skrining Masalah
        { wch: 25 },  // Tindak Lanjut
        { wch: 20 },  // Dibuat Pada
    ];
    ws['!cols'] = columnWidths;

    // Add worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Aduan');

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Aduan_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    // Download file
    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data aduan dengan filter tertentu
 * @param data Array of Lapor data
 * @param filters Filter yang digunakan (untuk ditambahkan di filename)
 * @param filename Optional filename
 */
export const exportAduanToExcelWithFilters = (
    data: Lapor[],
    filters?: {
        status?: string;
        klasifikasi?: string;
        priority?: string;
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
        if (filters.klasifikasi) {
            filteredData = filteredData.filter(item => item.klasifikasi === filters.klasifikasi);
        }
        if (filters.priority) {
            filteredData = filteredData.filter(item => item.priority === filters.priority);
        }
        if (filters.startDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_pelaporan);
                const startDate = new Date(filters.startDate!);
                return itemDate >= startDate;
            });
        }
        if (filters.endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.tanggal_pelaporan);
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
        if (filters?.klasifikasi) filterParts.push(`Klasifikasi-${getKlasifikasiLabel(filters.klasifikasi)}`);
        if (filters?.priority) filterParts.push(`Priority-${getPriorityLabel(filters.priority)}`);
        if (filters?.startDate) filterParts.push(`Dari-${filters.startDate}`);
        if (filters?.endDate) filterParts.push(`Sampai-${filters.endDate}`);
        
        const filterStr = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
        finalFilename = `Data_Aduan${filterStr}_${timestamp}.xlsx`;
    }

    exportAduanToExcel(filteredData, finalFilename);
};

