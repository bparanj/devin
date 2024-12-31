import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Dataset } from './types';
import { validateDataset } from './utils/validation';

const App = () => {
  const [data, setData] = useState<Dataset>([]);
  const [error, setError] = useState<string>('');
  const [hiddenClasses, setHiddenClasses] = useState<Set<string>>(new Set());
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 120, bottom: 40, left: 50 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/sample-data.json');
        const jsonData = await response.json();
        const validation = validateDataset(jsonData);
        
        if (!validation.isValid) {
          setError(validation.error || 'Invalid data format');
          return;
        }

        setData(jsonData);
      } catch (err) {
        setError('Error loading data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    
    // Get unique classes for color scale
    const classes = Array.from(new Set(data.map(d => d.class)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(classes);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.x)! - 0.5, d3.max(data, d => d.x)! + 0.5])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.y)! - 0.5, d3.max(data, d => d.y)! + 0.5])
      .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .style('text-anchor', 'middle')
      .text('X Coordinate');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .text('Y Coordinate');

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '5px')
      .style('border-radius', '3px');

    // Add points
    svg.selectAll('circle')
      .data(data.filter(d => !hiddenClasses.has(d.class)))
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => colorScale(d.class))
      .attr('opacity', 0.7)
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`ID: ${d.id}<br/>Class: ${d.class}<br/>X: ${d.x}<br/>Y: ${d.y}`);
        
        const [mouseX, mouseY] = d3.pointer(event);
        tooltip
          .style('left', `${mouseX + 10}px`)
          .style('top', `${mouseY - 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 10}, ${margin.top})`);

    classes.forEach((className, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendItem.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(className))
        .attr('opacity', hiddenClasses.has(className) ? 0.2 : 0.7);

      legendItem.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .text(className)
        .style('font-size', '14px')
        .style('cursor', 'pointer')
        .on('click', () => {
          const newHiddenClasses = new Set(hiddenClasses);
          if (newHiddenClasses.has(className)) {
            newHiddenClasses.delete(className);
          } else {
            newHiddenClasses.add(className);
          }
          setHiddenClasses(newHiddenClasses);
        });
    });

  }, [data, hiddenClasses]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const validation = validateDataset(jsonData);
        
        if (!validation.isValid) {
          setError(validation.error || 'Invalid data format');
          return;
        }

        setData(jsonData);
        setError('');
      } catch (err) {
        setError('Error parsing file');
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleData = async () => {
    try {
      const response = await fetch('/example-data.json');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'example-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error downloading sample data');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Distribution and Overlap Visualization</h1>
      
      <div className="mb-4 space-y-2">
        <div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          onClick={downloadSampleData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Sample Data
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded"
        />
        <div ref={tooltipRef} />
      </div>
    </div>
  );
};

export default App;
