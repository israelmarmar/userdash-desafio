import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataItem {
    label: string;
    value: number;
}

interface PieChartProps {
    data: DataItem[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.label))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        const pie = d3.pie<DataItem>()
            .value(d => d.value);

        const data_ready = pie(data);

        const arcGenerator: any = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        svg.selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', d => color(d.data.label))
            .attr('stroke', 'black')
            .style('stroke-width', '2px')
            .style('opacity', 0.7);

        svg.selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
            .style('text-anchor', 'middle')
            .style('text-shadow', '0 0 3px black')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('fill', 'white');

            const legend = d3.select(ref.current)
            .append('div')
            .style('display', 'flex')
            .style('flex-wrap', 'wrap')
            .style('justify-content', 'center');

        legend.selectAll('div')
            .data(data_ready)
            .enter()
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-right', '20px')
            .style('margin-bottom', '10px')
            .html(d => `<div style="width: 20px; height: 20px; background-color: ${color(d.data.label)}; margin-right: 5px;"></div>${d.data.label} (${Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)}%)`);

    }, [data]);

    return (
        <div ref={ref} style={{display: 'flex', justifyContent: 'center' }}></div>
    );
};

export default PieChart;
