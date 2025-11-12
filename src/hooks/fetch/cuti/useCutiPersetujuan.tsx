import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// =========================================================================
// 🧩 TYPES
// =========================================================================

export interface PersetujuanCuti {
  id: string
  id_permohonan_cuti: string
  id_pegawai_approver: string
  role_approver: string
  status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
  tanggal_persetujuan: Date | null
  catatan_persetujuan: string | null
  urutan_persetujuan: number
}

export interface PersetujuanCutiFilters {
    id_permohonan_cuti?: string
    id_user_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// =========================================================================
// 🤝 PERSETUJUAN CUTI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Cuti (biasanya untuk Approver)
 * GET /kepegawaian/cuti/persetujuan
 */
export const usePersetujuanCutiList = (filters: PersetujuanCutiFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters;
    return useQuery({
      queryKey: ['persetujuanCuti', filters],
      queryFn: async () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.entries(otherFilters).reduce((acc: Record<string, string>, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    acc[key] = String(value);
                }
                return acc;
            }, {}),
        })
        const res = await api.get(`/kepegawaian/cuti/persetujuan?${params.toString()}`);
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
}

/**
 * Hook untuk mengambil daftar langkah Persetujuan berdasarkan ID Permohonan
 * GET /kepegawaian/cuti/permohonan/:id/persetujuan
 */
export const usePersetujuanCutiByPermohonan = (permohonanId: string, enabled: boolean = true) => {
    return useQuery<PersetujuanCuti[]>({
        queryKey: ['persetujuanCutiByPermohonan', permohonanId],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/cuti/permohonan/${permohonanId}/persetujuan`);
            return res.data;
        },
        enabled: enabled && !!permohonanId,
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook untuk mendapatkan detail Persetujuan Cuti
 * GET /kepegawaian/cuti/persetujuan/:id
 */
export const useGetPersetujuanCutiDetail = (id: string, enabled: boolean = true) => {
    return useQuery<PersetujuanCuti>({
        queryKey: ['persetujuanCutiDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/cuti/persetujuan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk memproses (menyetujui/menolak/merevisi) langkah Persetujuan Cuti
 * PUT /kepegawaian/cuti/persetujuan/:id
 * Catatan: Ini mencakup logika "update status persetujuan" di backend.
 */
export const useUpdatePersetujuanCuti = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { 
            id: string; 
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'; 
            catatan_persetujuan?: string 
        }) => {
            const res = await api.put(`/kepegawaian/cuti/persetujuan/${data.id}`, data);
            return res.data;
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                           variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi';
            
            toast.success(`✅ Langkah persetujuan berhasil ${action}!`, { position: 'bottom-right' });
            // Invalidate queries yang terkait:
            queryClient.invalidateQueries({ queryKey: ['persetujuanCuti'] });
            queryClient.invalidateQueries({ queryKey: ['persetujuanCutiByPermohonan'] });
            queryClient.invalidateQueries({ queryKey: ['permohonanCuti'] }); 
            queryClient.invalidateQueries({ queryKey: ['jatahCutiByPegawaiTahun'] }); // Penting jika ini adalah langkah final yang mengurangi jatah
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan cuti!';
            toast.error(message, { position: 'bottom-right' });
        },
    });
}

/**
 * Hook untuk menghapus langkah Persetujuan Cuti (Akses Super Admin)
 * DELETE /kepegawaian/cuti/persetujuan/:id
 */
export const useDeletePersetujuanCuti = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/cuti/persetujuan/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success('🗑️ Langkah persetujuan berhasil dihapus!', { position: 'bottom-right' });
            queryClient.invalidateQueries({ queryKey: ['persetujuanCuti'] });
            queryClient.invalidateQueries({ queryKey: ['persetujuanCutiByPermohonan'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus langkah persetujuan!';
            toast.error(message, { position: 'bottom-right' });
        },
    });
}
