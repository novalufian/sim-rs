    'use client'
    import { useEffect, useState } from 'react'
    import { RiResetRightLine } from "react-icons/ri";

    interface PegawaiFilterState {
    jenis_kelamin?: string;
    agama?: string;
    status_perkawinan?: string;
    status_pekerjaan?: string;
    jenjang_pendidikan?: string;
    }

    interface PegawaiQueryFilterProps {
    onFilterChange: (filters: PegawaiFilterState) => void;
    }

    export default function PegawaiQueryFilter({ onFilterChange }: PegawaiQueryFilterProps) {
    const [filters, setFilters] = useState<PegawaiFilterState>({});
    const [isInitialized, setIsInitialized] = useState(false);

    const _CLASSNAME_ =
        "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 px-4 cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white col-span-4";

    // Init from query params
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search);

        const initialFilters: PegawaiFilterState = {
            jenis_kelamin: params.get("jenis_kelamin") || "",
            agama: params.get("agama") || "",
            status_perkawinan: params.get("status_perkawinan") || "",
            status_pekerjaan: params.get("status_pekerjaan") || "",
            jenjang_pendidikan: params.get("jenjang_pendidikan") || "",
        };

        setFilters(initialFilters);
        onFilterChange(initialFilters);
        setIsInitialized(true);
        }
    }, [isInitialized, onFilterChange]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const resetFilters = () => {
        const reset: PegawaiFilterState = {
        jenis_kelamin: '',
        agama: '',
        status_perkawinan: '',
        status_pekerjaan: '',
        jenjang_pendidikan: '',
        };
        setFilters(reset);
        onFilterChange(reset);
    };

    return (
        <div className="grid grid-cols-12 gap-2 w-full">

        {/* Jenis Kelamin */}
        <select name="jenis_kelamin" className={`${_CLASSNAME_} pr-10`} onChange={handleChange} value={filters.jenis_kelamin || ''}>
            <option value="">Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
        </select>

        {/* Agama */}
        <select name="agama" className={`${_CLASSNAME_} pr-10`} onChange={handleChange} value={filters.agama || ''}>
            <option value="">Agama</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
        </select>

        {/* Status Perkawinan */}
        <select name="status_perkawinan" className={`${_CLASSNAME_} pr-10`} onChange={handleChange} value={filters.status_perkawinan || ''}>
            <option value="">Status Perkawinan</option>
            <option value="Belum Kawin">Belum Kawin</option>
            <option value="Kawin">Kawin</option>
            <option value="Cerai Hidup">Cerai Hidup</option>
            <option value="Cerai Mati">Cerai Mati</option>
        </select>

        {/* Status Pekerjaan */}
        <select name="status_pekerjaan" className={`${_CLASSNAME_} pr-10`} onChange={handleChange} value={filters.status_pekerjaan || ''}>
            <option value="">Status Pekerjaan</option>
            <option value="PNS">PNS</option>
            <option value="Wiraswasta">Wiraswasta</option>
            <option value="Petani">Petani</option>
            <option value="Pelajar">Pelajar</option>
            <option value="Lainnya">Lainnya</option>
        </select>

        {/* Jenjang Pendidikan */}
        <select name="jenjang_pendidikan" className={`${_CLASSNAME_} pr-10`} onChange={handleChange} value={filters.jenjang_pendidikan || ''}>
            <option value="">Jenjang Pendidikan</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="D1">D1</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
        </select>

        {/* Reset */}
        <button className={`${_CLASSNAME_} flex flex-row items-center gap-1`} onClick={resetFilters}>
            <RiResetRightLine className='h-4 w-4' />
            Reset
        </button>
        </div>
    )
}
