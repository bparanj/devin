import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ClassificationData, isValidClassificationData } from './types';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload } from 'lucide-react';

const App = () => {
  const [data, setData] = useState<ClassificationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Load initial data
    fetch('/sample-data.json')
      .then(response => response.json())
      .then(jsonData => {
        if (isValidClassificationData(jsonData)) {
          setData(jsonData);
          setError(null);
        } else {
          setError('Invalid data format');
        }
      })
      .catch(err => setError('Error loading data: ' + err.message));
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([
        d3.min(data.boundary, d => d.x) ?? 0,
        d3.max(data.boundary, d => d.x) ?? 0
      ])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data.boundary, d => d.y) ?? 0,
        d3.max(data.boundary, d => d.y) ?? 0
      ])
      .range([innerHeight, 0]);

    // Get unique classes
    const uniqueClasses = Array.from(new Set([
      ...data.points.map(d => d.class),
      ...data.boundary.map(d => d.predictedClass)
    ]));

    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(uniqueClasses)
      .range(d3.schemeCategory10);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create Voronoi diagram for boundary regions
    const voronoi = d3.Delaunay
      .from(
        data.boundary,
        d => xScale(d.x),
        d => yScale(d.y)
      )
      .voronoi([0, 0, innerWidth, innerHeight]);

    // Draw boundary regions
    g.append('g')
      .selectAll('path')
      .data(data.boundary)
      .join('path')
      .attr('d', (_, i) => voronoi.renderCell(i))
      .attr('fill', d => colorScale(d.predictedClass))
      .attr('fill-opacity', d => 
        hoveredClass === null ? 0.2 : 
        d.predictedClass === hoveredClass ? 0.4 : 0.1
      )
      .attr('stroke', 'none')
      .style('cursor', 'pointer')
      .on('mouseover', (_, d) => setHoveredClass(d.predictedClass))
      .on('mouseout', () => setHoveredClass(null));

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('X Coordinate');

    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Y Coordinate');

    // Add points
    const points = g.append('g')
      .selectAll('circle')
      .data(data.points)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => colorScale(d.class))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('opacity', d => 
        hoveredClass === null ? 1 : 
        d.class === hoveredClass ? 1 : 0.3
      );

    // Add tooltips
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'absolute hidden p-2 bg-white border rounded shadow-lg')
      .style('pointer-events', 'none');

    points
      .on('mouseover', (event, d) => {
        tooltip
          .style('display', 'block')
          .html(`
            ID: ${d.id}<br/>
            Class: ${d.class}<br/>
            X: ${d.x.toFixed(2)}<br/>
            Y: ${d.y.toFixed(2)}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);

    legend.selectAll('rect')
      .data(uniqueClasses)
      .join('rect')
      .attr('y', (_d, i) => i * 25)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d))
      .style('cursor', 'pointer')
      .on('mouseover', (_, d) => setHoveredClass(d))
      .on('mouseout', () => setHoveredClass(null));

    legend.selectAll('text')
      .data(uniqueClasses)
      .join('text')
      .attr('x', 25)
      .attr('y', (_d, i) => i * 25 + 12)
      .text(d => d)
      .style('cursor', 'pointer')
      .on('mouseover', (_, d) => setHoveredClass(d))
      .on('mouseout', () => setHoveredClass(null));

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, hoveredClass]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        if (isValidClassificationData(jsonData)) {
          setData(jsonData);
          setError(null);
        } else {
          setError('Invalid data format');
        }
      } catch (err) {
        setError('Error parsing JSON file');
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleData = () => {
    fetch('/test-data.json')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => setError('Error downloading sample data: ' + err.message));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Classification Boundaries Visualization</h1>
      
      <div className="mb-6 flex gap-4">
        <Button
          onClick={() => document.getElementById('fileInput')?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Data
        </Button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".json"
          onChange={handleFileUpload}
        />
        
        <Button
          variant="outline"
          onClick={downloadSampleData}
        >
          Download Sample Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-4 bg-white">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default App;
