import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface PegawaiFilters {
  nama?: string
  nip?: string
  jenis_kelamin?: string
  agama?: string
  status_perkawinan?: string
  status_pekerjaan?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Pegawai {
  id_pegawai: string;
  no_urut: number;
  nama: string;
  nip: string;
  avatar_url: string;
  avatar_id: string;
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
  is_deleted: boolean;
}

export const usePegawai = (filters: PegawaiFilters = {}) => {
  const {
    nama,
    nip,
    jenis_kelamin,
    agama,
    status_perkawinan,
    status_pekerjaan,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
  } = filters
  
  return useQuery({
    queryKey: ['pegawai', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (nama) params.append('nama', nama)
      if (nip) params.append('nip', nip)
      if (jenis_kelamin) params.append('jenis_kelamin', jenis_kelamin)
      if (agama) params.append('agama', agama)
      if (status_perkawinan) params.append('status_perkawinan', status_perkawinan)
      if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                  
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      if (sortBy) params.append('sortBy', sortBy)
      if (sortOrder) params.append('sortOrder', sortOrder)
          
      const res = await api.get(`/pegawai?${params.toString()}`);
      return res.data
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useGetPegawaiById = (id: string) => {
  return useQuery({
    queryKey: ['pegawai', id],
    queryFn: async () => {
      const res = await api.get(`/pegawai/${id}`)
      return res.data
    },
    staleTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const usePegawaiDelete = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/pegawai/${id}`)
      return res.data
    },
    onSuccess: (data) => {
      console.log('✅ Pegawai berhasil dihapus!', data)
      toast.success('Pegawai berhasil dihapus!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['pegawai'] })
    },
    onError: (error: any) => {
      console.error('❌ Error deleting pegawai:', error)
      toast.error('Gagal menghapus pegawai!', { position: 'bottom-right' })
    },
  })
}

export const usePostPegawai = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await api.post('/pegawai', formData)
      return res.data
    },
    onSuccess: (data) => {
      console.log('✅ Pegawai berhasil ditambahkan!', data)
      toast.success('Pegawai berhasil ditambahkan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['pegawai'] })
    },
    onError: (error: any) => {
      if (error.response) {
        const message = error.response.data?.message || 'Unknown error'
        const validationErrors = error.response.data?.errors
        
        console.error('🛑 Validation error:', message)
        
        if (validationErrors) {
          Object.keys(validationErrors).forEach((key: string) => {
            const errMessages = validationErrors[key];
            if (Array.isArray(errMessages)) {
              errMessages.forEach((errMsg: string) => {
                console.error(`🔸 ${key} - ${errMsg}`);
                toast(`${key} - ${errMsg}`, {
                  icon: '❌',
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  duration: 5000,
                  position: 'bottom-right',
                });
              });
            }
          });
        } else {
          toast.error(message, { position: 'bottom-right' })
        }
      } else {
        console.error('❌ Unexpected error:', error)
        toast.error('Gagal menambahkan pegawai!', { position: 'bottom-right' })
      }
    },
  })
}

export const useUpdatePegawai = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; formData: any }) => {
      const res = await api.put('/pegawai/' + data.id, data.formData)
      return res.data
    },
    onSuccess: (data) => {
      console.log('✅ Pegawai berhasil diupdate!', data)
      toast.success('Pegawai berhasil diupdate!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      queryClient.invalidateQueries({ queryKey: ['whoami'] })
      queryClient.invalidateQueries({ queryKey: ['pegawai', data.id_pegawai] })
    },
    
    onError: (error: any) => {
      console.error('❌ Error updating pegawai:', error)
      toast.error('Gagal mengupdate pegawai!', { position: 'bottom-right' })
    },
  })
}