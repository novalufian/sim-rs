import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface RiwayatKepangkatanItem {
  id?: string
  id_pegawai?: string
  pangkat?: string
  golongan?: string
  ruang?: string
  tmt_pangkat?: string
  no_sk_pangkat?: string
  masa_kerja?: string
  is_aktif?: boolean
}

export interface RiwayatKepangkatanParams {
  id_pegawai?: string
}

const BASE_URL = '/kepegawaian/kepangkatan/riwayat'

export const useRiwayatKepangkatanById = (id: string) => {
  return useQuery({
    queryKey: ['riwayat-kepangkatan', id],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/${id}`)
      return res.data
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useRiwayatKepangkatan = (params: RiwayatKepangkatanParams = {}) => {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['riwayat-kepangkatan', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.id_pegawai) searchParams.append('id_pegawai', params.id_pegawai)
      const qs = searchParams.toString()
      const res = await api.get(`${BASE_URL}${qs ? `?${qs}` : ''}`)
      return res.data
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<RiwayatKepangkatanItem>) => {
      const res = await api.post(BASE_URL, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-kepangkatan'] })
      if (params.id_pegawai) {
        queryClient.invalidateQueries({ queryKey: ['pegawai', params.id_pegawai] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; payload: Partial<RiwayatKepangkatanItem> }) => {
      const res = await api.put(`${BASE_URL}/${data.id}`, data.payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-kepangkatan'] })
      if (params.id_pegawai) {
        queryClient.invalidateQueries({ queryKey: ['pegawai', params.id_pegawai] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${BASE_URL}/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-kepangkatan'] })
      if (params.id_pegawai) {
        queryClient.invalidateQueries({ queryKey: ['pegawai', params.id_pegawai] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      }
    },
  })

  return {
    riwayatKepangkatan: listQuery.data?.data ?? listQuery.data,
    isLoadingRiwayat: listQuery.isLoading,
    getRiwayatKepangkatan: listQuery.refetch,
    getRiwayatKepangkatanById: useRiwayatKepangkatanById,
    createRiwayatKepangkatan: createMutation.mutate,
    updateRiwayatKepangkatan: updateMutation.mutate,
    deleteRiwayatKepangkatan: deleteMutation.mutate,
  }
}
