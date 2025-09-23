    "use client";
    import React from "react";

    interface DropdownFilterProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    }

    export function DropDOwnCustom({
    label,
    options,
    value,
    onChange,
    }: DropdownFilterProps) {
    return (
        <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
            <option value="">Semua</option>
            {options.map((opt) => (
            <option key={opt} value={opt}>
                {opt}
            </option>
            ))}
        </select>
        </div>
    );
}
