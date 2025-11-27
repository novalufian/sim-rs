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

export interface PermohonanBelajarFilters {
    id_pegawai?: string
    status?: string
    institusi_pendidikan_id?: string
    program_studi_id?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

export interface PermohonanBelajarInput {
    id_pegawai: string
    nama_sekolah?: string
    jenjang_pendidikan?: string
    jurusan?: string
    alamat_sekolah?: string
    tanggal_mulai?: string | Date
    tanggal_selesai?: string | Date
    // Tambahkan field lain sesuai kebutuhan
}

// Tipe data dasar Permohonan Ijin Belajar (sesuai API response)
export interface PermohonanBelajar {
    id: string
    pegawai_id: string
    pegawai_nama: string
    pegawai_nip: string
    jenis_permohonan: string
    tanggal_pengajuan: Date | string
    gelar_yang_diperoleh: string | null
    program_studi_id: string
    program_studi_nama: string
    program_studi_jenjang: string
    program_studi_bidang: string | null
    institusi_pendidikan_id: string
    institusi_pendidikan_nama: string
    institusi_pendidikan_kota: string | null
    institusi_pendidikan_negara: string | null
    tanggal_mulai_belajar: Date | string
    tanggal_selesai_belajar: Date | string | null
    lama_studi_bulan: number | null
    biaya_ditanggung: string | null
    status_pegawai_selama_belajar: string | null
    kewajiban_setelah_belajar: string | null
    status: string
    catatan_kepegawaian: string | null
    catatan_penolakan: string | null
    no_sk_belajar: string | null
    tanggal_sk_belajar: Date | string | null
    created_at: string
    updated_at: string
    created_by: string | null
    updated_by: string | null
    is_deleted: boolean
}

// Tipe data Permohonan Belajar yang diperkaya dengan Relasi
export interface PermohonanBelajarWithRelations extends PermohonanBelajar {
    // Semua field sudah termasuk dalam PermohonanBelajar
    [key: string]: any
}

// Tipe untuk Dokumen Persyaratan
export interface DokumenPersyaratanBelajar {
    id: string
    id_izin_belajar: string
    jenis_dokumen: string
    nama_file: string
    path_file: string
    is_completed: boolean
    created_at: string
    updated_at: string
}

// =========================================================================
// 🚀 PERMOHONAN IJIN BELAJAR HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Permohonan Ijin Belajar
 * GET /api/kepegawaian/ijinbelajar
 */
export const usePermohonanBelajarList = (filters: PermohonanBelajarFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<PermohonanBelajarWithRelations>>({
        queryKey: ['permohonanBelajar', filters],
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

            const url = `/kepegawaian/ijinbelajar?${params.toString()}`;
            console.log('🔍 Fetching ijin belajar with URL:', url);
            console.log('📋 Filters:', filters);
            
            const res = await api.get(url);
            console.log('📦 Raw API Response:', res.data);
            
            // Response structure: { success, message, data: { items: [...], pagination: {...} } }
            const responseData = res.data;
            
            // Jika response sudah dalam format yang benar
            if (responseData && responseData.data && Array.isArray(responseData.data.items) && responseData.data.pagination) {
                console.log('✅ Using standard format - data count:', responseData.data.items.length);
                return responseData as ApiListResponse<PermohonanBelajarWithRelations>;
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
                } as ApiListResponse<PermohonanBelajarWithRelations>;
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
 * Hook untuk mendapatkan detail Permohonan Ijin Belajar
 * GET /api/kepegawaian/ijinbelajar/:id
 */
export const useGetPermohonanBelajarDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanBelajarWithRelations>>({
        queryKey: ['permohonanBelajar', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/ijinbelajar/${id}`)
            return res.data as ApiItemResponse<PermohonanBelajarWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Dokumen Persyaratan
 * GET /api/kepegawaian/ijinbelajar/:id/dokumen
 */
export const useDokumenPersyaratanBelajar = (id: string, enabled: boolean = true) => {
    return useQuery<ApiListResponse<DokumenPersyaratanBelajar>>({
        queryKey: ['dokumenPersyaratanBelajar', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/ijinbelajar/${id}/dokumen`)
            return res.data as ApiListResponse<DokumenPersyaratanBelajar>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

// Tipe response untuk Mutation
type MutationResponse = ApiItemResponse<PermohonanBelajarWithRelations>

/**
 * Hook untuk membuat Permohonan Ijin Belajar baru
 * POST /api/kepegawaian/ijinbelajar
 */
export const useCreatePermohonanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, PermohonanBelajarInput>({
        mutationFn: async (formData: PermohonanBelajarInput) => {
            const res = await api.post('/kepegawaian/ijinbelajar', formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan ijin belajar berhasil diajukan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengajukan permohonan ijin belajar!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Permohonan Ijin Belajar
 * PUT /api/kepegawaian/ijinbelajar/:id
 */
export const useUpdatePermohonanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, { id: string; formData: Partial<PermohonanBelajarInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/ijinbelajar/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('✅ Permohonan ijin belajar berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar', permohonan.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate permohonan ijin belajar!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Permohonan Ijin Belajar
 * DELETE /api/kepegawaian/ijinbelajar/:id
 */
export const useDeletePermohonanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation<MutationResponse, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/ijinbelajar/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const permohonan = response.data
            toast.success('🗑️ Permohonan ijin belajar berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus permohonan ijin belajar!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menambahkan Dokumen Persyaratan
 * POST /api/kepegawaian/ijinbelajar/:id/dokumen
 */
export const useAddDokumenPersyaratanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.post(`/kepegawaian/ijinbelajar/${data.id}/dokumen`, data.formData)
            return res.data
        },
        onSuccess: (response, variables) => {
            toast.success('✅ Dokumen persyaratan berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanBelajar', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar', variables.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Dokumen Persyaratan
 * PUT /api/kepegawaian/ijinbelajar/dokumen/:docId
 */
export const useUpdateDokumenPersyaratanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { docId: string; formData: any }) => {
            const res = await api.put(`/kepegawaian/ijinbelajar/dokumen/${data.docId}`, data.formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Dokumen persyaratan berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Dokumen Persyaratan
 * DELETE /api/kepegawaian/ijinbelajar/dokumen/:docId
 */
export const useDeleteDokumenPersyaratanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (docId: string) => {
            const res = await api.delete(`/kepegawaian/ijinbelajar/dokumen/${docId}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('🗑️ Dokumen persyaratan berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['dokumenPersyaratanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus dokumen persyaratan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

