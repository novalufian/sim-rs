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
import { PermohonanPensiunWithRelations } from '@/hooks/fetch/pensiun/usePensiunPermohonan';

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
 * Export data pensiun ke file DOC
 */
export const exportPensiunToDoc = async (data: PermohonanPensiunWithRelations[], filename?: string): Promise<void> => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Header tabel
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun('No')], alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('NIP')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Nama Pegawai')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Jenis Pensiun')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Tanggal Pengajuan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Tanggal Pensiun')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Status')] })] }),
        ],
    });

    // Data rows
    const dataRows = data.map((pensiun, index) => 
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(String(index + 1))], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pensiun.pegawai_nip || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pensiun.pegawai_nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getJenisPensiunLabel(pensiun.jenis_pensiun || ''))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatDateIndonesian(pensiun.tanggal_pengajuan))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(formatDateIndonesian(pensiun.tanggal_pensiun))] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(getStatusLabel(pensiun.status || ''))] })] }),
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
                    children: [new TextRun({ text: 'Data Pensiun', bold: true, size: 32 })],
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
    const defaultFilename = `Data_Pensiun_${timestamp}.docx`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Export data pensiun dengan filter tertentu
 */
export const exportPensiunToDocWithFilters = async (
    data: PermohonanPensiunWithRelations[],
    filters?: {
        status?: string;
        jenis_pensiun?: string;
        startDate?: string;
        endDate?: string;
    },
    filename?: string
): Promise<void> => {
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
        finalFilename = `Data_Pensiun${filterInfo}_${timestamp}.docx`;
    }

    await exportPensiunToDoc(filteredData, finalFilename);
};

