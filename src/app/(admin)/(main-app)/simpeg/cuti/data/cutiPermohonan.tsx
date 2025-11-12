// cutiPermohonan.tsx
// import { Column } from '@/app/types'; // Asumsi Anda memiliki type Column global

// Enum StatusPermohonanCuti dari schema.prisma
export enum StatusCuti {
    DIAJUKAN = 'DIAJUKAN',
    DISETUJUI_KA_UNIT = 'DISETUJUI_KA_UNIT',
    DISETUJUI_KA_BIDANG = 'DISETUJUI_KA_BIDANG',
    VALIDASI_KEPEGAWAIAN = 'VALIDASI_KEPEGAWAIAN',
    DISETUJUI_AKHIR = 'DISETUJUI_AKHIR',
    DITOLAK = 'DITOLAK',
    DIREVISI = 'DIREVISI',
    DIBATALKAN = 'DIBATALKAN',
    SELESAI = 'SELESAI',
}

export interface PermohonanCuti {
    id: string;
    id_pegawai: string;
    nama_pegawai: string; // Asumsi join/lookup data pegawai
    nip_pegawai: string;   // Asumsi join/lookup data pegawai
    id_jenis_cuti: number;
    nama_jenis_cuti: string; // Asumsi join/lookup data jenis cuti
    tanggal_mulai_cuti: string; // Gunakan string untuk tanggal dari backend
    tanggal_selesai_cuti: string;
    jumlah_hari: number;
    alasan_cuti: string;
    status: StatusCuti; // Menggunakan enum yang sudah didefinisikan
    tanggal_diajukan: string;
    nomor_surat_cuti: string | null;
    catatan_kepegawaian: string | null;
    // Tambahkan field lain sesuai kebutuhan dari backend/API
}

// Interface untuk state dropdown (seperti di employee.tsx)
export interface DropdownState {
    [key: number]: boolean;
}

// Interface yang lebih umum untuk kolom tabel
export interface Column {
    id: keyof PermohonanCuti | 'no' | 'actions';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
    // ... field lain
}