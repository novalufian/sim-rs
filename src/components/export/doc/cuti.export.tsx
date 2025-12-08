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
// Interface dan helper functions lainnya (diasumsikan sudah diimpor/didefinisikan di sini)
import { PermohonanCutiWithRelations } from '@/hooks/fetch/cuti/useCutiPermohonan';

// Interface untuk data tambahan pegawai yang diperlukan
export interface CutiExportData {
    cuti: PermohonanCutiWithRelations;
    // Data tambahan pegawai
    pangkat?: string | null;
    golongan?: string | null;
    jabatan?: string | null;
    unit_ruangan?: string | null;
    satuan_organisasi?: string;
    // Data surat
    nomor_surat?: string;
    tanggal_surat?: Date | string;
    // Data penandatangan
    nama_penandatangan?: string;
    nip_penandatangan?: string;
    jabatan_penandatangan?: string;
    pangkat_penandatangan?: string;
}

// Helper untuk format tanggal Indonesia
const formatDateIndonesian = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    try {
        const d = date instanceof Date ? date : new Date(date);
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

// Helper untuk format tanggal range
const formatDateRange = (start: Date | string | null | undefined, end: Date | string | null | undefined): string => {
    const startStr = formatDateIndonesian(start);
    const endStr = formatDateIndonesian(end);
    if (!startStr || !endStr) return '';
    return `${startStr} s.d ${endStr}`;
};

// Helper untuk mendapatkan tahun dari tanggal
const getYear = (date: Date | string | null | undefined): number => {
    if (!date) return new Date().getFullYear();
    try {
        const d = date instanceof Date ? date : new Date(date);
        return d.getFullYear();
    } catch {
        return new Date().getFullYear();
    }
};

/**
 * Fungsi untuk export dokumen Surat Keterangan Cuti Alasan Penting
 * @param data Data cuti dan pegawai yang diperlukan
 * @returns Promise<Blob> File docx yang siap diunduh
 */
export const exportCutiAlasanPenting = async (data: CutiExportData): Promise<Blob> => {
    const { cuti } = data;
    
    // Format data
    const nama = cuti.nama || '-';
    const nip = cuti.nip || '-';
    const pangkat = data.pangkat || '-';
    const golongan = data.golongan || '';
    const pangkatGol = golongan ? `${pangkat} / ${golongan}` : pangkat; // Sesuai format di gambar
    const jabatan = data.jabatan || '-';
    const unitRuangan = data.unit_ruangan || '-';
    const satuanOrganisasi = data.satuan_organisasi || 'RSUD dr. Abdul Rivai Kabupaten Berau';
    const tahun = getYear(cuti.tanggal_mulai_cuti);
    const lamaCuti = cuti.jumlah_hari || 0;
    const tanggalCuti = formatDateRange(cuti.tanggal_mulai_cuti, cuti.tanggal_selesai_cuti);
    const keterangan = cuti.alasan_cuti || '-';
    
    // Data surat
    const nomorSurat = data.nomor_surat || cuti.nomor_surat_cuti || '445 / 1117 / TU-1 / XI / 2025';
    const tanggalSurat = data.tanggal_surat || cuti.tanggal_surat_cuti || new Date();
    const tanggalSuratFormatted = formatDateIndonesian(tanggalSurat);
    
    // Data penandatangan (Menggunakan data default yang ada di file Anda)
    const namaPenandatangan = data.nama_penandatangan || 'Arif Rudi Hermawan, S.Si., M.Si., Apt';
    const nipPenandatangan = data.nip_penandatangan || '197310102003121014';
    const jabatanPenandatangan = data.jabatan_penandatangan || 'Plh. Direktur';
    const pangkatPenandatangan = data.pangkat_penandatangan || 'Pembina';
    
    // Lokasi
    const lokasi = 'Tanjung Redeb';

    // Data-data yang akan dicetak di bawah NIP
    const employeeDataList = [
        { label: "Nama", value: nama, bold: false },
        { label: "Nip", value: nip, bold: false },
        { label: "Pangkat / Gol", value: pangkatGol, bold: false, italic: true },
        { label: "Jabatan", value: jabatan, bold: false },
        { label: "Unit / Ruangan", value: unitRuangan, bold: false },
        { label: "Satuan Organisasi", value: satuanOrganisasi, bold: false },
        { label: "Cuti Untuk Tahun", value: tahun.toString(), bold: false },
        { label: "Lama Cuti", value: `${lamaCuti} Hari`, bold: false },
        { label: "Tanggal Mulai Cuti", value: tanggalCuti, bold: false },
        { label: "Keterangan", value: keterangan, bold: false }
    ];

    // Membuat dokumen
    const doc = new Document({
        // Gunakan font Times New Roman secara default untuk seluruh dokumen
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 24, // 12pt
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1417,    // 2.5 cm
                            right: 1134,  // 2.0 cm
                            bottom: 1134, // 2.0 cm
                            left: 1701,   // 3.0 cm (standar surat)
                        },
                    },
                },
                children: [
                    // ==========================================================
                    // 1. HEADER (KOP SURAT) - Menggunakan Table untuk alignment logo
                    // ==========================================================
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE },
                            insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        // Placeholder Logo Kiri (Pemda Berau)
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        children: [
                                            // Biasanya image here, tapi kita pakai placeholder teks
                                            new Paragraph({
                                                children: [new TextRun({ text: "[Logo Berau]", size: 20 })],
                                                alignment: AlignmentType.CENTER,
                                            }),
                                        ],
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                    }),
                                    new TableCell({
                                        // Teks Kop Surat
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                children: [new TextRun({ text: "PEMERINTAH KABUPATEN BERAU", bold: true, size: 28 })],
                                                alignment: AlignmentType.CENTER,
                                                spacing: { after: 50 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "RUMAH SAKIT UMUM DAERAH dr. ABDUL RIVAI", bold: true, size: 36 })], // Lebih besar
                                                alignment: AlignmentType.CENTER,
                                                spacing: { after: 50 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "Jalan Pulau Panjang No. 276 Kode Pos. 77311 Telp. (0554) 21359 Fax. 21359", size: 20 })],
                                                alignment: AlignmentType.CENTER,
                                                spacing: { after: 50 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "Website: rsuddrabdulrivai.co.id/ E-mail: rsudrabdulrivai@gmail.com", size: 20 })],
                                                alignment: AlignmentType.CENTER,
                                                spacing: { after: 50 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "TANJUNG REDEB", bold: true, size: 24 })],
                                                alignment: AlignmentType.CENTER,
                                            }),
                                        ],
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                    }),
                                    new TableCell({
                                        // Placeholder Logo Kanan (RSUD)
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        children: [
                                            // Biasanya image here
                                            new Paragraph({
                                                children: [new TextRun({ text: "[Logo RSUD]", size: 20 })],
                                                alignment: AlignmentType.CENTER,
                                            }),
                                        ],
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                    }),
                                ],
                            }),
                        ],
                    }),

                    // Garis Pemisah Header (Horizontal Rule)
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                            }),
                        ],
                        border: {
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 12, // Ketebalan
                                color: "000000",
                            },
                        },
                        spacing: { before: 200, after: 400 },
                    }),
                    
                    // ==========================================================
                    // 2. JUDUL SURAT
                    // ==========================================================
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "SURAT KETERANGAN CUTI ALASAN PENTING",
                                bold: true,
                                size: 28, // 14pt
                                underline: { type: "single" },
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }),
                    
                    // Nomor Surat
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Nomor: ${nomorSurat}`,
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    
                    // ==========================================================
                    // 3. DATA PEGAWAI
                    // ==========================================================
                    // Paragraf pembuka
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Diberikan Cuti Alasan Penting Kepada Pegawai RSUD dr. Abdul Rivai dengan data sebagai berikut:",
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                    }),

                    // Data Pegawai - Menggunakan Table untuk perataan kolon (:)
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [28, 2, 70], // 28% untuk Label, 2% untuk Kolon, 70% untuk Value
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE },
                            insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: employeeDataList.map(item => new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: item.label, size: 24 })],
                                            // Indentasi untuk data pegawai
                                            indent: { left: 400 } 
                                        }),
                                    ],
                                    borders: {
                                        top: { style: BorderStyle.NONE },
                                        bottom: { style: BorderStyle.NONE },
                                        left: { style: BorderStyle.NONE },
                                        right: { style: BorderStyle.NONE },
                                    },
                                    verticalAlign: "top",
                                }),
                                new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: ":", size: 24 })] })],
                                    borders: {
                                        top: { style: BorderStyle.NONE },
                                        bottom: { style: BorderStyle.NONE },
                                        left: { style: BorderStyle.NONE },
                                        right: { style: BorderStyle.NONE },
                                    },
                                    verticalAlign: "top",
                                    width: { size: 5, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({ 
                                                    text: item.value, 
                                                    size: 24, 
                                                    italics: item.italic 
                                                })
                                            ],
                                            alignment: AlignmentType.JUSTIFIED,
                                        }),
                                    ],
                                    borders: {
                                        top: { style: BorderStyle.NONE },
                                        bottom: { style: BorderStyle.NONE },
                                        left: { style: BorderStyle.NONE },
                                        right: { style: BorderStyle.NONE },
                                    },
                                    verticalAlign: "top",
                                }),
                            ],
                            cantSplit: true,
                            height: { value: 300, rule: "atLeast" } // Sedikit ruang antara baris
                        })),
                    }),
                    
                    // Jarak setelah data pegawai
                    new Paragraph({
                        children: [new TextRun({ text: "" })],
                        spacing: { after: 400 },
                    }),

                    // ==========================================================
                    // 4. KETENTUAN DAN PENUTUP
                    // ==========================================================
                    // Ketentuan pembuka
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Dengan ketentuan sebagai berikut:",
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                    }),

                    // Ketentuan a.
                    new Paragraph({
                        children: [
                            new TextRun({ text: "a. ", size: 24 }),
                            new TextRun({
                                text: "Sebelum menjalani Cuti Alasan Penting tersebut wajib menyerahkan pekerjaan kepada Atasan langsung atau Pejabat lain yang ditunjuk.",
                                size: 24,
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 120 },
                        indent: { left: 400 }, // Indentasi untuk list
                    }),
                    
                    // Ketentuan b.
                    new Paragraph({
                        children: [
                            new TextRun({ text: "b. ", size: 24 }),
                            new TextRun({
                                text: "Setelah selesai menjalankan Cuti Alasan Penting tersebut agar segera kembali dan wajib melaporkan diri ke Bagian Kepegawaian atau Atasan Langsung atau Pejabat lain yang ditunjuk dan bekerja kembali sebagaimana mestinya.",
                                size: 24,
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 },
                    }),
                    
                    // Paragraf Penutup
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Demikian Surat Keterangan Cuti Alasan Penting ini dibuat untuk dapat dipergunakan sebagaimana mestinya.",
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 },
                    }),
                    
                    // ==========================================================
                    // 5. TANDA TANGAN (RIGHT ALIGNED)
                    // ==========================================================
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${lokasi}, ${tanggalSuratFormatted}`,
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 120 },
                        indent: { right: 500 } // Geser ke kiri sedikit
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jabatanPenandatangan,
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 600 }, // Ruang untuk TTD/Stempel
                        indent: { right: 500 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: namaPenandatangan,
                                size: 24, // 12pt
                                underline: { type: "single" }
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 120 },
                        indent: { right: 500 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: pangkatPenandatangan, // Pangkat diletakkan di bawah nama
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 120 },
                        indent: { right: 500 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `NIP. ${nipPenandatangan}`,
                                size: 24, // 12pt
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 400 },
                        indent: { right: 500 }
                    }),
                    
                    // ==========================================================
                    // 6. TEMBUSAN
                    // ==========================================================
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tembusan Disampaikan Kepada Yth:",
                                size: 24, // 12pt
                                bold: true,
                                underline: { type: "single" }
                            }),
                        ],
                        spacing: { after: 100 },
                        indent: { right: 500 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Inspektur Inspektorat Kabupaten Berau", size: 24 }),
                        ],
                        spacing: { after: 100 },
                        indent: { left: 200 } // Indentasi list tembusan
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Kepala BKPSDM Kabupaten Berau", size: 24 }),
                        ],
                        spacing: { after: 100 },
                        indent: { left: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Ka. Bid. Keperawatan", size: 24 }),
                        ],
                        spacing: { after: 100 },
                        indent: { left: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "4. Yang Bersangkutan", size: 24 }),
                        ],
                        spacing: { after: 100 },
                        indent: { left: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "5. Arsip", size: 24 }),
                        ],
                        spacing: { after: 200 },
                        indent: { left: 200 }
                    }),
                    
                    // Placeholder Logo BerAKHLAK (di kanan bawah)
                    new Paragraph({
                        children: [new TextRun({ text: "[Logo BerAKHLAK]", size: 20 })],
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 200 }
                    }),
                ],
            },
        ],
    });

    // Generate dan return blob
    const blob = await Packer.toBlob(doc);
    return blob;
};

/**
 * Helper function untuk download file
 * @param blob Blob file yang akan diunduh
 * @param filename Nama file
 */
export const downloadCutiDocument = async (data: CutiExportData, filename?: string): Promise<void> => {
    const blob = await exportCutiAlasanPenting(data);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `Surat_Cuti_${data.cuti.nama || 'Pegawai'}_${new Date().getTime()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};