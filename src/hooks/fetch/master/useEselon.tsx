import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface EselonItem {
  id: string
  nama?: string
  kode?: string
  level?: number
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface EselonListResponse {
  success: boolean
  message: string
  data: {
    page: number
    limit: number
    total: number
    items: EselonItem[]
  }
}

export interface EselonAllResponse {
  success: boolean
  message: string
  data: EselonItem[]
}

export interface EselonItemResponse {
  success: boolean
  message: string
  data: EselonItem
}

export interface EselonFilters {
  page?: number
  limit?: number
}

const BASE_URL = '/master/eselon'

export const useEselon = (filters: EselonFilters = {}) => {
  const { page = 1, limit = 10 } = filters
  return useQuery<EselonListResponse>({
    queryKey: ['eselon', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', String(limit))
      const res = await api.get(`${BASE_URL}?${params.toString()}`)
      return res.data as EselonListResponse
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useEselonAll = () => {
  return useQuery<EselonAllResponse>({
    queryKey: ['eselon', 'all'],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/all`)
      return res.data as EselonAllResponse
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useEselonById = (id: string) => {
  return useQuery<EselonItemResponse>({
    queryKey: ['eselon', id],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/${id}`)
      return res.data as EselonItemResponse
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useCreateEselon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<EselonItem>) => {
      const res = await api.post(BASE_URL, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eselon'] })
    },
  })
}

export const useUpdateEselon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string; payload: Partial<EselonItem> }) => {
      const res = await api.put(`${BASE_URL}/${data.id}`, data.payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eselon'] })
    },
  })
}

export const useDeleteEselon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${BASE_URL}/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eselon'] })
    },
  })
}
