import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface MasterPangkatGolonganItem {
  id: string
  nama_pangkat: string
  golongan: string
  ruang?: string | null
  urutan?: number | null
  is_active?: boolean
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
}

const BASE_URL = '/master/pangkat-golongan'
const MASTER_KEY = ['master-pangkat-golongan']

export const usePangkatGolonganById = (id: string) => {
  return useQuery({
    queryKey: [...MASTER_KEY, id],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/${id}`)
      return res.data
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useMasterPangkatGolongan = () => {
  const queryClient = useQueryClient()

  const masterQuery = useQuery({
    queryKey: MASTER_KEY,
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/master`)
      return res.data
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const formQuery = useQuery({
    queryKey: [...MASTER_KEY, 'form'],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/form`)
      return res.data
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<MasterPangkatGolonganItem>) => {
      const res = await api.post(BASE_URL, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; payload: Partial<MasterPangkatGolonganItem> }) => {
      const res = await api.put(`${BASE_URL}/${data.id}`, data.payload)
      console.log('[PangkatGolongan] update response:', res.data);

      return res.data

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${BASE_URL}/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_KEY })
    },
  })

  return {
    masterPangkatGolongan: masterQuery.data?.data ?? masterQuery.data,
    pangkatGolonganForm: formQuery.data?.data ?? formQuery.data,
    isLoading: masterQuery.isLoading || formQuery.isLoading,
    getPangkatGolonganById: usePangkatGolonganById,
    createPangkatGolongan: createMutation.mutateAsync,
    updatePangkatGolongan: updateMutation.mutateAsync,
    deletePangkatGolongan: deleteMutation.mutateAsync,
  }
}
