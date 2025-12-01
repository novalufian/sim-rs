'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { PermohonanMutasiFilters } from "@/hooks/fetch/mutasi/useMutasiPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
    jenis_mutasi?: string 
    startDate?: string
    endDate?: string
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanMutasiFilters)
interface Props {
    onFilterChange: (filters: PermohonanMutasiFilters) => void
}

export default function MutasiQueryFilter({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [focusedInput, setFocusedInput] = useState<any>(null)

    const _CLASSNAME_ =
        "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanMutasiFilters => {
        return {
            status: internalFilters.status || undefined,
            jenis_mutasi: internalFilters.jenis_mutasi || undefined,
            startDate: internalFilters.startDate || undefined,
            endDate: internalFilters.endDate || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
            jenis_mutasi: params.get("jenis_mutasi") || "",
            startDate: params.get("startDate") || "",
            endDate: params.get("endDate") || "",
        }

        setFilters(initialFilters)
        onFilterChange(convertToOutput(initialFilters));
        setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedInternalFilters = {
        ...filters,
        [name]: value,
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters))
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        const updatedInternalFilters = {
        ...filters,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
        endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters));
    };

    const resetFilters = () => {
        const reset: InternalFilterState = {
        status: '',
        jenis_mutasi: '',
        startDate: '',
        endDate: '',
        }
        setFilters(reset)
        // Reset focused input untuk DateRangePicker
        setFocusedInput(null)
        // Kirim object kosong untuk reset semua filter
        const resetOutput: PermohonanMutasiFilters = {};
        onFilterChange(resetOutput)
    }

    // Status options untuk mutasi - sesuai dengan valid values dari server
    const statusOptions = [
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'DISETUJUI_KA_UNIT', label: 'Disetujui KA Unit' },
        { value: 'DISETUJUI_KA_BIDANG', label: 'Disetujui KA Bidang' },
        { value: 'VALIDASI_KEPEGAWAIAN', label: 'Validasi Kepegawaian' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
    ]

    // Jenis Mutasi options
    const jenisMutasiOptions = [
        { value: 'MUTASI_KELUAR', label: 'Mutasi Keluar' },
        { value: 'MUTASI_MASUK', label: 'Mutasi Masuk' },
        { value: 'PROMOSI', label: 'Promosi' },
        { value: 'DEMOSI', label: 'Demosi' },
        { value: 'ROTASI', label: 'Rotasi' },
    ]

    return (
        <div className="flex flex-wrap gap-2">
        {/* Date Range (Tanggal Pengajuan) */}
        <div className={"relative z-[99] " + _CLASSNAME_}>
            <DateRangePicker
            startDate={filters.startDate ? moment(filters.startDate) : null}
            endDate={filters.endDate ? moment(filters.endDate) : null}
            onDatesChange={handleDateChange}
            startDateId="start_date_mutasi"
            focusedInput={focusedInput}
            onFocusChange={setFocusedInput}
            endDateId="end_date_mutasi"
            displayFormat="YYYY-MM-DD"
            isOutsideRange={() => false}
            />
        </div>
        {/* Status Permohonan Mutasi */}
        <select name="status" className={`${_CLASSNAME_} pr-10`} value={filters.status} onChange={handleChange}>
            <option value="">Status Mutasi</option>
            {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                    {status.label}
                </option>
            ))}
        </select>

        {/* Jenis Mutasi */}
        <select name="jenis_mutasi" value={filters.jenis_mutasi} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Jenis Mutasi</option>
            {jenisMutasiOptions.map(jenis => (
                <option key={jenis.value} value={jenis.value}>
                    {jenis.label}
                </option>
            ))}
        </select>

        

        {/* Reset */}
        <button className={`${_CLASSNAME_} flex flex-row items-center gap-1`} onClick={resetFilters}>
            <RiResetRightLine className='h-4 w-4' />
            Reset
        </button>
        </div>
    )
}

