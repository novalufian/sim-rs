// src/app/(admin)/(main-app)/sim-pegawai/data/pegawaiInterface.ts
import { z } from 'zod';

export interface Pegawai {
    id_pegawai?: string;
    no_urut?: number;
    nama?: string;
    nip?: string;
    tempat_lahir?: string | null;
    tanggal_lahir?: Date | null;
    umur?: number | null;
    jenis_kelamin?: string | null;
    agama?: string | null;
    nik?: string | null;
    no_kk?: string | null;
    alamat_ktp?: string | null;
    alamat_domisili?: string | null;
    no_hp?: string | null;
    email?: string | null;
    npwp?: string | null;
    bpjs?: string | null;
    nama_bank_gaji?: string | null;
    no_rekening?: string | null;
    status_perkawinan?: string | null;
    nama_pasangan?: string | null;
    nama_anak?: string | null;
    status_pekerjaan: string;
    created_at: Date;
    updated_at: Date;
    created_by?: string | null;
    updated_by?: string | null;
    is_deleted?: boolean;
}

// Zod Schema for Pegawai Form Input
export const pegawaiSchema = z.object({
    // no_urut: z.preprocess will be handled implicitly by register's valueAsNumber
    no_urut: z.number({
        invalid_type_error: "No. Urut harus angka",
        required_error: "No. Urut wajib diisi"
    }).min(1, "No. Urut harus lebih dari 0"), // no_urut should always be a number due to HTML input type="number"

    nama: z.string().min(1, "Nama wajib diisi"),
    nip: z.string().min(1, "NIP wajib diisi"),

    // Optional fields remain optional, but type handling for empty strings:
    tempat_lahir: z.string().nullable().optional(), // `nullable()` means it can be null, `optional()` means it can be undefined.
    // For date, it comes as a string from HTML input
    tanggal_lahir: z.string().nullable().optional().or(z.literal("")), // Accept empty string for optional date

    // Handle umur: if empty string, treat as null. Then validate as number.
    umur: z.preprocess(
        (val) => {
            if (typeof val === 'string' && val.trim() === '') return null;
            return val;
        },
        z.number().int().positive("Umur harus angka positif").nullable().optional()
    ),

    jenis_kelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]).nullable().optional(),
    agama: z.enum(["ISLAM", "KRISTEN_PROTESTAN", "KATOLIK", "HINDU", "BUDHA", "KONGHUCU"]).nullable().optional(),
    nik: z.string().min(16, "NIK harus 16 digit").nullable().optional().or(z.literal("")),
    no_kk: z.string().nullable().optional().or(z.literal("")),
    alamat_ktp: z.string().nullable().optional().or(z.literal("")),
    alamat_domisili: z.string().nullable().optional().or(z.literal("")),
    no_hp: z.string().nullable().optional().or(z.literal("")),
    email: z.string().email("Format email tidak valid").nullable().optional().or(z.literal("")),
    npwp: z.string().nullable().optional().or(z.literal("")),
    bpjs: z.string().nullable().optional().or(z.literal("")),
    nama_bank_gaji: z.string().nullable().optional().or(z.literal("")),
    no_rekening: z.string().nullable().optional().or(z.literal("")),
    status_perkawinan: z.enum(["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"]).nullable().optional(),
    nama_pasangan: z.string().nullable().optional().or(z.literal("")),
    nama_anak: z.string().nullable().optional().or(z.literal("")),
    status_pekerjaan: z.enum(["PNS","AKTIF", "NON_AKTIF", "PENSIUN", "CUTI"], {
        required_error: "Status pekerjaan wajib diisi",
    }),
});

export type PegawaiFormInput = z.infer<typeof pegawaiSchema>;