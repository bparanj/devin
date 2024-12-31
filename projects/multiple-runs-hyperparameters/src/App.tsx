import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

interface DataPoint {
  epoch: number;
  run: string;
  loss: number;
}

const sampleData: DataPoint[] = [
  { epoch: 1, run: "lr=0.01,batch=32", loss: 0.90 },
  { epoch: 2, run: "lr=0.01,batch=32", loss: 0.78 },
  { epoch: 3, run: "lr=0.01,batch=32", loss: 0.66 },
  { epoch: 4, run: "lr=0.01,batch=32", loss: 0.60 },
  { epoch: 5, run: "lr=0.01,batch=32", loss: 0.57 },
  { epoch: 1, run: "lr=0.001,batch=64", loss: 0.92 },
  { epoch: 2, run: "lr=0.001,batch=64", loss: 0.85 },
  { epoch: 3, run: "lr=0.001,batch=64", loss: 0.75 },
  { epoch: 4, run: "lr=0.001,batch=64", loss: 0.71 },
  { epoch: 5, run: "lr=0.001,batch=64", loss: 0.70 }
];

function App() {
  const [data, setData] = useState<DataPoint[]>(sampleData);
  const [hoveredRun, setHoveredRun] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setData(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 150, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Setup scales
    const xScale = d3.scaleLinear()
      .domain([1, d3.max(data, d => d.epoch) || 5])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.loss) || 1])
      .range([height, 0]);

    // Create color scale
    const runs = Array.from(new Set(data.map(d => d.run)));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(runs)
      .range(d3.schemeCategory10);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Epoch');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Loss');

    // Create line generator
    const line = d3.line<DataPoint>()
      .x(d => xScale(d.epoch))
      .y(d => yScale(d.loss));

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '8px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Draw lines for each run
    runs.forEach(run => {
      const runData = data.filter(d => d.run === run);
      svg.append('path')
        .datum(runData)
        .attr('class', `line-${run.replace(/[=,.]/g, '_')}`)
        .attr('fill', 'none')
        .attr('stroke', colorScale(run))
        .attr('stroke-width', hoveredRun === run ? 3 : 1.5)
        .attr('d', line)
        .style('opacity', hoveredRun && hoveredRun !== run ? 0.2 : 1);

      // Add dots for each data point
      svg.selectAll(`.dot-${run.replace(/[=,.]/g, '_')}`)
        .data(runData)
        .enter()
        .append('circle')
        .attr('class', d => `dot-${d.run.replace(/[=,.]/g, '_')}`)
        .attr('cx', d => xScale(d.epoch))
        .attr('cy', d => yScale(d.loss))
        .attr('r', 4)
        .attr('fill', colorScale(run))
        .style('opacity', hoveredRun && hoveredRun !== run ? 0.2 : 1)
        .on('mouseover', (_event, d) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`Run: ${d.run}<br/>Epoch: ${d.epoch}<br/>Loss: ${d.loss.toFixed(4)}`)
            .style('left', (event as MouseEvent).pageX + 10 + 'px')
            .style('top', (event as MouseEvent).pageY - 28 + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    });

    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(runs)
      .enter()
      .append('g')
      .attr('transform', (_d, i) => `translate(${width + 10},${i * 20 + 10})`)
      .style('cursor', 'pointer')
      .on('mouseover', (_event, d) => {
        setHoveredRun(d);
      })
      .on('mouseout', () => {
        setHoveredRun(null);
      });

    legend.append('rect')
      .attr('x', 0)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => colorScale(d));

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);

  }, [data, hoveredRun]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multiple Runs Comparison</h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="mb-2 p-2 border rounded"
        />
        <button
          onClick={() => setData(sampleData)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset to Sample Data
        </button>
      </div>
      <div className="border rounded p-4">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default App;
