import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PermohonanBelajarWithRelations } from '@/hooks/fetch/belajar/useBelajarPermohonan';

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
 * Export data belajar ke file PDF
 */
export const exportBelajarToPdf = (data: PermohonanBelajarWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const tableBody = [
        [
            { text: 'No', style: 'tableHeader', alignment: 'center' },
            { text: 'NIP', style: 'tableHeader' },
            { text: 'Nama Pegawai', style: 'tableHeader' },
            { text: 'Jenis Permohonan', style: 'tableHeader' },
            { text: 'Institusi Pendidikan', style: 'tableHeader' },
            { text: 'Program Studi', style: 'tableHeader' },
            { text: 'Tanggal Mulai', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
        ],
        ...data.map((belajar, index) => [
            { text: String(index + 1), alignment: 'center' },
            { text: belajar.pegawai_nip || '' },
            { text: belajar.pegawai_nama || '' },
            { text: getJenisPermohonanLabel(belajar.jenis_permohonan || '') },
            { text: belajar.institusi_pendidikan_nama || '' },
            { text: belajar.program_studi_nama || '' },
            { text: formatDateIndonesian(belajar.tanggal_mulai_belajar) },
            { text: getStatusLabel(belajar.status || '') },
        ]),
    ];

    const docDefinition: any = {
        content: [
            {
                text: 'Data Ijin Belajar',
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
                    widths: ['auto', 'auto', '*', 'auto', '*', '*', 'auto', 'auto'],
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
    const defaultFilename = `Data_Ijin_Belajar_${timestamp}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename || defaultFilename);
};

