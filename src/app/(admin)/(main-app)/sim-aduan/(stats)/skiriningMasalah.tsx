"use client";

import SpinerLoading from '@/components/loading/spiner';
import { useSkriningMasalah } from '@/hooks/fetch/useAduanStat';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Enhanced type declarations for d3-cloud
declare module 'd3-cloud' {
    export interface Word {
        text: string;
        size: number;
        x?: number;
        y?: number;
        rotate?: number;
        font?: string;
        style?: string;
        padding?: number;
    }
    
    export interface CloudLayout<T extends Word = Word> {
        start(): CloudLayout<T>;
        stop(): CloudLayout<T>;
        words(words: T[]): CloudLayout<T>;
        size(size: [number, number]): CloudLayout<T>;
        font(font: string | ((d: T) => string)): CloudLayout<T>;
        fontSize(size: (d: T) => number): CloudLayout<T>;
        rotate(rotate: (d: T) => number): CloudLayout<T>;
        padding(padding: number | ((d: T) => number)): CloudLayout<T>;
        on(type: 'end', listener: (words: T[]) => void): CloudLayout<T>;
        on(type: 'word', listener: (word: T) => void): CloudLayout<T>;
    }
    function cloud<T extends Word = Word>(): CloudLayout<T>;
}

import d3Cloud from 'd3-cloud';

interface CloudWord {
    text: string;
    size: number;
    x: number;
    y: number;
    rotate: number;
}

function WordCloudChart() {
    const { data, isLoading } = useSkriningMasalah();
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        if (!data || isLoading || !svgRef.current) return;
        
        // Clear previous SVG
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        
        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        
        svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('style', 'max-width: 100%; height: auto; background: #f8f9fa;'); // Added background for visibility
        
        // Process data according to your API response structure
        const labels = data.data.skriningMasalah.labels || [];
        const counts = data.data.skriningMasalah.counts || [];
        // Combine labels and counts into word objects
        const wordData = labels.map((label: string, index: number) => ({
            text: label,
            count: counts[index] || 0
        }));
        
        const values = wordData.map((d: { count: number }) => Number(d.count));
        const maxValue = d3.max(values) ?? 1;
        const fontSize = d3.scaleLinear<number>()
        .domain([0, maxValue as number])
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
        .rotate(() => Math.random() * 60 - 30) // Random rotation between -30 and 30 degrees
        .font('sans-serif')
        .fontSize(d => d.size)
        .on('end', (words: CloudWord[]) => {
            const g = svg.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);
            
            g.selectAll<SVGTextElement, CloudWord>('text')
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
        
        layout.start();
        
        return () => {
            layout.stop();
        };
    }, [data, isLoading]);
    
    if (isLoading) return <SpinerLoading title="Loading Word Cloud..." />;
    
    // Check if data exists but is empty
    if (data && (!data.data.skriningMasalah.labels || data.data.skriningMasalah.labels.length === 0)) {
        return (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Common Complaint Topics</h2>
            <div className="text-center py-8">No complaint data available</div>
            </div>
        );
    }
    
    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Topik aduan yang sering muncul</h2>
        <div className="overflow-auto">
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