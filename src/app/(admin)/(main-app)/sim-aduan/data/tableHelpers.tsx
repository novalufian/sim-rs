"use client";
import { Lapor,  statusConfig, klasifikasiConfig, priorityConfig} from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";
import Link from "next/link";

export const getColumnValue = (lapor: Lapor, columnId: string): string | React.ReactNode => {
  const columnMapping: { [key: string]: keyof Lapor } = {
    id: "id",
    judul: "judul",
    klasifikasi: "klasifikasi",
    priority: "priority",
    status: "status",
    uraian: "uraian",
    media: "media",
    tanggal_pelaporan: "tanggal_pelaporan",
    masked_email: "masked_email",
    tindak_lanjut_nama: "tindak_lanjut_nama",
    created_at: "created_at",
  };

  const key = columnMapping[columnId];
  const value = key ? lapor[key] : "";

  if (columnId === "status" && typeof value === "string") {
    const status = statusConfig[value as keyof typeof statusConfig]
    return <span className={`px-3 py-1 rounded-full inline-flex flex-row items-center  ${status.bgColor +" "+status.color }`}>
      {status.icon}  <p className="ml-1">{status.label}</p>
    </span>;
  }

  if(columnId ==="judul" && typeof value === "string"){
    return <Link href={`/sim-aduan/data/${lapor.id}`} className="flex flex-col hover:decoration-1">
      {value}
    </Link>
  }


  if (columnId === "klasifikasi" && typeof value === "string") {
    const status = klasifikasiConfig[value as keyof typeof klasifikasiConfig]
    return <span className={`px-3 py-1 rounded-full inline-flex flex-row items-center font-light  ${status.bgColor +" "+status.color }`}>
      {status.icon}  <p className="ml-1">{status.label}</p>
    </span>;
  }

  if (columnId === "priority" && typeof value === "string") {
    const status = priorityConfig[value as keyof typeof priorityConfig]
    return <span className={`px-3 py-1 rounded-full inline-flex flex-row items-center font-light  ${status.bgColor +" "+status.color }`}>
      {status.icon}  <p className="ml-1">{status.label}</p>
    </span>;
  }

  if (typeof value === "string") {
    // Format tanggal jika kolom tanggal
    if (["tanggal_pelaporan", "created_at"].includes(columnId)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);
      }
    }
    return value;
  }

  return typeof value === "number" ? String(value) : "";
};
