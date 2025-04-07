import { Lapor } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";

export const getColumnValue = (lapor: Lapor, columnId: string): string => {
  const columnMapping: { [key: string]: keyof Lapor } = {
    judul: "judul",
    bidang: "bidang",
    tanggalKejadian: "tanggal",
    isiLaporan: "isi",
    email: "email",
    noHp: "noHp",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    id: "id"
  };

  const key = columnMapping[columnId];
  const value = key ? lapor[key] : "";

  return typeof value === "string" || typeof value === "number" ? String(value) : "";
};

// Add a display name mapping if needed
export const columnDisplayNames: { [key: string]: string } = {
  judul: "JUDUL LAPORAN",
  bidang: "BIDANG YANG DITUJU",
  tanggalKejadian: "TANGGAL KEJADIAN",
  isiLaporan: "ISI LAPORAN",
  email: "EMAIL",
  noHp: "NO. HP",
  createdAt: "CREATED AT",
  updatedAt: "UPDATED AT",
  id: "ID"
};
