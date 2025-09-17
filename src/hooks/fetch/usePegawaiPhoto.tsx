import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const BASE_PATH = '/kepegawaian/pegawai'

export interface PegawaiPhotoMeta {
    description?: string
    tags?: string[]
    is_active?: boolean
    is_avatar?: boolean
}

export interface PegawaiPhotoItem {
    id: string
    id_pegawai: string
    filename: string
    url: string
    is_avatar: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    description?: string
    tags?: string[]
}

export interface ListPhotosResponse {
    success: boolean
    message: string
    data: PegawaiPhotoItem[]
}

// GET: list all photos of a pegawai (optional helper)
export const usePegawaiPhotos = (id_pegawai: string | undefined) => {
    return useQuery<ListPhotosResponse>({
        queryKey: ['pegawaiPhotos', id_pegawai],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id_pegawai}/photos`)
            return res.data as ListPhotosResponse
        },
        enabled: !!id_pegawai,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// POST: upload a photo for pegawai
export const useUploadPegawaiPhoto = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id_pegawai: string; file: File; meta?: PegawaiPhotoMeta }) => {
            const form = new FormData()
            form.append('photo', payload.file)
            if (payload.meta?.description) form.append('description', payload.meta.description)
            if (payload.meta?.is_active !== undefined) form.append('is_active', String(payload.meta.is_active))
            if (payload.meta?.is_avatar !== undefined) form.append('is_avatar', String(payload.meta.is_avatar))
            if (payload.meta?.tags && payload.meta.tags.length > 0) {
                // Send as CSV or multiple fields depending on backend; CSV is common
                form.append('tags', payload.meta.tags.join(','))
            }

            const res = await api.post(`${BASE_PATH}/${payload.id_pegawai}/photos/upload`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return res.data
        },
        onSuccess: (_data, variables) => {
            // Refresh photo lists for that pegawai
            queryClient.invalidateQueries({ queryKey: ['pegawaiPhotos', variables.id_pegawai] })
        },
    })
}


