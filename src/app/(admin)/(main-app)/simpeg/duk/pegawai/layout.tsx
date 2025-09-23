'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const activeLinkClass = "text-base font-medium text-white dark:text-gray-300 dark:bg-blue-900 bg-blue-600 w-full p-2 px-4 rounded-md transition-colors duration-300";
    const inactiveLinkClass = "text-base font-medium text-gray-700 dark:text-gray-300 w-full p-2 px-4 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300";
    
    return (
        <div className='grid grid-cols-12 gap-2'>
            <div className="col-span-2 pt-6">
                <div className="flex flex-col justify-start gap-1 items-start mb-4  p-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Menu Utama</h1>
                    <Link 
                        href="/simpeg/duk/pegawai" 
                        className={pathname === "/simpeg/duk/pegawai" ? activeLinkClass : inactiveLinkClass}>
                        Daftar Pegawai
                    </Link>
                    <Link 
                        href="/simpeg/duk/pegawai/auth" 
                        className={pathname === "/simpeg/duk/pegawai/auth" ? activeLinkClass : inactiveLinkClass}>
                        Authentikasi
                    </Link>
                </div>
            </div>
            
            <div className="col-span-10">
                {children}
            </div>
        </div>
    );
}