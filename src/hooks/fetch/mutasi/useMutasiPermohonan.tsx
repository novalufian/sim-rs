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

export interface PermohonanMutasiFilters {
    id_pegawai?: string
    jenis_mutasi?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

export interface PermohonanMutasiInput {
    id_pegawai: string
    jenis_mutasi: string
    alasan_mutasi: string
    tanggal_pengajuan?: string | Date
    // Tambahkan field lain sesuai kebutuhan
}

// Tipe data dasar Permohonan Mutasi
export interface PermohonanMutasi {
    id: string
    pegawai_id: string
    jenis_mutasi?: string
    instansi_tujuan?: string
    alasan_mutasi: string
    status: string
    tanggal_pengajuan: Date | string
    tanggal_approval?: Date | string | null
    tanggal_rekomendasi_mutasi?: Date | string | null
    nomor_rekomendasi_mutasi?: string | null
    file_bukti_rekomendasi?: string | null
    catatan_kepegawaian?: string | null
    catatan_penolakan?: string | null
    is_deleted: boolean
}

// Tipe data Permohonan Mutasi yang diperkaya dengan Relasi
export interface PermohonanMutasiWithRelations extends PermohonanMutasi {
    // Data relasi Pegawai (dari join)
    pegawai_nama?: string
    pegawai_nip?: string
    
    // Alias untuk kompatibilitas
    nama?: string
    nip?: string
    id_pegawai?: string
    
    // Data relasi lainnya jika ada
    [key: string]: any
}

// =========================================================================
// 🚀 PERMOHONAN MUTASI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Permohonan Mutasi
 * GET /api/kepegawaian/mutasi/permohonan
 */
export const usePermohonanMutasiList = (filters: PermohonanMutasiFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<PermohonanMutasiWithRelations>>({
        queryKey: ['permohonanMutasi', filters],
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

            const url = `/kepegawaian/mutasi/permohonan?${params.toString()}`;
            
            const res = await api.get(url);
            
            // Response structure: { success, message, data: { items: [...], pagination: {...} } }
            const responseData = res.data;
            
            // Jika response sudah dalam format yang benar
            if (responseData && responseData.data && Array.isArray(responseData.data.items) && responseData.data.pagination) {
                return responseData as ApiListResponse<PermohonanMutasiWithRelations>;
            }
            
            // Fallback: return empty
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
 * Hook untuk mendapatkan detail Permohonan Mutasi
 * GET /api/kepegawaian/mutasi/permohonan/:id
 */
export const useGetPermohonanMutasiDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanMutasiWithRelations>>({
        queryKey: ['permohonanMutasi', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/mutasi/permohonan/${id}`)
            return res.data as ApiItemResponse<PermohonanMutasiWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

// Tipe response untuk Mutation
type MutationResponse = ApiItemResponse<PermohonanMutasiWithRelations>

/**
 * Hook untuk membuat Permohonan Mutasi baru
 * POST /api/kepegawaian/mutasi/permohonan
 */
export const useCreatePermohonanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, PermohonanMutasiInput>({
        mutationFn: async (formData: PermohonanMutasiInput) => {
            const res = await api.post('/kepegawaian/mutasi/permohonan', formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan mutasi berhasil diajukan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengajukan permohonan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Permohonan Mutasi
 * PUT /api/kepegawaian/mutasi/permohonan/:id
 */
export const useUpdatePermohonanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; formData: Partial<PermohonanMutasiInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/mutasi/permohonan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan mutasi berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi', permohonan.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate permohonan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus (soft delete) Permohonan Mutasi
 * DELETE /api/kepegawaian/mutasi/permohonan/:id
 */
export const useDeletePermohonanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/mutasi/permohonan/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('🗑️ Permohonan mutasi berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus permohonan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status Permohonan Mutasi
 * PATCH /api/kepegawaian/mutasi/permohonan/:id/status
 */
export const useSetStatusPermohonanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; status: string; catatan?: string }>({
        mutationFn: async (data) => {
            const res = await api.patch(`/kepegawaian/mutasi/permohonan/${data.id}/status`, data)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success(`✅ Status permohonan berhasil diubah menjadi ${permohonan.status}!`, { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi', permohonan.id] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah status permohonan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

