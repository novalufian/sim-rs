import Link from 'next/link'
import React from 'react'
function layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className='grid grid-cols-12 gap-1 items-start'>
            <div className="col-span-2 flex flex-col sticky top-20">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Profile
                </h1>
                <Link className='w-full p-2 px-4 rounded-xl hover:bg-white/[0.03]' href="/profile">Data pribadi</Link>
                <Link className='w-full p-2 px-4 rounded-xl hover:bg-white/[0.03]' href="/profile/auth">Auth</Link>
            </div>
            <div className="col-span-10">
            {children}
            </div>
        </div>
    )
}

export default layout