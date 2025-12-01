"use client";
import React, { useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSettings2, LuFolderSearch, LuShieldX, LuHouse, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from '@/libs/store';

import { 
    usePermohonanBelajarList, 
    PermohonanBelajarFilters, 
    PermohonanBelajarWithRelations, 
    useDeletePermohonanBelajar 
} from "@/hooks/fetch/belajar/useBelajarPermohonan"; 
import BelajarStatusFilter from "./belajarStatusFilter";
import BelajarDateFilter from "./belajarDateFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedBelajar from "./selectedBelajar";


// Tipe untuk kolom tabel ijin belajar
interface BelajarColumn {
    id: keyof PermohonanBelajarWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const BELAJAR_TABLE_COLUMNS: BelajarColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
    { id: 'institusi_pendidikan_nama', label: 'Institusi Pendidikan', width: 'w-[200px]' },
    { id: 'program_studi_nama', label: 'Program Studi', width: 'w-[150px]' },
    { id: 'program_studi_jenjang', label: 'Jenjang', width: 'w-[100px]' },
    { id: 'tanggal_mulai_belajar', label: 'Tgl Mulai', width: 'w-[120px]' },
    { id: 'tanggal_selesai_belajar', label: 'Tgl Selesai', width: 'w-[120px]' },
    { id: 'lama_studi_bulan', label: 'Lama Studi', width: 'w-[100px]' },
    { id: 'actions', label: 'Aksi', width: 'w-[80px]', sticky: 'right' },
];

// --- Helper Functions ---

const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
        const d = date instanceof Date ? date : new Date(date); 
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    } catch {
        return "Tgl Invalid";
    }
};

const renderStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium inline-block";
    let classes = baseClasses;
    const s = status.toUpperCase();

    switch (s) {
        case "DIAJUKAN":
            classes += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; break;
        case "PERSETUJUAN_ATASAN":
        case "VALIDASI_KEPEGAWAIAN":
            classes += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"; break;
        case "PERSETUJUAN_AKHIR":
        case "SELESAI":
            classes += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"; break;
        case "DITOLAK":
        case "DIBATALKAN":
            classes += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"; break;
        case "DIREVISI":
            classes += " bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"; break;
        default:
            classes += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"; break;
    }

    return (
        <span className={classes}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const getColumnValue = (belajar: PermohonanBelajarWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_mulai_belajar':
            return formatDate(belajar.tanggal_mulai_belajar);
        case 'tanggal_selesai_belajar':
            return formatDate(belajar.tanggal_selesai_belajar);
        case 'status':
            return renderStatusBadge(belajar.status);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{belajar.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{belajar.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        case 'institusi_pendidikan_nama':
            return (
                <div className="max-w-[200px] truncate" title={belajar.institusi_pendidikan_nama || ''}>
                    {belajar.institusi_pendidikan_nama || '-'}
                </div>
            );
        case 'program_studi_nama':
            return (
                <div className="max-w-[150px] truncate" title={belajar.program_studi_nama || ''}>
                    {belajar.program_studi_nama || '-'}
                </div>
            );
        case 'program_studi_jenjang':
            return belajar.program_studi_jenjang || '-';
        case 'lama_studi_bulan':
            return belajar.lama_studi_bulan ? `${belajar.lama_studi_bulan} bulan` : '-';
        default:
            // Mengakses properti lain
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = belajar[columnId as keyof PermohonanBelajarWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

function Page() {
    const router = useRouter();
    const user = useAppSelector((state: RootState) => state.auth.user);
    const userRole = user?.role;
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    
    // State untuk Drawer
    const [belajarDrawer, setBelajarDrawer] = useState(false);
    const [selectedBelajar, setSelectedBelajar] = useState<PermohonanBelajarWithRelations | null>(null);
    
    // State untuk Column Filter Visibility
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set([
            "no",
            "pegawai_info",
            "institusi_pendidikan_nama",
            "program_studi_nama",
            "program_studi_jenjang",
            "tanggal_mulai_belajar",
            "tanggal_selesai_belajar",
            "lama_studi_bulan",
            "status",
            "actions"
        ])
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [showDataFilter, setShowDataFilter] = useState(false);
    
    // State untuk filtering dan pagination
    const [filters, setFilters] = useState<PermohonanBelajarFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    // Hooks untuk fetching data dan mutasi delete
    // Pastikan page selalu sesuai dengan currentPage
    const { data: queryResult, isLoading: isLoadingList, isError, error } = usePermohonanBelajarList({
        ...filters,
        page: currentPage, 
        limit: filters.limit || ITEMS_PER_PAGE,
    });
    
    const deleteMutation = useDeletePermohonanBelajar();

    // Guard: Cek apakah user memiliki akses (hanya super_admin)
    if (userRole !== "super_admin") {
        return (
            <div className="flex items-center justify-center min-h-[80vh] p-6">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 md:p-12">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <LuShieldX className="w-16 h-16 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Akses Ditolak
                        </h1>

                        {/* Description */}
                        <div className="space-y-3 mb-8">
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                            </p>
                            <p className="text-base text-gray-500 dark:text-gray-400">
                                Halaman <span className="font-semibold text-gray-700 dark:text-gray-300">Kelola Data Ijin Belajar</span> hanya dapat diakses oleh <span className="font-semibold text-blue-600 dark:text-blue-400">Super Admin</span>.
                            </p>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Informasi:</strong> Sebagai pengguna biasa, Anda dapat mengajukan permohonan ijin belajar melalui halaman <span className="font-semibold">Permohonan Ijin Belajar</span> dan melihat statistik permohonan Anda di halaman utama.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                <LuArrowLeft className="w-5 h-5" />
                                Kembali
                            </button>
                            <Link
                                href="/simpeg/ijin-belajar"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <LuHouse className="w-5 h-5" />
                                Ke Halaman Utama
                            </Link>
                        </div>

                        {/* Additional Help */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Ekstraksi Data Ijin Belajar
    const permohonanList: PermohonanBelajarWithRelations[] = queryResult?.data?.items || [];
    const totalItems = queryResult?.data?.pagination?.total || 0;
    const totalPages = queryResult?.data?.pagination?.totalPages || 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    
    // Menutup semua dropdown jika klik di luar
    React.useEffect(() => {
        const handleClickOutside = () => {
        setDropdownStates({});
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleColumn = (columnId: string) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnId)) {
                newSet.delete(columnId);
            } else {
                newSet.add(columnId);
            }
            return newSet;
        });
    };

    const handleFilterChange = (newFilters: PermohonanBelajarFilters) => {
        // Jika newFilters kosong (reset), set ke default (hanya limit dan page)
        // Ini akan menghapus semua filter sebelumnya
        if (Object.keys(newFilters).length === 0) {
            const resetFilters = {
                limit: ITEMS_PER_PAGE,
                page: 1,
            };
            setFilters(resetFilters);
        } else {
            // Merge dengan filter yang ada, tapi hapus filter yang undefined/null/empty
            setFilters(prev => {
                // Hapus property yang undefined/null/empty dari newFilters
                const cleanedNewFilters: PermohonanBelajarFilters = {};
                
                if (newFilters.status && newFilters.status !== '') {
                    cleanedNewFilters.status = newFilters.status;
                }
                if (newFilters.institusi_pendidikan_id && newFilters.institusi_pendidikan_id !== '') {
                    cleanedNewFilters.institusi_pendidikan_id = newFilters.institusi_pendidikan_id;
                }
                if (newFilters.program_studi_id && newFilters.program_studi_id !== '') {
                    cleanedNewFilters.program_studi_id = newFilters.program_studi_id;
                }
                if (newFilters.startDate && newFilters.startDate !== '') {
                    cleanedNewFilters.startDate = newFilters.startDate;
                }
                if (newFilters.endDate && newFilters.endDate !== '') {
                    cleanedNewFilters.endDate = newFilters.endDate;
                }
                
                // Buat filter baru dengan hanya field yang ada di cleanedNewFilters
                // Ini memastikan filter yang tidak ada di newFilters akan dihapus
                const updated: PermohonanBelajarFilters = {
                    limit: ITEMS_PER_PAGE,
                    page: 1,
                    ...cleanedNewFilters,
                };
                
                return updated;
            });
        }
        setCurrentPage(1); 
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleDropdown = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setDropdownStates((prev) => ({
        ...Object.keys(prev).reduce(
            (acc, key) => ({
            ...acc,
            [key]: false,
            }),
            {}
        ),
        [index]: !prev[index],
        }));
    };
    
    // Handler untuk aksi View
    const handleView = (belajar: PermohonanBelajarWithRelations) => {
        setSelectedBelajar(belajar);
        setBelajarDrawer(true);
    };
    
    // Handler untuk menutup drawer
    const handleCloseDrawer = () => {
        setBelajarDrawer(false);
        setSelectedBelajar(null);
    }

    // Handler untuk aksi Delete
    const handleDelete = (belajar: PermohonanBelajarWithRelations) => {
        const namaPegawai = belajar.pegawai_nama || 'pegawai';
        if (window.confirm(`Anda yakin ingin menghapus permohonan ijin belajar dari ${namaPegawai}?`)) {
            deleteMutation.mutate(belajar.id);
        }
    };


    const isLoading = isLoadingList || deleteMutation.isPending;

    return (
        <Suspense fallback={<div className="container mx-auto p-4"><div>Memuat Halaman...</div></div>}>
        <div className="container mx-auto p-4">
            <style jsx global>{`
            .table-wrapper { position: relative; overflow-x: auto; }
            .min-table-width { min-width: max-content; }
            .sticky-right { position: sticky; right: 0; z-index: 20; }
            .sticky-right-header { position: sticky; right: 0; z-index: 30; }
            .sticky-left { position: sticky; left: 0; z-index: 20; }
            .bg-sticky-header { background-color: rgb(243 244 246); }
            .dropdown-menu { min-width: 120px; transform-origin: top right; }
            
            /* DateRangePicker Styles */
            .DateInput div {
                font-size: 16px !important;
            }

            .DateInput_input {
                font-size: 16px;
                font-weight: 400;
                color: inherit;
                padding: 9px;
                border: none;
                text-align: center;
                background: transparent !important;
            }

            .DateRangePickerInput {
                border: none;
                color: inherit;
                background: transparent;
            }

            .DateRangePicker {
                color: inherit;
            }

            .DateRangePicker_picker {
                border-radius: 20px;
                overflow: hidden;
                border: solid 1px lightgray;
                backdrop-filter: blur(10px);
                background: #ffffff80;
            }

            .DateInput {
                background: transparent;
            }
            `}</style>

            <PathBreadcrumb defaultTitle="Permohonan Ijin Belajar Pegawai"/>
            

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Aksi dan Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Link href="/simpeg/ijin-belajar/permohonan" passHref>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <IoAddCircleSharp className="mr-2 h-5 w-5" />
                                Ajukan Ijin Belajar Baru
                            </button>
                        </Link>
                        
                        <button
                            onClick={() => setShowDataFilter(!showDataFilter)}
                            className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4"
                        >
                            <LuSettings2 className='h-5 w-5 mr-2'/>Data Filter
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <BelajarDateFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                    </div>
                </div>

                <div className="relative sm:rounded-lg bg-transparent">
                    <div className="table-wrapper rounded-2xl">
                    <div className="min-table-width">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                            {BELAJAR_TABLE_COLUMNS.map(
                                (column) => visibleColumns.has(String(column.id)) && (
                                    <th
                                    key={String(column.id)}
                                    scope="col"
                                    className={`p-3 ${column.width} ${
                                        column.sticky === "left"
                                        ? "sticky-left bg-gray-100 dark:bg-gray-700 z-30"
                                        : column.sticky === "right"
                                        ? "sticky-right-header bg-gray-100 dark:bg-gray-700 z-30"
                                        : ""
                                    }`}
                                    >
                                    <div className="text-xs font-medium text-gray-500 dark:text-white uppercase">
                                        {column.label}
                                    </div>
                                    </th>
                                )
                            )}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                            {isError ? (
                            // Error message
                            <tr>
                                <td 
                                colSpan={BELAJAR_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
                                className="p-8 text-center"
                                >
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="text-red-600 dark:text-red-400 font-semibold text-lg">
                                        ⚠️ Error Memuat Data
                                    </div>
                                    <div className="text-red-500 dark:text-red-300 text-sm">
                                        Gagal memuat data permohonan ijin belajar. Silakan coba lagi atau hubungi administrator.
                                    </div>
                                    {error && (
                                        <div className="text-red-400 dark:text-red-500 text-xs mt-2 font-mono bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                                            {error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data'}
                                        </div>
                                    )}
                                </div>
                                </td>
                            </tr>
                            ) : isLoading ? (
                            // Loading skeleton
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                {BELAJAR_TABLE_COLUMNS.map(
                                    (column) => visibleColumns.has(String(column.id)) && (
                                        <td
                                        key={String(column.id)}
                                        className={`p-3 whitespace-nowrap`}
                                        >
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </td>
                                    )
                                )}
                                </tr>
                            ))
                            ) : permohonanList.length === 0 ? (
                            // No data message
                            <tr >
                                <td 
                                colSpan={BELAJAR_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
                                className="p-8 text-center min-h-[400px]"
                                >
                                    <div className="flex flex-col items-center justify-center h-full py-10">
                                        {/* Empty State Illustration */}
                                        <div className="relative mb-6">
                                            {/* Search Icon Background */}
                                            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                                <LuFolderSearch className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                                            </div>
                                            {/* Decorative Elements */}
                                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-200 dark:bg-blue-900 rounded-full opacity-60"></div>
                                            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-200 dark:bg-purple-900 rounded-full opacity-60"></div>
                                        </div>
                                        
                                        {/* Message */}
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Tidak ada data permohonan ijin belajar
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Coba ubah filter atau tambahkan permohonan ijin belajar baru
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            ) : (
                            // Data rows
                            permohonanList.map((belajar, index) => (
                                <tr key={belajar.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                {BELAJAR_TABLE_COLUMNS.map(
                                    (column) => visibleColumns.has(String(column.id)) && (
                                        <td
                                        key={String(column.id)}
                                        className={`p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800 ${
                                            column.sticky === "left"
                                            ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20 text-center "
                                            : column.sticky === "right"
                                            ? "sticky-right bg-white  group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20"
                                            : ""
                                        }`}

                                        onClick={()=>{setSelectedBelajar(belajar);setBelajarDrawer(true);}}
                                        >
                                        {column.id === "actions" ? (
                                            <ActionDropdown
                                            index={index}
                                            isOpen={dropdownStates[index]}
                                            onToggle={(e) => toggleDropdown(index, e)}
                                            onView={() => handleView(belajar)} 
                                            onEdit={() => handleView(belajar)}
                                            onDelete={() => handleDelete(belajar)}
                                            />
                                        ) : (
                                            getColumnValue(belajar, String(column.id), index, startIndex)
                                        )}
                                        </td>
                                    )
                                )}
                                </tr>
                            ))
                            )}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>

                {totalPages > 0 && (
                    <div className="mt-10">
                        <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
        
        {/* LEFT DRAWER - Data Filter */}
        <LeftDrawer isOpen={showDataFilter} onClose={() => setShowDataFilter(false)} title='Filter Data' width="600px">
            <div className="flex flex-col rounded-lg space-y-4">
                {/* Filter Status dan Reset */}
                <div className="mb-4">
                    <BelajarStatusFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                </div>

                {/* Column Filter Toggle */}
                <button
                    onClick={() => setShowColumnFilter(!showColumnFilter)}
                    className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4"
                >
                    <LuSettings2 className='h-6 w-6 mr-4'/>{showColumnFilter ? 'Hide Column Filter' : 'Show Column Filter'}
                </button>

                {showColumnFilter && (
                    <div className="bg-white dark:bg-gray-900 dark:text-gray-300 p-6 rounded-2xl">
                        <div className="flex flex-row flex-wrap gap-4">
                            {BELAJAR_TABLE_COLUMNS.map((column) =>
                                column.id !== 'actions' && (  
                                    <label key={String(column.id)} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.has(String(column.id))}
                                            onChange={() => toggleColumn(String(column.id))}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="text-sm">{column.label}</span>
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </LeftDrawer>

        {/* LEFT DRAWER - Detail Ijin Belajar */}
        <LeftDrawer isOpen={belajarDrawer} onClose={handleCloseDrawer} title='Detail Permohonan Ijin Belajar'>
            <SelectedBelajar belajar={selectedBelajar} />
        </LeftDrawer>
        </Suspense>
    );
}

export default Page;

