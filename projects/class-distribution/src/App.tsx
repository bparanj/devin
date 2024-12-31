import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown } from "lucide-react";

interface DataItem {
  class: string;
  count: number;
  percentage?: number;
}

const sampleData: DataItem[] = [
  { class: "Mammals", count: 1250 },
  { class: "Birds", count: 850 },
  { class: "Reptiles", count: 420 },
  { class: "Amphibians", count: 380 },
  { class: "Fish", count: 650 }
];

const validateData = (data: any[]): string | null => {
  if (!Array.isArray(data)) return "Input must be an array";
  if (data.length < 2) return "At least 2 classes are required";
  
  for (const item of data) {
    if (!item.class || typeof item.class !== "string" || !item.class.trim()) {
      return "Each item must have a non-empty class name";
    }
    if (typeof item.count !== "number" || item.count < 0) {
      return "Each item must have a non-negative count";
    }
  }
  
  return null;
};

const calculatePercentages = (data: DataItem[]): DataItem[] => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return data.map(item => ({
    ...item,
    percentage: (item.count / total) * 100
  }));
};

function App() {
  const [data, setData] = useState<DataItem[]>(sampleData);
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sortByCount, setSortByCount] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 100, left: 60 };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    console.log('=== Data Flow Debug ===');
    console.log('1. Original data:', data.map(d => `${d.class}: ${d.count}`));
    
    const processedData = calculatePercentages(data);
    console.log('2. Processed data:', processedData.map(d => 
      `${d.class}: ${d.count} (${d.percentage?.toFixed(1)}%)`
    ));
    
    // Sort data if needed
    console.log('3. Sort enabled:', sortByCount);
    const sortedData = sortByCount 
      ? [...processedData].sort((a, b) => b.count - a.count)
      : processedData;
    
    console.log('4. Final data order:', sortedData.map(d => 
      `${d.class}: ${d.count} (${d.percentage?.toFixed(1)}%)`
    ));
    
    // Verify data integrity
    console.log('5. Data integrity check:', {
      originalCount: data.length,
      processedCount: processedData.length,
      sortedCount: sortedData.length,
      uniqueClasses: new Set(sortedData.map(d => d.class)).size,
      isFullySorted: sortByCount 
        ? sortedData.every((d, i) => 
            i === 0 || sortedData[i-1].count >= d.count
          )
        : true
    });

    // Create scales
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.class))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .attr("dy", "0.5em")
      .attr("dx", "-0.5em")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add axis labels
    svg.append("text")
      .attr("transform", `translate(${width/2},${height - margin.bottom/3})`)
      .style("text-anchor", "middle")
      .text("Class");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left/3)
      .attr("x", -height/2)
      .style("text-anchor", "middle")
      .text("Count");

    // Add bars with transitions
    const bars = svg.selectAll("rect")
      .data(sortedData)
      .join(
        enter => enter.append("rect")
          .attr("x", d => x(d.class) || 0)
          .attr("y", height - margin.bottom)  // Start from bottom for enter animation
          .attr("width", x.bandwidth())
          .attr("height", 0),  // Start with height 0
        update => update,
        exit => exit.remove()
      );

    // Apply transitions to all bars
    bars.transition()
      .duration(750)
      .attr("x", d => x(d.class) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.count));

    // Apply static attributes and event handlers
    bars.attr("fill", d => d.class === selectedClass ? "#2563eb" : "#64748b")
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 1)
          .html(`
            Class: ${d.class}<br/>
            Count: ${d.count}<br/>
            Percentage: ${d.percentage?.toFixed(1)}%
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
      })
      .on("click", (_, d) => {
        setSelectedClass(prev => prev === d.class ? null : d.class);
      });

  }, [data, selectedClass, sortByCount]);

  const handleDataInput = (input: string) => {
    try {
      const newData = JSON.parse(input);
      const validationError = validateData(newData);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      setData(newData);
      setSortByCount(false);  // Reset sorting when new data is loaded
      setError(null);
      setJsonInput(input);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Class Distribution Visualization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 col-span-2">
          <div className="relative">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="mx-auto"
            />
            <div
              id="tooltip"
              className="absolute bg-white p-2 rounded shadow-lg pointer-events-none opacity-0 transition-opacity"
              style={{
                position: "fixed",
                zIndex: 100
              }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Controls</h2>
              <Button
                onClick={() => setSortByCount(!sortByCount)}
                className="w-full"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortByCount ? "Reset Sort" : "Sort by Count"}
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Custom Data Input</h2>
              <Textarea
                placeholder="Paste your JSON data here..."
                value={jsonInput}
                onChange={(e) => handleDataInput(e.target.value)}
                className="h-48"
              />
              {error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Data Format Example</h2>
              <pre className="bg-slate-100 p-2 rounded text-sm overflow-auto">
{`[
  { "class": "Class A", "count": 50 },
  { "class": "Class B", "count": 30 },
  { "class": "Class C", "count": 20 }
]`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
