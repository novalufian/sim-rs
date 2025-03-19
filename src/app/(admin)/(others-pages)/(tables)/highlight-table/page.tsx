'use client'

import { useEffect, useState } from "react";
import { Employee } from "@/app/(admin)/(main-app)/simpeg/duk/data/employee";
import { HiExternalLink } from "react-icons/hi";
import Link from "next/link";

export default function HighlightTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/duk?limit=5");
                const result = await response.json();
                setEmployees(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    },[])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between items-center">
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Cuti Pegawai</h3>
                <Link href="/simpeg/cuti" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">lihat detail <HiExternalLink/></Link>
            </div>
            <div className="max-w-full overflow-x-auto my-8">
                <table className="w-full dark:text-white/70 text-lg px-3">
                    <thead>
                        <tr className="dark:text-amber-300 dark:bg-gray-700 bg-gray-200">
                            <td className="p-3">No</td>
                            <td className="p-3">name</td>
                            <td className="p-3">status</td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {employees.map((employee, index)=>(
                            <tr key={index} className="hover:dark:bg-gray-800">
                                <td className="p-3">{index+1}</td>
                                <td className="p-3">{employee['NAMA']}</td>
                                <td className="p-3"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className="text-gray-500 dark:text-amber-300 w-full text-center mt-4">( 231 ) lainnya <br /> daftar permintaan cuti pegawai </p>

            </div>
        </div>
    );
}
