// cutiTableColumns.tsx
import { Column } from "./cutiPermohonan";

export const CutiTableColumns: Column[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'nama_pegawai', label: 'Nama Pegawai', width: 'w-[200px]' },
    { id: 'nip_pegawai', label: 'NIP', width: 'w-[150px]' },
    { id: 'nama_jenis_cuti', label: 'Jenis Cuti', width: 'w-[150px]' },
    { id: 'tanggal_mulai_cuti', label: 'Tgl Mulai', width: 'w-[120px]' },
    { id: 'tanggal_selesai_cuti', label: 'Tgl Selesai', width: 'w-[120px]' },
    { id: 'jumlah_hari', label: 'Jumlah Hari', width: 'w-[100px]' },
    { id: 'tanggal_diajukan', label: 'Tgl Pengajuan', width: 'w-[120px]' },
    { id: 'status', label: 'Status', width: 'w-[160px]' },
    { id: 'nomor_surat_cuti', label: 'No. SK Cuti', width: 'w-[160px]' },
    { id: 'alasan_cuti', label: 'Alasan Cuti', width: 'w-[250px]' },
    { id: 'actions', label: 'Aksi', width: 'w-[100px]', sticky: 'right' },
];