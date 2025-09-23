    import React from 'react';
    import { AiFillCloseCircle } from 'react-icons/ai';

    interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showOverlay?: boolean;
    children?: React.ReactNode;
    }

    export default function LeftDrawer({
    isOpen,
    onClose,
    title = "Drawer Title",
    showOverlay = true,
    children
    }: DrawerProps) {

    return (
        <>
        {/* Overlay */}
        {showOverlay && (
            <div 
            className={`fixed inset-0 bg-white/[0.03] backdrop-blur-[1px] z-99999 transition-opacity duration-300 ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            onClick={onClose}
            />
        )}

        {/* Drawer */}
        <div 
            className={`fixed top-0 right-0 h-full w-100 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-99999 overflow-auto ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {/* Drawer Header */}
            <div className=" dark:text-white p-10 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-blue-600 rounded"
                >
                    <AiFillCloseCircle size={20} />
                </button>
            </div>
            
            {/* Drawer Content */}
            <div className="p-4 h-full overflow-y-auto">
            {children}
            </div>
        </div>
        </>
    );
}