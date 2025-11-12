import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// =========================================================================
// 🧩 TYPES (MENGGUNAKAN NAMA LAMA)
// =========================================================================

// Filters for querying jatah cuti (Tipe Lama)
export interface CutiJatahFilters {
    id_pegawai?: string
    year?: number // mapped to 'tahun' on API
    tahun?: number // Tambahkan 'tahun' agar filter list bisa digunakan juga
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Shape of a single jatah cuti item (Tipe Lama)
export interface CutiJatahItem {
    id: string
    id_pegawai: string
    tahun: number
    jumlah_jatah: number
    sisa_jatah: number
    created_at?: string
    updated_at?: string
    pegawai_nama?: string
    pegawai_nip?: string
    is_deleted?: boolean
    // ...field lain
}

// Input untuk Mutasi
export interface JatahCutiInput {
    id_pegawai: string
    tahun: number
    jumlah_jatah: number
    sisa_jatah: number
}

// List response shape (Tipe Lama)
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


const BASE_PATH = '/kepegawaian/cuti/jatah'

// =========================================================================
// 📆 JATAH CUTI HOOKS (MENGGUNAKAN NAMA LAMA)
// =========================================================================

/**
 * Hook untuk mengambil daftar Jatah Cuti (Mirip useCutiJatah Lama)
 * GET /kepegawaian/cuti/jatah
 */
export const useCutiJatah = (filters: CutiJatahFilters = {}) => {
    const {
        id_pegawai,
        year,
        tahun = year, // Gunakan year/tahun
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
    } = filters

    return useQuery<ApiListResponse<CutiJatahItem>>({
        queryKey: ['cutiJatah', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            
            if (id_pegawai) params.append('id_pegawai', id_pegawai)
            if (typeof tahun === 'number') params.append('tahun', String(tahun))
            
            params.append('page', String(page))
            params.append('limit', String(limit))
            
            if (sortBy) params.append('sortBy', sortBy)
            if (sortOrder) params.append('sortOrder', sortOrder)
            
            const res = await api.get(`${BASE_PATH}?${params.toString()}`)
            return res.data as ApiListResponse<CutiJatahItem>
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan Jatah Cuti berdasarkan ID record (Mirip useCutiJatahById Lama)
 * GET /kepegawaian/cuti/jatah/:id
 */
export const useCutiJatahById = (id: string | undefined) => {
    return useQuery<ApiItemResponse<CutiJatahItem>>({
        queryKey: ['cutiJatah', id],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id}`)
            return res.data as ApiItemResponse<CutiJatahItem>
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan Daftar Jatah Cuti berdasarkan ID Pegawai dan/atau Tahun (Mirip useCutiJatahByPegawai Lama)
 * Hook ini memanggil endpoint list dengan filter, sehingga mengembalikan list (ApiListResponse)
 */
export const useCutiJatahByPegawai = (id_pegawai: string | undefined, tahun?: number) => {
    // Memanggil useCutiJatah (list query) dengan filter spesifik
    return useCutiJatah({ 
        id_pegawai: id_pegawai, 
        tahun: tahun,
        limit: 1000 // Biasanya tanpa pagination untuk convenience query
    });
}


// =========================================================================
// 🚀 HOOKS SPESIFIK (DARI VERSI BARU)
// =========================================================================

/**
 * Hook untuk mendapatkan Jatah Cuti spesifik berdasarkan ID Pegawai dan Tahun (Mengembalikan Objek Tunggal)
 * GET /kepegawaian/cuti/jatah/by-pegawai-tahun
 */
export const useJatahCutiByPegawaiTahun = (id_pegawai: string | undefined, tahun: number | undefined, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<CutiJatahItem>>({ // Mengembalikan ApiItemResponse
        queryKey: ['jatahCutiByPegawaiTahun', id_pegawai, tahun],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (id_pegawai) params.append('id_pegawai', id_pegawai);
            if (tahun) params.append('tahun', tahun.toString());
            
            const res = await api.get(`${BASE_PATH}/by-pegawai-tahun?${params.toString()}`);
            return res.data;
        },
        enabled: enabled && !!id_pegawai && !!tahun,
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook untuk membuat Jatah Cuti baru (useCreateJatahCuti Lama)
 * POST /kepegawaian/cuti/jatah
 */
export const usePostCutiJatah = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: JatahCutiInput) => {
      const res = await api.post(BASE_PATH, formData)
      return (res.data as ApiItemResponse<CutiJatahItem>).data // Ambil data inti
    },
    onSuccess: (data) => {
      toast.success('✅ Jatah cuti berhasil ditambahkan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
      queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', data.id_pegawai, data.tahun] }) // Invalidate spesifik
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menambahkan jatah cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

/**
 * Hook untuk memperbarui Jatah Cuti (useUpdateCutiJatah Lama)
 * PUT /kepegawaian/cuti/jatah/:id
 */
export const useUpdateCutiJatah = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: Partial<JatahCutiInput> }) => {
            const res = await api.put(`${BASE_PATH}/${data.id}`, data.formData)
            return (res.data as ApiItemResponse<CutiJatahItem>).data // Ambil data inti
        },
        onSuccess: (data) => {
            toast.success('✅ Jatah cuti berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
            queryClient.invalidateQueries({ queryKey: ['cutiJatah', data.id] })
            queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', data.id_pegawai, data.tahun] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate jatah cuti!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk Upsert (Create or Update) Jatah Cuti
 * POST /kepegawaian/cuti/jatah/upsert
 */
export const useUpsertJatahCuti = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (formData: JatahCutiInput) => {
        const res = await api.post(`${BASE_PATH}/upsert`, formData)
        return (res.data as ApiItemResponse<CutiJatahItem>).data
      },
      onSuccess: (data) => {
        toast.success('✅ Jatah cuti berhasil diperbarui (upsert)!', { position: 'bottom-right' })
        queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
        queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', data.id_pegawai, data.tahun] })
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Gagal upsert jatah cuti!'
        toast.error(message, { position: 'bottom-right' })
      },
    })
  }

/**
 * Hook untuk penyesuaian (adjust) sisa jatah cuti
 * PATCH /kepegawaian/cuti/jatah/:id/adjust
 */
export const useAdjustSisaJatah = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (data: { id: string; delta: number; clampToJumlah?: boolean }) => {
        const res = await api.patch(`${BASE_PATH}/${data.id}/adjust`, { delta: data.delta, clampToJumlah: data.clampToJumlah })
        return (res.data as ApiItemResponse<CutiJatahItem>).data
      },
      onSuccess: (data) => {
        toast.success('⚙️ Sisa jatah cuti berhasil disesuaikan!', { position: 'bottom-right' })
        queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
        queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun', data.id_pegawai, data.tahun] })
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Gagal menyesuaikan sisa jatah cuti!'
        toast.error(message, { position: 'bottom-right' })
      },
    })
}

/**
 * Hook untuk menghapus Jatah Cuti (useDeleteCutiJatah Lama)
 * DELETE /kepegawaian/cuti/jatah/:id
 */
export const useDeleteCutiJatah = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`${BASE_PATH}/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success('🗑️ Jatah cuti berhasil dihapus!', { position: 'bottom-right' });
            queryClient.invalidateQueries({ queryKey: ['cutiJatah'] });
            queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun'] }); // Invalidasi semua by pegawai tahun jika ada
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus jatah cuti!';
            toast.error(message, { position: 'bottom-right' });
        },
    });
}