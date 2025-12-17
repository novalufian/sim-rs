"use client";
import React from 'react';

interface GeneratingPageProps {
    title?: string;
    transparent?: boolean;
}

function GeneratingPage({ title = "Generating...", transparent = false }: GeneratingPageProps) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
            <div className="max-w-2xl w-full text-center">
                <div className={`${transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-800'} ${transparent ? '' : 'rounded-2xl border border-gray-200 dark:border-gray-700'} p-8 md:p-12`}>
                    {/* Title */}
                    {title && (
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-left">
                            {title}
                        </h2>
                    )}
                    
                    {/* Animated Bars */}
                    <div className="flex flex-col items-center justify-center gap-3 mb-6">
                        <div className="flex gap-2 items-end">
                            <div className="w-2 h-8 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-12 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-16 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-10 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.45s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-14 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-8 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.75s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-12 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-16 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1.05s', animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-10 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '1.2s' }}></div>
                        </div>
                    </div>
                    
                    {/* Generating Text */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                        {title || "Generating..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default GeneratingPage;

