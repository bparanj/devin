import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";
import { validateFeatureData } from './utils/validation';
import { FeatureData } from './types';

const defaultData: FeatureData[] = [
  { feature: "Click Through Rate", importance: 0.92 },
  { feature: "Page Load Time", importance: 0.85 },
  { feature: "Bounce Rate", importance: 0.78 },
  { feature: "Time on Page", importance: 0.71 },
  { feature: "Pages per Session", importance: 0.65 },
  { feature: "Social Shares", importance: 0.58 },
  { feature: "Mobile Usability", importance: 0.52 },
  { feature: "Backlink Quality", importance: 0.45 },
  { feature: "Keyword Density", importance: 0.42 },
  { feature: "Meta Description Length", importance: 0.38 }
];

export default function App() {
  const [data, setData] = useState<FeatureData[]>(defaultData);
  const [error, setError] = useState<string>("");
  const svgRef = useRef<SVGSVGElement>(null);

  const margin = { top: 20, right: 30, bottom: 80, left: 60 };
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

    // Sort data by importance
    const sortedData = [...data].sort((a, b) => b.importance - a.importance);

    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(sortedData.map(d => d.feature))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(sortedData, d => d.importance) || 1]);

    // Add X axis with rotated labels
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll("rect")
      .data(sortedData)
      .join("rect")
      .attr("x", d => x(d.feature) || 0)
      .attr("y", d => y(d.importance))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.importance))
      .attr("fill", "#4f46e5")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#6366f1");
        
        const tooltip = svg.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.feature) || 0)
          .attr("y", y(d.importance) - 5)
          .attr("text-anchor", "middle")
          .text(`${d.importance.toFixed(2)}`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#4f46e5");
        svg.selectAll(".tooltip").remove();
      });

  }, [data, width, height]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        const validationResult = validateFeatureData(parsedData);
        if (validationResult.isValid) {
          setData(parsedData);
          setError("");
        } else {
          setError(validationResult.error || "Invalid data format");
        }
      } catch (err) {
        setError("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sampleData: FeatureData[] = [
      { feature: "Customer Age", importance: 0.88 },
      { feature: "Purchase History", importance: 0.82 },
      { feature: "Email Engagement", importance: 0.75 },
      { feature: "Website Visits", importance: 0.70 },
      { feature: "Cart Abandonment", importance: 0.65 },
      { feature: "Social Media Activity", importance: 0.60 },
      { feature: "Support Tickets", importance: 0.55 },
      { feature: "Product Reviews", importance: 0.50 },
      { feature: "Loyalty Points", importance: 0.45 },
      { feature: "Return Rate", importance: 0.40 }
    ];

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feature Importance Ranking</h1>
      
      <div className="mb-4 space-x-4">
        <Button onClick={handleDownloadSample}>
          Download Sample Data
        </Button>
        
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          variant="outline"
        >
          Upload Data
        </Button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
