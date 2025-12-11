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
import { Employee } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';

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
 * Export data pegawai ke file DOC
 */
export const exportPegawaiToDoc = async (data: Employee[], filename?: string): Promise<void> => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Header tabel
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun('No')], alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Nama')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('NIP')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Status Pekerjaan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Jabatan')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Jenis Kelamin')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Agama')] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun('Email')] })] }),
        ],
    });

    // Data rows
    const dataRows = data.map((pegawai, index) => 
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(String(index + 1))], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.nama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.nip || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.status_pekerjaan || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.jabatan || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.jenis_kelamin || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.agama || '')] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(pegawai.email || '')] })] }),
            ],
        })
    );

    const table = new Table({
        rows: [headerRow, ...dataRows],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
    });

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Data Pegawai',
                            bold: true,
                            size: 28,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Tanggal Export: ${formatDateIndonesian(new Date())}`,
                            size: 22,
                        }),
                    ],
                    spacing: { after: 400 },
                }),
                table,
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `Data_Pegawai_${timestamp}.docx`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Export data pegawai dengan filter tertentu
 */
export const exportPegawaiToDocWithFilters = async (
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
): Promise<void> => {
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
        finalFilename = `Data_Pegawai${filterStr}_${timestamp}.docx`;
    }

    await exportPegawaiToDoc(filteredData, finalFilename);
};

