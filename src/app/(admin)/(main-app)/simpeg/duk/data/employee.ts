export interface Employee {
  NAMA: string;
  "NIP/NIPPPK": string;
  PANGKAT: string;
  GOL: string;
  TMT: string;
  JABATAN: string;
  "NO. SK PANGKAT AKHIR": string;
  TMTJAB: string;
  ESELON: string;
  "TH MSKRJ": string;
  "BLN MS KRJ": string;
  PENDIDIKAN: string;
  "TAHUN LULUS": string;
  GELAR: string;
  TINGKAT: string;
  "TMPT LHR": string;
  TGLLHR: string;
  UMUR: string;
  "JENIS KELAMIN": string;
  AGAMA: string;
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