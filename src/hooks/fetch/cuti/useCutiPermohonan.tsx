import api from '@/libs/api'
// Pastikan useQuery dan useMutation diimpor dari '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 
import toast from 'react-hot-toast'

// =========================================================================
// 🧩 TYPES
// =========================================================================

// --- Standard API Response Types ---
export interface ApiListResponse<T> {
    success: boolean
    message: string
    data: {
        page: number
        limit: number
        total: number
        items: T[]
    }
}

export interface ApiItemResponse<T> {
    success: boolean
    message: string
    data: T
}
// ------------------------------------

export interface PermohonanCutiFilters {
  id_pegawai?: string
  id_jenis_cuti?: number
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface PermohonanCutiInput {
  id_pegawai: string
  id_jenis_cuti: number
  tanggal_mulai_cuti: string | Date
  tanggal_selesai_cuti: string | Date
  jumlah_hari: number
  alasan_cuti: string
  alamat_selama_cuti: string
  no_hp_selama_cuti: string
  id_jatah_cuti?: string | null
}

// --- Dependencies Type (Asumsi dari useCutiPersetujuan.tsx) ---
export interface PersetujuanCuti {
  id: string
  id_permohonan_cuti: string
  id_pegawai_approver: string
  role_approver: string
  status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
  tanggal_persetujuan: Date | string | null // Ditambahkan | string agar fleksibel dengan JSON
  catatan_persetujuan: string | null
  urutan_persetujuan: number
}
// -----------------------------------------------------------------

/**
 * Tipe data Persetujuan Cuti yang diperkaya dengan data Pegawai Approver
 * Menggunakan field approver_nama dan approver_nip sesuai dengan response API Anda.
 */
export interface PersetujuanCutiWithApprover extends PersetujuanCuti {
    approver_nama?: string | null; // ✅ Koreksi tipe untuk field nama approver
    approver_nip?: string | null;  // ✅ Tambahan tipe untuk NIP approver
}

// Tipe data dasar Permohonan Cuti
export interface PermohonanCuti {
  id: string;
  id_pegawai: string;
  id_jenis_cuti: number;
  tanggal_mulai_cuti: Date | string; // Ganti menjadi Date | string agar fleksibel
  tanggal_selesai_cuti: Date | string; // Ganti menjadi Date | string agar fleksibel
  jumlah_hari: number;
  alasan_cuti: string; // Ditambahkan sesuai Input/Detail
  alamat_selama_cuti: string; // Ditambahkan sesuai Input/Detail
  no_hp_selama_cuti: string; // Ditambahkan sesuai Input/Detail
  status: string;
  nomor_surat_cuti: string | null;
  tanggal_surat_cuti: Date | string | null;
  file_bukti_cuti: string | null;
  catatan_kepegawaian: string | null;
  catatan_penolakan: string | null;
  is_deleted: boolean; // Ditambahkan sesuai response JSON
}

// Tipe data Permohonan Cuti yang diperkaya dengan Relasi (sesuai JSON)
export interface PermohonanCutiWithRelations extends PermohonanCuti {
    // Data relasi Pegawai
    nama: string; 
    nip: string;
    
    // Data relasi Jenis Cuti
    jenis_cuti_nama: string;
    jenis_cuti_max_hari: number | null; 
    
    // ✅ Relasi ke Riwayat Persetujuan
    persetujuan_cuti?: PersetujuanCutiWithApprover[];
}


// =========================================================================
// 🚀 PERMOHONAN CUTI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Permohonan Cuti
 * GET /kepegawaian/cuti/permohonan
 */
export const usePermohonanCutiList = (filters: PermohonanCutiFilters = {}) => {
  const { page = 1, limit = 10, ...otherFilters } = filters

  // Menggunakan ApiListResponse dengan tipe item PermohonanCutiWithRelations
  return useQuery<ApiListResponse<PermohonanCutiWithRelations>>({ 
    queryKey: ['permohonanCuti', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.entries(otherFilters).reduce((acc: Record<string, string>, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value)
          }
          return acc
        }, {}),
      })

      const res = await api.get(`/kepegawaian/cuti/permohonan?${params.toString()}`)
      return res.data as ApiListResponse<PermohonanCutiWithRelations> // Casting untuk type safety
    },
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook untuk mendapatkan detail Permohonan Cuti
 * GET /kepegawaian/cuti/permohonan/:id
 */
export const useGetPermohonanCutiDetail = (id: string, enabled: boolean = true) => {
    // Menggunakan ApiItemResponse dengan tipe item PermohonanCutiWithRelations
    return useQuery<ApiItemResponse<PermohonanCutiWithRelations>>({
      queryKey: ['permohonanCuti', id],
      queryFn: async () => {
        const res = await api.get(`/kepegawaian/cuti/permohonan/${id}`)
        return res.data as ApiItemResponse<PermohonanCutiWithRelations> // Casting untuk type safety
      },
      enabled: enabled && !!id,
      refetchOnWindowFocus: false,
    })
}

// Tipe response untuk Mutasi (mengembalikan objek yang dibuat/diupdate)
type MutationResponse = ApiItemResponse<PermohonanCutiWithRelations>;

/**
 * Hook untuk membuat Permohonan Cuti baru
 * POST /kepegawaian/cuti/permohonan
 */
export const useCreatePermohonanCuti = () => {
  const queryClient = useQueryClient()
  return useMutation<MutationResponse, any, PermohonanCutiInput>({
    mutationFn: async (formData: PermohonanCutiInput) => {
      const res = await api.post('/kepegawaian/cuti/permohonan', formData)
      return res.data
    },
    onSuccess: (response) => {
      // Data pegawai yang mengajukan cuti (dari response.data) dapat digunakan untuk invalidate spesifik
      const permohonan = response.data;
      toast.success('✅ Permohonan cuti berhasil diajukan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti'] })
      queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', permohonan.id_pegawai] }) // Invalidate jatah
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal mengajukan permohonan cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

/**
 * Hook untuk memperbarui Permohonan Cuti
 * PUT /kepegawaian/cuti/permohonan/:id
 */
export const useUpdatePermohonanCuti = () => {
  const queryClient = useQueryClient()
  return useMutation<MutationResponse, any, { id: string; formData: Partial<PermohonanCutiInput> }>({
    mutationFn: async (data) => {
      const res = await api.put(`/kepegawaian/cuti/permohonan/${data.id}`, data.formData)
      return res.data
    },
    onSuccess: (response) => {
      const permohonan = response.data;
      toast.success('✅ Permohonan cuti berhasil diupdate!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti'] })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti', permohonan.id] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal mengupdate permohonan cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

/**
 * Hook untuk menghapus (soft delete/membatalkan) Permohonan Cuti
 * DELETE /kepegawaian/cuti/permohonan/:id
 * (Diubah menjadi useCancelPermohonanCuti agar lebih deskriptif)
 */
export const useCancelPermohonanCuti = () => {
  const queryClient = useQueryClient()
  return useMutation<MutationResponse, any, string>({ // Mengembalikan data yang dibatalkan
    mutationFn: async (id: string) => {
      // Asumsi endpoint DELETE/soft delete juga mengembalikan data yang diupdate
      const res = await api.delete(`/kepegawaian/cuti/permohonan/${id}`) 
      return res.data
    },
    onSuccess: (response) => {
      const permohonan = response.data;
      toast.success('🗑️ Permohonan cuti berhasil dibatalkan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti'] })
      queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', permohonan.id_pegawai] }) // Jatah mungkin dikembalikan setelah dibatalkan
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal membatalkan permohonan cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

/**
 * Hook untuk mengubah status Permohonan Cuti (Digunakan oleh Admin/Kepegawaian)
 * PATCH /kepegawaian/cuti/permohonan/:id/status
 */
export const useSetStatusPermohonanCuti = () => {
  const queryClient = useQueryClient()
  return useMutation<MutationResponse, any, { id: string; status: string; catatan_kepegawaian?: string; catatan_penolakan?: string }>({
    mutationFn: async (data) => {
      const res = await api.patch(`/kepegawaian/cuti/permohonan/${data.id}/status`, data)
      return res.data
    },
    onSuccess: (response) => {
      const permohonan = response.data;
      toast.success(`✅ Status Permohonan berhasil diubah menjadi ${permohonan.status}!`, { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti'] })
      queryClient.invalidateQueries({ queryKey: ['permohonanCuti', permohonan.id] })
      // Jika status disetujui, perlu invalidate jatah
      if (permohonan.status.includes('DISETUJUI_AKHIR') || permohonan.status.includes('DISETUJUI')) {
        queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', permohonan.id_pegawai] });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal mengubah status permohonan cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}