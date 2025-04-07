"use client";
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GelarData {
    gelar: string;
    count: number;
    percentage: number;
    tingkat: string;
}

interface GelarStats {
    data: GelarData[];
    total: number;
    summary: {
        uniqueGelar: number;
        topGelar: string;
        topGelarCount: number;
        topGelarPercentage: number;
    };
}

type TooltipContext = {
    raw: number; // The raw data value
    dataIndex: number; // Index of the data point
    dataset: { label: string }; // Dataset information
};

export default function GelarStats() {
    const [stats, setStats] = useState<GelarStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<string, boolean>>({});
    const [showAll, setShowAll] = useState(false); // Toggle to show all categories
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/duk?gelar=true');
                const result = await response.json();
                setStats(result);

                // Initialize filters for the top 6 gelar values
                const dataArray = Array.isArray(result.data) ? result.data : [];
                const sortedData = [...dataArray]
                    .sort((a, b) => b.count - a.count); // Sort by count in descending order

                // Get the top 6 unique gelar values
                const top6Gelar = Array.from(new Set(sortedData.map((item: GelarData) => item.gelar))).slice(0, 6);

                // Initialize filters for the top 6 gelar values
                const initialFilters: Record<string, boolean> = {};
                top6Gelar.forEach(gelar => {
                    initialFilters[gelar] = true; // Default to showing the top 6 gelar values
                });

                // Add remaining gelar values (if any) but set them to false by default
                const remainingGelar = Array.from(new Set(sortedData.map((item: GelarData) => item.gelar))).slice(6);
                remainingGelar.forEach(gelar => {
                    initialFilters[gelar] = false; // Hide remaining gelar values by default
                });

                setFilters(initialFilters);
            } catch (error) {
                console.error('Error fetching gelar stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>No data available</div>;

    // Check if stats.data exists and is an array
    const dataArray = Array.isArray(stats.data) ? stats.data : [];

    // Sort data by count in descending order
    const sortedData = [...dataArray].sort((a, b) => b.count - a.count);

    // Apply search filter to unique gelar values
    const uniqueGelar = Array.from(new Set(sortedData.map(item => item.gelar)));
    const filteredGelar = uniqueGelar.filter(gelar =>
        gelar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Limit data to top 10 or show all based on toggle
    const limitedData = showAll ? sortedData : sortedData.slice(0, 100);

    // Filter data based on selected filters
    const filteredData = limitedData.filter(item => filters[item.gelar]);


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                text: 'Distribusi Gelar Akademik',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const percentage = filteredData[context.dataIndex]?.percentage || 0;
                        return `${context.dataset.label}: ${value} (${percentage}%)`;
                    }
                }
            },
            legend: {
                position: 'bottom' as const,
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#000'
                },
                title: {
                    display: false,
                    text: 'Gelar'
                }
            },
            y: {
                grid: {
                    display: true,
                    color: '#e0e0e0'
                },
                ticks: {
                    color: '#000'
                },
                title: {
                    display: false,
                    text: 'Jumlah'
                }
            },
        },
    };

    const data = {
        labels: filteredData.map(item => item.gelar),
        datasets: [{
            label: 'Jumlah',
            data: filteredData.map(item => item.count),
            borderColor: 'rgba(255, 193, 7, 1)', // Yellow border color
            backgroundColor: 'rgba(255, 193, 7, 0.2)', // Light yellow fill color
            borderWidth: 2,
            fill: true, // Fill area under the line
            pointRadius: 4, // Size of points on the line
            pointHoverRadius: 6, // Hover effect on points
        }],
    };

    // Handle filter changes
    const handleFilterChange = (gelar: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [gelar]: !prevFilters[gelar]
        }));
    };

    return (
        <div className="container mx-auto flex overflow-hidden bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800">
            
            {/* Summary Cards */}
            

            {/* Chart */}
            <div className="w-9/12 box-border pr-5 p-6 overflow-hidden">
                <h3 className="text-gray-800 text-3xl font-semibold dark:text-white">
                    Distribusi Gelar Akademik
                </h3>
                <p className=" font-normal text-gray-500 text-theme-sm dark:text-gray-400 mb-10">
                    keseluruhan pegawai
                    </p>
                <div className="w-full h-[300px]">
                    <Line options={options} data={data} />
                </div>
            </div>

            <div className="w-3/12 dark:bg-gray-900 bg-gray-100 box-border p-6 rounded-2xl">
            {/* Filters */}
            <div className="mb-1">
                <h3 className="text-gray-800 text-lg font-semibold mb-2 dark:text-white">Filter by Gelar:</h3>
                
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                {/* Filter List */}
                <ul
                    className="overflow-y-scroll h-[250px] scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none', // For Firefox
                        msOverflowStyle: 'none', // For Internet Explorer and Edge
                    }}
                >
                    {filteredGelar.map((gelar) => (
                        <li
                            key={gelar}
                            onClick={() => handleFilterChange(gelar)}
                            className={`px-4 py-2 mb-[1px] rounded-sm text-sm font-medium w-full cursor-pointer border  ${
                                filters[gelar]
                                    ? 'bg-yellow-400 border-yellow-500 text-white'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-white/[0.03] dark:text-gray-200 dark:border-transparent'
                            }`}
                        >
                            {gelar}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Show All Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-4 py-2 rounded-sm bg-gray-200 text-gray-900 text-sm font-medium w-full"
                >
                    {showAll ? 'Show Top 10' : 'Show All'}
                </button>
            </div>

            </div>
        </div>
    );
}