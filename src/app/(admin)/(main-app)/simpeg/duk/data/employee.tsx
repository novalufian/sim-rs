export interface Employee {
  id: string;
  id_pegawai: string;
  nama: string;
  nip: string;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  umur?: number | null;
  jenis_kelamin?: string | null;
  agama?: string | null;
  status_perkawinan?: string | null;
  status_pekerjaan?: string | null;
  alamat_ktp?: string | null;
  alamat_domisili?: string | null;
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
  email?: string | null;
  tmt_pangkat?: string | null;
  tmt_jabatan?: string | null;
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