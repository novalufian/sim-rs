import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PermohonanGajiWithRelations } from '@/hooks/fetch/gaji/useGajiPermohonan';

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
 * Export data gaji ke file PDF
 */
export const exportGajiToPdf = (data: PermohonanGajiWithRelations[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const tableBody = [
        [
            { text: 'No', style: 'tableHeader', alignment: 'center' },
            { text: 'NIP', style: 'tableHeader' },
            { text: 'Nama Pegawai', style: 'tableHeader' },
            { text: 'Gaji Pokok Lama', style: 'tableHeader', alignment: 'right' },
            { text: 'Gaji Pokok Baru', style: 'tableHeader', alignment: 'right' },
            { text: 'Selisih', style: 'tableHeader', alignment: 'right' },
            { text: 'Status', style: 'tableHeader' },
        ],
        ...data.map((gaji, index) => {
            const selisih = gaji.selisih_gaji || (gaji.gaji_pokok_baru - gaji.gaji_pokok_lama);
            return [
                { text: String(index + 1), alignment: 'center' },
                { text: gaji.pegawai_nip || '' },
                { text: gaji.pegawai_nama || '' },
                { text: formatCurrency(gaji.gaji_pokok_lama), alignment: 'right' },
                { text: formatCurrency(gaji.gaji_pokok_baru), alignment: 'right' },
                { text: formatCurrency(selisih), alignment: 'right' },
                { text: getStatusLabel(gaji.status || '') },
            ];
        }),
    ];

    const docDefinition: any = {
        content: [
            {
                text: 'Data Kenaikan Gaji Berkala',
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
    const defaultFilename = `Data_Kenaikan_Gaji_${timestamp}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename || defaultFilename);
};

