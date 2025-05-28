"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { BsCloudSlash } from "react-icons/bs";

export function TableEmptyState(props: { colomLenght: number }) {
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

export function TableLoading(props: { colomLenght: number }) {
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

export function TableError(props: { colomLenght: number; onRetry: () => void; retryCount: number; setRetryCount: (count: number) => void; }) {
    // Destructure the onRetry prop
    const { onRetry, retryCount, setRetryCount } = props;
    const [errorMessage, setErrorMessage] = useState("server sedang mengalami gangguan");

    const handleRetry = () => {
        if (retryCount < 3) {
            onRetry();  // Call the onRetry function
            setRetryCount(retryCount + 1); // Increment retryCount directly
        }
        if (retryCount >= 2) {
            setErrorMessage("Harap hubungi IT Support");
        }
    };

    return (
        <>
            <tr>
                {}
                <td colSpan={props.colomLenght} className="text-center py-4 ">
                    <div className="flex justify-center items-center flex-col w-ful min-h-[300px]">
                        <div className='flex flex-col items-center'>
                            <BsCloudSlash className='w-15 h-15' />
                            <p> {errorMessage} </p>
                            <button
                                onClick={handleRetry}  // Call the handleRetry function
                                className="mt-4 px-10 py-2 border border-gray-300 rounded-full text-gray-900 hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:shadow-outline dark:text-gray-300 dark:hover:text-gray-900"
                            >
                                muat ulang
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}
