import api from '@/libs/api'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface PangkatGolonganItem {
  id: string
  nama_pangkat: string
  golongan?: string | null
  ruang?: string | null
  urutan?: number | null
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
}

export interface ApiListResponse<T> {
  success: boolean
  message: string
  data: T[]
}

export interface ApiItemResponse<T> {
  success: boolean
  message: string
  data: T
}

export const usePangkatGolonganMaster = () => {
  return useQuery<ApiListResponse<PangkatGolonganItem>>({
    queryKey: ['pangkat-golongan-master'],
    queryFn: async () => {
      const res = await api.get('/master/pangkat-golongan/master')
      return res.data as ApiListResponse<PangkatGolonganItem>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const usePangkatGolonganForm = () => {
  return useQuery<ApiListResponse<PangkatGolonganItem>>({
    queryKey: ['pangkat-golongan-form'],
    queryFn: async () => {
      const res = await api.get('/master/pangkat-golongan/form')
      return res.data as ApiListResponse<PangkatGolonganItem>
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const usePangkatGolonganById = (id: string) => {
  return useQuery<ApiItemResponse<PangkatGolonganItem>>({
    queryKey: ['pangkat-golongan', id],
    queryFn: async () => {
      const res = await api.get(`/master/pangkat-golongan/${id}`)
      return res.data as ApiItemResponse<PangkatGolonganItem>
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useCreatePangkatGolongan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: Partial<PangkatGolonganItem>) => {
      const res = await api.post('/master/pangkat-golongan', formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan-master'] })
    },
  })
}

export const useUpdatePangkatGolongan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string; formData: Partial<PangkatGolonganItem> }) => {
      const res = await api.put(`/master/pangkat-golongan/${data.id}`, data.formData)
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan-master'] })
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan-form'] })
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan', variables.id] })
    },
  })
}

export const useDeletePangkatGolongan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/master/pangkat-golongan/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan-master'] })
      queryClient.invalidateQueries({ queryKey: ['pangkat-golongan-form'] })
    },
  })
}

export const usePangkatGolonganOptions = () => {
  const formQuery = usePangkatGolonganForm()
  const options = useMemo(() => {
    const items = formQuery.data?.data ?? []
    return items.map((item) => {
      const golongan = item.golongan ?? '-'
      const ruang = item.ruang ?? '-'
      return {
        value: item.id,
        label: `${item.nama_pangkat} (${golongan}/${ruang})`,
      }
    })
  }, [formQuery.data])

  return {
    options,
    isLoading: formQuery.isLoading,
    isError: formQuery.isError,
    error: formQuery.error,
    refetch: formQuery.refetch,
  }
}
