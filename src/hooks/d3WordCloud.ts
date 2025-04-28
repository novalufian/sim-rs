// src/hooks/use-d3-wordcloud.ts
import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';
import { useEffect, useRef } from 'react';

type WordCloudData = {
    text: string;
    value: number;
}[];

export const useD3WordCloud = (data: WordCloudData, options?: {
    width?: number;
    height?: number;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) return;
        
        const width = options?.width || 800;
        const height = options?.height || 500;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        
        // Clear previous SVG
        d3.select(svgRef.current).selectAll('*').remove();
        
        // Setup SVG
        const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');
        
        // Scale for font sizes
        const fontSize = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 1])
        .range([15, 60]);
        
        // Word cloud layout - Perhatikan cara pemanggilan yang benar
        const cloudLayout = d3Cloud()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .words(data.map(d => ({ 
            text: d.text, 
            size: fontSize(d.value),
            // Properti yang diperlukan oleh d3-cloud
            x: 0,
            y: 0,
            rotate: 0
        })))
        .padding(5)
        .rotate(() => 0)
        .font('sans-serif')
        .fontSize(d => (d as any).size)
        .on('end', draw);
        
        cloudLayout.start();
        
        function draw(words: any[]) {
            const g = svg.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);
            
            g.selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => `${(d as any).size}px`)
            .style('font-family', 'sans-serif')
            .style('fill', (_, i) => d3.schemeCategory10[i % 10])
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${(d as any).x},${(d as any).y})rotate(${(d as any).rotate})`)
            .text(d => (d as any).text)
            .append('title')
            .text(d => `${(d as any).text}: ${data.find(item => item.text === (d as any).text)?.value} laporan`);
        }
        
    }, [data, options?.width, options?.height]);
    
    return svgRef;
};