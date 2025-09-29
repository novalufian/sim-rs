'use client';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const id = params?.id as string;


    const activeLinkClass = "text-base font-medium text-white dark:text-gray-300 dark:bg-blue-900 bg-blue-600 w-full p-2 px-4 rounded-md transition-colors duration-300";
    const inactiveLinkClass = "text-base font-medium text-gray-700 dark:text-gray-300 w-full p-2 px-4 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300";
    
    return (
        <div className='grid grid-cols-12 gap-2'>
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="detail"/>
            </div>

            <div className="col-span-2 pt-6 sticky top-0 z-10">
                <div className="flex flex-col justify-start gap-1 items-start mb-4  p-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Menu Utama</h1>
                    <Link 
                        href={`/simpeg/duk/pegawai/${id}`}
                        className={pathname === `/simpeg/duk/pegawai/${id}` ? activeLinkClass : inactiveLinkClass}>
                        Daftar Pegawai
                    </Link>
                    <Link 
                        href={`/simpeg/duk/pegawai/${id}/auth`}
                        className={pathname === `/simpeg/duk/pegawai/${id}/auth` ? activeLinkClass : inactiveLinkClass}>
                        Authentikasi
                    </Link>
                    <Link 
                        href={`/simpeg/duk/pegawai/${id}/keluarga`}
                        className={pathname === `/simpeg/duk/pegawai/${id}/keluarga` ? activeLinkClass : inactiveLinkClass}>
                        Data Keluarga
                    </Link>
                    <Link 
                        href={`/simpeg/duk/pegawai/${id}/identitas`}
                        className={pathname === `/simpeg/duk/pegawai/${id}/identitas` ? activeLinkClass : inactiveLinkClass}>
                        Indentitas
                    </Link>

                    <Link 
                        href={`/simpeg/duk/pegawai/${id}/pendidikan`}
                        className={pathname === `/simpeg/duk/pegawai/${id}/pendidikan` ? activeLinkClass : inactiveLinkClass}>
                        Pendidikan
                    </Link>
                </div>
            </div>

            
            <div className="col-span-10">
                {children}
            </div>  
        </div>
    );
}