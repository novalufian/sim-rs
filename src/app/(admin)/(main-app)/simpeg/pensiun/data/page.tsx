"use client";
import React, { useState, Suspense, useEffect, useRef } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { 
    usePermohonanPensiunList, 
    PermohonanPensiunFilters, 
    PermohonanPensiunWithRelations,
    useExportPermohonanPensiun
} from "@/hooks/fetch/pensiun/usePensiunPermohonan"; 
import PensiunStatusFilter from "./pensiunStatusFilter";
import PensiunDateFilter from "./pensiunDateFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedPensiun from "./selectedPensiun";
import { exportPensiunToExcelWithFilters } from "@/components/export/xls/pensiun.export";
import { exportPensiunToDocWithFilters } from "@/components/export/doc/pensiun.export";
import { exportPensiunToPdfWithFilters } from "@/components/export/pdf/pensiun.export";
import { TbFileExport } from "react-icons/tb";
import toast from "react-hot-toast";
import nProgress from "nprogress";
import api from "@/libs/api";


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
    { id: 'tanggal_pensiun', label: 'Tanggal Pensiun', width: 'w-[120px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
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
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {pensiun.pegawai_nama || '-'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {pensiun.pegawai_nip || 'NIP N/A'}
                    </span>
                </div>
            );
        case 'tanggal_pengajuan':
            return formatDate(pensiun.tanggal_pengajuan);
        case 'tanggal_pensiun':
            return formatDate(pensiun.tanggal_pensiun);
        case 'status':
            return renderStatusBadge(pensiun.status);
        default:
            const value = pensiun[columnId as keyof PermohonanPensiunWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value 
                ? value.toString() 
                : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

type ExportType = 'excel' | 'docx' | 'pdf';

function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [showDataFilter, setShowDataFilter] = useState(false);
    
    // State untuk Drawer
    const [pensiunDrawer, setPensiunDrawer] = useState(false);
    const [selectedPensiun, setSelectedPensiun] = useState<PermohonanPensiunWithRelations | null>(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null); 
    
    // State untuk filtering dan pagination
    const [filters, setFilters] = useState<PermohonanPensiunFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    // Helper function untuk update URL dengan query parameters
    const updateURLParams = (newFilters: PermohonanPensiunFilters, page: number = 1) => {
        const params = new URLSearchParams();
        
        if (newFilters.status) params.set('status', newFilters.status);
        if (newFilters.jenis_pensiun) params.set('jenis_pensiun', newFilters.jenis_pensiun);
        if (newFilters.startDate) params.set('startDate', newFilters.startDate);
        if (newFilters.endDate) params.set('endDate', newFilters.endDate);
        if (page > 1) params.set('page', page.toString());
        
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });
    };

    // Baca query parameter saat pertama kali load
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search);
            
            const initialFilters: PermohonanPensiunFilters = {
                limit: ITEMS_PER_PAGE,
                page: 1,
            };
            
            const statusParam = params.get("status");
            const jenisPensiunParam = params.get("jenis_pensiun");
            const startDateParam = params.get("startDate");
            const endDateParam = params.get("endDate");
            const pageParam = params.get("page");
            
            if (statusParam) initialFilters.status = statusParam;
            if (jenisPensiunParam) initialFilters.jenis_pensiun = jenisPensiunParam;
            if (startDateParam) initialFilters.startDate = startDateParam;
            if (endDateParam) initialFilters.endDate = endDateParam;
            if (pageParam) {
                const pageNum = parseInt(pageParam, 10);
                if (!isNaN(pageNum) && pageNum > 0) {
                    initialFilters.page = pageNum;
                    setCurrentPage(pageNum);
                }
            }
            
            setFilters(initialFilters);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Hooks untuk fetching data
    const { data: queryResult, isLoading: isLoadingList, isError, error } = usePermohonanPensiunList({
        ...filters,
        page: currentPage,
        limit: filters.limit || ITEMS_PER_PAGE,
    });
    
    const exportQuery = useExportPermohonanPensiun(filters, false);
    
    // Ekstraksi Data Pensiun
    const permohonanList: PermohonanPensiunWithRelations[] = queryResult?.data?.items || [];
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

    // Menutup export dropdown jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
                setShowExportDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (newFilters: PermohonanPensiunFilters) => {
        if (Object.keys(newFilters).length === 0 || (!newFilters.status && !newFilters.jenis_pensiun && !newFilters.startDate && !newFilters.endDate)) {
            const resetFilters = {
                limit: ITEMS_PER_PAGE,
                page: 1,
            };
            setFilters(resetFilters);
            setCurrentPage(1);
            router.replace(pathname, { scroll: false });
        } else {
            setFilters(prev => {
                const cleanedNewFilters: PermohonanPensiunFilters = {};
                
                if (newFilters.status && newFilters.status !== '') {
                    cleanedNewFilters.status = newFilters.status;
                }
                if (newFilters.jenis_pensiun && newFilters.jenis_pensiun !== '') {
                    cleanedNewFilters.jenis_pensiun = newFilters.jenis_pensiun;
                }
                if (newFilters.startDate && newFilters.startDate !== '') {
                    cleanedNewFilters.startDate = newFilters.startDate;
                }
                if (newFilters.endDate && newFilters.endDate !== '') {
                    cleanedNewFilters.endDate = newFilters.endDate;
                }
                
                const mergedFilters = { ...prev, ...cleanedNewFilters, page: 1 };
                setCurrentPage(1);
                updateURLParams(mergedFilters, 1);
                return mergedFilters;
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURLParams(filters, page);
    };

    const toggleDropdown = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setDropdownStates((prev) => ({
            ...Object.keys(prev).reduce(
                (acc, key) => ({ ...acc, [key]: false }),
                {}
            ),
            [index]: !prev[index],
        }));
    };

    const handleView = (pensiun: PermohonanPensiunWithRelations) => {
        setSelectedPensiun(pensiun);
        setPensiunDrawer(true);
    };

    const handleCloseDrawer = () => {
        setPensiunDrawer(false);
        setSelectedPensiun(null);
    };

    // Handler untuk export dengan berbagai format
    const handleExport = async (type: ExportType) => {
        try {
            nProgress.start();
            toast.loading('Mengunduh data...', { id: 'export' });

            // Fetch semua data dengan filter yang sama (tanpa pagination)
            // Buat params untuk export (tanpa limit, karena export endpoint biasanya mengembalikan semua data)
            const exportParams = new URLSearchParams();
            if (filters.status) exportParams.append('status', filters.status);
            if (filters.jenis_pensiun) exportParams.append('jenis_pensiun', filters.jenis_pensiun);
            if (filters.startDate) exportParams.append('startDate', filters.startDate);
            if (filters.endDate) exportParams.append('endDate', filters.endDate);
            
            let allData: PermohonanPensiunWithRelations[] = [];
            
            try {
                // Coba endpoint export terlebih dahulu
                const res = await api.get(`/kepegawaian/pensiun/pengajuan/export?${exportParams.toString()}`);
                
                console.log('Export API Response:', res.data);
                
                // Handle different response structures
                // Response structure: { success: true, message: '...', data: { data: Array(...) } }
                if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
                    allData = res.data.data.data;
                } else if (res.data?.data?.items && Array.isArray(res.data.data.items)) {
                    allData = res.data.data.items;
                } else if (res.data?.items && Array.isArray(res.data.items)) {
                    allData = res.data.items;
                } else if (Array.isArray(res.data)) {
                    allData = res.data;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    allData = res.data.data;
                }
            } catch (exportError: any) {
                // Jika endpoint export tidak ada atau error, gunakan endpoint list biasa dengan limit besar
                console.warn('Export endpoint tidak tersedia atau error, menggunakan endpoint list:', exportError);
                const params = new URLSearchParams();
                if (filters.status) params.append('status', filters.status);
                if (filters.jenis_pensiun) params.append('jenis_pensiun', filters.jenis_pensiun);
                if (filters.startDate) params.append('startDate', filters.startDate);
                if (filters.endDate) params.append('endDate', filters.endDate);
                params.append('limit', '10000'); // Limit besar untuk mendapatkan semua data
                const res = await api.get(`/kepegawaian/pensiun/pengajuan?${params.toString()}`);
                
                console.log('List API Response:', res.data);
                
                if (res.data?.data?.items && Array.isArray(res.data.data.items)) {
                    allData = res.data.data.items;
                } else if (res.data?.items && Array.isArray(res.data.items)) {
                    allData = res.data.items;
                }
            }
            
            console.log('Final extracted data:', allData);
            console.log('Data length:', allData?.length);
            
            if (!allData || allData.length === 0) {
                toast.error('Tidak ada data untuk diekspor dengan filter yang dipilih', { id: 'export' });
                nProgress.done();
                return;
            }

            // Export berdasarkan type
            switch (type) {
                case 'excel':
                    exportPensiunToExcelWithFilters(allData, {
                        status: filters.status,
                        jenis_pensiun: filters.jenis_pensiun,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                    });
                    break;
                case 'docx':
                    await exportPensiunToDocWithFilters(allData, {
                        status: filters.status,
                        jenis_pensiun: filters.jenis_pensiun,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                    });
                    break;
                case 'pdf':
                    exportPensiunToPdfWithFilters(allData, {
                        status: filters.status,
                        jenis_pensiun: filters.jenis_pensiun,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                    });
                    break;
            }
            toast.success('Data berhasil diekspor!', { id: 'export' });
        } catch (error: any) {
            console.error('Error exporting data:', error);
            toast.error(error?.response?.data?.message || 'Gagal mengekspor data', { id: 'export' });
        } finally {
            nProgress.done();
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
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

            <PathBreadcrumb defaultTitle="Permohonan Pensiun"/>
            

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Aksi dan Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Link href="/simpeg/pensiun/permohonan">
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

                        <div className="relative" ref={exportDropdownRef}>
                            <button
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4"
                            >
                                <TbFileExport className='h-5 w-5 mr-2'/> Export
                            </button>
                            {showExportDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50">
                                    <button
                                        onClick={() => { handleExport('excel'); setShowExportDropdown(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Export Excel
                                    </button>
                                    <button
                                        onClick={() => { handleExport('docx'); setShowExportDropdown(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Export DOCX
                                    </button>
                                    <button
                                        onClick={() => { handleExport('pdf'); setShowExportDropdown(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Export PDF
                                    </button>
                                </div>
                            )}
                        </div>
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
                                        {PENSIUN_TABLE_COLUMNS.map((column) => (
                                            <th
                                                key={column.id}
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
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                                    {isLoadingList ? (
                                        <tr>
                                            <td colSpan={PENSIUN_TABLE_COLUMNS.length} className="p-8 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-400">Memuat data...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : isError ? (
                                        <tr>
                                            <td colSpan={PENSIUN_TABLE_COLUMNS.length} className="p-8 text-center text-red-600 dark:text-red-400">
                                                Gagal memuat data permohonan pensiun. Silakan coba lagi atau hubungi administrator.
                                            </td>
                                        </tr>
                                    ) : permohonanList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={PENSIUN_TABLE_COLUMNS.length}
                                                className="p-8 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <p className="text-lg font-medium mb-2">
                                                        Tidak ada data permohonan pensiun
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Coba ubah filter atau tambahkan permohonan pensiun baru
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        permohonanList.map((pensiun, index) => (
                                            <tr key={pensiun.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                                {PENSIUN_TABLE_COLUMNS.map((column) => (
                                                    <td
                                                        key={column.id}
                                                        className={`p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800 ${
                                                            column.sticky === "left"
                                                                ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700 dark:bg-gray-900 z-20 text-center"
                                                                : column.sticky === "right"
                                                                ? "sticky-right bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700 dark:bg-gray-900 z-20"
                                                                : ""
                                                        }`}
                                                        onClick={() => {
                                                            if (column.id !== 'actions') {
                                                                handleView(pensiun);
                                                            }
                                                        }}
                                                    >
                                                        {column.id === "actions" ? (
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <ActionDropdown
                                                                    index={index}
                                                                    isOpen={dropdownStates[index]}
                                                                    onToggle={(e) => toggleDropdown(index, e)}
                                                                    onView={() => handleView(pensiun)}
                                                                    onEdit={() => handleView(pensiun)}
                                                                    onDelete={() => handleView(pensiun)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            getColumnValue(pensiun, String(column.id), index, startIndex)
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* LEFT DRAWER - Data Filter */}
            <LeftDrawer isOpen={showDataFilter} onClose={() => setShowDataFilter(false)} title='Filter Data' width="600px">
                <div className="flex flex-col rounded-lg space-y-4">
                    {/* Filter Status dan Reset */}
                    <div className="mb-4">
                        <PensiunStatusFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                    </div>
                </div>
            </LeftDrawer>

            {/* Left Drawer untuk Detail */}
            <LeftDrawer 
                isOpen={pensiunDrawer} 
                onClose={handleCloseDrawer} 
                title='Detail Permohonan Pensiun'
            >
                <SelectedPensiun pensiun={selectedPensiun} />
            </LeftDrawer>
        </Suspense>
    );
}

export default Page;
