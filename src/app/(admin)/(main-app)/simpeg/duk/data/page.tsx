"use client";
import React, { useEffect, useState, Suspense } from "react";
import Pagination from "@/components/tables/Pagination";
import ColumnFilter from "@/components/tables/ColumnFilter";
import ActionDropdown from "@/components/tables/ActionDropdown";
import { DUKTableColumns } from "@/app/(admin)/(main-app)/simpeg/duk/data/tableColumns";
import { Employee, DropdownState } from "@/app/(admin)/(main-app)/simpeg/duk/data/employee";
import { getColumnValue } from "@/app/(admin)/(main-app)/simpeg/duk/data/tableHelpers";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { usePegawai } from "@/hooks/fetch/pegawai/usePegawai";
import { useAppSelector } from '@/hooks/useAppDispatch';
import router from "next/router";
import nProgress from "nprogress";
import { usePegawaiSearch } from "@/hooks/fetch/pegawai/usePegawaiSearch";
import LeftDrawer from "@/components/drawer/leftDrawer";
import SelectedPegawai from "./selectedPegawai";


function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "no",                     // NO
      "nama",                   // NAMA
      "nip",                    // NIP/NIPPPK
      "status_pekerjaan",       // STATUS PEKERJAAN
      // "pangkat_tmt",            // PANGKAT/GOL (kalau ada golongan pisah, tambahin juga)
      "pengangkatan_tmt",       // TMT
      "jabatan",                // JABATAN
      "pengangkatan_nomor_sk",  // NO. SK PANGKAT AKHIR
      // "jabatan_tmt",            // TMTJAB
      // "eselon",               // ESELON (kalau nanti ada)
      "pengangkatan_masakerja", // THN MSKRJ / BLN MSKRJ
      "pendidikan_institusi",   // PENDIDIKAN
      "pendidikan_jenjang",     // Jenjang
      // "pendidikan_gelar",       // GELAR
      // "pendidikan_tingkat",   // TINGKAT (kalau ada field)
      "pendidikan_tahun_selesai", // TAHUN LULUS
      "tempat_lahir",           // TMPT LHR
      "tanggal_lahir",          // TGLLHR
      "umur",                   // UMUR
      "jenis_kelamin",          // JENIS KELAMIN
      "agama",                  // AGAMA
      "actions"
    ])
  );

  //drawer pegawai
  const [pegawaiDrawer, setPegawaiDrawer] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Employee | null>(null); 

  // Search state from Redux
  const { keyword, trigger } = useAppSelector(state => state.search);
  const [ employees, setEmployees ] = useState<Employee[]>([]);
  // Filter and UI states
  
  const [filters, setFilters] = useState({});
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<DropdownState>({});
  const itemsPerPage = 10;

  // Default fetch hook
  const { data: pegawaiData, isLoading: isLoadingDefault, error: errorDefault } = usePegawai({
    page: currentPage,
    limit: itemsPerPage,
    ...filters
  });

  // Search fetch hook
  const { data: pegawaiSearchData, isLoading: isLoadingSearch, error: errorSearch } = usePegawaiSearch({
    q: keyword,
    page: currentPage,
    limit: itemsPerPage,
    ...filters
  });

  // Determine which data to use based on keyword presence
  const isSearchMode = trigger || keyword.trim() !== '';
  // const isSearchMode = keyword && keyword.trim() !== '';
  // const isUsingSearch = trigger ;

  const activeData = isSearchMode ? pegawaiSearchData : pegawaiData;
  const isLoading = isSearchMode ? isLoadingSearch : isLoadingDefault;
  const error = isSearchMode ? errorSearch : errorDefault;
  // Extract employees and pagination info
  // const employees: Employee[] = activeData?.data.pegawai || [];
  const totalPages = activeData?.data.total ? Math.ceil(activeData.data.total / itemsPerPage) : 0;


  console.log(isSearchMode)
  // Reset to page 1 when switching between search and default mode
  useEffect(() => {
    if(activeData) {
      setEmployees(activeData.data.pegawai);
      setCurrentPage(1);
    }
  }, [activeData]);

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownStates({});
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    nProgress.start();
    setTimeout(() => {
      nProgress.done();
    }, 300);
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

  const handleView = (employee: Employee) => {
    console.log("View:", employee);
  };

  const handleEdit = (employee: Employee) => {
    console.log("Edit:", employee);
  };

  const handleDelete = (employee: Employee) => {
    console.log("Delete:", employee);
  };

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = employees;

  return (
    <Suspense fallback={<div className="container mx-auto px-4"><div>Loading...</div></div>}>
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

      <PathBreadcrumb defaultTitle="Data Pegawai"/>
      

      <ColumnFilter
        addLink="/simpeg/duk/pegawai"
        columns={DUKTableColumns}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        showColumnFilter={showColumnFilter}
        setShowColumnFilter={setShowColumnFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="relative sm:rounded-lg bg-transparent">
        <div className="table-wrapper hide-scrollbar rounded-2xl">
          <div className="min-table-width">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {DUKTableColumns.map(
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
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      {DUKTableColumns.map(
                        (column) =>
                          visibleColumns.has(column.id) && (
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
                ) : currentEmployees.length === 0 ? (
                  // No data message
                  <tr >
                    <td 
                      colSpan={DUKTableColumns.filter(col => visibleColumns.has(col.id)).length}
                      className="p-8 text-center text-gray-500"
                    >
                      {isSearchMode 
                        ? `Tidak ada data yang ditemukan untuk pencarian "${keyword}"`
                        : "Tidak ada data pegawai"
                      }
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  currentEmployees.map((employee, index) => (
                    <tr key={index} className="group group-hover:bg-gray-50 hover:cursor-pointer" onClick={()=>{
                      setPegawaiDrawer(true)
                      setSelectedPegawai(employee)
                      }}>
                      {DUKTableColumns.map(
                        (column) =>
                          visibleColumns.has(column.id) && (
                            <td
                              key={column.id}
                              className={`p-3 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-gray-800    ${
                                column.sticky === "left"
                                  ? "sticky-left bg-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20 text-center "
                                  : column.sticky === "right"
                                  ? "sticky-right bg-white  group-hover:bg-gray-200 dark:group-hover:bg-gray-700  dark:bg-gray-900 z-20"
                                  : ""
                              }`}
                            >
                              {column.id === "no" ? (
                                startIndex + index + 1
                              ) : column.id === "actions" ? (
                                <ActionDropdown
                                  index={index}
                                  isOpen={dropdownStates[index]}
                                  onToggle={(e) => toggleDropdown(index, e)}
                                  onView={() => handleView(employee)}
                                  onEdit={() => handleEdit(employee)}
                                  onDelete={() => handleDelete(employee)}
                                />
                              ) : (
                                getColumnValue(employee, column.id)
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
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>

    <LeftDrawer isOpen={pegawaiDrawer} onClose={()=>{
        setPegawaiDrawer(false);
        setSelectedPegawai(null);
      }} title='Data Pegawai'>
      <SelectedPegawai employee={selectedPegawai} />
      </LeftDrawer>
    </Suspense>
  );
}

export default Page;