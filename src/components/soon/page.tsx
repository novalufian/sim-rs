"use client";

import React, { useEffect, useState } from "react";

interface ComingSoonProps {
    title?: string; // Optional title prop
}

export default function ComingSoon({ title = "Coming Soon" }: ComingSoonProps) {
    const targetDate = new Date("2025-06-01T00:00:00Z").getTime(); // Set launch date
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-78px)] bg-gray-900 text-white text-center px-6">
            <h1 className="text-5xl font-bold mb-4 animate-pulse">{title}</h1>
            <p className="text-lg text-gray-400 mb-6">We're launching something amazing. Stay tuned!</p>
            
            {/* Countdown Timer */}
            <div className="flex space-x-6 text-4xl font-semibold">
                <div className="flex flex-col items-center">
                    <span>{timeLeft.days}</span>
                    <span className="text-sm text-gray-400">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{timeLeft.hours}</span>
                    <span className="text-sm text-gray-400">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{timeLeft.minutes}</span>
                    <span className="text-sm text-gray-400">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{timeLeft.seconds}</span>
                    <span className="text-sm text-gray-400">Seconds</span>
                </div>
            </div>

            {/* Notify Me Button */}
            <button className="mt-6 px-6 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition">
                Notify Me
            </button>
        </div>
    );
}
