'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";  

interface FilterState {
    status?: string
    klasifikasi?: string
    priority?: string
    startDate?: string
    endDate?: string
    gender?: string
    jenis_pekerjaan?: string
    jenjang_pendidikan?: string
    status_perkawinan?: string
    agama?: string
}

interface Props {
    onFilterChange: (filters: FilterState) => void
}

 export default function PegawaiQueryFilter({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<FilterState>({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [focusedInput, setFocusedInput] = useState<any>(null)

    const _CLASSNAME_ =
        "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: FilterState = {
            status: params.get("status") || "",
            klasifikasi: params.get("klasifikasi") || "",
            priority: params.get("priority") || "",
            startDate: params.get("startDate") || "",
            endDate: params.get("endDate") || "",
            gender: params.get("gender") || "",
            jenis_pekerjaan: params.get("jenis_pekerjaan") || "",
            jenjang_pendidikan: params.get("jenjang_pendidikan") || "",
            status_perkawinan: params.get("status_perkawinan") || "",
            agama: params.get("agama") || "",
        }

        setFilters(initialFilters)
        onFilterChange(initialFilters)
        setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedFilters = {
        ...filters,
        [name]: value,
        }
        setFilters(updatedFilters)
        onFilterChange(updatedFilters)
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        const updatedFilters = {
        ...filters,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
        endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        }
        setFilters(updatedFilters)
        onFilterChange(updatedFilters)
    };

    const resetFilters = () => {
        const reset: FilterState = {
        status: '',
        klasifikasi: '',
        priority: '',
        startDate: '',
        endDate: '',
        gender: '',
        jenis_pekerjaan: '',
        jenjang_pendidikan: '',
        status_perkawinan: '',
        agama: '',
        }
        setFilters(reset)
        onFilterChange(reset)
    }

    return (
        <div className="flex flex-wrap gap-2">
        {/* Status */}
        <select name="status" className={`${_CLASSNAME_} pr-10`} value={filters.status} onChange={handleChange}>
            <option value="">Status</option>
            <option value="OPEN">Open</option>
            <option value="ON_PROGRESS">In Progress</option>
            <option value="CLOSE">Close</option>
        </select>

        {/* Klasifikasi */}
        <select name="klasifikasi" value={filters.klasifikasi} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Klasifikasi</option>
            <option value="PENGADUAN">Aduan</option>
            <option value="ASPIRASI">Aspirasi</option>
            <option value="PERMINTAAN_INFORMASI">Permintaan Informasi</option>
        </select>

        {/* Priority */}
        <select name="priority" value={filters.priority} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Prioritas</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
        </select>

        {/* Gender */}
        <select name="gender" value={filters.gender} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
        </select>

        {/* Jenis Pekerjaan */}
        <select name="jenis_pekerjaan" value={filters.jenis_pekerjaan} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Jenis Pekerjaan</option>
            <option value="PNS">PNS</option>
            <option value="WIRASWASTA">Wiraswasta</option>
            <option value="PETANI">Petani</option>
            <option value="PELAJAR">Pelajar</option>
            <option value="LAINNYA">Lainnya</option>
        </select>

        {/* Pendidikan */}
        <select name="jenjang_pendidikan" value={filters.jenjang_pendidikan} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Pendidikan</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="DIPLOMA">Diploma</option>
            <option value="SARJANA">Sarjana</option>
            <option value="MAGISTER">Magister</option>
            <option value="DOKTOR">Doktor</option>
        </select>

        {/* Status Perkawinan */}
        <select name="status_perkawinan" value={filters.status_perkawinan} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Status Perkawinan</option>
            <option value="BELUM_KAWIN">Belum Kawin</option>
            <option value="KAWIN">Kawin</option>
            <option value="CERAI_HIDUP">Cerai Hidup</option>
            <option value="CERAI_MATI">Cerai Mati</option>
        </select>

        {/* Agama */}
        <select name="agama" value={filters.agama} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Agama</option>
            <option value="ISLAM">Islam</option>
            <option value="KRISTEN">Kristen</option>
            <option value="KATOLIK">Katolik</option>
            <option value="HINDU">Hindu</option>
            <option value="BUDDHA">Buddha</option>
            <option value="KONGHUCU">Konghucu</option>
        </select>

        {/* Date Range */}
        <div className={"relative " + _CLASSNAME_}>
            <DateRangePicker
            startDate={filters.startDate ? moment(filters.startDate) : null}
            endDate={filters.endDate ? moment(filters.endDate) : null}
            onDatesChange={handleDateChange}
            startDateId="start_date"
            focusedInput={focusedInput}
            onFocusChange={setFocusedInput}
            endDateId="end_date"
            displayFormat="YYYY-MM-DD"
            isOutsideRange={() => false}
            />
        </div>

        {/* Reset */}
        <button className={`${_CLASSNAME_} flex flex-row items-center gap-1`} onClick={resetFilters}>
            <RiResetRightLine className='h-4 w-4' />
            Reset
        </button>
        </div>
    )
}
