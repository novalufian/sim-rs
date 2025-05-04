import Link from 'next/link';
import React from 'react';

const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center min-h-[500px] ">
            <div className="text-center p-4 ">
                <h1 className="text-3xl font-semibold text-red-600">Access Denied</h1>
                <p className="text-xl text-gray-700 mt-2">You are not authorized to access this page.</p>
                <Link href="/" className='mt-5 text-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'> Back to home</Link>
            </div>
        </div>
    );
};

export default Unauthorized;
