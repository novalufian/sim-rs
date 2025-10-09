import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export interface User {
    id: string
    username: string
    role: string
    is_deleted: boolean
    created_at: string
    pegawai_id: string
    pegawai?: {
        id_pegawai: string
        nama: string
        nip?: string
    }
}

export interface UserFilters {
    username?: string
    role?: string
    page?: number
    limit?: number
}

/* =========================================
🔹 GET USERS (list with pagination/filter)
========================================= */
export const useUsers = (filters: UserFilters = {}) => {
    const { username, role, page = 1, limit = 10 } = filters
    
    return useQuery({
        queryKey: ['user', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            
            if (username) params.append('username', username)
                if (role) params.append('role', role)
                    params.append('page', page.toString())
            params.append('limit', limit.toString())
            
            const res = await api.get(`/pegawai/user?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

/* =========================================
🔹 GET USER BY ID
========================================= */
export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const res = await api.get(`/pegawai/user/${id}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

/* =========================================
🔹 CREATE USER
========================================= */
export const usePostUser = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/pegawai/user', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ User berhasil dibuat!', data)
            toast.success('User berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: any) => {
            console.error('❌ Gagal membuat user:', error)
            const message =
            error.response?.data?.message || 'Gagal menambahkan user!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/* =========================================
🔹 UPDATE USER
========================================= */
export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/pegawai/user/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ User berhasil diupdate!', data)
            toast.success('User berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['user', data.id] })
        },
        onError: (error: any) => {
            console.error('❌ Gagal mengupdate user:', error)
            toast.error('Gagal mengupdate user!', { position: 'bottom-right' })
        },
    })
}

/* =========================================
🔹 DELETE USER (soft delete)
========================================= */
export const useUserDelete = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/pegawai/user/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ User berhasil dihapus!', data)
            toast.success('User berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: any) => {
            console.error('❌ Gagal menghapus user:', error)
            toast.error('Gagal menghapus user!', { position: 'bottom-right' })
        },
    })
}
