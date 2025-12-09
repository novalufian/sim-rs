import { z } from "zod";

export const permohonanGajiSchema = z.object({
    id_pegawai: z.string().min(1, "ID Pegawai wajib diisi"),
    tanggal_pengajuan: z.string().optional(),
    gaji_pokok_lama: z.number().min(0, "Gaji pokok lama harus lebih dari 0"),
    gaji_pokok_baru: z.number().min(0, "Gaji pokok baru harus lebih dari 0"),
    tmt_kgb_lama: z.string().min(1, "TMT KGB lama wajib diisi"),
    tmt_kgb_baru: z.string().min(1, "TMT KGB baru wajib diisi"),
    masa_kerja_gol_lama: z.string().min(1, "Masa kerja golongan lama wajib diisi"),
    masa_kerja_gol_baru: z.string().min(1, "Masa kerja golongan baru wajib diisi"),
}).refine(
    (data) => {
        if (data.gaji_pokok_baru <= data.gaji_pokok_lama) {
            return false;
        }
        return true;
    },
    {
        message: "Gaji pokok baru harus lebih besar dari gaji pokok lama",
        path: ["gaji_pokok_baru"],
    }
).refine(
    (data) => {
        if (data.tmt_kgb_lama && data.tmt_kgb_baru) {
            const tmtLama = new Date(data.tmt_kgb_lama);
            const tmtBaru = new Date(data.tmt_kgb_baru);
            return tmtBaru >= tmtLama;
        }
        return true;
    },
    {
        message: "TMT KGB baru harus setelah atau sama dengan TMT KGB lama",
        path: ["tmt_kgb_baru"],
    }
);

export type PermohonanGajiFormData = z.infer<typeof permohonanGajiSchema>;

