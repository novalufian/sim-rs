import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

export interface RiwayatPendidikan {
    id_riwayat_pendidikan: string;
    id_pegawai: string;
    status_pendidikan: string;
    jurusan: string;
    institusi: string;
    tahun_mulai: number;
    tahun_selesai: number;
    no_ijazah: string;
    dokumen_ijazah: string;
    dokumen_transkrip: string;
    gelar: string;
}

export const useRiwayatPendidikan = (filters: any = {}) => {
    return useQuery({
        queryKey: ['riwayatPendidikan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters.status_pendidikan) params.append('status_pendidikan', filters.status_pendidikan)
            if (filters.jurusan) params.append('jurusan', filters.jurusan)
            if (filters.institusi) params.append('institusi', filters.institusi)
            if (filters.tahun_mulai) params.append('tahun_mulai', filters.tahun_mulai)
            if (filters.tahun_selesai) params.append('tahun_selesai', filters.tahun_selesai)
            if (filters.no_ijazah) params.append('no_ijazah', filters.no_ijazah)
            if (filters.dokumen_ijazah) params.append('dokumen_ijazah', filters.dokumen_ijazah)
            if (filters.dokumen_transkrip) params.append('dokumen_transkrip', filters.dokumen_transkrip)
            if (filters.gelar) params.append('gelar', filters.gelar)
            const res = await api.get(`/riwayat_pendidikan?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useRiwayatPendidikanDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
            mutationFn: async (id: string) => {
            const res = await api.delete(`/riwayat_pendidikan/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Riwayat pendidikan berhasil dihapus!', data)
            toast.success('Riwayat pendidikan berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPendidikan'] })
        },
        onError: (error: any) => {
            console.error('❌ Error deleting riwayat pendidikan:', error)
            toast.error('Gagal menghapus riwayat pendidikan!', { position: 'bottom-right' })
        },
    })
}

export const useRiwayatPendidikanCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/riwayat_pendidikan', data)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Riwayat pendidikan berhasil dibuat!', data)
            toast.success('Riwayat pendidikan berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPendidikan'] })
        },
        onError: (error: any) => {
            console.error('❌ Error creating riwayat pendidikan:', error)
            toast.error('Gagal membuat riwayat pendidikan!', { position: 'bottom-right' })
        },
    })
}

export const useRiwayatPendidikanUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.put('/riwayat_pendidikan', data)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Riwayat pendidikan berhasil diupdate!', data)
            toast.success('Riwayat pendidikan berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPendidikan'] })
        },
        onError: (error: any) => {
            console.error('❌ Error updating riwayat pendidikan:', error)
            toast.error('Gagal mengupdate riwayat pendidikan!', { position: 'bottom-right' })
        },
    })
}

export const useRiwayatPendidikanGetById = (id: string) => {
    return useQuery({
        queryKey: ['riwayatPendidikanById', id],
        queryFn: async ({ queryKey }: { queryKey: string[] }) => {
            const [, riwayatId] = queryKey
            const res = await api.get(`/riwayat_pendidikan/${riwayatId}`)
            return res.data
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}