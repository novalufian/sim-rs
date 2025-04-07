import React from 'react';
import { FiMoreVertical, FiEdit } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

interface ActionDropdownProps {
  index: number;
  isOpen: boolean;
  onToggle: (event: React.MouseEvent) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionDropdown({
  isOpen,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: ActionDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <FiMoreVertical className="w-5 h-5 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu absolute right-15 mt-2 rounded-xl shadow-lg bg-white dark:bg-gray-700 dark:text-white text-gray-700  ring-1 ring-black ring-opacity-5 z-50 top-[-15px] overflow-hidden px-1">
          <div className="flex py-1 t-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="w-full text-left px-4 py-2 text-sm  hover:bg-gray-100 hover:text-gray-700 rounded-md flex items-center"
            >
              <FiEdit className="mr-2" />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:text-gray-700 hover:bg-gray-100 flex items-center rounded-md "
            >
              <FiEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center rounded-md "
            >
              <AiOutlineDelete className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 