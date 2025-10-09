import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const BASE_PATH = '/pegawai'

// ==============================
// Types
// ==============================
export interface RiwayatPendidikan {
    id_pendidikan: string
    id_pegawai: string
    tingkat_pendidikan: string
    nama_institusi: string
    jurusan: string
    tahun_mulai: number
    tahun_selesai: number
    nomor_ijazah?: string
    tanggal_ijazah?: string
    created_at: string
    updated_at: string
}

export interface ListRiwayatPendidikanResponse {
    success: boolean
    message: string
    data: RiwayatPendidikan[]
}

export interface RiwayatPendidikanResponse {
    success: boolean
    message: string
    data: RiwayatPendidikan
}

// ==============================
// Query Hooks
// ==============================

// GET: list all riwayat pendidikan for pegawai
export const useRiwayatPendidikanList = (id_pegawai: string | undefined) => {
    return useQuery<ListRiwayatPendidikanResponse>({
        queryKey: ['riwayatPendidikan', id_pegawai],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id_pegawai}/riwayat-pendidikan`)
            return res.data as ListRiwayatPendidikanResponse
        },
        enabled: !!id_pegawai,
        refetchOnWindowFocus: false,
    })
}

// GET: single riwayat pendidikan by ID
export const useRiwayatPendidikanById = (
    id_pegawai: string | undefined,
    id: string | undefined
) => {
    return useQuery<RiwayatPendidikanResponse>({
        queryKey: ['riwayatPendidikanDetail', id],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id_pegawai}/riwayat-pendidikan/${id}`)
            return res.data as RiwayatPendidikanResponse
        },
        enabled: !!id_pegawai && !!id,
        refetchOnWindowFocus: false,
    })
}

// ==============================
// Mutation Hooks
// ==============================

// POST: create new riwayat pendidikan
export const useCreateRiwayatPendidikan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id_pegawai: string; data: Partial<RiwayatPendidikan> }) => {
            const res = await api.post(
                `${BASE_PATH}/${payload.id_pegawai}/riwayat-pendidikan`,
                payload.data
            )
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['riwayatPendidikan', variables.id_pegawai],
            })
        },
    })
}

// PUT: update riwayat pendidikan
export const useUpdateRiwayatPendidikan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            id_pegawai: string
            id_pendidikan: string
            data: Partial<RiwayatPendidikan>
        }) => {
            const res = await api.put(
                `${BASE_PATH}/${payload.id_pegawai}/riwayat-pendidikan/${payload.id_pendidikan}`,
                payload.data
            )
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['riwayatPendidikan', variables.id_pegawai],
            })
            queryClient.invalidateQueries({
                queryKey: ['riwayatPendidikanDetail', variables.id_pendidikan],
            })
        },
    })
}

// DELETE: delete riwayat pendidikan
export const useDeleteRiwayatPendidikan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id_pegawai: string; id: string }) => {
            const res = await api.delete(
                `${BASE_PATH}/${payload.id_pegawai}/riwayat-pendidikan/${payload.id}`
            )
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['riwayatPendidikan', variables.id_pegawai],
            })
        },
    })
}

// POST: bulk create/update riwayat pendidikan via FormData (supports file upload)
export const useUploadRiwayatPendidikanFormData = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id_pegawai: string; formData: FormData }) => {
            const res = await api.post(
                `${BASE_PATH}/${payload.id_pegawai}/riwayat-pendidikan/bulk`,
                payload.formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['riwayatPendidikan', variables.id_pegawai],
            })
        },
    })
}
