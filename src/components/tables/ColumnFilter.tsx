import React, { useState } from 'react';
import { Column } from '@/app/(admin)/(main-app)/simpeg/duk/pegawai/employee';
import { AiOutlinePlus } from "react-icons/ai";
import { CiExport } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import Link from 'next/link';
import ModalCustom from '../modals/modal';
import PegawaiQueryFilter from '@/components/tables/queryFilterPegawai';
import LeftDrawer from '@/components/drawer/leftDrawer';
interface ColumnFilterProps {
  addLink : string;
  columns: Column[];
  visibleColumns: Set<string>;
  toggleColumn: (columnId: string) => void;
  showColumnFilter: boolean;
  setShowColumnFilter: (show: boolean) => void;
  children?: React.ReactNode;
  onFilterChange: (filters: any) => void;
}

export default function ColumnFilter({
  addLink,
  columns,
  visibleColumns,
  toggleColumn,
  showColumnFilter,
  setShowColumnFilter,
  onFilterChange,
  children
}: ColumnFilterProps) {

  const [showDataFilter, setShowDataFilter] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex flex-row gap-1">
          

          <button
            onClick={() => setShowDataFilter(!showDataFilter)}
            className=" flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-5 px-4">
            <LuSettings2 className='h-6 w-6 mr-4'/>Data Filter
          </button>

        </div>

        <div className="button-wrapper flex flex-row">
          <button className='flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-1 px-4'>
            <CiExport className='h-6 w-6 mr-2'/> export
          </button>

          <Link href={addLink} className='flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-yellow-300 dark:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white px-4'>
            <AiOutlinePlus className='h-4 w-4 mr-2 rounded-full'/> Add new
          </Link>
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
    </div>
  );
} 