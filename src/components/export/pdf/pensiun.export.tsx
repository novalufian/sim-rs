import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PermohonanPensiunWithRelations } from '@/hooks/fetch/pensiun/usePensiunPermohonan';

// Initialize pdfMake with fonts
if (typeof pdfFonts !== 'undefined' && pdfFonts) {
    pdfMake.vfs = pdfFonts as any;
}

/**
 * Format tanggal ke format Indonesia
 */
const formatDateIndonesian = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
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
 * Export data pensiun ke file PDF
 */
export const exportPensiunToPdf = (data: PermohonanPensiunWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const tableBody = [
        [
            { text: 'No', style: 'tableHeader', alignment: 'center' },
            { text: 'NIP', style: 'tableHeader' },
            { text: 'Nama Pegawai', style: 'tableHeader' },
            { text: 'Jenis Pensiun', style: 'tableHeader' },
            { text: 'Tanggal Pengajuan', style: 'tableHeader' },
            { text: 'Tanggal Pensiun', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
        ],
        ...data.map((pensiun, index) => [
            { text: String(index + 1), alignment: 'center' },
            { text: pensiun.pegawai_nip || '' },
            { text: pensiun.pegawai_nama || '' },
            { text: getJenisPensiunLabel(pensiun.jenis_pensiun || '') },
            { text: formatDateIndonesian(pensiun.tanggal_pengajuan) },
            { text: formatDateIndonesian(pensiun.tanggal_pensiun) },
            { text: getStatusLabel(pensiun.status || '') },
        ]),
    ];

    const docDefinition: any = {
        content: [
            {
                text: 'Data Pensiun',
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 20],
            },
            {
                text: `Tanggal Export: ${formatDateIndonesian(new Date())}`,
                style: 'subheader',
                margin: [0, 0, 0, 20],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
                    body: tableBody,
                },
                layout: {
                    hLineWidth: function (i: number, node: any) {
                        return i === 0 || i === node.table.body.length ? 1 : 0.5;
                    },
                    vLineWidth: function (i: number, node: any) {
                        return i === 0 || i === node.table.widths.length ? 1 : 0.5;
                    },
                    hLineColor: function () {
                        return '#aaa';
                    },
                    vLineColor: function () {
                        return '#aaa';
                    },
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
            },
            subheader: {
                fontSize: 12,
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#f0f0f0',
            },
        },
        defaultStyle: {
            fontSize: 9,
        },
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Pensiun_${timestamp}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename || defaultFilename);
};

/**
 * Export data pensiun dengan filter tertentu
 */
export const exportPensiunToPdfWithFilters = (
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

    // Apply filters jika ada
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

    // Generate filename dengan info filter
    let finalFilename = filename;
    if (!finalFilename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        let filterInfo = '';
        if (filters?.status) filterInfo += `_${filters.status}`;
        if (filters?.jenis_pensiun) filterInfo += `_${filters.jenis_pensiun}`;
        finalFilename = `Data_Pensiun${filterInfo}_${timestamp}.pdf`;
    }

    exportPensiunToPdf(filteredData, finalFilename);
};

