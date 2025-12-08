"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import ColumnFilter from "@/components/tables/ColumnFilter";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { LaporTableColumns } from "@/app/(admin)/(main-app)/sim-aduan/data/tableColumns";
import { Lapor } from "@/app/(admin)/(main-app)/sim-aduan/data/laporInterface";
import { getColumnValue } from "@/app/(admin)/(main-app)/sim-aduan/data/tableHelpers";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { redirect, useRouter } from "next/navigation";

import { UseAduanSearch } from '@/hooks/fetch/useAduanSearch';
import { useAduan } from "@/hooks/fetch/useAduan";
import AduanQueryFilter from "./aduanQueryFilter";

import {TableEmptyState, TableLoading, TableError} from "./tableEmptyState";
import { useAppSelector } from '@/hooks/useAppDispatch';
import nProgress from "nprogress";
import DeleteModal from "@/components/modals/deleteModal";
import moment from 'moment';
import 'react-dates/initialize';
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { exportAduanToExcelWithFilters } from "@/components/export/xls/aduan.export";
import api from "@/libs/api";
import toast from "react-hot-toast";


function Page() {
    //trigger for search from redux
    const {keyword, trigger} = useAppSelector(state => state.search)

    //state for table
    const columnInit = ["no", "judul", "klasifikasi","priority","status","tindak_lanjut_nama","skrining_masalah_nama", "actions"]
    const [lapor, setLapor] = useState<Lapor[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(columnInit)
    );
    const [showColumnFilter, setShowColumnFilter] = useState(false);
    // const [dropdownStates, setDropdownStates] = useState<DropdownState>({});
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number| string | null>(null);
    const [filters, setFilters] = useState<{
        status?: string;
        klasifikasi?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
    }>({})
    const [retryError, setRetryError] = useState(0)
    const [dateRangeFocusedInput, setDateRangeFocusedInput] = useState<any>(null)
    const [dateRangeStartDate, setDateRangeStartDate] = useState<moment.Moment | null>(null)
    const [dateRangeEndDate, setDateRangeEndDate] = useState<moment.Moment | null>(null)

    const itemsPerPage = 10;

    // search and default fetch hooks
    const aduanQuery = useAduan({ ...filters, page: currentPage, limit: itemsPerPage });
    const aduanSearchQuery = UseAduanSearch({ q: keyword, page: currentPage, limit: itemsPerPage, ...filters });

    const [openModal, setOpenModal] = useState(false);
    const [laporDeleteId, setLaporDeleteId] = useState<string | null>(null);
    // use search data only if trigger is true
    const isUsingSearch = trigger ;
    const data = isUsingSearch ? aduanSearchQuery.data : aduanQuery.data;
    const isLoading = isUsingSearch ? aduanSearchQuery.isPending : aduanQuery.isPending;
    const isError = isUsingSearch ? aduanSearchQuery.isError : aduanQuery.isError;
    const refetchData = isUsingSearch ? aduanSearchQuery.refetch : aduanQuery.refetch;
    const [totalPages, setTotalPages] = useState(0);

    const router = useRouter();
    
    // Initialize filters and date range from URL params on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            
            // Get all filter params
            const statusParam = params.get("status");
            const klasifikasiParam = params.get("klasifikasi");
            const priorityParam = params.get("priority");
            const startDateParam = params.get("startDate");
            const endDateParam = params.get("endDate");
            
            // Initialize filters state
            const initialFilters: {
                status?: string;
                klasifikasi?: string;
                priority?: string;
                startDate?: string;
                endDate?: string;
            } = {};
            
            if (statusParam) initialFilters.status = statusParam.toUpperCase();
            if (klasifikasiParam) initialFilters.klasifikasi = klasifikasiParam.toUpperCase();
            if (priorityParam) initialFilters.priority = priorityParam.toUpperCase();
            if (startDateParam) {
                initialFilters.startDate = startDateParam;
                setDateRangeStartDate(moment(startDateParam));
            }
            if (endDateParam) {
                initialFilters.endDate = endDateParam;
                setDateRangeEndDate(moment(endDateParam));
            }
            
            // Set filters to state so hooks can use them
            if (Object.keys(initialFilters).length > 0) {
                setFilters(initialFilters);
            }
        }
    }, []);

    useEffect(() => {
        if(data) {
            setLapor(data.data.aduan);
            console.log(data, isUsingSearch)
            setTotalPages(Math.ceil(data.data.count / itemsPerPage))
        }

    }, [data]);


    const handleFilterChange = (newFilters: {
        status?: string;
        klasifikasi?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        setFilters(newFilters);
        setCurrentPage(1);

        // Update date range state if dates are provided
        if (newFilters.startDate) {
            setDateRangeStartDate(moment(newFilters.startDate));
        } else if (newFilters.startDate === '') {
            setDateRangeStartDate(null);
        }
        if (newFilters.endDate) {
            setDateRangeEndDate(moment(newFilters.endDate));
        } else if (newFilters.endDate === '') {
            setDateRangeEndDate(null);
        }

        const params = new URLSearchParams(window.location.search)
        params.delete('status')
        params.delete('klasifikasi')
        params.delete('priority')
        params.delete('startDate')
        params.delete('endDate')

        // Add only non-empty filters
        if (newFilters.status) params.set('status', newFilters.status.toLowerCase())
        if (newFilters.klasifikasi) params.set('klasifikasi', newFilters.klasifikasi.toLowerCase())
        if (newFilters.priority) params.set('priority', newFilters.priority.toLowerCase())
        if (newFilters.startDate) params.set('startDate', newFilters.startDate)
        if (newFilters.endDate) params.set('endDate', newFilters.endDate)

        router.replace(`?${params.toString()}`);
        nProgress.start();
        setTimeout(() => {
            nProgress.done();
        }, 300);
    };

    const handleDateRangeChange = ({ startDate, endDate }: { startDate: moment.Moment | null, endDate: moment.Moment | null }) => {
        setDateRangeStartDate(startDate);
        setDateRangeEndDate(endDate);
        
        const updatedFilters = {
            ...filters,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
            endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        };
        
        handleFilterChange(updatedFilters);
    };

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

    const handleView = (lapor: Lapor) => {
        console.log("View:", lapor);
        redirect(`/sim-aduan/data/${lapor.id}`);
    };

    const handleEdit = (lapor: Lapor) => {
        redirect(`/sim-aduan/lapor/${lapor.id}/edit`);
    };

    const handleDelete = (lapor: Lapor) => {
        console.log("Delete:", lapor);
        setLaporDeleteId(lapor.id);
        setOpenModal(true);
    };

    const handleFirmDelete = (lapor: Lapor) => {
        console.log("Delete:", lapor);
        setOpenModal(false);
    };

    // Handler untuk export Excel
    const handleExportExcel = async () => {
        try {
            nProgress.start();
            toast.loading('Mengunduh data...', { id: 'export' });

            // Fetch semua data dengan filter yang sama (tanpa pagination)
            const params = new URLSearchParams();
            
            if (filters.status) params.append('status', filters.status);
            if (filters.klasifikasi) params.append('klasifikasi', filters.klasifikasi);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            
            // Jika menggunakan search, gunakan endpoint search
            if (isUsingSearch && keyword) {
                params.append('q', keyword);
                params.append('limit', '10000'); // Limit besar untuk mendapatkan semua data
                const res = await api.get(`/aduan/search?${params.toString()}`);
                const allData: Lapor[] = res.data?.data?.aduan || [];
                
                exportAduanToExcelWithFilters(allData, filters as any);
            } else {
                // Fetch semua data tanpa pagination
                params.append('limit', '10000'); // Limit besar untuk mendapatkan semua data
                const res = await api.get(`/aduan?${params.toString()}`);
                const allData: Lapor[] = res.data?.data?.aduan || [];
                
                exportAduanToExcelWithFilters(allData, filters as any);
            }

            toast.success('Data berhasil diekspor!', { id: 'export' });
        } catch (error: any) {
            console.error('Error exporting data:', error);
            toast.error(error?.response?.data?.message || 'Gagal mengekspor data', { id: 'export' });
        } finally {
            nProgress.done();
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

        <PathBreadcrumb defaultTitle="Daftar data"/>
        {/* <PageBreadcrumb pageTitle="Data urut kepegawaian" /> */}

        <style jsx global>{`
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
                z-index: 9999 !important;
            }

            .dark .DateRangePicker_picker {
                border: solid 1px rgb(55 65 81);
                background: rgba(17, 24, 39, 0.8);
            }

            .DateInput {
                background: transparent;
            }

            .CalendarDay {
                color: inherit;
            }

            .CalendarDay__default {
                color: inherit;
            }

            .CalendarDay__selected_span {
                background: #3b82f6;
                color: white;
            }

            .dark .CalendarDay__selected_span {
                background: #2563eb;
            }

            .CalendarDay__selected {
                background: #1e40af;
                color: white;
            }

            .dark .CalendarDay__selected {
                background: #1d4ed8;
            }

            .CalendarDay__hovered_span {
                background: #60a5fa;
                color: white;
            }

            .dark .CalendarDay__hovered_span {
                background: #3b82f6;
            }

            .DayPicker_weekHeader {
                color: inherit;
            }

            .DayPicker_weekHeader_li {
                color: inherit;
            }

            .DayPickerNavigation_button {
                color: inherit;
            }

            .DayPickerNavigation_button__default {
                color: inherit;
            }

            .DayPicker__withBorder {
                box-shadow: none;
            }
        `}</style>

        <ColumnFilter
            addLink="/sim-aduan/lapor"
            columns={LaporTableColumns}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            showColumnFilter={showColumnFilter}
            setShowColumnFilter={setShowColumnFilter}
            onFilterChange={()=>{}}
            onExport={handleExportExcel}
            additionalLeftContent={
                <div className="relative z-[99] appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer">
                    <DateRangePicker
                        startDate={dateRangeStartDate}
                        endDate={dateRangeEndDate}
                        onDatesChange={handleDateRangeChange}
                        startDateId="start_date_aduan"
                        focusedInput={dateRangeFocusedInput}
                        onFocusChange={setDateRangeFocusedInput}
                        endDateId="end_date_aduan"
                        displayFormat="YYYY-MM-DD"
                        isOutsideRange={() => false}
                    />
                </div>
            }
        >
            <AduanQueryFilter onFilterChange={handleFilterChange}/>

        </ColumnFilter>
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
                {
                    isError ? (<TableError colomLenght={columnInit.length} onRetry={refetchData} retryCount={retryError} setRetryCount={setRetryError}/>) :
                isLoading ? (
                    <TableLoading colomLenght={columnInit.length}/>
                ) : lapor.length === 0 ? (
                    <TableEmptyState colomLenght={columnInit.length} />
                ) : (
                    lapor.map((lapor, index) => (
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
            }}
            />
        </div>
        <DeleteModal laporanId={laporDeleteId}  isOpen={openModal} onClose={()=>{setOpenModal(false)}} onConfirm={()=>{handleFirmDelete}} />
        </div>
    );
}


export default Page;
