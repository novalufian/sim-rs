"use client";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface JabatanGroup {
    count: number;
    jabatanList: string[];
}

export default function GelarStats() {
    const [stats, setStats] = useState<JabatanGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/duk?jabatan=true');
                const result = await response.json();

                // Step 1: Group data by count
                const groupedData = result.data.reduce((acc: Record<number, JabatanGroup>, entry: { count: number; jabatan: string }) => {
                    const { count, jabatan } = entry;

                    // Initialize the group if it doesn't exist
                    if (!acc[count]) {
                        acc[count] = {
                            count,
                            jabatanList: [],
                        };
                    }

                    // Add the jabatan to the group
                    acc[count].jabatanList.push(jabatan);

                    return acc;
                }, {} as Record<number, JabatanGroup>);

                // Step 2: Convert grouped data into an array
                const resultArray = Object.values(groupedData) as JabatanGroup[];

                // Step 3: Sort the result by count in descending order
                resultArray.sort((a, b) => b.count - a.count);

                // Set the grouped data to state
                setStats(resultArray);
            } catch (error) {
                console.error('Error fetching gelar stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats || stats.length === 0) return <div>No data available</div>;

    // Prepare data for Stacked Bar Chart
    const uniqueCounts = [...new Set(stats.map((group) => group.count))]; // Get unique count values

    const datasets = uniqueCounts.map((countValue) => {
        const matchingGroups = stats.filter((group) => group.count === countValue); // Find groups with this count
        return {
            label: `Count: ${countValue}`, // Label for the dataset
            data: matchingGroups.map((group) => group.jabatanList.length), // Number of jabatan in each group
            backgroundColor: 'rgba(54, 162, 235, 0.8)', // Random color
            borderColor: "#fff",
            borderWidth: 2,
            stack: "stack", // Stack all datasets together
        };
    });
    console.log(uniqueCounts)

    const chartData = {
        labels: ['Jabatan'], // X-axis: single label for all stacks
        datasets: datasets,
    };

    const options = {
        indexAxis: 'y' as const, // Ensure horizontal orientation
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'point' as const,
                intersect: false,
                callbacks: {
                    label: function (context: any) {
                        const datasetIndex = context.datasetIndex; // Index of the dataset
                        console.log(datasetIndex)
                        const group = stats.find((g) => g.count === uniqueCounts.reverse()[datasetIndex]); // Find the group for this dataset
                        const jabatanList = group?.jabatanList.join(", "); // Join jabatan list into a string

                        // Return tooltip content specific to this stack
                        return [
                            `${uniqueCounts[datasetIndex]} Pegawai`, // Show the count value
                            ` ${jabatanList}`, // Show the job positions
                        ].join('\n'); // Use \n for new lines in tooltips
                    },
                },
            },
            legend: {
                display: false
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    display : false
                },
                border: {
                    color: 'transparent', // Make the axis line invisible
                }, // Enable stacking on the X-axis
            },
            y: {
                stacked: true, // Enable stacking on the Y-axis
            },
        },
    };

    return (
        <div className="w-full mx-auto p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex justify-between pr-4">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Jabatan</h2>
            <p className="text-gray-700 dark:text-gray-300 w-3/12 font-normal text-right leading-5">statistik jabatan dan jumah pergawai yang menduduki jabatan tersebut.</p>
            </div>
            <div className="h-[150px] w-full">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}