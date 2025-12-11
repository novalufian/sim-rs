import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PermohonanMutasiWithRelations } from '@/hooks/fetch/mutasi/useMutasiPermohonan';

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
 * Export data mutasi ke file PDF
 */
export const exportMutasiToPdf = (data: PermohonanMutasiWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const tableBody = [
        [
            { text: 'No', style: 'tableHeader', alignment: 'center' },
            { text: 'NIP', style: 'tableHeader' },
            { text: 'Nama Pegawai', style: 'tableHeader' },
            { text: 'Jenis Mutasi', style: 'tableHeader' },
            { text: 'Instansi Tujuan', style: 'tableHeader' },
            { text: 'Tanggal Pengajuan', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
        ],
        ...data.map((mutasi, index) => [
            { text: String(index + 1), alignment: 'center' },
            { text: mutasi.pegawai_nip || mutasi.nip || '' },
            { text: mutasi.pegawai_nama || mutasi.nama || '' },
            { text: getJenisMutasiLabel(mutasi.jenis_mutasi || '') },
            { text: mutasi.instansi_tujuan || '' },
            { text: formatDateIndonesian(mutasi.tanggal_pengajuan) },
            { text: getStatusLabel(mutasi.status || '') },
        ]),
    ];

    const docDefinition: any = {
        content: [
            {
                text: 'Data Mutasi',
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
                    widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto'],
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
    const defaultFilename = `Data_Mutasi_${timestamp}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename || defaultFilename);
};

