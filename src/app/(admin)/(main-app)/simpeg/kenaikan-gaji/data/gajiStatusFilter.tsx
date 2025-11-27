'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { PermohonanGajiFilters } from "@/hooks/fetch/gaji/useGajiPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanGajiFilters)
interface Props {
    onFilterChange: (filters: PermohonanGajiFilters) => void
    currentFilters?: PermohonanGajiFilters
}

const BUTTON_CLASSNAME = "flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4";

export default function GajiStatusFilter({ onFilterChange, currentFilters }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({
        status: currentFilters?.status || '',
    })
    const [isInitialized, setIsInitialized] = useState(false)

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanGajiFilters => {
        return {
            status: internalFilters.status || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
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
        }
        setFilters(reset)
        const resetOutput: PermohonanGajiFilters = {};
        onFilterChange(resetOutput)
    }

    // Status options untuk kenaikan gaji
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

    return (
        <div className="flex flex-col gap-3">
            {/* Status Permohonan Kenaikan Gaji */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status Kenaikan Gaji</label>
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

            {/* Reset */}
            <button className={`${BUTTON_CLASSNAME} flex flex-row items-center gap-1`} onClick={resetFilters}>
                <RiResetRightLine className='h-4 w-4' />
                Reset Filter
            </button>
        </div>
    )
}

