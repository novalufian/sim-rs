// src/hooks/fetch/usePegawaiSearch.ts

import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

interface PegawaiSearchFilters {
    q: string
    page?: number
    limit?: number
    nama?: string
    nip?: string
    jenis_kelamin?: string
    agama?: string
    status_perkawinan?: string
    status_pekerjaan?: string
}

// Interface for the fetched Pegawai data (matching your Prisma schema)
interface Pegawai {
    id_pegawai: string;
    no_urut: number;
    nama: string;
    nip: string;
    tempat_lahir?: string | null;
    tanggal_lahir?: Date | null;
    umur?: number | null;
    jenis_kelamin?: string | null;
    agama?: string | null;
    nik?: string | null;
    no_kk?: string | null;
    alamat_ktp?: string | null;
    alamat_domisili?: string | null;
    no_hp?: string | null;
    email?: string | null;
    npwp?: string | null;
    bpjs?: string | null;
    nama_bank_gaji?: string | null;
    no_rekening?: string | null;
    status_perkawinan?: string | null;
    nama_anak?: string | null;
    status_pekerjaan: string;
    created_at: Date;
    updated_at: Date;
    created_by?: string | null;
    updated_by?: string | null;
    is_deleted: boolean;
}

export const usePegawaiSearch = (filters: PegawaiSearchFilters) => {
    const {
        q,
        page = 1,
        limit = 10,
        nama,
        nip,
        jenis_kelamin,
        agama,
        status_perkawinan,
        status_pekerjaan,
    } = filters
    
    return useQuery<{ data: Pegawai[], total: number }>({ // Assuming your API returns { data: [], total: count }
        queryKey: ['pegawaiSearch', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            // params.append('keyword', q) // 'search' parameter for the backend search endpoint
            
            if (nama) params.append('nama', nama)
            if (nip) params.append('nip', nip)
            if (jenis_kelamin) params.append('jenis_kelamin', jenis_kelamin)
            if (agama) params.append('agama', agama)
            if (status_perkawinan) params.append('status_perkawinan', status_perkawinan)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                                    
            params.append('page', page.toString())
            params.append('limit', limit.toString())
            
            const res = await api.get(`/pegawai/search/${q}?${params.toString()}`) // Use the same /pegawai endpoint, backend distinguishes search by 'search' param
            return res.data
        },
        enabled: !!q, // Only run the query if 'q' (search keyword) is present
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}