"use client"
import ComponentCard from '@/components/common/ComponentCard'
import PathBreadcrumb from '@/components/common/PathBreadcrumb'
import LaporForm from '@/components/form/(main-app)/lapor/page'

import React from 'react'

function page() {

    return (
        <div className='w-full grid grid-cols-12 gap-6'>
            <div className="col-span-12">
            <PathBreadcrumb />
            </div>

            <LaporForm />
            
            <ComponentCard title='Keterangan :'  className="col-span-4 bg-white/[0.03]">
                <ul className='list-decimal w-9/12 m-auto gap-1 text-gray-700'>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime quo hic odio consequatur cupiditate inventore qui laborum alias nisi id? Maiores consectetur dolores adipisci nobis assumenda quidem architecto sit earum!</li>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime quo hic odio consequatur cda quidem architecto sit earum!</li>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime quo hic odio consequatuonsectetur dolores adipisci nobis assumenda quidem architecto sit earum!</li>
                    <li>File tidak lebih dari 500kb</li>
                    <li>Format file menggunakan <span className='text-red-500 font-semibold'>pdf</span></li>

                </ul>
            </ComponentCard>
        </div>
    )
}

export default page