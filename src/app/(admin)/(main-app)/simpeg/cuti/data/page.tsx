"use client";
import React, { useState, Suspense, useRef, useEffect } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEye, FiTrash2 } from "react-icons/fi"; // Digunakan untuk ikon
import { CiExport } from "react-icons/ci";
import { FiFile, FiFileText } from "react-icons/fi";
import { TbFileExport } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import toast from "react-hot-toast";
import api from "@/libs/api";

import { 
    usePermohonanCutiList, 
    PermohonanCutiFilters, 
    PermohonanCutiWithRelations, 
    useCancelPermohonanCuti 
} from "@/hooks/fetch/cuti/useCutiPermohonan"; 
import CutiQueryFilter from "./cutiQueryFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedCuti from "./selectedCuti";
import { exportCutiToExcelWithFilters } from "@/components/export/xls/cuti.export";
import { exportCutiToDocWithFilters } from "@/components/export/doc/cuti.export";
import { exportCutiToPdf } from "@/components/export/pdf/cuti.export";

type ExportType = 'excel' | 'docx' | 'pdf';


// Tipe untuk kolom tabel cuti (Disimpan di sini sesuai permintaan)
interface CutiColumn {
    id: keyof PermohonanCutiWithRelations | 'actions' | 'no' | 'pegawai_info' | 'jenis_cuti_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const CUTI_TABLE_COLUMNS: CutiColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'jenis_cuti_info', label: 'Jenis Cuti', width: 'w-[150px]' },
    { id: 'tanggal_mulai_cuti', label: 'Tgl Mulai', width: 'w-[120px]' },
    { id: 'tanggal_selesai_cuti', label: 'Tgl Selesai', width: 'w-[120px]' },
    { id: 'jumlah_hari', label: 'Jml Hari', width: 'w-[80px]' },
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
            classes += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; break;
        case "DISETUJUI_AKHIR":
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

const getColumnValue = (cuti: PermohonanCutiWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_mulai_cuti':
            return formatDate(cuti.tanggal_mulai_cuti);
        case 'tanggal_selesai_cuti':
            return formatDate(cuti.tanggal_selesai_cuti);
        case 'status':
            return renderStatusBadge(cuti.status);
        case 'jenis_cuti_info':
            return cuti.jenis_cuti_nama || '-';
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{cuti.nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{cuti.nip || 'NIP N/A'}</span>
                </div>
            );
        default:
            // Mengakses properti lain
            const value = cuti[columnId as keyof PermohonanCutiWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

function Page() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({}); // State untuk dropdown
    
    // ✅ STATE BARU: Untuk Drawer
    const [cutiDrawer, setCutiDrawer] = useState(false);
    const [selectedCuti, setSelectedCuti] = useState<PermohonanCutiWithRelations | null>(null); 
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null);
  // -------------------------
  
    // State untuk filtering dan pagination
    const [filters, setFilters] = useState<PermohonanCutiFilters>({
        limit: ITEMS_PER_PAGE,
        page: 1,
    });

    // Hooks untuk fetching data dan mutasi pembatalan
    const { data: queryResult, isLoading: isLoadingList, isError } = usePermohonanCutiList({
        ...filters,
        page: currentPage, 
    });
    
    const cancelMutation = useCancelPermohonanCuti();

    // Ekstraksi Data Cuti
    const permohonanList: PermohonanCutiWithRelations[] = queryResult?.data?.items || [];
    const totalItems = queryResult?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
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

    // Close export dropdown when clicking outside
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


    const handleFilterChange = (newFilters: PermohonanCutiFilters) => {
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
    // ✅ MODIFIKASI: Buka Drawer dan set data cuti
    const handleView = (cuti: PermohonanCutiWithRelations) => {
        // ✅ MODIFIKASI: Buka Drawer dan set data cuti
        setSelectedCuti(cuti);
        setCutiDrawer(true);
    };
    
    // Handler untuk menutup drawer
    const handleCloseDrawer = () => {
        setCutiDrawer(false);
        setSelectedCuti(null);
    }

    // Handler untuk aksi Batalkan (Dipetakan ke onEdit/onDelete di ActionDropdown)
    const handleCancel = (cuti: PermohonanCutiWithRelations) => {
        // Logika opsional: hanya izinkan batal jika status DIAJUKAN, DIREVISI
        const canBeCancelled = cuti.status.includes("DIAJUKAN") || cuti.status.includes("DIREVISI");
        if (!canBeCancelled) {
            alert("Permohonan cuti hanya dapat dibatalkan jika statusnya DIAJUKAN atau DIREVISI.");
            return;
        }

        if (window.confirm(`Anda yakin ingin membatalkan permohonan cuti dari ${cuti.nama} (${formatDate(cuti.tanggal_mulai_cuti)} - ${formatDate(cuti.tanggal_selesai_cuti)})?`)) {
            cancelMutation.mutate(cuti.id);
        }
    };

    // Handler untuk export dengan berbagai format
    const handleExport = async (type: ExportType) => {
        try {
            nProgress.start();
            toast.loading('Mengunduh data...', { id: 'export' });

            // Fetch semua data dengan filter yang sama (tanpa pagination)
            const params = new URLSearchParams();
            
            // Apply filters yang sama seperti saat list ditampilkan
            if (filters.status) params.append('status', filters.status);
            if (filters.id_jenis_cuti) params.append('id_jenis_cuti', filters.id_jenis_cuti.toString());
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            
            // Fetch semua data tanpa pagination
            // Buat params untuk export (tanpa limit, karena export endpoint biasanya mengembalikan semua data)
            const exportParams = new URLSearchParams();
            if (filters.status) exportParams.append('status', filters.status);
            if (filters.id_jenis_cuti) exportParams.append('id_jenis_cuti', filters.id_jenis_cuti.toString());
            if (filters.startDate) exportParams.append('startDate', filters.startDate);
            if (filters.endDate) exportParams.append('endDate', filters.endDate);
            
            let allData: PermohonanCutiWithRelations[] = [];
            
            try {
                // Coba endpoint export terlebih dahulu
                const res = await api.get(`/kepegawaian/cuti/permohonan/export?${exportParams.toString()}`);
                
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
                params.append('limit', '10000'); // Limit besar untuk mendapatkan semua data
                const res = await api.get(`/kepegawaian/cuti/permohonan?${params.toString()}`);
                
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
                    exportCutiToExcelWithFilters(allData, {
                        status: filters.status,
                        id_jenis_cuti: filters.id_jenis_cuti,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                    });
                    break;
                case 'docx':
                    await exportCutiToDocWithFilters(allData, {
                        status: filters.status,
                        id_jenis_cuti: filters.id_jenis_cuti,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                    });
                    break;
                case 'pdf':
                    exportCutiToPdf(allData);
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

    if (isError) {
        return <div>Error loading data: Gagal memuat data permohonan cuti.</div>;
    }
    
    const isLoading = isLoadingList || cancelMutation.isPending;

    return (
        <Suspense fallback={<div className="container mx-auto p-4"><div>Memuat Halaman...</div></div>}>
        <div className="container mx-auto p-4">
            {/* --- Style CSS global dari Pegawai Dihilangkan --- */}
            <style jsx global>{`
            /* Minimal CSS untuk sticky header dan scrollbar */
            .table-wrapper { position: relative; overflow-x: auto; }
            .min-table-width { min-width: max-content; }
            .sticky-right { position: sticky; right: 0; z-index: 20; }
            .sticky-right-header { position: sticky; right: 0; z-index: 30; }
            .sticky-left { position: sticky; left: 0; z-index: 20; }
            .bg-sticky-header { background-color: rgb(243 244 246); }
            .dropdown-menu { min-width: 120px; transform-origin: top right; }
            `}</style>

            <PathBreadcrumb defaultTitle="Permohonan Cuti Pegawai"/>
            

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Aksi dan Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Link href="/simpeg/cuti/permohonan/create" passHref>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <IoAddCircleSharp className="mr-2 h-5 w-5" />
                                Ajukan Cuti Baru
                            </button>
                        </Link>

                        {/* Export Dropdown */}
                        <div className="relative" ref={exportDropdownRef}>
                            <button 
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className='flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4'
                            >
                                <CiExport className='h-5 w-5 mr-2'/> Export
                            </button>

                            {showExportDropdown && (
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                handleExport('excel');
                                                setShowExportDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <FiFile className="mr-2 h-4 w-4" />
                                            Export Excel
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleExport('docx');
                                                setShowExportDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <FiFileText className="mr-2 h-4 w-4" />
                                            Export DOCX
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleExport('pdf');
                                                setShowExportDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <TbFileExport className="mr-2 h-4 w-4" />
                                            Export PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <CutiQueryFilter onFilterChange={handleFilterChange} />
                    </div>

                </div>

                <div className="relative sm:rounded-lg bg-transparent">
                    <div className="table-wrapper rounded-2xl">
                    <div className="min-table-width">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                            {CUTI_TABLE_COLUMNS.map(
                                (column) => (
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
                                )
                            )}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                {CUTI_TABLE_COLUMNS.map(
                                    (column) => (
                                        <td
                                        key={column.id}
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
                                colSpan={CUTI_TABLE_COLUMNS.length}
                                className="p-8 text-center text-gray-500"
                                >
                                Tidak ada data permohonan cuti.
                                </td>
                            </tr>
                            ) : (
                            // Data rows
                            permohonanList.map((cuti, index) => (
                                <tr key={cuti.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                {CUTI_TABLE_COLUMNS.map(
                                    (column) => (
                                        <td
                                        key={column.id}
                                        className={`p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800 ${
                                            column.sticky === "left"
                                            ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20 text-center "
                                            : column.sticky === "right"
                                            ? "sticky-right bg-white  group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20"
                                            : ""
                                        }`}

                                        onClick={()=>{setSelectedCuti(cuti);setCutiDrawer(true);}}
                                        >
                                        {column.id === "actions" ? (
                                            <ActionDropdown
                                            index={index}
                                            isOpen={dropdownStates[index]}
                                            onToggle={(e) => toggleDropdown(index, e)}
                                            // VIEW
                                            onView={() => handleView(cuti)} 
                                            // EDIT (Dipakai untuk Cancel/Batalkan)
                                            onEdit={() => handleCancel(cuti)}
                                            // DELETE (Dipakai untuk Cancel/Batalkan)
                                            onDelete={() => handleCancel(cuti)}
                                            />
                                        ) : (
                                            getColumnValue(cuti, column.id, index, startIndex)
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

                <div className="mt-10">
                    <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
        {/* ✅ IMPLEMENTASI LEFT DRAWER */}
        <LeftDrawer isOpen={cutiDrawer} onClose={handleCloseDrawer} title='Detail Permohonan Cuti'>
        <SelectedCuti cuti={selectedCuti} />
        </LeftDrawer>
        {/* ---------------------------------- */}
        </Suspense>
    );
}

export default Page;