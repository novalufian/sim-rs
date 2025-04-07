import { Column } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";

export const LaporTableColumns: Column[] = [
    { id: "no", label: "No", width: "w-[60px]", sticky: "left" },
    { id: "judul", label: "Judul Laporan", width: "w-[200px]" },
    { id: "bidang", label: "Bidang yang Dituju", width: "w-[180px]" },
    { id: "tanggal", label: "Tanggal Kejadian", width: "w-[150px]" },
    { id: "isi", label: "Isi Laporan", width: "w-[300px]" },
    { id: "email", label: "Email", width: "w-[200px]" },
    { id: "noHp", label: "No. HP", width: "w-[150px]" },
    { id: "createdAt", label: "Created At", width: "w-[180px]" },
    { id: "updatedAt", label: "Updated At", width: "w-[180px]" },
    { id: "actions", label: "", width: "w-[30px]", sticky: "right" },
];
