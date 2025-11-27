"use client";
import React, { useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { 
    usePermohonanPensiunList, 
    PermohonanPensiunFilters, 
    PermohonanPensiunWithRelations, 
    useDeletePermohonanPensiun 
} from "@/hooks/fetch/pensiun/usePensiunPermohonan"; 
import PensiunStatusFilter from "./pensiunStatusFilter";
import PensiunDateFilter from "./pensiunDateFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedPensiun from "./selectedPensiun";


// Tipe untuk kolom tabel pensiun
interface PensiunColumn {
    id: keyof PermohonanPensiunWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const PENSIUN_TABLE_COLUMNS: PensiunColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'jenis_pensiun', label: 'Jenis Pensiun', width: 'w-[150px]' },
    { id: 'tanggal_pengajuan', label: 'Tgl Pengajuan', width: 'w-[120px]' },
    { id: 'tanggal_pensiun', label: 'Tgl Pensiun', width: 'w-[120px]' },
    { id: 'alasan_pensiun', label: 'Alasan', width: 'w-[200px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
    { id: 'catatan_kepegawaian', label: 'Catatan Kepegawaian', width: 'w-[200px]' },
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
        case "MENUNGGU":
            classes += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; break;
        case "DISETUJUI":
        case "DISETUJUI_AKHIR":
        case "SELESAI":
            classes += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"; break;
        case "DITOLAK":
        case "DIBATALKAN":
            classes += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"; break;
        case "DIREVISI":
            classes += " bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"; break;
        case "VALIDASI":
        case "PROSES":
            classes += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"; break;
        default:
            classes += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"; break;
    }

    return (
        <span className={classes}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const getColumnValue = (pensiun: PermohonanPensiunWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_pengajuan':
            return formatDate(pensiun.tanggal_pengajuan);
        case 'tanggal_pensiun':
            return formatDate(pensiun.tanggal_pensiun);
        case 'status':
            return renderStatusBadge(pensiun.status);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{pensiun.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{pensiun.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        case 'alasan_pensiun':
            return (
                <div className="max-w-[200px] truncate" title={pensiun.alasan_pensiun || ''}>
                    {pensiun.alasan_pensiun || '-'}
                </div>
            );
        case 'catatan_kepegawaian':
            return (
                <div className="max-w-[200px] truncate" title={pensiun.catatan_kepegawaian || ''}>
                    {pensiun.catatan_kepegawaian || '-'}
                </div>
            );
        case 'jenis_pensiun':
            return pensiun.jenis_pensiun || '-';
        default:
            // Mengakses properti lain
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = pensiun[columnId as keyof PermohonanPensiunWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

function Page() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    
    // State untuk Drawer
    const [pensiunDrawer, setPensiunDrawer] = useState(false);
    const [selectedPensiun, setSelectedPensiun] = useState<PermohonanPensiunWithRelations | null>(null);
    
    // State untuk Column Filter Visibility
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set([
            "no",
            "pegawai_info",
            "jenis_pensiun",
            "tanggal_pengajuan",
            "tanggal_pensiun",
            "alasan_pensiun",
            "status",
            "actions"
        ])
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [showDataFilter, setShowDataFilter] = useState(false);
    
    // State untuk filtering dan pagination
    const [filters, setFilters] = useState<PermohonanPensiunFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    // Hooks untuk fetching data dan mutasi delete
    const { data: queryResult, isLoading: isLoadingList, isError, error } = usePermohonanPensiunList({
        ...filters,
        page: currentPage, 
    });
    
    // Debug: log error jika ada
    if (isError) {
        console.error('❌ Error fetching pensiun:', error);
    }
    
    const deleteMutation = useDeletePermohonanPensiun();

    // Ekstraksi Data Pensiun
    const permohonanList: PermohonanPensiunWithRelations[] = queryResult?.data?.items || [];
    const totalItems = queryResult?.data?.pagination?.total || 0;
    const totalPages = queryResult?.data?.pagination?.totalPages || 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    
    console.log('🔍 Query Result:', queryResult);
    console.log('✅ Extracted data - count:', permohonanList.length, 'total:', totalItems, 'totalPages:', totalPages);
    
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

    const handleFilterChange = (newFilters: PermohonanPensiunFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
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
    const handleView = (pensiun: PermohonanPensiunWithRelations) => {
        setSelectedPensiun(pensiun);
        setPensiunDrawer(true);
    };
    
    // Handler untuk menutup drawer
    const handleCloseDrawer = () => {
        setPensiunDrawer(false);
        setSelectedPensiun(null);
    }

    // Handler untuk aksi Delete
    const handleDelete = (pensiun: PermohonanPensiunWithRelations) => {
        const namaPegawai = pensiun.pegawai_nama || 'pegawai';
        if (window.confirm(`Anda yakin ingin menghapus permohonan pensiun dari ${namaPegawai}?`)) {
            deleteMutation.mutate(pensiun.id);
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

            <PathBreadcrumb defaultTitle="Permohonan Pensiun Pegawai"/>
            

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Aksi dan Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Link href="/simpeg/pensiun/permohonan/create" passHref>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <IoAddCircleSharp className="mr-2 h-5 w-5" />
                                Ajukan Pensiun Baru
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
                        <PensiunDateFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                    </div>
                </div>

                <div className="relative sm:rounded-lg bg-transparent">
                    <div className="table-wrapper rounded-2xl">
                    <div className="min-table-width">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                            {PENSIUN_TABLE_COLUMNS.map(
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
                                colSpan={PENSIUN_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
                                className="p-8 text-center"
                                >
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="text-red-600 dark:text-red-400 font-semibold text-lg">
                                        ⚠️ Error Memuat Data
                                    </div>
                                    <div className="text-red-500 dark:text-red-300 text-sm">
                                        Gagal memuat data permohonan pensiun. Silakan coba lagi atau hubungi administrator.
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
                                {PENSIUN_TABLE_COLUMNS.map(
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
                                colSpan={PENSIUN_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
                                className="p-8 text-center text-gray-500"
                                >
                                Tidak ada data permohonan pensiun.
                                </td>
                            </tr>
                            ) : (
                            // Data rows
                            permohonanList.map((pensiun, index) => (
                                <tr key={pensiun.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                {PENSIUN_TABLE_COLUMNS.map(
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

                                        onClick={()=>{setSelectedPensiun(pensiun);setPensiunDrawer(true);}}
                                        >
                                        {column.id === "actions" ? (
                                            <ActionDropdown
                                            index={index}
                                            isOpen={dropdownStates[index]}
                                            onToggle={(e) => toggleDropdown(index, e)}
                                            onView={() => handleView(pensiun)} 
                                            onEdit={() => handleView(pensiun)}
                                            onDelete={() => handleDelete(pensiun)}
                                            />
                                        ) : (
                                            getColumnValue(pensiun, String(column.id), index, startIndex)
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
                {/* Filter Status, Jenis Pensiun, dan Reset */}
                <div className="mb-4">
                    <PensiunStatusFilter onFilterChange={handleFilterChange} currentFilters={filters} />
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
                            {PENSIUN_TABLE_COLUMNS.map((column) =>
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

        {/* LEFT DRAWER - Detail Pensiun */}
        <LeftDrawer isOpen={pensiunDrawer} onClose={handleCloseDrawer} title='Detail Permohonan Pensiun'>
            <SelectedPensiun pensiun={selectedPensiun} />
        </LeftDrawer>
        </Suspense>
    );
}

export default Page;

