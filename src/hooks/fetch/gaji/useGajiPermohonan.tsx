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

export interface PermohonanGajiFilters {
    id_pegawai?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PermohonanGajiInput {
    id_pegawai: string
    tanggal_pengajuan?: string | Date
    gaji_pokok_lama: number
    gaji_pokok_baru: number
    tmt_kgb_lama: string
    tmt_kgb_baru: string
    masa_kerja_gol_lama: string
    masa_kerja_gol_baru: string
    // Tambahkan field lain sesuai kebutuhan
}

// Tipe data dasar Permohonan Gaji (KGB Proses)
export interface PermohonanGaji {
    id: string
    id_pegawai: string
    tanggal_pengajuan: Date | string
    gaji_pokok_lama: number
    gaji_pokok_baru: number
    tmt_kgb_lama: string
    tmt_kgb_baru: string
    masa_kerja_gol_lama: string
    masa_kerja_gol_baru: string
    no_sk_kgb: string | null
    tanggal_sk_kgb: Date | string | null
    status: string
    catatan_kepegawaian: string | null
    catatan_penolakan: string | null
    is_deleted: boolean
    created_at: string
    updated_at: string
}

// Tipe data Permohonan Gaji yang diperkaya dengan Relasi
export interface PermohonanGajiWithRelations extends PermohonanGaji {
    // Data relasi Pegawai
    pegawai_nama?: string
    pegawai_nip?: string
    
    // Data kalkulasi
    selisih_gaji?: number
    persentase_kenaikan?: number
    
    // Data relasi lainnya jika ada
    [key: string]: any
}

// =========================================================================
// 🚀 PERMOHONAN GAJI (KGB PROSES) HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Permohonan Gaji (KGB Proses)
 * GET /api/kepegawaian/gajiberkala
 */
export const usePermohonanGajiList = (filters: PermohonanGajiFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<PermohonanGajiWithRelations>>({
        queryKey: ['permohonanGaji', filters],
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

            const url = `/kepegawaian/gajiberkala?${params.toString()}`;
            console.log('🔍 Fetching kenaikan gaji with URL:', url);
            console.log('📋 Filters:', filters);
            
            const res = await api.get(url);
            console.log('📦 Raw API Response:', res.data);
            
            // Response structure: { success, message, data: { items: [...], pagination: {...} } }
            const responseData = res.data;
            
            // Jika response sudah dalam format yang benar
            if (responseData && responseData.data && Array.isArray(responseData.data.items) && responseData.data.pagination) {
                console.log('✅ Using standard format - data count:', responseData.data.items.length);
                return responseData as ApiListResponse<PermohonanGajiWithRelations>;
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
                } as ApiListResponse<PermohonanGajiWithRelations>;
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
 * Hook untuk mendapatkan detail Permohonan Gaji
 * GET /api/kepegawaian/gajiberkala/:id
 */
export const useGetPermohonanGajiDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanGajiWithRelations>>({
        queryKey: ['permohonanGaji', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/${id}`)
            return res.data as ApiItemResponse<PermohonanGajiWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk export semua data Permohonan Gaji (tanpa pagination)
 * GET /kepegawaian/gajiberkala/export
 */
export const useExportPermohonanGaji = (filters: Omit<PermohonanGajiFilters, 'page' | 'limit'> = {}, enabled: boolean = false) => {
    return useQuery<ApiListResponse<PermohonanGajiWithRelations>>({
        queryKey: ['permohonanGaji', 'export', filters],
        queryFn: async () => {
            const params = new URLSearchParams({
                ...Object.entries(filters).reduce((acc: Record<string, string>, [key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        acc[key] = String(value)
                    }
                    return acc
                }, {}),
            })

            const res = await api.get(`/kepegawaian/gajiberkala/export?${params.toString()}`)
            return res.data as ApiListResponse<PermohonanGajiWithRelations>
        },
        enabled: enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Cache 5 minutes
    })
}

/**
 * Hook untuk menghitung gaji baru
 * GET /api/kepegawaian/gajiberkala/:id/calculate
 */
export const useCalculateGajiBaru = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<any>>({
        queryKey: ['calculateGajiBaru', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/${id}/calculate`)
            return res.data as ApiItemResponse<any>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

// Tipe response untuk Mutation
type MutationResponse = ApiItemResponse<PermohonanGajiWithRelations>

/**
 * Hook untuk membuat Permohonan Gaji baru
 * POST /api/kepegawaian/gajiberkala
 */
export const useCreatePermohonanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, PermohonanGajiInput>({
        mutationFn: async (formData: PermohonanGajiInput) => {
            const res = await api.post('/kepegawaian/gajiberkala', formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan kenaikan gaji berhasil diajukan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengajukan permohonan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Permohonan Gaji
 * PUT /api/kepegawaian/gajiberkala/:id
 */
export const useUpdatePermohonanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; formData: Partial<PermohonanGajiInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/gajiberkala/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan kenaikan gaji berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji', permohonan.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate permohonan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus (soft delete) Permohonan Gaji
 * DELETE /api/kepegawaian/gajiberkala/:id
 */
export const useDeletePermohonanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/gajiberkala/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('🗑️ Permohonan kenaikan gaji berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus permohonan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status Permohonan Gaji
 * PATCH /api/kepegawaian/gajiberkala/:id/status
 */
export const useSetStatusPermohonanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; status: string; catatan?: string }>({
        mutationFn: async (data) => {
            const res = await api.patch(`/kepegawaian/gajiberkala/${data.id}/status`, data)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success(`✅ Status permohonan berhasil diubah menjadi ${permohonan.status}!`, { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji', permohonan.id] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah status permohonan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

