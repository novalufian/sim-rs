export interface Employee {
  id: string;
  id_pegawai: string;
  nama: string;
  nip: string;
  email?: string | null;

  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  umur?: string | null; // "21 tahun 3 bulan" → string, bukan number

  jenis_kelamin?: string | null;
  agama?: string | null;
  status_perkawinan?: string | null;
  status_pekerjaan?: string | null;

  alamat_ktp?: string | null;
  alamat_domisili?: string | null;
  avatar_url?: string | null;

  no_kk?: {
    masked: string;
    unmasked: string;
  } | null;

  no_rekening?: {
    masked: string;
    unmasked: string;
  } | null;

  no_hp?: {
    masked: string;
    unmasked: string;
  } | null;

  // === Data Pengangkatan ===
  pengangkatan_tmt?: string | null;
  pengangkatan_nomor_sk?: string | null;
  pengangkatan_masakerja?: string | null;

  // === Pangkat & Jabatan ===
  pangkat_tmt?: string | null;
  jabatan?: string | null;
  jabatan_tmt?: string | null;

  // === Pendidikan ===
  pendidikan_jenjang?: string | null;
  pendidikan_jurusan?: string | null;
  pendidikan_institusi?: string | null;
  pendidikan_tahun_selesai?: number | null;
  pendidikan_gelar?: string | null;

  is_deleted: boolean;
}


export interface Column {
  id: string;
  label: string;
  width: string;
  sticky?: 'left' | 'right';
}

export interface DropdownState {
  [key: number]: boolean;
} 