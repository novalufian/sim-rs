"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import ColumnFilter from "@/components/tables/ColumnFilter";
import ActionDropdown from "@/components/tables/ActionDropdown";
// Import Pegawai specific data and helpers
import { PegawaiTableColumns } from "@/app/(super-admin)/master/pegawai/tableColumn";
import { Pegawai } from "@/app/(super-admin)/master/pegawai/pegawaiInterface";
import { getColumnValue } from "@/app/(super-admin)/master/pegawai/tableHelpers";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { redirect, useRouter } from "next/navigation";

// Import Pegawai specific hooks
import { usePegawaiSearch } from '@/hooks/fetch/pegawai/usePegawaiSearch'; // Changed hook name
import { usePegawai ,usePegawaiDelete} from "@/hooks/fetch/pegawai/usePegawai"; // Changed hook name
import PegawaiQueryFilter from "@/app/(super-admin)/master/pegawai/pegawaiQueryFilters"; // Changed filter component

import {TableEmptyState, TableLoading, TableError} from "@/app/(super-admin)/master/pegawai/tableEmptyState"; // Assuming this path is correct
import { useAppSelector } from '@/hooks/useAppDispatch'; // Assuming this path is correct
import nProgress from "nprogress";
import DeleteModal from "@/components/modals/deleteModal"; // Assuming this path is correct


function Page() {
    //trigger for search from redux
    const {keyword, trigger} = useAppSelector(state => state.search)

    //state for table
    const columnInit = ["no", "nip", "nama", "jenis_kelelamin", "status_pekerjaan", "no_hp", "email", "actions"]
    const [pegawai, setPegawai] = useState<Pegawai[]>([]); // Renamed state variable
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(columnInit)
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number| string | null>(null);
    const [filters, setFilters] = useState({})
    const [retryError, setRetryError] = useState(0)

    const itemsPerPage = 10;

    // search and default fetch hooks
    const pegawaiQuery = usePegawai({ ...filters, page: currentPage, limit: itemsPerPage }); // Changed hook name
    const pegawaiSearchQuery = usePegawaiSearch({ q: keyword, page: currentPage, limit: itemsPerPage, ...filters }); // Changed hook name

    const [openModal, setOpenModal] = useState(false);
    const [pegawaiDeleteId, setPegawaiDeleteId] = useState<string | null>(null); // Renamed state variable
    const { mutate: deletePegawaiMutation, isPending: isDeleting } = usePegawaiDelete(); // Use the delete mutation hook

    // use search data only if trigger is true
    const isUsingSearch = trigger ;
    const data = isUsingSearch ? pegawaiSearchQuery.data : pegawaiQuery.data;
    const isLoading = isUsingSearch ? pegawaiSearchQuery.isPending : pegawaiQuery.isPending;
    const isError = isUsingSearch ? pegawaiSearchQuery.isError : pegawaiQuery.isError;
    const refetchData = isUsingSearch ? pegawaiSearchQuery.refetch : pegawaiQuery.refetch;
    const [totalPages, setTotalPages] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if(data) {
            console.log(typeof data.data)
            if(data.data){
                setPegawai(data.data.pegawai); // Assuming data.data directly contains the array of pegawai
            }
            setTotalPages(Math.ceil(data.data.count / itemsPerPage)) // Assuming data.total contains total count
        }

    }, [data, pegawai]);

    if(isLoading) {
        nProgress.start();
    } else {
        nProgress.done();
    }
    if(isError && retryError < 3) {
        setTimeout(() => {
            setRetryError(retryError + 1)
        }, 3000);
        return <TableError colomLenght={columnInit.length} onRetry={refetchData} retryCount={retryError} setRetryCount={setRetryError}/>
    }

    const handleFilterChange = (newFilters: {
        nama?: string;
        nip?: string;
        jenis_kelamin?: string;
        agama?: string;
        status_perkawinan?: string;
        status_pekerjaan?: string;
    }) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to page 1 on filter change

        const params = new URLSearchParams(window.location.search)
        params.delete('nama')
        params.delete('nip')
        params.delete('jenis_kelamin')
        params.delete('agama')
        params.delete('status_perkawinan')
        params.delete('status_pekerjaan')

        // Add only non-empty filters
        if (newFilters.nama) params.set('nama', newFilters.nama)
        if (newFilters.nip) params.set('nip', newFilters.nip)
        if (newFilters.jenis_kelamin) params.set('jenis_kelamin', newFilters.jenis_kelamin)
        if (newFilters.agama) params.set('agama', newFilters.agama)
        if (newFilters.status_perkawinan) params.set('status_perkawinan', newFilters.status_perkawinan)
        if (newFilters.status_pekerjaan) params.set('status_pekerjaan', newFilters.status_pekerjaan)


        router.replace(`?${params.toString()}`);
        nProgress.start();
        setTimeout(() => {
            nProgress.done();
        }, 300);
    };

    console.log(pegawai)

    const toggleColumn = (columnId: string) => {
        const newVisibleColumns = new Set(visibleColumns);
        if (newVisibleColumns.has(columnId)) {
        newVisibleColumns.delete(columnId);
        } else {
        newVisibleColumns.add(columnId);
        }
        setVisibleColumns(newVisibleColumns);
    };

    const toggleDropdown = (index: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setOpenDropdownIndex((prev) => (prev === index ? null : index));
    };

    const handleView = (pegawai: Pegawai) => {
        console.log("View Pegawai:", pegawai);
        router.push(`/master/pegawai/${pegawai.id_pegawai}`); // Adjust path
    };

    const handleEdit = (pegawai: Pegawai) => {
        router.push(`/master/pegawai/${pegawai.id_pegawai}?action=edit`); // Adjust path
    };

    const handleDelete = (pegawai: Pegawai) => {
        console.log("Delete Pegawai:", pegawai);
        // setPegawaiDeleteId(pegawai.id_pegawai); // Set the ID for deletion
        setOpenModal(true); // Open the delete confirmation modal
    };

    const handleConfirmDelete = () => {
        if (pegawaiDeleteId) {
            deletePegawaiMutation(pegawaiDeleteId, {
                onSuccess: () => {
                    // Invalidate and refetch are handled by the mutation's onSuccess
                    setOpenModal(false); // Close the modal
                    setPegawaiDeleteId(null);
                    // Optionally refetch current page or adjust UI
                    refetchData();
                },
                onError: (error) => {
                    console.error('Error during actual deletion:', error);
                    // Toast message is handled by the mutation's onError
                }
            });
        }
    };

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="container mx-auto px-4" onClick={()=>{setOpenDropdownIndex(null)}}>
        <style jsx global>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                /* Hide scrollbar for IE, Edge and Firefox */
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }

                /* For modern browsers that show scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background-color: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    background-color: rgba(203, 213, 225, 0.5);
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-track {
                    background-color: transparent;
                }

                .table-wrapper {
                    position: relative;
                    overflow-x: auto;
                }

                .table-scroll {
                    overflow: visible;
                    min-width: 100%;
                }

                /* Add smooth transition for column visibility */
                .table-container table {
                    transition: width 0.3s ease;
                }

                /* Ensure minimum width for table */
                .min-table-width {
                    min-width: max-content;
                }

                /* Sticky header and columns */
                .sticky-right {
                    position: sticky;
                    right: 0;
                    z-index: 20;
                }

                .sticky-right-header {
                    position: sticky;
                    right: 0;
                    z-index: 30;
                }

                .sticky-left {
                    position: sticky;
                    left: 0;
                }

                .bg-sticky-header {
                    background-color: rgb(243 244 246);
                }

                .bg-sticky-cell {
                    background-color: white;
                }

                .dropdown-menu {
                    min-width: 120px;
                    transform-origin: top right;
                    animation: dropdownAnimation 0.2s ease-in-out;
                }

                @keyframes dropdownAnimation {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>

        <PathBreadcrumb defaultTitle="Daftar Pegawai"/> {/* Changed title */}

        <ColumnFilter
            addLink="/master/pegawai/tambah"
            columns={PegawaiTableColumns} 
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            showColumnFilter={showColumnFilter}
            setShowColumnFilter={setShowColumnFilter}
            onFilterChange={handleFilterChange}
        >
            {/* <PegawaiQueryFilter onFilterChange={handleFilterChange}/>  */}

        </ColumnFilter>
        <div className="relative sm:rounded-2xl bg-white">
            <div className="table-wrapper hide-scrollbar rounded-2xl">
            <div className="min-table-width">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                    {PegawaiTableColumns.map( // Changed to PegawaiTableColumns
                        (column) =>
                        visibleColumns.has(column.id) && (
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
                {
                    isError ? (<TableError colomLenght={columnInit.length} onRetry={refetchData} retryCount={retryError} setRetryCount={setRetryError}/>) :
                isLoading ? (
                    <TableLoading colomLenght={columnInit.length}/>
                ) : pegawai.length === 0 ? ( // Check pegawai length
                    <TableEmptyState colomLenght={columnInit.length} />
                ) : (
                    pegawai.map((item : any, index: number) => ( // Renamed `lapor` to `item` for clarity
                    <tr key={item.id_pegawai} className={`group group-hover:bg-gray-50 hover:cursor-pointer ${openDropdownIndex === item.id_pegawai ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
                        {PegawaiTableColumns.map( // Changed to PegawaiTableColumns
                        (column) =>
                            visibleColumns.has(column.id) && (
                            <td
                                key={column.id}
                                className={`

                                    p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800    ${
                                column.sticky === "left"
                                    ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20 text-center "
                                    : column.sticky === "right"
                                    ? "sticky-right bg-white  group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20"
                                    : ""
                                } ${openDropdownIndex === item.id_pegawai ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                            >
                                {column.id === "no" ? (
                                startIndex + index + 1
                                ) : column.id === "actions" ? (
                                <ActionDropdown
                                    index={index}
                                    isOpen={openDropdownIndex === item.id_pegawai}
                                    onToggle={(e) => toggleDropdown(item.id_pegawai, e)}
                                    onView={() => handleView(item)}
                                    onEdit={() => handleEdit(item)}
                                    onDelete={() => handleDelete(item)}
                                />
                                ) : (
                                getColumnValue(item, column.id) // Pass `item` (Pegawai object)
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
            onPageChange={(page) =>{
                setCurrentPage(page)
                setFilters({ ...filters, page })
            }}
            />
        </div>
        <DeleteModal
            laporanId={pegawaiDeleteId} // Changed prop name to match
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={handleConfirmDelete} // Changed function name
        />
        </div>
    );
}

export default Page;