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
        <div className="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FiEdit className="mr-2" />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
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