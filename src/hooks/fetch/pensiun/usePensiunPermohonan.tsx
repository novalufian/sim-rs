import api from '@/libs/api'
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
        items: T[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}

export interface ApiItemResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface PermohonanPensiunFilters {
    id_pegawai?: string
    jenis_pensiun?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

export interface PermohonanPensiunInput {
    id_pegawai: string
    jenis_pensiun: string
    tanggal_pengajuan?: string | Date
    alasan_pensiun?: string
    tanggal_pensiun?: string | Date
    // Tambahkan field lain sesuai kebutuhan
}

// Tipe data dasar Permohonan Pensiun (Pengajuan)
export interface PermohonanPensiun {
    id: string
    id_pegawai: string
    jenis_pensiun: string
    tanggal_pengajuan: Date | string
    alasan_pensiun: string | null
    tanggal_pensiun: Date | string | null
    status: string
    catatan_kepegawaian: string | null
    catatan_penolakan: string | null
    is_deleted: boolean
    created_at: string
    updated_at: string
}

// Tipe data Permohonan Pensiun yang diperkaya dengan Relasi
export interface PermohonanPensiunWithRelations extends PermohonanPensiun {
    // Data relasi Pegawai
    pegawai_nama?: string
    pegawai_nip?: string
    
    // Data relasi lainnya jika ada
    [key: string]: any
}

// Tipe untuk Dokumen Persyaratan
export interface DokumenPersyaratanPensiun {
    id: string
    id_pensiun_proses: string
    jenis_dokumen: string
    nama_file: string
    path_file: string
    is_completed: boolean
    created_at: string
    updated_at: string
}

// =========================================================================
// 🚀 PERMOHONAN PENSIUN (PENGAJUAN) HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Permohonan Pensiun (Pengajuan)
 * GET /api/kepegawaian/pensiun/pengajuan
 */
export const usePermohonanPensiunList = (filters: PermohonanPensiunFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<PermohonanPensiunWithRelations>>({
        queryKey: ['permohonanPensiun', filters],
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

            const url = `/kepegawaian/pensiun/pengajuan?${params.toString()}`;
            console.log('🔍 Fetching pensiun with URL:', url);
            console.log('📋 Filters:', filters);
            
            const res = await api.get(url);
            console.log('📦 Raw API Response:', res.data);
            
            // Response structure: { success, message, data: { items: [...], pagination: {...} } }
            const responseData = res.data;
            
            // Jika response sudah dalam format yang benar
            if (responseData && responseData.data && Array.isArray(responseData.data.items) && responseData.data.pagination) {
                console.log('✅ Using standard format - data count:', responseData.data.items.length);
                return responseData as ApiListResponse<PermohonanPensiunWithRelations>;
            }
            
            // Fallback untuk struktur lama: { data: { page, limit, total, items } }
            if (responseData && responseData.data && Array.isArray(responseData.data.items)) {
                const oldData = responseData.data;
                console.log('✅ Using legacy format - data count:', oldData.items.length);
                return {
                    success: responseData.success || true,
                    message: responseData.message || 'Success',
                    data: {
                        items: oldData.items,
                        pagination: {
                            page: oldData.page || page,
                            limit: oldData.limit || limit,
                            total: oldData.total || oldData.items.length,
                            totalPages: Math.ceil((oldData.total || oldData.items.length) / (oldData.limit || limit))
                        }
                    }
                } as ApiListResponse<PermohonanPensiunWithRelations>;
            }
            
            // Fallback: return empty
            console.warn('⚠️ Unexpected response format:', responseData);
            return {
                success: false,
                message: 'Unexpected response format',
                data: {
                    items: [],
                    pagination: {
                        page: page,
                        limit: limit,
                        total: 0,
                        totalPages: 0
                    }
                }
            };
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Permohonan Pensiun
 * GET /api/kepegawaian/pensiun/pengajuan/:id
 */
export const useGetPermohonanPensiunDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanPensiunWithRelations>>({
        queryKey: ['permohonanPensiun', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/pengajuan/${id}`)
            return res.data as ApiItemResponse<PermohonanPensiunWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk export semua data Permohonan Pensiun (tanpa pagination)
 * GET /kepegawaian/pensiun/pengajuan/export
 */
export const useExportPermohonanPensiun = (filters: Omit<PermohonanPensiunFilters, 'page' | 'limit'> = {}, enabled: boolean = false) => {
    return useQuery<ApiListResponse<PermohonanPensiunWithRelations>>({
        queryKey: ['permohonanPensiun', 'export', filters],
        queryFn: async () => {
            const params = new URLSearchParams({
                ...Object.entries(filters).reduce((acc: Record<string, string>, [key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        acc[key] = String(value)
                    }
                    return acc
                }, {}),
            })

            const res = await api.get(`/kepegawaian/pensiun/pengajuan/export?${params.toString()}`)
            return res.data as ApiListResponse<PermohonanPensiunWithRelations>
        },
        enabled: enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Cache 5 minutes
    })
}

/**
 * Hook untuk mengambil daftar Dokumen Persyaratan
 * GET /api/kepegawaian/pensiun/dokumen
 */
export const useDokumenPersyaratanPensiunList = (filters: { id_pensiun_proses?: string; page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<DokumenPersyaratanPensiun>>({
        queryKey: ['dokumenPersyaratanPensiun', filters],
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

            const res = await api.get(`/kepegawaian/pensiun/dokumen?${params.toString()}`)
            return res.data as ApiListResponse<DokumenPersyaratanPensiun>
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Dokumen Persyaratan
 * GET /api/kepegawaian/pensiun/dokumen/:id
 */
export const useGetDokumenPersyaratanPensiunDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DokumenPersyaratanPensiun>>({
        queryKey: ['dokumenPersyaratanPensiun', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/dokumen/${id}`)
            return res.data as ApiItemResponse<DokumenPersyaratanPensiun>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

// Tipe response untuk Mutation
type MutationResponse = ApiItemResponse<PermohonanPensiunWithRelations>

/**
 * Hook untuk membuat Permohonan Pensiun baru
 * POST /api/kepegawaian/pensiun/pengajuan
 */
export const useCreatePermohonanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, PermohonanPensiunInput>({
        mutationFn: async (formData: PermohonanPensiunInput) => {
            const res = await api.post('/kepegawaian/pensiun/pengajuan', formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan pensiun berhasil diajukan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengajukan permohonan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Permohonan Pensiun
 * PUT /api/kepegawaian/pensiun/pengajuan/:id
 */
export const useUpdatePermohonanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; formData: Partial<PermohonanPensiunInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/pensiun/pengajuan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan pensiun berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun', permohonan.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate permohonan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Permohonan Pensiun
 * DELETE /api/kepegawaian/pensiun/pengajuan/:id
 */
export const useDeletePermohonanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/pensiun/pengajuan/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('🗑️ Permohonan pensiun berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus permohonan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status Permohonan Pensiun
 * PATCH /api/kepegawaian/pensiun/pengajuan/:id/status
 */
export const useSetStatusPermohonanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; status: string; catatan?: string }>({
        mutationFn: async (data) => {
            const res = await api.patch(`/kepegawaian/pensiun/pengajuan/${data.id}/status`, data)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success(`✅ Status permohonan berhasil diubah menjadi ${permohonan.status}!`, { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun', permohonan.id] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah status permohonan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menambahkan Dokumen Persyaratan
 * POST /api/kepegawaian/pensiun/dokumen
 */
export const useAddDokumenPersyaratanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/kepegawaian/pensiun/dokumen', formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Dokumen persyaratan berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Dokumen Persyaratan
 * PUT /api/kepegawaian/pensiun/dokumen/:id
 */
export const useUpdateDokumenPersyaratanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/kepegawaian/pensiun/dokumen/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Dokumen persyaratan berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Dokumen Persyaratan
 * DELETE /api/kepegawaian/pensiun/dokumen/:id
 */
export const useDeleteDokumenPersyaratanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/pensiun/dokumen/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('🗑️ Dokumen persyaratan berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

