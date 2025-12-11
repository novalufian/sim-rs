import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    AlignmentType, 
    Table, 
    TableRow, 
    TableCell, 
    WidthType
} from 'docx';
import { PermohonanGajiWithRelations } from '@/hooks/fetch/gaji/useGajiPermohonan';

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
 * Export data gaji ke file DOC
 */
export const exportGajiToDoc = async (data: PermohonanGajiWithRelations[], filename?: string): Promise<void> => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Header tabel
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun('No')], alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('NIP')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Nama Pegawai')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Gaji Pokok Lama')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Gaji Pokok Baru')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Selisih')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Status')] })] }),
        ],
    });

    // Data rows
    const dataRows = data.map((gaji, index) => {
        const selisih = gaji.selisih_gaji || (gaji.gaji_pokok_baru - gaji.gaji_pokok_lama);
        return new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(String(index + 1))], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(gaji.pegawai_nip || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(gaji.pegawai_nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatCurrency(gaji.gaji_pokok_lama))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatCurrency(gaji.gaji_pokok_baru))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatCurrency(selisih))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getStatusLabel(gaji.status || ''))] })] }),
            ],
        });
    });

    const table = new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
    });

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [new TextRun({ text: 'Data Kenaikan Gaji Berkala', bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [new TextRun({ text: `Tanggal Export: ${formatDateIndonesian(new Date())}`, size: 24 })],
                    spacing: { after: 400 },
                }),
                table,
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Kenaikan_Gaji_${timestamp}.docx`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

