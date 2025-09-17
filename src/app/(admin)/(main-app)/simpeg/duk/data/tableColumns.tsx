import { Column } from '@/app/(admin)/(main-app)/simpeg/duk/data/employee';

export const DUKTableColumns: Column[] = [
  { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
  { id: 'nama', label: 'Nama', width: 'w-[200px]' },
  { id: 'nip', label: 'NIP', width: 'w-[150px]' },
  { id: 'tempat_lahir', label: 'Tempat Lahir', width: 'w-[120px]' },
  { id: 'tanggal_lahir', label: 'Tanggal Lahir', width: 'w-[120px]' },
  { id: 'umur', label: 'Umur', width: 'w-[80px]' },
  { id: 'jenis_kelamin', label: 'Jenis Kelamin', width: 'w-[120px]' },
  { id: 'agama', label: 'Agama', width: 'w-[100px]' },
  { id: 'status_perkawinan', label: 'Status Perkawinan', width: 'w-[140px]' },
  { id: 'status_pekerjaan', label: 'Status Pekerjaan', width: 'w-[140px]' },
  { id: 'alamat_ktp', label: 'Alamat KTP', width: 'w-[200px]' },
  { id: 'alamat_domisili', label: 'Alamat Domisili', width: 'w-[200px]' },
  { id: 'no_kk', label: 'No KK', width: 'w-[120px]' },
  { id: 'no_rekening', label: 'No Rekening', width: 'w-[120px]' },
  { id: 'no_hp', label: 'No HP', width: 'w-[120px]' },
  { id: 'email', label: 'Email', width: 'w-[200px]' },
  { id: 'tmt_pangkat', label: 'TMT Pangkat', width: 'w-[120px]' },
  { id: 'tmt_jabatan', label: 'TMT Jabatan', width: 'w-[120px]' },
  { id: 'actions', label: '', width: 'w-[30px]', sticky: 'right' },
]; 