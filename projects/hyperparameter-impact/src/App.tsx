import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

interface DataPoint {
  paramValue: string;
  metric: number;
}

// Sample data - using learning rate instead of trees for variety
const sampleData: DataPoint[] = [
  { paramValue: "0.001 lr", metric: 0.78 },
  { paramValue: "0.01 lr", metric: 0.83 },
  { paramValue: "0.05 lr", metric: 0.89 },
  { paramValue: "0.1 lr", metric: 0.86 },
  { paramValue: "0.5 lr", metric: 0.72 }
];

function validateData(data: DataPoint[]): boolean {
  if (data.length < 3) return false;
  
  return data.every(point => {
    const isValidMetric = typeof point.metric === 'number' && 
                         point.metric >= 0 && 
                         point.metric <= 1;
    const isValidParam = typeof point.paramValue === 'string' && 
                        point.paramValue.trim().length > 0;
    return isValidMetric && isValidParam;
  });
}

function App() {
  const [data, setData] = useState<DataPoint[]>(sampleData);
  const [sortAscending, setSortAscending] = useState(true);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [customData, setCustomData] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    // Set domains
    x.domain(data.map(d => d.paramValue));
    y.domain([0, Math.max(...data.map(d => d.metric))]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add axis labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Performance Metric");

    svg.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .text("Hyperparameter Value");

    // Add bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.paramValue)!)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.metric))
      .attr("height", d => height - y(d.metric))
      .attr("fill", d => d.paramValue === selectedBar ? "#3b82f6" : "#60a5fa")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#2563eb");
        
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "white")
          .style("padding", "8px")
          .style("border", "1px solid #ccc")
          .style("border-radius", "4px")
          .style("pointer-events", "none");

        tooltip.html(`Parameter: ${d.paramValue}<br/>Metric: ${d.metric.toFixed(3)}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function(_event, d: DataPoint) {
        d3.select(this).attr("fill", d.paramValue === selectedBar ? "#3b82f6" : "#60a5fa");
        d3.selectAll(".tooltip").remove();
      })
      .on("click", (_event, d: DataPoint) => {
        setSelectedBar(d.paramValue === selectedBar ? null : d.paramValue);
      });

  }, [data, selectedBar]);

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => 
      sortAscending ? a.metric - b.metric : b.metric - a.metric
    );
    setData(sortedData);
    setSortAscending(!sortAscending);
  };

  const handleCustomDataSubmit = () => {
    try {
      const parsedData = JSON.parse(customData);
      if (Array.isArray(parsedData) && validateData(parsedData)) {
        setData(parsedData);
        setCustomData('');
      } else {
        alert('Invalid data format. Please check the example format.');
      }
    } catch (e) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hyperparameter Impact Visualization</h1>
      
      <Card className="p-4 mb-4">
        <div className="flex gap-4 mb-4">
          <Button onClick={handleSort}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort by Metric
          </Button>
        </div>

        <div className="overflow-x-auto">
          <svg ref={svgRef}></svg>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Custom Data Input</h2>
        <p className="text-sm text-gray-600 mb-2">
          Format: [{'"paramValue": "value", "metric": 0.85'}, ...]
        </p>
        <div className="flex gap-2">
          <Input
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            placeholder='[{ "paramValue": "0.001 lr", "metric": 0.78 }, ...]'
            className="flex-1"
          />
          <Button onClick={handleCustomDataSubmit}>
            Update Data
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;
