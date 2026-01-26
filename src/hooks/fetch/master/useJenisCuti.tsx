import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface JenisCutiFilters {
  page?: number
  limit?: number
}

export interface JenisCutiItem {
  id: number
  nama: string
  max_hari?: number | null
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
}

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

// GET /master/jenis_cuti — List dengan pagination & filter
export const useJenisCuti = (filters: JenisCutiFilters = {}) => {
  const { page = 1, limit = 10 } = filters
  return useQuery<ApiListResponse<JenisCutiItem>>({
    queryKey: ['jenisCuti', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', String(limit))
      const res = await api.get(`/master/jenis_cuti?${params.toString()}`)
      return res.data as ApiListResponse<JenisCutiItem>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/jenis_cuti/all — Get semua untuk dropdown
export const useJenisCutiAll = () => {
  return useQuery<ApiItemResponse<JenisCutiItem[]>>({
    queryKey: ['jenisCuti', 'all'],
    queryFn: async () => {
      const res = await api.get('/master/jenis_cuti/all')
      return res.data as ApiItemResponse<JenisCutiItem[]>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/jenis_cuti/search?search=xxx — Search
export const useJenisCutiSearch = (search: string) => {
  return useQuery<ApiItemResponse<JenisCutiItem[]>>({
    queryKey: ['jenisCuti', 'search', search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get(`/master/jenis_cuti/search?${params.toString()}`)
      return res.data as ApiItemResponse<JenisCutiItem[]>
    },
    enabled: !!search,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/jenis_cuti/:id — Get by ID
export const useJenisCutiById = (id: string) => {
  return useQuery<ApiItemResponse<JenisCutiItem>>({
    queryKey: ['jenisCuti', id],
    queryFn: async () => {
      const res = await api.get(`/master/jenis_cuti/${id}`)
      return res.data as ApiItemResponse<JenisCutiItem>
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// POST /master/jenis_cuti — Create
export const usePostJenisCuti = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: Partial<JenisCutiItem>) => {
      const res = await api.post('/master/jenis_cuti', formData)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('✅ Jenis cuti berhasil ditambahkan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menambahkan jenis cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

// PUT /master/jenis_cuti/:id — Update
export const useUpdateJenisCuti = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; formData: Partial<JenisCutiItem> }) => {
      const res = await api.put(`/master/jenis_cuti/${data.id}`, data.formData)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('✅ Jenis cuti berhasil diupdate!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal mengupdate jenis cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

// DELETE /master/jenis_cuti/:id — Soft delete
export const useDeleteJenisCuti = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/master/jenis_cuti/${id}`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('🗑️ Jenis cuti berhasil dihapus!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['jenisCuti', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menghapus jenis cuti!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}
