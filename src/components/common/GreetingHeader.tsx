"use client";
import React from "react";
import getGreeting from '@/utils/greatingMsg';

interface GreetingHeaderProps {
    userName?: string;
    structuralName?: string | null;
    className?: string;
}

export default function GreetingHeader({ 
    userName, 
    structuralName,
    className = '' 
}: GreetingHeaderProps) {
    return (
        <div className={`flex flex-col mb-5 ${className}`}>
            <h2 className='text-4xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2'>
                👋 Hi, {getGreeting()}
            </h2>
            {userName && (
                <h2 className='text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-800 to-dark-blue-600 bg-clip-text text-transparent capitalize'>
                    {userName.toLocaleLowerCase()}
                </h2>
            )}
            {structuralName && (
                <p className='text-lg text-gray-500 dark:text-blue-400 mt-0 ml-4'>
                    {structuralName}
                </p>
            )}
        </div>
    );
}

