import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface RiwayatJabatanItem {
  id?: string
  pegawai_id?: string
  jabatan_id?: string
  tipe_jabatan?: string
  tmt_mulai?: string
  tmt_selesai?: string | null
  sk_nomor?: string | null
  sk_tanggal?: string | null
  file_sk?: string | null
  keterangan?: string | null
  is_aktif?: boolean
}

export interface RiwayatJabatanParams {
  id_pegawai?: string
}

export interface CreateRiwayatJabatanPayload {
  pegawai_id: string
  jabatan_id: string
  tipe_jabatan: string
  tmt_mulai: string
  tmt_selesai?: string | null
  sk_nomor?: string | null
  sk_tanggal?: string | null
  is_aktif?: boolean
  file_sk?: File | null
  keterangan?: string | null
}

const BASE_URL = '/kepegawaian/jabatan/riwayat'

const toFormData = (payload: CreateRiwayatJabatanPayload) => {
  const fd = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null) {
      fd.append(key, '')
      return
    }
    if (value instanceof File) {
      fd.append(key, value)
      return
    }
    fd.append(key, String(value))
  })
  return fd
}

export const useRiwayatJabatanById = (id: string) => {
  return useQuery({
    queryKey: ['riwayat-jabatan', id],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/${id}`)
      return res.data
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export const useRiwayatJabatan = (params: RiwayatJabatanParams = {}) => {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['riwayat-jabatan', params],
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
    mutationFn: async (payload: CreateRiwayatJabatanPayload | FormData) => {
      if (payload instanceof FormData) {
        const res = await api.post(BASE_URL, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
      }
      const body = payload.file_sk ? toFormData(payload) : payload
      const res = await api.post(
        BASE_URL,
        body,
        payload.file_sk ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-jabatan'] })
      if (params.id_pegawai) {
        queryClient.invalidateQueries({ queryKey: ['pegawai', params.id_pegawai] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; payload: Partial<CreateRiwayatJabatanPayload> | FormData }) => {
      if (data.payload instanceof FormData) {
        const res = await api.put(`${BASE_URL}/${data.id}`, data.payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
      }
      const body =
        data.payload && (data.payload as any).file_sk
          ? toFormData(data.payload as CreateRiwayatJabatanPayload)
          : data.payload
      const res = await api.put(
        `${BASE_URL}/${data.id}`,
        body,
        (data.payload as any)?.file_sk ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-jabatan'] })
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
      queryClient.invalidateQueries({ queryKey: ['riwayat-jabatan'] })
      if (params.id_pegawai) {
        queryClient.invalidateQueries({ queryKey: ['pegawai', params.id_pegawai] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['pegawai'] })
      }
    },
  })

  return {
    riwayatJabatan: listQuery.data?.data ?? listQuery.data,
    isLoadingRiwayatJabatan: listQuery.isLoading,
    getRiwayatJabatan: listQuery.refetch,
    getRiwayatJabatanById: useRiwayatJabatanById,
    createRiwayatJabatan: createMutation.mutateAsync,
    updateRiwayatJabatan: updateMutation.mutateAsync,
    deleteRiwayatJabatan: deleteMutation.mutateAsync,
    isCreatingRiwayatJabatan: createMutation.isPending,
    isUpdatingRiwayatJabatan: updateMutation.isPending,
    isDeletingRiwayatJabatan: deleteMutation.isPending,
  }
}
