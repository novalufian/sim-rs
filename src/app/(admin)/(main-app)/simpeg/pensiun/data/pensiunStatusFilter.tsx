'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { PermohonanPensiunFilters } from "@/hooks/fetch/pensiun/usePensiunPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
    jenis_pensiun?: string 
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanPensiunFilters)
interface Props {
    onFilterChange: (filters: PermohonanPensiunFilters) => void
    currentFilters?: PermohonanPensiunFilters
}

const BUTTON_CLASSNAME = "flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4";

export default function PensiunStatusFilter({ onFilterChange, currentFilters }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({
        status: currentFilters?.status || '',
        jenis_pensiun: currentFilters?.jenis_pensiun || '',
    })
    const [isInitialized, setIsInitialized] = useState(false)

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanPensiunFilters => {
        return {
            status: internalFilters.status || undefined,
            jenis_pensiun: internalFilters.jenis_pensiun || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
            jenis_pensiun: params.get("jenis_pensiun") || "",
        }

        setFilters(initialFilters)
        onFilterChange(convertToOutput(initialFilters));
        setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    useEffect(() => {
        if (currentFilters) {
            setFilters({
                status: currentFilters.status || '',
                jenis_pensiun: currentFilters.jenis_pensiun || '',
            })
        }
    }, [currentFilters])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedInternalFilters = {
        ...filters,
        [name]: value,
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters))
    }

    const resetFilters = () => {
        const reset: InternalFilterState = {
        status: '',
        jenis_pensiun: '',
        }
        setFilters(reset)
        const resetOutput: PermohonanPensiunFilters = {};
        onFilterChange(resetOutput)
    }

    // Status options untuk pensiun
    const statusOptions = [
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'MENUNGGU', label: 'Menunggu' },
        { value: 'PROSES', label: 'Proses' },
        { value: 'VALIDASI', label: 'Validasi' },
        { value: 'DISETUJUI', label: 'Disetujui' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
    ]

    // Jenis Pensiun options
    const jenisPensiunOptions = [
        { value: 'PENSIUN_USIA', label: 'Pensiun Usia' },
        { value: 'PENSIUN_JABATAN', label: 'Pensiun Jabatan' },
        { value: 'PENSIUN_SAKIT', label: 'Pensiun Sakit' },
        { value: 'PENSIUN_CACAT', label: 'Pensiun Cacat' },
        { value: 'PENSIUN_ATAS_PERMINTAAN_SENDIRI', label: 'Pensiun Atas Permintaan Sendiri' },
    ]

    return (
        <div className="flex flex-col gap-3">
            {/* Status Permohonan Pensiun */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status Pensiun</label>
                <select 
                    name="status" 
                    className={`${BUTTON_CLASSNAME} appearance-none pr-10`} 
                    value={filters.status} 
                    onChange={handleChange}
                >
                    <option value="">Semua Status</option>
                    {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Jenis Pensiun */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Jenis Pensiun</label>
                <select 
                    name="jenis_pensiun" 
                    value={filters.jenis_pensiun} 
                    onChange={handleChange} 
                    className={`${BUTTON_CLASSNAME} appearance-none pr-10`}
                >
                    <option value="">Semua Jenis</option>
                    {jenisPensiunOptions.map(jenis => (
                        <option key={jenis.value} value={jenis.value}>
                            {jenis.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset */}
            <button className={`${BUTTON_CLASSNAME} flex flex-row items-center gap-1`} onClick={resetFilters}>
                <RiResetRightLine className='h-4 w-4' />
                Reset Filter
            </button>
        </div>
    )
}

