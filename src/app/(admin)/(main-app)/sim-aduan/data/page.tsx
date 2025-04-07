"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import ColumnFilter from "@/components/tables/ColumnFilter";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { LaporTableColumns } from "@/app/(admin)/(main-app)/sim-aduan/data/tableColumns";
import { Lapor, DropdownState } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";
import { getColumnValue } from "@/app/(admin)/(main-app)/sim-aduan/data/tableHelpers";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { redirect } from "next/navigation";

function Page() {
    const [lapor, setLapor] = useState<Lapor[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(["no", "judul", "bidang", "noHp", "email", "actions"])
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    const [dropdownStates, setDropdownStates] = useState<DropdownState>({});
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number| string | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch("/api/aduan");
            const result = await response.json();
            setLapor(result.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();

        const handleClickOutside = () => {
        setDropdownStates({});
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const toggleColumn = (columnId: string) => {
        const newVisibleColumns = new Set(visibleColumns);
        if (newVisibleColumns.has(columnId)) {
        newVisibleColumns.delete(columnId);
        } else {
        newVisibleColumns.add(columnId);
        }
        setVisibleColumns(newVisibleColumns);
    };

    const toggleDropdown = (index: number, event: React.MouseEvent) => {
        console.log(index)
        event.stopPropagation();

        setOpenDropdownIndex((prev) => (prev === index ? null : index));
    };

    const handleView = (lapor: Lapor) => {
        console.log("View:", lapor);
        redirect(`/sim-aduan/data/${lapor.id}`);
    };

    const handleEdit = (lapor: Lapor) => {
        console.log("Edit:", lapor);
    };

    const handleDelete = (lapor: Lapor) => {
        console.log("Delete:", lapor);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Calculate pagination
    const totalPages = Math.ceil(lapor.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentlapor = lapor.slice(startIndex, endIndex);

    return (
        <div className="container mx-auto px-4">
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

        <PathBreadcrumb defaultTitle="Daftar data"/>
        {/* <PageBreadcrumb pageTitle="Data urut kepegawaian" /> */}

        <ColumnFilter
            columns={LaporTableColumns}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            showColumnFilter={showColumnFilter}
            setShowColumnFilter={setShowColumnFilter}
        />

        <div className="relative sm:rounded-lg bg-transparent">
            <div className="table-wrapper hide-scrollbar rounded-2xl">
            <div className="min-table-width">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                    {LaporTableColumns.map(
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
                    {currentlapor.map((lapor, index) => (
                    <tr key={index} className={`group group-hover:bg-gray-50 hover:cursor-pointer ${openDropdownIndex === lapor.id ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
                        {LaporTableColumns.map(
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
                                } ${openDropdownIndex === lapor.id ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                            >
                                {column.id === "no" ? (
                                startIndex + index + 1
                                ) : column.id === "actions" ? (
                                <ActionDropdown
                                    index={index}
                                    isOpen={openDropdownIndex === lapor.id}
                                    onToggle={(e) => toggleDropdown(lapor.id, e)}
                                    onView={() => handleView(lapor)}
                                    onEdit={() => handleEdit(lapor)}
                                    onDelete={() => handleDelete(lapor)}
                                />
                                ) : (
                                getColumnValue(lapor, column.id)
                                )}
                            </td>
                            )
                        )}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>

        <div className="mt-10">
            <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
        </div>
    );
}

export default Page;
