import { z } from "zod";

export const permohonanBelajarSchema = z.object({
    id_pegawai: z.string().min(1, "ID Pegawai wajib diisi"),
    jenis_permohonan: z.enum(["TUGAS_BELAJAR", "IZIN_BELAJAR"], {
        errorMap: () => ({ message: "Jenis permohonan wajib diisi" }),
    }),
    id_program_studi: z.string().min(1, "Program studi wajib diisi"),
    id_institusi_pendidikan: z.string().min(1, "Institusi pendidikan wajib diisi"),
    gelar_yang_diperoleh: z.string().optional(),
    tanggal_mulai_belajar: z.string().min(1, "Tanggal mulai belajar wajib diisi"),
    tanggal_selesai_belajar: z.string().min(1, "Tanggal selesai belajar wajib diisi"),
    lama_studi_bulan: z.number().optional(),
    biaya_ditanggung: z.enum(["INSTANSI", "MANDIRI", "CAMPURAN"], {
        errorMap: () => ({ message: "Biaya ditanggung wajib diisi" }),
    }),
    status_pegawai_selama_belajar: z.string().optional(),
    kewajiban_setelah_belajar: z.string().optional(),
}).refine(
    (data) => {
        if (data.tanggal_mulai_belajar && data.tanggal_selesai_belajar) {
            const start = new Date(data.tanggal_mulai_belajar);
            const end = new Date(data.tanggal_selesai_belajar);
            return end >= start;
        }
        return true;
    },
    {
        message: "Tanggal selesai belajar harus setelah tanggal mulai belajar",
        path: ["tanggal_selesai_belajar"],
    }
);

export type PermohonanBelajarFormData = z.infer<typeof permohonanBelajarSchema>;

