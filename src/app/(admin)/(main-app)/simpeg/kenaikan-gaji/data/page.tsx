"use client";
import React, { useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSettings2, LuFolderSearch } from "react-icons/lu";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { 
    usePermohonanGajiList, 
    PermohonanGajiFilters, 
    PermohonanGajiWithRelations, 
    useDeletePermohonanGaji 
} from "@/hooks/fetch/gaji/useGajiPermohonan"; 
import GajiStatusFilter from "./gajiStatusFilter";
import GajiDateFilter from "./gajiDateFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedGaji from "./selectedGaji";


// Tipe untuk kolom tabel kenaikan gaji
interface GajiColumn {
    id: keyof PermohonanGajiWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const GAJI_TABLE_COLUMNS: GajiColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
    { id: 'tanggal_pengajuan', label: 'Tgl Pengajuan', width: 'w-[120px]' },
    { id: 'gaji_pokok_lama', label: 'Gaji Pokok Lama', width: 'w-[150px]' },
    { id: 'gaji_pokok_baru', label: 'Gaji Pokok Baru', width: 'w-[150px]' },
    { id: 'selisih_gaji', label: 'Selisih Gaji', width: 'w-[150px]' },
    { id: 'persentase_kenaikan', label: 'Persentase', width: 'w-[120px]' },
    { id: 'tmt_kgb_lama', label: 'TMT KGB Lama', width: 'w-[120px]' },
    { id: 'tmt_kgb_baru', label: 'TMT KGB Baru', width: 'w-[120px]' },
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

const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `${value.toFixed(2)}%`;
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

const getColumnValue = (gaji: PermohonanGajiWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_pengajuan':
            return formatDate(gaji.tanggal_pengajuan);
        case 'tmt_kgb_lama':
            return formatDate(gaji.tmt_kgb_lama);
        case 'tmt_kgb_baru':
            return formatDate(gaji.tmt_kgb_baru);
        case 'status':
            return renderStatusBadge(gaji.status);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{gaji.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{gaji.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        case 'gaji_pokok_lama':
            return (
                <div className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(gaji.gaji_pokok_lama)}
                </div>
            );
        case 'gaji_pokok_baru':
            return (
                <div className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(gaji.gaji_pokok_baru)}
                </div>
            );
        case 'selisih_gaji':
            const selisih = gaji.selisih_gaji ?? 0;
            const isNaik = selisih > 0;
            return (
                <div className={`flex items-center gap-2 font-medium ${isNaik ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isNaik ? (
                        <FiTrendingUp className="h-5 w-5" />
                    ) : selisih < 0 ? (
                        <FiTrendingDown className="h-5 w-5" />
                    ) : null}
                    <span>{formatCurrency(gaji.selisih_gaji)}</span>
                </div>
            );
        case 'persentase_kenaikan':
            const persentase = gaji.persentase_kenaikan ?? 0;
            const isNaikPersen = persentase > 0;
            return (
                <div className={`flex items-center gap-2 font-medium ${isNaikPersen ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isNaikPersen ? (
                        <FiTrendingUp className="h-5 w-5" />
                    ) : persentase < 0 ? (
                        <FiTrendingDown className="h-5 w-5" />
                    ) : null}
                    <span>{formatPercentage(gaji.persentase_kenaikan)}</span>
                </div>
            );
        default:
            // Mengakses properti lain
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = gaji[columnId as keyof PermohonanGajiWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

function Page() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    
    // State untuk Drawer
    const [gajiDrawer, setGajiDrawer] = useState(false);
    const [selectedGaji, setSelectedGaji] = useState<PermohonanGajiWithRelations | null>(null);
    
    // State untuk Column Filter Visibility
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set([
            "no",
            "pegawai_info",
            "status",
            "tanggal_pengajuan",
            "gaji_pokok_lama",
            "gaji_pokok_baru",
            "selisih_gaji",
            "persentase_kenaikan",
            "tmt_kgb_lama",
            "tmt_kgb_baru",
            "actions"
        ])
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [showDataFilter, setShowDataFilter] = useState(false);
    
    // State untuk filtering dan pagination
    const [filters, setFilters] = useState<PermohonanGajiFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    // Hooks untuk fetching data dan mutasi delete
    const { data: queryResult, isLoading: isLoadingList, isError, error } = usePermohonanGajiList({
        ...filters,
        page: currentPage, 
    });
    
    // Debug: log error jika ada
    if (isError) {
        console.error('❌ Error fetching kenaikan gaji:', error);
    }
    
    const deleteMutation = useDeletePermohonanGaji();

    // Ekstraksi Data Kenaikan Gaji
    const permohonanList: PermohonanGajiWithRelations[] = queryResult?.data?.items || [];
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

    const handleFilterChange = (newFilters: PermohonanGajiFilters) => {
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
    const handleView = (gaji: PermohonanGajiWithRelations) => {
        setSelectedGaji(gaji);
        setGajiDrawer(true);
    };
    
    // Handler untuk menutup drawer
    const handleCloseDrawer = () => {
        setGajiDrawer(false);
        setSelectedGaji(null);
    }

    // Handler untuk aksi Delete
    const handleDelete = (gaji: PermohonanGajiWithRelations) => {
        const namaPegawai = gaji.pegawai_nama || 'pegawai';
        if (window.confirm(`Anda yakin ingin menghapus permohonan kenaikan gaji dari ${namaPegawai}?`)) {
            deleteMutation.mutate(gaji.id);
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

            <PathBreadcrumb defaultTitle="Permohonan Kenaikan Gaji Berkala"/>
            

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Aksi dan Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Link href="/simpeg/kenaikan-gaji/permohonan/create" passHref>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <IoAddCircleSharp className="mr-2 h-5 w-5" />
                                Ajukan KGB Baru
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
                        <GajiDateFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                    </div>
                </div>

                <div className="relative sm:rounded-lg bg-transparent">
                    <div className="table-wrapper rounded-2xl">
                    <div className="min-table-width">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                            {GAJI_TABLE_COLUMNS.map(
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
                                colSpan={GAJI_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
                                className="p-8 text-center"
                                >
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="text-red-600 dark:text-red-400 font-semibold text-lg">
                                        ⚠️ Error Memuat Data
                                    </div>
                                    <div className="text-red-500 dark:text-red-300 text-sm">
                                        Gagal memuat data permohonan kenaikan gaji. Silakan coba lagi atau hubungi administrator.
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
                                {GAJI_TABLE_COLUMNS.map(
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
                                colSpan={GAJI_TABLE_COLUMNS.filter(col => visibleColumns.has(String(col.id))).length}
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
                                                Tidak ada data permohonan kenaikan gaji
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Coba ubah filter atau tambahkan permohonan kenaikan gaji baru
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            ) : (
                            // Data rows
                            permohonanList.map((gaji, index) => (
                                <tr key={gaji.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                {GAJI_TABLE_COLUMNS.map(
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

                                        onClick={()=>{setSelectedGaji(gaji);setGajiDrawer(true);}}
                                        >
                                        {column.id === "actions" ? (
                                            <ActionDropdown
                                            index={index}
                                            isOpen={dropdownStates[index]}
                                            onToggle={(e) => toggleDropdown(index, e)}
                                            onView={() => handleView(gaji)} 
                                            onEdit={() => handleView(gaji)}
                                            onDelete={() => handleDelete(gaji)}
                                            />
                                        ) : (
                                            getColumnValue(gaji, String(column.id), index, startIndex)
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
                    <GajiStatusFilter onFilterChange={handleFilterChange} currentFilters={filters} />
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
                            {GAJI_TABLE_COLUMNS.map((column) =>
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

        {/* LEFT DRAWER - Detail Kenaikan Gaji */}
        <LeftDrawer isOpen={gajiDrawer} onClose={handleCloseDrawer} title='Detail Permohonan Kenaikan Gaji Berkala'>
            <SelectedGaji gaji={selectedGaji} />
        </LeftDrawer>
        </Suspense>
    );
}

export default Page;

