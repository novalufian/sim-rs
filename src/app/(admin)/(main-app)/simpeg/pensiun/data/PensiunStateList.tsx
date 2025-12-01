"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePensiunStateList, useDeletePensiunState, PensiunStateWithRelations, PensiunStateFilters } from "@/hooks/fetch/pensiun/usePensiunState";
import Pagination from "@/components/tables/Pagination";
import ActionDropdown from "@/components/tables/ActionDropdown";
import LeftDrawer from "@/components/drawer/leftDrawer";
import PensiunStateDetail from "../state/PensiunStateDetail";

interface PensiunStateColumn {
    id: keyof PensiunStateWithRelations | 'actions' | 'no' | 'pegawai_info';
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

const PENSIUN_STATE_COLUMNS: PensiunStateColumn[] = [
    { id: 'no', label: 'No', width: 'w-[60px]', sticky: 'left' },
    { id: 'pegawai_info', label: 'Pegawai (NIP & Nama)', width: 'w-[250px]' },
    { id: 'status', label: 'Status', width: 'w-[150px]' },
    { id: 'tanggal_efektif', label: 'Tanggal Efektif', width: 'w-[150px]' },
    { id: 'catatan', label: 'Catatan', width: 'w-[200px]' },
    { id: 'actions', label: 'Aksi', width: 'w-[80px]', sticky: 'right' },
];

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
        case "AKTIF":
            classes += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"; break;
        case "PENSIUN":
        case "PENSIUNAN":
            classes += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; break;
        case "NON_AKTIF":
        case "NONAKTIF":
            classes += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"; break;
        default:
            classes += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"; break;
    }

    return (
        <span className={classes}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const getColumnValue = (state: PensiunStateWithRelations, columnId: string, index: number, startIndex: number) => {
    switch (columnId) {
        case 'no':
            return startIndex + index + 1;
        case 'tanggal_efektif':
            return formatDate(state.tanggal_efektif);
        case 'status':
            return renderStatusBadge(state.status);
        case 'pegawai_info':
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{state.pegawai_nama || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{state.pegawai_nip || 'NIP N/A'}</span>
                </div>
            );
        default:
            if (columnId === 'actions' || columnId === 'no' || columnId === 'pegawai_info') {
                return '-';
            }
            const value = state[columnId as keyof PensiunStateWithRelations] as any;
            return typeof value === 'object' && value !== null && 'toString' in value ? value.toString() : (value ?? '-');
    }
};

const ITEMS_PER_PAGE = 10;

export default function PensiunStateList() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    const [stateDrawer, setStateDrawer] = useState(false);
    const [selectedState, setSelectedState] = useState<PensiunStateWithRelations | null>(null);

    const [filters, setFilters] = useState<PensiunStateFilters>({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
    });

    const { data: queryResult, isLoading, isError, error } = usePensiunStateList({
        ...filters,
        page: currentPage,
    });

    const deleteMutation = useDeletePensiunState();

    const stateList: PensiunStateWithRelations[] = queryResult?.data?.items || [];
    const totalItems = queryResult?.data?.pagination?.total || 0;
    const totalPages = queryResult?.data?.pagination?.totalPages || 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    React.useEffect(() => {
        const handleClickOutside = () => {
            setDropdownStates({});
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    const handleView = (state: PensiunStateWithRelations) => {
        setSelectedState(state);
        setStateDrawer(true);
    };

    const handleCloseDrawer = () => {
        setStateDrawer(false);
        setSelectedState(null);
    };

    const handleDelete = (state: PensiunStateWithRelations) => {
        if (window.confirm(`Anda yakin ingin menghapus state pensiun dari ${state.pegawai_nama || 'pegawai ini'}?`)) {
            deleteMutation.mutate(state.id);
        }
    };

    if (isError) {
        return <div className="text-red-600 dark:text-red-400">Error: {error?.message || 'Gagal memuat data state pensiun'}</div>;
    }

    return (
        <>
            <style jsx global>{`
                .table-wrapper { position: relative; overflow-x: auto; }
                .min-table-width { min-width: max-content; }
                .sticky-right { position: sticky; right: 0; z-index: 20; }
                .sticky-right-header { position: sticky; right: 0; z-index: 30; }
                .sticky-left { position: sticky; left: 0; z-index: 20; }
                .bg-sticky-header { background-color: rgb(243 244 246); }
                .dropdown-menu { min-width: 120px; transform-origin: top right; }
            `}</style>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Daftar State Pensiun</h2>

                <div className="relative sm:rounded-lg bg-transparent">
                <div className="table-wrapper rounded-2xl">
                    <div className="min-table-width">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    {PENSIUN_STATE_COLUMNS.map((column) => (
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
                                            {PENSIUN_STATE_COLUMNS.map((column) => (
                                                <td key={column.id} className="p-3 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : stateList.length === 0 ? (
                                    <tr>
                                        <td colSpan={PENSIUN_STATE_COLUMNS.length} className="p-8 text-center text-gray-500">
                                            Tidak ada data state pensiun.
                                        </td>
                                    </tr>
                                ) : (
                                    stateList.map((state, index) => (
                                        <tr key={state.id} className="group group-hover:bg-gray-50 hover:cursor-pointer">
                                            {PENSIUN_STATE_COLUMNS.map((column) => (
                                                <td
                                                    key={column.id}
                                                    className={`p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800 ${
                                                        column.sticky === "left"
                                                            ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700 dark:bg-gray-900 z-20 text-center"
                                                            : column.sticky === "right"
                                                            ? "sticky-right bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700 dark:bg-gray-900 z-20"
                                                            : ""
                                                    }`}
                                                    onClick={() => handleView(state)}
                                                >
                                                    {column.id === "actions" ? (
                                                        <ActionDropdown
                                                            index={index}
                                                            isOpen={dropdownStates[index]}
                                                            onToggle={(e) => toggleDropdown(index, e)}
                                                            onView={() => handleView(state)}
                                                            onEdit={() => router.push(`/simpeg/pensiun/data/tambah?id=${state.id}`)}
                                                            onDelete={() => handleDelete(state)}
                                                        />
                                                    ) : (
                                                        getColumnValue(state, String(column.id), index, startIndex)
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
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

                <LeftDrawer isOpen={stateDrawer} onClose={handleCloseDrawer} title='Detail State Pensiun'>
                    <PensiunStateDetail state={selectedState} />
                </LeftDrawer>
            </div>
        </>
    );
}

