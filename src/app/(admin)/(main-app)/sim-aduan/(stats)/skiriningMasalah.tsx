    "use client";

    import SpinerLoading from '@/components/loading/spiner';
    import { useSkriningMasalah } from '@/hooks/fetch/useAduanStat';
    import React, { useEffect, useRef } from 'react';
    import { BsCloudSlash } from "react-icons/bs";

    import * as d3 from 'd3';
    import d3Cloud from 'd3-cloud';

    interface CloudWord {
        text: string;
        size: number;
        x: number;
        y: number;
        rotate: number;
    }

    interface FilterState {
        startDate?: string;
        endDate?: string;
    }

    interface WordData {
        text: string;
        count: number;
    }

    function WordCloudChart({ filters }: { filters: FilterState }) {
    const { data, isLoading, refetch } = useSkriningMasalah(filters);
    const svgRef = useRef<SVGSVGElement>(null);
    const layoutRef = useRef<ReturnType<typeof d3Cloud> | null>(null);

    useEffect(() => {
        if (!data || isLoading || !svgRef.current) return;

        // Clear previous SVG
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Stop previous layout if exists
        if (layoutRef.current) {
        layoutRef.current.stop();
        }

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('style', 'max-width: 100%; height: auto; background: #ffffff;');

        // Process data
        const labels = data.data?.skriningMasalah?.labels || [];
        const counts = data.data?.skriningMasalah?.counts || [];

        const wordData = labels.map((label: string, index: number) => ({
        text: label,
        count: counts[index] || 0
        }));

        const values = wordData.map((d: WordData) => Number(d.count));
        const maxValue = d3.max(values as number[]) ?? 1;
        const fontSize = d3.scaleLinear()
        .domain([0, maxValue])
        .range([15, 60])
        .clamp(true);

        // Create word cloud layout
        const layout = d3Cloud<CloudWord>()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .words(wordData.map((d: { text: string; count: number }) => ({
            text: d.text,
            size: fontSize(d.count),
            x: 0,
            y: 0,
            rotate: 0
        })))
        .padding(5)
        .rotate(() => Math.random() * 60 - 30)
        .font('sans-serif')
        .fontSize(d => d.size)
        .on('end', (words) => {
            const g = svg.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

            g.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', 'sans-serif')
            .style('fill', (_, i) => d3.schemeCategory10[i % 10])
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text)
            .append('title')
            .text(d => `${d.text}: ${d.size.toFixed(0)} occurrences`);
        });

        layoutRef.current = layout;
        layout.start();

        return () => {
        if (layoutRef.current) {
            layoutRef.current.stop();
        }
        };
    }, [data, isLoading]);

    useEffect(() => {
        refetch();
    }, [filters, refetch]);

    if (isLoading) {
        return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
            <SpinerLoading title="Loading Word Cloud..." />
        </div>
        );
    }

    if(!data){
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full flex flex-col justify-center items-center text-gray-400">
                <BsCloudSlash className='w-15 h-15'/>
                <p>koneksi server bermasalah</p>
            </div>
        )
    }

    if (!data?.data?.skriningMasalah?.labels || data.data.skriningMasalah.labels.length === 0) {
        return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Common Complaint Topics</h2>
            <div className="text-center py-8">No complaint data available</div>
        </div>
        );
    }

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
        <h2 className="text-lg font-semibold mb-4">Topik aduan yang sering muncul</h2>
        <div className="overflow-hidden rounded-4xl">
            <svg
            ref={svgRef}
            className="mx-auto"
            width="100%"
            height="500"
            preserveAspectRatio="xMidYMid meet"
            />
        </div>
        </div>
    );
    }

    export default WordCloudChart;
