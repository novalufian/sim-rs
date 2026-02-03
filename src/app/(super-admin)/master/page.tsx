import React from 'react'
import Link from 'next/link'

function page() {
    const masterMenus = [
        { label: 'Master Kepegawaian', href: '/master/kepegawaian', desc: 'Menu master kepegawaian' },
        { label: 'Pangkat & Golongan', href: '/master/kepegawaian/pangkat-golongan', desc: 'Master pangkat dan golongan' },
        { label: 'Jabatan', href: '/master/kepegawaian/jabatan', desc: 'Master jabatan' },
        { label: 'Unit Kerja', href: '/master/kepegawaian/unit-kerja', desc: 'Master unit kerja' },
        { label: 'Jenis Cuti', href: '/master/kepegawaian/cuti', desc: 'Master jenis cuti' },
        { label: 'Status Pendidikan', href: '/master/kepegawaian/status-pendidikan', desc: 'Master status pendidikan' },
        { label: 'Master Pegawai', href: '/master/pegawai', desc: 'Kelola data pegawai' },
        { label: 'Master Users', href: '/master/users', desc: 'Kelola akun pengguna' },
        { label: 'Master Pelatihan', href: '/master/pelatihan', desc: 'Kelola data pelatihan' },
        { label: 'Master Demografi', href: '/master/demografi', desc: 'Kelola data demografi' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Data</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pilih menu master yang ingin dikelola.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {masterMenus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className="group border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition"
                    >
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                {menu.label}
                            </h2>
                            <span className="text-xs text-blue-600 dark:text-blue-300">Kelola</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {menu.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default page
