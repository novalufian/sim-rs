import { Column } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";

export const LaporTableColumns: Column[] = [
    { id: "no", label: "No", width: "w-[60px]", sticky: "left" },
    { id: "judul", label: "Judul Laporan", width: "w-[300px]" },
    { id: "klasifikasi", label: "Klasifikasi", width: "w-[180px]" },
    { id: "status", label: "Status", width: "w-[120px]" },
    { id: "priority", label: "Priority", width: "w-[100px]" },
    { id: "tanggal_pelaporan", label: "Tanggal Pelaporan", width: "w-[100px]" },
    { id: "uraian", label: "Isi Laporan", width: "w-[300px]" },
    { id: "email", label: "Email", width: "w-[200px]" },
    { id: "tindak_lanjut", label: "Tindak Lanjut", width: "w-[200px]" },
    { id: "created_at", label: "Dibuat Pada", width: "w-[180px]" },
    { id: "actions", label: "", width: "w-[30px]", sticky: "right" },
];  
