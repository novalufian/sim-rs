import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface UnitKerjaFilters {
  page?: number
  limit?: number
}

export interface UnitKerjaItem {
  id: string
  nama_unit_kerja: string
  level: number
  kode_unit: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
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

// GET /master/unit_kerja/
export const useUnitKerja = (filters: UnitKerjaFilters = {}) => {
  const { page = 1, limit = 10 } = filters
  return useQuery<ApiListResponse<UnitKerjaItem>>({
    queryKey: ['unitKerja', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', String(limit))
      const res = await api.get(`/master/unit_kerja?${params.toString()}`)
      return res.data as ApiListResponse<UnitKerjaItem>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/unit_kerja/all
export const useUnitKerjaAll = () => {
  return useQuery<ApiItemResponse<UnitKerjaItem[]>>({
    queryKey: ['unitKerja', 'all'],
    queryFn: async () => {
      const res = await api.get('/master/unit_kerja/all')
      return res.data as ApiItemResponse<UnitKerjaItem[]>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/unit_kerja/search
export const useUnitKerjaSearch = (query: string) => {
  return useQuery<ApiItemResponse<UnitKerjaItem[]>>({
    queryKey: ['unitKerja', 'search', query],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      const res = await api.get(`/master/unit_kerja/search?${params.toString()}`)
      return res.data as ApiItemResponse<UnitKerjaItem[]>
    },
    enabled: !!query,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// GET /master/unit_kerja/:id
export const useUnitKerjaById = (id: string) => {
  return useQuery<ApiItemResponse<UnitKerjaItem>>({
    queryKey: ['unitKerja', id],
    queryFn: async () => {
      const res = await api.get(`/master/unit_kerja/${id}`)
      return res.data as ApiItemResponse<UnitKerjaItem>
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

// POST /master/unit_kerja/
export const usePostUnitKerja = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: Partial<UnitKerjaItem>) => {
      const res = await api.post('/master/unit_kerja', formData)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('✅ Unit kerja berhasil ditambahkan!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['unitKerja'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menambahkan unit kerja!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

// PUT /master/unit_kerja/:id
export const useUpdateUnitKerja = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; formData: Partial<UnitKerjaItem> }) => {
      const res = await api.put(`/master/unit_kerja/${data.id}`, data.formData)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('✅ Unit kerja berhasil diupdate!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['unitKerja'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal mengupdate unit kerja!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}

// DELETE /master/unit_kerja/:id
export const useDeleteUnitKerja = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/master/unit_kerja/${id}`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('🗑️ Unit kerja berhasil dihapus!', { position: 'bottom-right' })
      queryClient.invalidateQueries({ queryKey: ['unitKerja'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['unitKerja', 'search'] })
      console.log('🟢 Data:', data)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menghapus unit kerja!'
      toast.error(message, { position: 'bottom-right' })
    },
  })
}
