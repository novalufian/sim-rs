"use client";

import React, { useState, useMemo } from 'react';
import { usePermohonanGajiList, PermohonanGajiWithRelations, PermohonanGajiFilters } from '@/hooks/fetch/gaji/useGajiPermohonan';
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from '@/libs/store';
import { FiFileText, FiFilter, FiChevronDown } from 'react-icons/fi';
import Pagination from "@/components/tables/Pagination";
import ActionDropdown from "@/components/tables/ActionDropdown";
import LeftDrawer from "@/components/drawer/leftDrawer";
import Link from "next/link";

// Tipe untuk kolom tabel
interface GajiColumn {
    id: keyof PermohonanGajiWithRelations | 'actions' | 'no' | 'gaji_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const GAJI_TABLE_COLUMNS: GajiColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'tanggal_pengajuan', label: 'Tgl Pengajuan', width: 'w-[150px]' },
    { id: 'gaji_info', label: 'Gaji Pokok', width: 'w-[200px]' },
    { id: 'tmt_kgb_baru', label: 'TMT KGB Baru', width: 'w-[150px]' },
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
        case "DISETUJUI_KA_UNIT":
        case "DISETUJUI_KA_BIDANG":
        case "VALIDASI_KEPEGAWAIAN":
            classes += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"; break;
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

const getColumnValue = (gaji: PermohonanGajiWithRelations, columnId: string | keyof PermohonanGajiWithRelations | 'actions' | 'no' | 'gaji_info', index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_pengajuan':
            return formatDate(gaji.tanggal_pengajuan);
        case 'status':
            return renderStatusBadge(gaji.status);
        case 'gaji_info':
            return (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Lama: Rp {gaji.gaji_pokok_lama?.toLocaleString('id-ID') || '0'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">Baru: Rp {gaji.gaji_pokok_baru?.toLocaleString('id-ID') || '0'}</span>
                </div>
            );
        case 'tmt_kgb_baru':
            return formatDate(gaji.tmt_kgb_baru);
        default:
            const value = gaji[columnId as keyof PermohonanGajiWithRelations];
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

export default function MyGaji() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<PermohonanGajiWithRelations | null>(null);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

    // Build filters
    const filters: PermohonanGajiFilters = useMemo(() => {
        const baseFilters: PermohonanGajiFilters = {
            page,
            limit: ITEMS_PER_PAGE,
            id_pegawai: user?.id_pegawai,
        };

        if (statusFilter !== 'all') {
            baseFilters.status = statusFilter;
        }

        return baseFilters;
    }, [page, statusFilter, user?.id_pegawai]);

    // Fetch my gaji list
    const { data, isLoading, error } = usePermohonanGajiList(filters);

    const items = data?.data?.items || [];
    const total = data?.data?.pagination?.total || 0;
    const totalPages = data?.data?.pagination?.totalPages || 0;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    // Filter options
    const filterOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
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

    const handleView = (gaji: PermohonanGajiWithRelations) => {
        setSelectedItem(gaji);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedItem(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <span className="ml-2">Memuat data permohonan kenaikan gaji...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading data: {error instanceof Error ? error.message : 'Gagal memuat data permohonan kenaikan gaji'}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header dengan Filter */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permohonan Kenaikan Gaji Saya</h2>
                <div className="relative filter-dropdown-container">
                    <button
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <FiFilter className="h-4 w-4" />
                        <span>{selectedFilterLabel}</span>
                        <FiChevronDown className="h-4 w-4" />
                    </button>
                    {filterDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setStatusFilter(option.value);
                                        setFilterDropdownOpen(false);
                                        setPage(1);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                        statusFilter === option.value
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                {GAJI_TABLE_COLUMNS.map((column) => (
                                    <th
                                        key={column.id}
                                        scope="col"
                                        className={`p-3 ${column.width} text-xs font-medium text-gray-500 dark:text-white uppercase`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={GAJI_TABLE_COLUMNS.length} className="p-8 text-center text-gray-500">
                                        Tidak ada data permohonan kenaikan gaji.
                                    </td>
                                </tr>
                            ) : (
                                items.map((gaji, index) => (
                                    <tr key={gaji.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        {GAJI_TABLE_COLUMNS.map((column) => (
                                            <td
                                                key={column.id}
                                                className={`p-3 whitespace-nowrap`}
                                            >
                                                {column.id === "actions" ? (
                                                    <ActionDropdown
                                                        index={index}
                                                        isOpen={dropdownStates[index]}
                                                        onToggle={(e) => toggleDropdown(index, e)}
                                                        onView={() => handleView(gaji)}
                                                        onEdit={() => {}}
                                                        onDelete={() => {}}
                                                    />
                                                ) : (
                                                    getColumnValue(gaji, String(column.id), index, startIndex)
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* Drawer untuk Detail */}
            <LeftDrawer isOpen={drawerOpen} onClose={handleCloseDrawer} title="Detail Permohonan Kenaikan Gaji">
                {selectedItem && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Informasi Permohonan</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Tanggal Pengajuan:</span> {formatDate(selectedItem.tanggal_pengajuan)}</p>
                                <p><span className="font-medium">Status:</span> {renderStatusBadge(selectedItem.status)}</p>
                                <p><span className="font-medium">Gaji Pokok Lama:</span> Rp {selectedItem.gaji_pokok_lama?.toLocaleString('id-ID') || '0'}</p>
                                <p><span className="font-medium">Gaji Pokok Baru:</span> Rp {selectedItem.gaji_pokok_baru?.toLocaleString('id-ID') || '0'}</p>
                                <p><span className="font-medium">TMT KGB Lama:</span> {formatDate(selectedItem.tmt_kgb_lama)}</p>
                                <p><span className="font-medium">TMT KGB Baru:</span> {formatDate(selectedItem.tmt_kgb_baru)}</p>
                            </div>
                        </div>
                        {selectedItem.catatan_kepegawaian && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Catatan</h3>
                                <p className="text-gray-600 dark:text-gray-400">{selectedItem.catatan_kepegawaian}</p>
                            </div>
                        )}
                    </div>
                )}
            </LeftDrawer>
        </div>
    );
}

