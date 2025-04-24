"use client"
import React from 'react'
import Image from 'next/image'

export function TableEmptyState(props :{colomLenght : number}) {
    return (
    <>
        
        <tr>
            <td colSpan={props.colomLenght} className="text-center py-4 ">
                <div className="flex justify-center items-center flex-col w-ful min-h-[30vh]">
                    <Image src="/images/empty/no-data.png" alt="no data" width={100} height={100} />
                    <p className="text-gray-500 dark:text-gray-400">tidak ada data aduan</p>
                </div>
            </td>
        </tr>

    </>
    )
}

export function TableLoading(props :{colomLenght : number}) {
    return (
    <>
        
        <tr>
            {}
            <td colSpan={props.colomLenght} className="text-center py-4 ">
                <div className="flex justify-center items-center flex-col w-ful min-h-[30vh]">
                    <p className="text-gray-500 dark:text-gray-400">Sedang memuat data . . . </p>
                </div>
            </td>
        </tr>

    </>
    )
}