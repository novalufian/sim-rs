"use client";
import React from "react";
import getGreeting from '@/utils/greatingMsg';
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { RootState } from '@/libs/store';

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
    const user = useAppSelector((state: RootState) => state.auth.user);
    const userRole = user?.role;
    
    // Determine gradient color based on user role
    const gradientClass = userRole === "user" 
        ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-blue-400 via-blue-800 to-blue-600 bg-clip-text text-transparent';
    
    return (
        <div className={`flex flex-col mb-5 w-full ${className}`}>
            <h2 className='text-4xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2'>
                👋 Hi, {getGreeting()}
            </h2>
            {userName && (
                <h2 className={`text-6xl font-bold tracking-tighter capitalize ${gradientClass}`}>
                    {userName.toLocaleLowerCase()}
                </h2>
            )}
            {structuralName && (
                <p className='text-2xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2 w-6/12 ml-1 mt-3'>
                    {structuralName}
                </p>
            )}
        </div>
    );
}

