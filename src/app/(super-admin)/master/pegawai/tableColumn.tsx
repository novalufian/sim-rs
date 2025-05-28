export interface ColumnDef {
    id: string;
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

// src/app/(admin)/(main-app)/sim-pegawai/data/tableColumns.ts
export const PegawaiTableColumns: ColumnDef[] = [
    { id: "no", label: "No", width: "w-[60px]", sticky: "left" },
    { id: "nip", label: "NIP", width: "w-[150px]" },
    { id: "nama", label: "Nama", width: "w-[250px]" },
    { id: "jenis_kelamin", label: "Jenis Kelamin", width: "w-[120px]" },
    { id: "agama", label: "Agama", width: "w-[120px]" },
    { id: "status_pekerjaan", label: "Status Pekerjaan", width: "w-[150px]" },
    { id: "tempat_lahir", label: "Tempat Lahir", width: "w-[150px]" },
    { id: "tanggal_lahir", label: "Tanggal Lahir", width: "w-[150px]" }, // Will need formatting in getColumnValue
    { id: "umur", label: "Umur", width: "w-[80px]" },
    { id: "nik", label: "NIK", width: "w-[200px]" },
    { id: "no_hp", label: "No. HP", width: "w-[150px]" },
    { id: "email", label: "Email", width: "w-[200px]" },
    { id: "npwp", label: "NPWP", width: "w-[180px]" },
    { id: "bpjs", label: "BPJS", width: "w-[180px]" },
    { id: "status_perkawinan", label: "Status Perkawinan", width: "w-[150px]" },
    { id: "actions", label: "", width: "w-[30px]", sticky: "right" }
];