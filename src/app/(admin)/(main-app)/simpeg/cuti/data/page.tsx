"use client";
import React, { useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEye, FiTrash2 } from "react-icons/fi"; // Digunakan untuk ikon
import Link from "next/link";
import { useRouter } from "next/navigation";

import { 
    usePermohonanCutiList, 
    PermohonanCutiFilters, 
    PermohonanCutiWithRelations, 
    useCancelPermohonanCuti 
} from "@/hooks/fetch/cuti/useCutiPermohonan"; 
import CutiQueryFilter from "./cutiQueryFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedCuti from "./selectedCuti";


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
                    <Link href="/simpeg/cuti/permohonan/create" passHref>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <IoAddCircleSharp className="mr-2 h-5 w-5" />
                            Ajukan Cuti Baru
                        </button>
                    </Link>
                    
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