import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Employee } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';

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
 * Export data pegawai ke file PDF
 */
export const exportPegawaiToPdf = (data: Employee[], filename?: string): void => {
    if (!data || data.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const tableBody = [
        [
            { text: 'No', style: 'tableHeader', alignment: 'center' },
            { text: 'Nama', style: 'tableHeader' },
            { text: 'NIP', style: 'tableHeader' },
            { text: 'Status Pekerjaan', style: 'tableHeader' },
            { text: 'Jabatan', style: 'tableHeader' },
            { text: 'Jenis Kelamin', style: 'tableHeader' },
            { text: 'Agama', style: 'tableHeader' },
            { text: 'Email', style: 'tableHeader' },
        ],
        ...data.map((pegawai, index) => [
            { text: String(index + 1), alignment: 'center' },
            { text: pegawai.nama || '' },
            { text: pegawai.nip || '' },
            { text: pegawai.status_pekerjaan || '' },
            { text: pegawai.jabatan || '' },
            { text: pegawai.jenis_kelamin || '' },
            { text: pegawai.agama || '' },
            { text: pegawai.email || '' },
        ]),
    ];

    const docDefinition: any = {
        content: [
            {
                text: 'Data Pegawai',
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
                    widths: ['auto', '*', 'auto', 'auto', '*', 'auto', 'auto', '*'],
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
    const defaultFilename = `Data_Pegawai_${timestamp}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename || defaultFilename);
};

/**
 * Export data pegawai dengan filter tertentu
 */
export const exportPegawaiToPdfWithFilters = (
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
        finalFilename = `Data_Pegawai${filterStr}_${timestamp}.pdf`;
    }

    exportPegawaiToPdf(filteredData, finalFilename);
};

