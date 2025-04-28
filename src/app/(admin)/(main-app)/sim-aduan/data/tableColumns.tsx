import { Column } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";

export const LaporTableColumns: Column[] = [
    { id: "no", label: "No", width: "w-[60px]", sticky: "left" },
    { id: "tanggal_pelaporan", label: "Tanggal Pelaporan", width: "w-[100px]" },
    { id: "judul", label: "Judul Laporan", width: "w-[300px]" },
    { id: "klasifikasi", label: "Klasifikasi", width: "w-[180px]" },
    { id: "status", label: "Status", width: "w-[120px]" },
    { id: "priority", label: "Priority", width: "w-[100px]" },
    { id: "alamat", label: "Alamat", width: "w-[300px]" },
    { id: "uraian", label: "Isi Laporan", width: "w-[300px]" },
    { id: "masked_email", label: "Email", width: "w-[200px]" },
    { id: "masked_nik", label: "NIK", width: "w-[200px]" },
    { id: "masked_no_hp", label: "No HP", width: "w-[180px]" },
    { id: "skrining_masalah_nama", label: "Skrining Masalah", width: "w-[200px]" },
    { id: "tindak_lanjut_nama", label: "Tindak Lanjut", width: "w-[200px]" },
    // { id: "created_at", label: "Dibuat Pada", width: "w-[180px]" },
    { id: "actions", label: "", width: "w-[30px]", sticky: "right" }
];  
