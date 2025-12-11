import * as XLSX from 'xlsx';
import { Employee } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';

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
 * Convert data Pegawai ke format untuk Excel
 */
const convertPegawaiToExcelRow = (pegawai: Employee, index: number): any => {
    return {
        'No': index + 1,
        'Nama': pegawai.nama || '',
        'NIP': pegawai.nip || '',
        'Status Pekerjaan': pegawai.status_pekerjaan || '',
        'TMT Pengangkatan': pegawai.pengangkatan_tmt || '',
        'Nomor SK': pegawai.pengangkatan_nomor_sk || '',
        'Masa Kerja': pegawai.pengangkatan_masakerja || '',
        'Pendidikan Institusi': pegawai.pendidikan_institusi || '',
        'Jenjang': pegawai.pendidikan_jenjang || '',
        'Tahun Lulus': pegawai.pendidikan_tahun_selesai || '',
        'Tempat Lahir': pegawai.tempat_lahir || '',
        'Tanggal Lahir': formatDateIndonesian(pegawai.tanggal_lahir),
        'Umur': pegawai.umur || '',
        'Jenis Kelamin': pegawai.jenis_kelamin || '',
        'Agama': pegawai.agama || '',
        'Jabatan': pegawai.jabatan || '',
        'TMT Pangkat': pegawai.pangkat_tmt || '',
        'TMT Jabatan': pegawai.jabatan_tmt || '',
        'Jurusan': pegawai.pendidikan_jurusan || '',
        'Gelar': pegawai.pendidikan_gelar || '',
        'Alamat KTP': pegawai.alamat_ktp || '',
        'Alamat Domisili': pegawai.alamat_domisili || '',
        'No KK': typeof pegawai.no_kk === 'object' ? pegawai.no_kk?.unmasked || '' : pegawai.no_kk || '',
        'No Rekening': typeof pegawai.no_rekening === 'object' ? pegawai.no_rekening?.unmasked || '' : pegawai.no_rekening || '',
        'No HP': typeof pegawai.no_hp === 'object' ? pegawai.no_hp?.unmasked || '' : pegawai.no_hp || '',
        'Email': pegawai.email || '',
    };
};

/**
 * Export data pegawai ke file Excel
 */
export const exportPegawaiToExcel = (data: Employee[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const excelData = data.map((pegawai, index) => convertPegawaiToExcelRow(pegawai, index));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
        { wch: 5 },   // No
        { wch: 30 },  // Nama
        { wch: 20 },  // NIP
        { wch: 20 },  // Status Pekerjaan
        { wch: 20 },  // TMT Pengangkatan
        { wch: 20 },  // Nomor SK
        { wch: 15 },  // Masa Kerja
        { wch: 35 },  // Pendidikan Institusi
        { wch: 15 },  // Jenjang
        { wch: 12 },  // Tahun Lulus
        { wch: 20 },  // Tempat Lahir
        { wch: 20 },  // Tanggal Lahir
        { wch: 15 },  // Umur
        { wch: 15 },  // Jenis Kelamin
        { wch: 12 },  // Agama
        { wch: 30 },  // Jabatan
        { wch: 15 },  // TMT Pangkat
        { wch: 15 },  // TMT Jabatan
        { wch: 30 },  // Jurusan
        { wch: 20 },  // Gelar
        { wch: 40 },  // Alamat KTP
        { wch: 40 },  // Alamat Domisili
        { wch: 20 },  // No KK
        { wch: 20 },  // No Rekening
        { wch: 15 },  // No HP
        { wch: 30 },  // Email
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Data Pegawai');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Pegawai_${timestamp}.xlsx`;
    const finalFilename = filename || defaultFilename;

    XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data pegawai dengan filter tertentu
 */
export const exportPegawaiToExcelWithFilters = (
    data: Employee[],
    filters?: {
        nama?: string;
        nip?: string;
        jenis_kelamin?: string;
        agama?: string;
        status_perkawinan?: string;
        status_pekerjaan?: string;
    },
    filename?: string
): void => {
    let filteredData = [...data];

    if (filters) {
        if (filters.nama) {
            filteredData = filteredData.filter(item => 
                item.nama?.toLowerCase().includes(filters.nama!.toLowerCase())
            );
        }
        if (filters.nip) {
            filteredData = filteredData.filter(item => 
                item.nip?.includes(filters.nip!)
            );
        }
        if (filters.jenis_kelamin) {
            filteredData = filteredData.filter(item => item.jenis_kelamin === filters.jenis_kelamin);
        }
        if (filters.agama) {
            filteredData = filteredData.filter(item => item.agama === filters.agama);
        }
        if (filters.status_perkawinan) {
            filteredData = filteredData.filter(item => item.status_perkawinan === filters.status_perkawinan);
        }
        if (filters.status_pekerjaan) {
            filteredData = filteredData.filter(item => item.status_pekerjaan === filters.status_pekerjaan);
        }
    }

    let finalFilename = filename;
    if (!finalFilename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filterParts: string[] = [];
        
        if (filters?.nama) filterParts.push(`Nama-${filters.nama}`);
        if (filters?.nip) filterParts.push(`NIP-${filters.nip}`);
        if (filters?.jenis_kelamin) filterParts.push(`JK-${filters.jenis_kelamin}`);
        if (filters?.agama) filterParts.push(`Agama-${filters.agama}`);
        if (filters?.status_pekerjaan) filterParts.push(`Status-${filters.status_pekerjaan}`);
        
        const filterStr = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
        finalFilename = `Data_Pegawai${filterStr}_${timestamp}.xlsx`;
    }

    exportPegawaiToExcel(filteredData, finalFilename);
};

