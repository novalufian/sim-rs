"use client";

import React, { useState, useMemo } from 'react';
import { usePermohonanBelajarList, PermohonanBelajarWithRelations, PermohonanBelajarFilters } from '@/hooks/fetch/belajar/useBelajarPermohonan';
import { 
    FiCalendar, 
    FiClock, 
    FiFileText, 
    FiFilter,
    FiCheckCircle, 
    FiXCircle, 
    FiMinusCircle,
    FiChevronDown,
    FiBook,
} from 'react-icons/fi';
import Pagination from "@/components/tables/Pagination";
import ActionDropdown from "@/components/tables/ActionDropdown";
import LeftDrawer from "@/components/drawer/leftDrawer";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from '@/libs/store';

// Tipe untuk kolom tabel
interface BelajarColumn {
    id: keyof PermohonanBelajarWithRelations | 'actions' | 'no' | 'institusi_info' | 'periode';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const BELAJAR_TABLE_COLUMNS: BelajarColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'institusi_info', label: 'Institusi Pendidikan', width: 'w-[250px]' },
    { id: 'program_studi_nama', label: 'Program Studi', width: 'w-[200px]' },
    { id: 'jenis_permohonan', label: 'Jenis', width: 'w-[150px]' },
    { id: 'periode', label: 'Periode Belajar', width: 'w-[200px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
    { id: 'actions', label: 'Aksi', width: 'w-[80px]', sticky: 'right' },
];

// Helper function untuk format tanggal
const formatDate = (dateStr?: Date | string | null): string => {
    if (!dateStr) return "-";
    try {
        const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(d);
    } catch {
        return "Tanggal Invalid";
    }
};

// Helper function untuk render status badge
const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let colorClass = "text-gray-700 bg-gray-100";
    let Icon = FiMinusCircle;

    switch (s) {
        case "DIAJUKAN":
        case "MENUNGGU":
            colorClass = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900";
            Icon = FiClock;
            break;
        case "DISETUJUI":
        case "DISETUJUI_AKHIR":
        case "SELESAI":
            colorClass = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900";
            Icon = FiCheckCircle;
            break;
        case "DITOLAK":
        case "DIBATALKAN":
            colorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
            Icon = FiXCircle;
            break;
        case "DIREVISI":
            colorClass = "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900";
            Icon = FiFileText;
            break;
        default:
            colorClass = "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700";
            break;
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            <Icon className="mr-1 h-3 w-3" />
            {s.replace(/_/g, ' ')}
        </span>
    );
};

const getColumnValue = (item: PermohonanBelajarWithRelations, columnId: string | keyof PermohonanBelajarWithRelations, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'institusi_info':
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.institusi_pendidikan_nama || '-'}
                    </span>
                    {item.institusi_pendidikan_kota && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.institusi_pendidikan_kota}
                        </span>
                    )}
                </div>
            );
        case 'periode':
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(item.tanggal_mulai_belajar)}
                    </span>
                    {item.tanggal_selesai_belajar && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            s/d {formatDate(item.tanggal_selesai_belajar)}
                        </span>
                    )}
                </div>
            );
        case 'status':
            return renderStatusBadge(item.status);
        default:
            const value = item[columnId as keyof PermohonanBelajarWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value 
                ? value.toString() 
                : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

export default function MyIjinBelajar() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<PermohonanBelajarWithRelations | null>(null);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

    // Build filters
    const filters: PermohonanBelajarFilters = useMemo(() => {
        const baseFilters: PermohonanBelajarFilters = {
            page,
            limit: ITEMS_PER_PAGE,
            id_pegawai: user?.id_pegawai,
        };

        if (statusFilter !== 'all') {
            baseFilters.status = statusFilter;
        }

        return baseFilters;
    }, [page, statusFilter, user?.id_pegawai]);

    // Fetch my ijin belajar list
    const { data, isLoading, error } = usePermohonanBelajarList(filters);

    const items = data?.data?.items || [];
    const total = data?.data?.pagination?.total || 0;
    const totalPages = data?.data?.pagination?.totalPages || 0;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    // Calculate chart data for stacked bar
    const chartData = useMemo(() => {
        const statusCounts: Record<string, number> = {};
        const statusColors: Record<string, string> = {
            'MENUNGGU': '#3b82f6',      // Blue
            'DIAJUKAN': '#3b82f6',      // Blue
            'DISETUJUI': '#22c55e',     // Green
            'DISETUJUI_AKHIR': '#22c55e', // Green
            'SELESAI': '#22c55e',       // Green
            'DITOLAK': '#ef4444',       // Red
            'DIBATALKAN': '#ef4444',    // Red
            'DIREVISI': '#f97316',      // Orange
        };

        items.forEach((item) => {
            const status = item.status.toUpperCase();
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const labels = Object.keys(statusCounts).filter(key => statusCounts[key] > 0);
        const total = labels.reduce((sum, label) => sum + statusCounts[label], 0);

        return labels.map(label => ({
            label: label.replace(/_/g, ' '),
            count: statusCounts[label],
            percentage: total > 0 ? (statusCounts[label] / total) * 100 : 0,
            color: statusColors[label] || '#9ca3af',
        })).sort((a, b) => {
            // Sort: MENUNGGU/DIAJUKAN first, then others
            const order = ['MENUNGGU', 'DIAJUKAN', 'DIREVISI', 'DISETUJUI', 'DISETUJUI_AKHIR', 'SELESAI', 'DITOLAK', 'DIBATALKAN'];
            return order.indexOf(a.label.toUpperCase().replace(/ /g, '_')) - order.indexOf(b.label.toUpperCase().replace(/ /g, '_'));
        });
    }, [items]);

    const filterOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'DISETUJUI_KA_UNIT', label: 'Disetujui KA Unit' },
        { value: 'DISETUJUI_KA_BIDANG', label: 'Disetujui KA Bidang' },
        { value: 'VALIDASI_KEPEGAWAIAN', label: 'Validasi Kepegawaian' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
    ];

    const selectedFilterLabel = filterOptions.find(opt => opt.value === statusFilter)?.label || 'Semua';

    // Menutup semua dropdown jika klik di luar
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            setDropdownStates({});
            const target = event.target as HTMLElement;
            if (!target.closest('.filter-dropdown-container')) {
                setFilterDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

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

    const handleView = (item: PermohonanBelajarWithRelations) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedItem(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat data permohonan ijin belajar...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">❌ Gagal memuat data permohonan ijin belajar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <style jsx global>{`
                .table-wrapper { position: relative; overflow-x: auto; }
                .min-table-width { min-width: max-content; }
                .sticky-right { position: sticky; right: 0; z-index: 20; }
                .sticky-right-header { position: sticky; right: 0; z-index: 30; }
                .sticky-left { position: sticky; left: 0; z-index: 20; }
                .bg-sticky-header { background-color: rgb(243 244 246); }
                .dropdown-menu { min-width: 120px; transform-origin: top right; }
            `}</style>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    📋 Permohonan Ijin Belajar Saya
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Berikut ini adalah daftar permohonan ijin belajar yang telah Anda ajukan
                </p>
            </div>

            {/* Filter & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-600 dark:text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Status</h3>
                        </div>
                        <div className="relative filter-dropdown-container">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterDropdownOpen(!filterDropdownOpen);
                                }}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                            >
                                <span>{selectedFilterLabel}</span>
                                <FiChevronDown className={`transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {filterDropdownOpen && (
                                <div 
                                    className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setStatusFilter(option.value);
                                                setPage(1);
                                                setFilterDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                                statusFilter === option.value
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                            Total: <span className="font-semibold">{total}</span> permohonan
                        </div>
                    </div>
                </div>

                {/* Chart Section - Stacked Bar */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Distribusi Status Permohonan
                    </h3>
                    {items.length > 0 && chartData.length > 0 ? (
                        <div className="space-y-4">
                            {/* Stacked Bar Chart */}
                            <div className="relative">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden flex">
                                    {chartData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="h-full transition-all duration-500 flex items-center justify-center"
                                            style={{
                                                width: `${item.percentage}%`,
                                                backgroundColor: item.color,
                                            }}
                                            title={`${item.label}: ${item.count} (${item.percentage.toFixed(1)}%)`}
                                        >
                                            {item.percentage > 8 && (
                                                <span className="text-xs font-medium text-white px-1">
                                                    {item.count}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 text-xs">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {item.label}: {item.count} ({item.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full py-8 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <p>Tidak ada data untuk ditampilkan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl">
                <div className="relative sm:rounded-lg bg-transparent">
                    <div className="table-wrapper rounded-2xl">
                        <div className="min-table-width">
                            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        {BELAJAR_TABLE_COLUMNS.map((column) => (
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
                                    {items.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={BELAJAR_TABLE_COLUMNS.length}
                                                className="p-8 text-center text-gray-500"
                                            >
                                                Tidak ada permohonan ijin belajar
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={item.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                                {BELAJAR_TABLE_COLUMNS.map((column) => (
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
                                                                handleView(item);
                                                            }
                                                        }}
                                                    >
                                                        {column.id === "actions" ? (
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <ActionDropdown
                                                                    index={index}
                                                                    isOpen={dropdownStates[index]}
                                                                    onToggle={(e) => toggleDropdown(index, e)}
                                                                    onView={() => handleView(item)}
                                                                    onEdit={() => handleView(item)}
                                                                    onDelete={() => handleView(item)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            getColumnValue(item, String(column.id), index, startIndex)
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
                    <div className="mt-6 p-4">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* Left Drawer untuk Detail */}
            <LeftDrawer 
                isOpen={drawerOpen} 
                onClose={handleCloseDrawer} 
                title="Detail Permohonan Ijin Belajar"
            >
                <div className="p-6 space-y-4 w-[600px]">
                    {selectedItem ? (
                        <>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Informasi Permohonan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Jenis Permohonan
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.jenis_permohonan || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Status
                                        </label>
                                        <div>{renderStatusBadge(selectedItem.status)}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Tanggal Pengajuan
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.tanggal_pengajuan)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Institusi Pendidikan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Nama Institusi
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.institusi_pendidikan_nama || '-'}</p>
                                    </div>
                                    {selectedItem.institusi_pendidikan_kota && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Kota
                                            </label>
                                            <p className="text-gray-900 dark:text-white">{selectedItem.institusi_pendidikan_kota}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Program Studi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Program Studi
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.program_studi_nama || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Jenjang
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.program_studi_jenjang || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Periode Belajar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Tanggal Mulai
                                        </label>
                                        <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.tanggal_mulai_belajar)}</p>
                                    </div>
                                    {selectedItem.tanggal_selesai_belajar && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Tanggal Selesai
                                            </label>
                                            <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.tanggal_selesai_belajar)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            Pilih permohonan untuk melihat detail
                        </div>
                    )}
                </div>
            </LeftDrawer>
        </div>
    );
}

