import { useEffect, useRef, useState, ChangeEvent } from 'react';
import * as d3 from 'd3';
import { DataPoint } from './types';
import { validateDataset } from './utils/validation';

const App = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [showOutliers, setShowOutliers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial sample data
    fetch('/sample-data.json')
      .then(response => response.json())
      .then(data => {
        const validation = validateDataset(data);
        if (validation.isValid) {
          setData(data);
          setError(null);
        } else {
          setError(validation.errors.join('\n'));
        }
      })
      .catch(error => setError('Error loading data: ' + error.message));
  }, []);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const validation = validateDataset(json);
        
        if (validation.isValid) {
          setData(json);
          setError(null);
        } else {
          setError(validation.errors.join('\n'));
        }
      } catch (error) {
        setError('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleData = () => {
    const element = document.createElement('a');
    element.href = '/example-data.json';
    element.download = 'example-data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([height, 0])
      .nice();

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Add points
    const filteredData = showOutliers ? data : data.filter(d => !d.outlier);
    
    g.selectAll('circle')
      .data(filteredData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => d.outlier ? '#ef4444' : '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        tooltip
          .style('display', 'block')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .html(`
            <div class="p-2">
              <div>ID: ${d.id}</div>
              <div>X: ${d.x}</div>
              <div>Y: ${d.y}</div>
              <div>Outlier: ${d.outlier ? 'Yes' : 'No'}</div>
            </div>
          `);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

  }, [data, showOutliers]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Outlier Detection Visualization</h1>
      
      <div className="mb-4 flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOutliers}
            onChange={(e) => setShowOutliers(e.target.checked)}
            className="w-4 h-4"
          />
          Show Outliers
        </label>

        <label className="flex items-center gap-2">
          <span>Upload Data:</span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="border p-1"
          />
        </label>

        <button
          onClick={downloadSampleData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Sample Data
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      <svg ref={svgRef} className="w-full h-[600px] border border-gray-200"></svg>
      <div
        ref={tooltipRef}
        className="fixed hidden bg-white shadow-lg rounded border border-gray-200"
        style={{ pointerEvents: 'none' }}
      ></div>
    </div>
  );
};

export default App;
