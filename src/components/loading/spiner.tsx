"use client"
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function SpinerLoading({title}: {title?: string}) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className='rounded-2xl min-h-full flex justify-center items-center flex-col'>
            <AiOutlineLoading3Quarters className='dark:text-white w-10 h-10 mb-3 animate-spin'/>
            <p className='text-xl dark:text-white/30 transition-all flex'>Sedang Memuat <span className='w-[20px] min-h-1'>{dots}</span></p>
            <p className='text-xl dark:text-white'>{title}</p>
        </div>
    )
}

export default SpinerLoading