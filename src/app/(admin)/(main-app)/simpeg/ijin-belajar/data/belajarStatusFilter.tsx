'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { PermohonanBelajarFilters } from "@/hooks/fetch/belajar/useBelajarPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
    institusi_pendidikan_id?: string
    program_studi_id?: string
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanBelajarFilters)
interface Props {
    onFilterChange: (filters: PermohonanBelajarFilters) => void
    currentFilters?: PermohonanBelajarFilters
}

const BUTTON_CLASSNAME = "flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4";

export default function BelajarStatusFilter({ onFilterChange, currentFilters }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({
        status: currentFilters?.status || '',
        institusi_pendidikan_id: currentFilters?.institusi_pendidikan_id || '',
        program_studi_id: currentFilters?.program_studi_id || '',
    })
    const [isInitialized, setIsInitialized] = useState(false)

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanBelajarFilters => {
        return {
            status: internalFilters.status || undefined,
            institusi_pendidikan_id: internalFilters.institusi_pendidikan_id || undefined,
            program_studi_id: internalFilters.program_studi_id || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
            institusi_pendidikan_id: params.get("institusi_pendidikan_id") || "",
            program_studi_id: params.get("program_studi_id") || "",
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
                institusi_pendidikan_id: currentFilters.institusi_pendidikan_id || '',
                program_studi_id: currentFilters.program_studi_id || '',
            })
        }
    }, [currentFilters])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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
        institusi_pendidikan_id: '',
        program_studi_id: '',
        }
        setFilters(reset)
        // Kirim object kosong untuk reset semua filter
        const resetOutput: PermohonanBelajarFilters = {};
        onFilterChange(resetOutput)
    }

    // Status options untuk ijin belajar - sesuai dengan valid values dari server
    const statusOptions = [
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'PERSETUJUAN_ATASAN', label: 'Persetujuan Atasan' },
        { value: 'VALIDASI_KEPEGAWAIAN', label: 'Validasi Kepegawaian' },
        { value: 'PERSETUJUAN_AKHIR', label: 'Persetujuan Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
    ]

    return (
        <div className="flex flex-col gap-3">
            {/* Status Permohonan Ijin Belajar */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status Ijin Belajar</label>
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

            {/* Filter Institusi Pendidikan */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Institusi Pendidikan</label>
                <input
                    type="text"
                    name="institusi_pendidikan_id"
                    className={BUTTON_CLASSNAME}
                    value={filters.institusi_pendidikan_id}
                    onChange={handleChange}
                    placeholder="Cari institusi pendidikan..."
                />
            </div>

            {/* Filter Program Studi */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Program Studi</label>
                <input
                    type="text"
                    name="program_studi_id"
                    className={BUTTON_CLASSNAME}
                    value={filters.program_studi_id}
                    onChange={handleChange}
                    placeholder="Cari program studi..."
                />
            </div>

            {/* Reset */}
            <button className={`${BUTTON_CLASSNAME} flex flex-row items-center gap-1`} onClick={resetFilters}>
                <RiResetRightLine className='h-4 w-4' />
                Reset Filter
            </button>
        </div>
    )
}

