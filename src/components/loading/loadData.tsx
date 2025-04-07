
"use client"
import React, { useEffect, useState } from 'react'
import PaperLoading from '../lottie/paperLoading';

function LoadDataLoading({title}: {title?: string}) {
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
            <PaperLoading/>
            <p className='text-xl dark:text-white/30 transition-all flex'>Sedang Memuat <span className='relative w-[20px] min-h-1 '> {dots}</span></p>
            <p className='text-xl dark:text-white'>{title}</p>
        </div>
    )
}

export default LoadDataLoading