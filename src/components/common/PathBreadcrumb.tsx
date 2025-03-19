"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface PathBreadcrumbProps {
    defaultTitle?: string;
}

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = ({
    defaultTitle,
}) => {
    const pathname = usePathname();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(defaultTitle || "");
    
    // Skip empty strings and specific admin paths from the breadcrumb
    const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && !["(admin)", "(main-app)"].includes(segment));
    
    // Create breadcrumb items with paths
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        // Capitalize and clean segment name
        const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
        
        return { name, path };
    });
    
    const currentPageTitle = title || breadcrumbItems[breadcrumbItems.length - 1]?.name || "Dashboard";
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Escape") {
            setIsEditing(false);
        }
    };
    
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="relative group">
        {isEditing ? (
            <input
            type="text"
            value={title || currentPageTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full px-2 py-1 text-xl font-semibold bg-transparent border-b-2 border-blue-500 outline-none text-gray-800 dark:text-white/90"
            />
        ) : (
            <h2
            onClick={() => setIsEditing(true)}
            className="text-xl font-semibold text-gray-800 dark:text-white/90 cursor-pointer group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50 px-2 py-1 rounded transition-colors duration-150"
            >
            {currentPageTitle}
            <span className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 text-sm font-normal">
            (Click to edit)
            </span>
            </h2>
        )}
        </div>
        <nav>
        <ol className="flex items-center gap-1.5">
        <li>
        <Link
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        href="/"
        >
        Home
        <svg
        className="stroke-current"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
        d="M6 12L10 8L6 4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        </svg>
        </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
            <li key={item.path}>
            {index === breadcrumbItems.length - 1 ? (
                <span className="text-sm text-gray-800 dark:text-white/90">
                {item.name}
                </span>
            ) : (
                <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                href={item.path}
                >
                {item.name}
                <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                d="M6 12L10 8L6 4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
                </svg>
                </Link>
            )}
            </li>
        ))}
        </ol>
        </nav>
        </div>
    );
};

export default PathBreadcrumb; 