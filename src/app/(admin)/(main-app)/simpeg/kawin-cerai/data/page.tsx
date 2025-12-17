"use client";
import React, { useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSettings2, LuShieldX } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from '@/libs/store';

import {
    useRiwayatPernikahanList,
    useRiwayatPerceraianList,
    PermohonanKawinFilters,
    RiwayatPernikahanWithRelations,
    RiwayatPerceraianWithRelations,
    useDeleteRiwayatPernikahan,
    useDeleteRiwayatPerceraian
} from "@/hooks/fetch/kawin/useKawinPermohonan";
import KawinStatusFilter from "./kawinStatusFilter";
import KawinDateFilter from "./kawinDateFilter";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedPernikahan from "./selectedPernikahan";
import SelectedPerceraian from "./selectedPerceraian";
import GeneratingPage from "@/components/loading/GeneratingPage";

type TabType = 'pernikahan' | 'perceraian';

// Tipe untuk kolom tabel pernikahan
interface PernikahanColumn {
    id: keyof RiwayatPernikahanWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const PERNIKAHAN_TABLE_COLUMNS: PernikahanColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'status_saat_ini', label: 'Status', width: 'w-[150px]' },
    { id: 'pasangan_nama', label: 'Nama Pasangan', width: 'w-[200px]' },
    { id: 'pernikahan_tanggal', label: 'Tgl Menikah', width: 'w-[120px]' },
    { id: 'pernikahan_tempat', label: 'Tempat Menikah', width: 'w-[200px]' },
    { id: 'pernikahan_no_akta', label: 'No Akta Nikah', width: 'w-[150px]' },
    { id: 'actions', label: 'Aksi', width: 'w-[80px]', sticky: 'right' },
];

// Tipe untuk kolom tabel perceraian
interface PerceraianColumn {
    id: keyof RiwayatPerceraianWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const PERCERAIAN_TABLE_COLUMNS: PerceraianColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'status_saat_ini', label: 'Status', width: 'w-[150px]' },
    { id: 'tanggal_cerai', label: 'Tgl Cerai', width: 'w-[120px]' },
    { id: 'alasan_perceraian', label: 'Alasan Cerai', width: 'w-[150px]' },
    { id: 'dokumen_akta_cerai_no', label: 'No Akta Cerai', width: 'w-[150px]' },
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

const renderStatusBadge = (status: string | null | undefined) => {
    if (!status) {
        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium inline-block bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                -
            </span>
        );
    }
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
        case "KAWIN":
            classes += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"; break;
        case "DITOLAK":
        case "DIBATALKAN":
        case "CERAI_MATI":
        case "CERAI_HIDUP":
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

const getPernikahanColumnValue = (pernikahan: RiwayatPernikahanWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'pernikahan_tanggal':
            return formatDate(pernikahan.pernikahan_tanggal);
        case 'status_saat_ini':
            return renderStatusBadge(pernikahan.status_saat_ini);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{pernikahan.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{pernikahan.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        default:
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = pernikahan[columnId as keyof RiwayatPernikahanWithRelations] as any;
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const getPerceraianColumnValue = (perceraian: RiwayatPerceraianWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_cerai':
            return formatDate(perceraian.tanggal_cerai);
        case 'status_saat_ini':
            return renderStatusBadge(perceraian.status_saat_ini);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{perceraian.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{perceraian.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        default:
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = perceraian[columnId as keyof RiwayatPerceraianWithRelations] as any;
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
    const [activeTab, setActiveTab] = useState<TabType>('pernikahan');

    const [pernikahanDrawer, setPernikahanDrawer] = useState(false);
    const [selectedPernikahan, setSelectedPernikahan] = useState<RiwayatPernikahanWithRelations | null>(null);

    const [perceraianDrawer, setPerceraianDrawer] = useState(false);
    const [selectedPerceraian, setSelectedPerceraian] = useState<RiwayatPerceraianWithRelations | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(activeTab === 'pernikahan' 
            ? ["no", "pegawai_info", "status_saat_ini", "pasangan_nama", "pernikahan_tanggal", "pernikahan_tempat", "pernikahan_no_akta", "actions"]
            : ["no", "pegawai_info", "status_saat_ini", "tanggal_cerai", "alasan_perceraian", "dokumen_akta_cerai_no", "actions"]
        )
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [showDataFilter, setShowDataFilter] = useState(false);

    const [filters, setFilters] = useState<PermohonanKawinFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    // Hooks untuk fetching data
    const { data: pernikahanResult, isLoading: isLoadingPernikahan, isError: isErrorPernikahan, error: errorPernikahan } = useRiwayatPernikahanList({
        ...filters,
        page: currentPage,
    });

    const { data: perceraianResult, isLoading: isLoadingPerceraian, isError: isErrorPerceraian, error: errorPerceraian } = useRiwayatPerceraianList({
        ...filters,
        page: currentPage,
    });

    const deletePernikahanMutation = useDeleteRiwayatPernikahan();
    const deletePerceraianMutation = useDeleteRiwayatPerceraian();

    // Ekstraksi Data
    const pernikahanList: RiwayatPernikahanWithRelations[] = pernikahanResult?.data?.items || [];
    const pernikahanTotalItems = pernikahanResult?.data?.total || 0;
    const pernikahanTotalPages = Math.ceil(pernikahanTotalItems / ITEMS_PER_PAGE);

    const perceraianList: RiwayatPerceraianWithRelations[] = perceraianResult?.data?.items || [];
    const perceraianTotalItems = perceraianResult?.data?.total || 0;
    const perceraianTotalPages = Math.ceil(perceraianTotalItems / ITEMS_PER_PAGE);

    const currentList = activeTab === 'pernikahan' ? pernikahanList : perceraianList;
    const currentTotalPages = activeTab === 'pernikahan' ? pernikahanTotalPages : perceraianTotalPages;
    const currentTotalItems = activeTab === 'pernikahan' ? pernikahanTotalItems : perceraianTotalItems;
    const isLoading = activeTab === 'pernikahan' ? isLoadingPernikahan : isLoadingPerceraian;
    const isError = activeTab === 'pernikahan' ? isErrorPernikahan : isErrorPerceraian;
    const error = activeTab === 'pernikahan' ? errorPernikahan : errorPerceraian;
    const currentColumns = activeTab === 'pernikahan' ? PERNIKAHAN_TABLE_COLUMNS : PERCERAIAN_TABLE_COLUMNS;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    // Update visible columns when tab changes
    React.useEffect(() => {
        setVisibleColumns(new Set(
            activeTab === 'pernikahan'
                ? ["no", "pegawai_info", "status_saat_ini", "pasangan_nama", "pernikahan_tanggal", "pernikahan_tempat", "pernikahan_no_akta", "actions"]
                : ["no", "pegawai_info", "status_saat_ini", "tanggal_cerai", "alasan_perceraian", "dokumen_akta_cerai_no", "actions"]
        ));
        setCurrentPage(1);
    }, [activeTab]);

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

    const handleFilterChange = (newFilters: PermohonanKawinFilters) => {
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

    const handleViewPernikahan = (pernikahan: RiwayatPernikahanWithRelations) => {
        setSelectedPernikahan(pernikahan);
        setPernikahanDrawer(true);
    };

    const handleViewPerceraian = (perceraian: RiwayatPerceraianWithRelations) => {
        setSelectedPerceraian(perceraian);
        setPerceraianDrawer(true);
    };

    const handleClosePernikahanDrawer = () => {
        setPernikahanDrawer(false);
        setSelectedPernikahan(null);
    };

    const handleClosePerceraianDrawer = () => {
        setPerceraianDrawer(false);
        setSelectedPerceraian(null);
    };

    const handleDeletePernikahan = (pernikahan: RiwayatPernikahanWithRelations) => {
        if (window.confirm(`Anda yakin ingin menghapus riwayat pernikahan dari ${pernikahan.pegawai_nama || 'pegawai ini'}?`)) {
            deletePernikahanMutation.mutate(pernikahan.id);
        }
    };

    const handleDeletePerceraian = (perceraian: RiwayatPerceraianWithRelations) => {
        if (window.confirm(`Anda yakin ingin menghapus riwayat perceraian dari ${perceraian.pegawai_nama || 'pegawai ini'}?`)) {
            deletePerceraianMutation.mutate(perceraian.id);
        }
    };

    // Guard: Cek apakah user memiliki akses (jika role adalah user, tampilkan forbidden)
    if (userRole === "user") {
        return (
            <div className="flex items-center justify-center min-h-[80vh] p-6">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
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
                                Halaman <span className="font-semibold text-gray-700 dark:text-gray-300">Kelola Data Riwayat Kawin Cerai</span> tidak dapat diakses oleh <span className="font-semibold text-red-600 dark:text-red-400">User</span>.
                            </p>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Jika Anda memerlukan akses ke halaman ini, silakan hubungi administrator sistem.
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center gap-4">
                            <Link href="/simpeg/kawin-cerai">
                                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                                    Kembali ke Halaman Kawin Cerai
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Preloading untuk super_admin dan admin saat data sedang dimuat
    if (isLoading && (userRole === "super_admin" || userRole === "admin")) {
        return <GeneratingPage title="Memuat Data Riwayat Kawin Cerai" />;
    }

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
                `}</style>

                <PathBreadcrumb defaultTitle="Riwayat Kawin Cerai" />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                        <button
                            onClick={() => setActiveTab('pernikahan')}
                            className={`px-6 py-3 font-medium text-sm transition-colors ${
                                activeTab === 'pernikahan'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Pernikahan
                        </button>
                        <button
                            onClick={() => setActiveTab('perceraian')}
                            className={`px-6 py-3 font-medium text-sm transition-colors ${
                                activeTab === 'perceraian'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Perceraian
                        </button>
                    </div>

                    {/* Aksi dan Filter */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Link href={activeTab === 'pernikahan' ? "/simpeg/kawin-cerai/pernikahan/create" : "/simpeg/kawin-cerai/perceraian/create"} passHref>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <IoAddCircleSharp className="mr-2 h-5 w-5" />
                                    {activeTab === 'pernikahan' ? 'Tambah Pernikahan Baru' : 'Tambah Perceraian Baru'}
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
                            <KawinDateFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative sm:rounded-lg bg-transparent">
                        <div className="table-wrapper rounded-2xl">
                            <div className="min-table-width">
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            {currentColumns
                                                .filter(column => visibleColumns.has(String(column.id)))
                                                .map((column) => (
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
                                        {isLoading ? (
                                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                                <tr key={index} className="animate-pulse">
                                                    {currentColumns
                                                        .filter(column => visibleColumns.has(String(column.id)))
                                                        .map((column) => (
                                                            <td
                                                                key={column.id}
                                                                className={`p-3 whitespace-nowrap`}
                                                            >
                                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                            </td>
                                                        ))}
                                                </tr>
                                            ))
                                        ) : isError ? (
                                            <tr>
                                                <td
                                                    colSpan={currentColumns.filter(column => visibleColumns.has(String(column.id))).length}
                                                    className="p-8 text-center text-red-600 dark:text-red-400"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>⚠️</span>
                                                        <span>Error loading data: {error?.message || 'Gagal memuat data'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : currentList.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={currentColumns.filter(column => visibleColumns.has(String(column.id))).length}
                                                    className="p-8 text-center text-gray-500"
                                                >
                                                    Tidak ada data {activeTab === 'pernikahan' ? 'pernikahan' : 'perceraian'}.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentList.map((item, index) => (
                                                <tr key={item.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                                    {currentColumns
                                                        .filter(column => visibleColumns.has(String(column.id)))
                                                        .map((column) => (
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
                                                                    if (activeTab === 'pernikahan') {
                                                                        setSelectedPernikahan(item as RiwayatPernikahanWithRelations);
                                                                        setPernikahanDrawer(true);
                                                                    } else {
                                                                        setSelectedPerceraian(item as RiwayatPerceraianWithRelations);
                                                                        setPerceraianDrawer(true);
                                                                    }
                                                                }}
                                                            >
                                                                {column.id === "actions" ? (
                                                                    <ActionDropdown
                                                                        index={index}
                                                                        isOpen={dropdownStates[index]}
                                                                        onToggle={(e) => toggleDropdown(index, e)}
                                                                        onView={() => activeTab === 'pernikahan' ? handleViewPernikahan(item as RiwayatPernikahanWithRelations) : handleViewPerceraian(item as RiwayatPerceraianWithRelations)}
                                                                        onEdit={() => {}}
                                                                        onDelete={() => activeTab === 'pernikahan' ? handleDeletePernikahan(item as RiwayatPernikahanWithRelations) : handleDeletePerceraian(item as RiwayatPerceraianWithRelations)}
                                                                    />
                                                                ) : (
                                                                    activeTab === 'pernikahan'
                                                                        ? getPernikahanColumnValue(item as RiwayatPernikahanWithRelations, String(column.id), index, startIndex)
                                                                        : getPerceraianColumnValue(item as RiwayatPerceraianWithRelations, String(column.id), index, startIndex)
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

                    <div className="mt-10">
                        <Pagination
                            totalPages={currentTotalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                {/* Filter Drawer */}
                <LeftDrawer isOpen={showDataFilter} onClose={() => setShowDataFilter(false)} title='Filter Data' width="600px">
                    <div className="flex flex-col rounded-lg space-y-4">
                        <div className="mb-4">
                            <KawinStatusFilter onFilterChange={handleFilterChange} currentFilters={filters} />
                        </div>
                        <button
                            onClick={() => setShowColumnFilter(!showColumnFilter)}
                            className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4"
                        >
                            <LuSettings2 className='h-6 w-6 mr-4'/>{showColumnFilter ? 'Hide Column Filter' : 'Show Column Filter'}
                        </button>
                        {showColumnFilter && (
                            <div className="bg-white dark:bg-gray-900 dark:text-gray-300 p-6 rounded-2xl">
                                <div className="flex flex-row flex-wrap gap-4">
                                    {currentColumns.map((column) =>
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

                {/* Detail Drawers */}
                <LeftDrawer isOpen={pernikahanDrawer} onClose={handleClosePernikahanDrawer} title='Detail Riwayat Pernikahan'>
                    <SelectedPernikahan pernikahan={selectedPernikahan} />
                </LeftDrawer>

                <LeftDrawer isOpen={perceraianDrawer} onClose={handleClosePerceraianDrawer} title='Detail Riwayat Perceraian'>
                    <SelectedPerceraian perceraian={selectedPerceraian} />
                </LeftDrawer>
            </div>
        </Suspense>
    );
}

export default Page;

