import React, { useState, useRef, useEffect } from 'react';
import { Column } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';
import { AiOutlinePlus } from "react-icons/ai";
import { CiExport } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import { FiFile, FiFileText } from "react-icons/fi";
import { TbFileExport } from "react-icons/tb";
import PegawaiQueryFilter from '@/components/tables/queryFilterPegawai';
import LeftDrawer from '@/components/drawer/leftDrawer';
import PegawaiInitForm from '../form/PegawaiInitForm';

export type ExportType = 'excel' | 'docx' | 'pdf';

interface ColumnFilterProps {
  addLink : string;
  columns: Column[];
  visibleColumns: Set<string>;
  toggleColumn: (columnId: string) => void;
  showColumnFilter: boolean;
  setShowColumnFilter: (show: boolean) => void;
  children?: React.ReactNode;
  onFilterChange: (filters: any) => void;
  additionalLeftContent?: React.ReactNode;
  onExport?: (type: ExportType) => void;
}

export default function ColumnFilter({
  addLink,
  columns,
  visibleColumns,
  toggleColumn,
  showColumnFilter,
  setShowColumnFilter,
  onFilterChange,
  children,
  additionalLeftContent,
  onExport
}: ColumnFilterProps) {

  const [showDataFilter, setShowDataFilter] = useState(false);
  const [showAddPegawai, setShowAddPegawai] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const handleExportClick = (type: ExportType) => {
    if (onExport) {
      onExport(type);
    }
    setShowExportDropdown(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex flex-row gap-2 items-center">
          {additionalLeftContent}
          <button
            onClick={() => setShowDataFilter(!showDataFilter)}
            className=" flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-5 px-4">
            <LuSettings2 className='h-6 w-6 mr-4'/>Data Filter
          </button>

        </div>

        <div className="button-wrapper flex flex-row">
          <div className="relative" ref={exportDropdownRef}>
            <button 
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className='flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-1 px-4'>
              <CiExport className='h-6 w-6 mr-2'/> Export
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleExportClick('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiFile className="mr-2 h-4 w-4" />
                    Export Excel
                  </button>
                  <button
                    onClick={() => handleExportClick('docx')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiFileText className="mr-2 h-4 w-4" />
                    Export DOCX
                  </button>
                  <button
                    onClick={() => handleExportClick('pdf')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <TbFileExport className="mr-2 h-4 w-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className='flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-1 px-4' onClick={()=>{setShowAddPegawai(true)}}>
            <AiOutlinePlus className='h-4 w-4 mr-2 rounded-full'/> Tambah Pegawai
          </button>
        </div>
      </div>
      
      


      <LeftDrawer isOpen={showDataFilter} onClose={() => setShowDataFilter(false)} title='Filter Data'>
        <div className="flex flex-col rounded-lg">
          <button
            onClick={() => setShowColumnFilter(!showColumnFilter)}
            className=" flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 mb-2">
            <LuSettings2 className='h-6 w-6 mr-4'/>{showColumnFilter ? 'Hide Column Filter' : 'Show Column Filter'}
          </button>

          {showColumnFilter && (
            <div className="bg-white dark:bg-gray-900 dark:text-gray-300 p-6 rounded-2xl">
              <div className="flex flex-row flex-wrap gap-4">
                {columns.map((column) => (
                  column.id !== 'actions' && (  
                  <label key={column.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column.id)}
                      onChange={() => toggleColumn(column.id)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{column.label}</span>
                  </label>)
                ))}
              </div>
            </div>
          )}

          <PegawaiQueryFilter onFilterChange={(data)=>{onFilterChange(data)}}/>
        </div>
        
      </LeftDrawer>

      <LeftDrawer isOpen={showAddPegawai} onClose={() => setShowAddPegawai(false)} title='Tambah Pegawai'>
        <div className="flex flex-col rounded-lg">
          <PegawaiInitForm/>
        </div>
        
      </LeftDrawer>
    </div>
  );
} 