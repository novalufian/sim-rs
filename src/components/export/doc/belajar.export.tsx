import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    AlignmentType, 
    Table, 
    TableRow, 
    TableCell, 
    WidthType, 
    BorderStyle
} from 'docx';
import { PermohonanBelajarWithRelations } from '@/hooks/fetch/belajar/useBelajarPermohonan';

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
 * Export data belajar ke file DOC
 */
export const exportBelajarToDoc = async (data: PermohonanBelajarWithRelations[], filename?: string): Promise<void> => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Header tabel
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun('No')], alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('NIP')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Nama Pegawai')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Jenis Permohonan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Institusi Pendidikan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Program Studi')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Tanggal Mulai')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Status')] })] }),
        ],
    });

    // Data rows
    const dataRows = data.map((belajar, index) => 
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(String(index + 1))], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(belajar.pegawai_nip || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(belajar.pegawai_nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getJenisPermohonanLabel(belajar.jenis_permohonan || ''))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(belajar.institusi_pendidikan_nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(belajar.program_studi_nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatDateIndonesian(belajar.tanggal_mulai_belajar))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getStatusLabel(belajar.status || ''))] })] }),
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
                    children: [new TextRun({ text: 'Data Ijin Belajar', bold: true, size: 32 })],
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
    const defaultFilename = `Data_Ijin_Belajar_${timestamp}.docx`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Export data belajar dengan filter tertentu
 */
export const exportBelajarToDocWithFilters = async (
    data: PermohonanBelajarWithRelations[],
    filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
    },
    filename?: string
): Promise<void> => {
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
        finalFilename = `Data_Ijin_Belajar${filterStr}_${timestamp}.docx`;
    }

    await exportBelajarToDoc(filteredData, finalFilename);
};

