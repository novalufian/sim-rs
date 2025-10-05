import { Column } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';

export const DUKTableColumns: Column[] = [
  { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
  { id: 'nama', label: 'Nama', width: 'w-[200px]' },
  { id: 'nip', label: 'NIP', width: 'w-[150px]' },
  { id: 'tempat_lahir', label: 'Tempat Lahir', width: 'w-[120px]' },
  { id: 'tanggal_lahir', label: 'Tanggal Lahir', width: 'w-[120px]' },
  { id: 'umur', label: 'Umur', width: 'w-[120px]' },
  { id: 'jenis_kelamin', label: 'Jenis Kelamin', width: 'w-[120px]' },
  { id: 'agama', label: 'Agama', width: 'w-[100px]' },
  { id: 'status_perkawinan', label: 'Status Perkawinan', width: 'w-[140px]' },
  { id: 'status_pekerjaan', label: 'Status Pekerjaan', width: 'w-[140px]' },
  { id: 'alamat_ktp', label: 'Alamat KTP', width: 'w-[200px]' },
  { id: 'alamat_domisili', label: 'Alamat Domisili', width: 'w-[200px]' },
  { id: 'no_kk', label: 'No KK', width: 'w-[120px]' },
  { id: 'no_rekening', label: 'No Rekening', width: 'w-[140px]' },
  { id: 'no_hp', label: 'No HP', width: 'w-[140px]' },
  { id: 'email', label: 'Email', width: 'w-[200px]' },

  // tambahan
  { id: 'pengangkatan_tmt', label: 'TMT Pengangkatan', width: 'w-[160px]' },
  { id: 'pengangkatan_nomor_sk', label: 'Nomor SK', width: 'w-[160px]' },
  { id: 'pengangkatan_masakerja', label: 'Masa Kerja', width: 'w-[140px]' },
  { id: 'pangkat_tmt', label: 'TMT Pangkat', width: 'w-[140px]' },
  { id: 'jabatan', label: 'Jabatan', width: 'w-[160px]' },
  { id: 'jabatan_tmt', label: 'TMT Jabatan', width: 'w-[140px]' },

  // pendidikanpendidikan_jenjang
  { id: 'pendidikan_jenjang', label: 'Jenjang', width: 'w-[100px]' },
  { id: 'pendidikan_jurusan', label: 'Jurusan', width: 'w-[160px]' },
  { id: 'pendidikan_institusi', label: 'Institusi', width: 'w-[200px]' },
  { id: 'pendidikan_tahun_selesai', label: 'Thn Selesai', width: 'w-[120px]' },
  { id: 'pendidikan_gelar', label: 'Gelar', width: 'w-[120px]' },

  { id: 'actions', label: '', width: 'w-[30px]', sticky: 'right' },
];
