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
import { PermohonanMutasiWithRelations } from '@/hooks/fetch/mutasi/useMutasiPermohonan';

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
 * Export data mutasi ke file DOC
 */
export const exportMutasiToDoc = async (data: PermohonanMutasiWithRelations[], filename?: string): Promise<void> => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Header tabel
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun('No')], alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('NIP')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Nama Pegawai')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Jenis Mutasi')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Instansi Tujuan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Tanggal Pengajuan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Status')] })] }),
        ],
    });

    // Data rows
    const dataRows = data.map((mutasi, index) => 
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(String(index + 1))], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(mutasi.pegawai_nip || mutasi.nip || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(mutasi.pegawai_nama || mutasi.nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getJenisMutasiLabel(mutasi.jenis_mutasi || ''))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(mutasi.instansi_tujuan || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatDateIndonesian(mutasi.tanggal_pengajuan))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getStatusLabel(mutasi.status || ''))] })] }),
            ],
        })
    );

    const table = new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
    });

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [new TextRun({ text: 'Data Mutasi', bold: true, size: 32 })],
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
    const defaultFilename = `Data_Mutasi_${timestamp}.docx`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

