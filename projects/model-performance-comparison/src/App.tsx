import { useCallback, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModelPerformance, validateModelData } from './types';

const defaultData: ModelPerformance[] = [
  { model: "Random Forest", metric: 0.88 },
  { model: "SVM", metric: 0.85 },
  { model: "Logistic Reg", metric: 0.82 },
  { model: "Naive Bayes", metric: 0.80 },
  { model: "KNN", metric: 0.78 }
];

function App() {
  const [data, setData] = useState<ModelPerformance[]>(defaultData);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const margin = { top: 20, right: 20, bottom: 80, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const sortData = useCallback((data: ModelPerformance[]) => {
    return [...data].sort((a, b) => 
      sortOrder === 'desc' ? b.metric - a.metric : a.metric - b.metric
    );
  }, [sortOrder]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        const errors = validateModelData(parsedData);

        if (errors.length > 0) {
          setError(errors.map(err => err.message).join(', '));
          return;
        }

        setData(parsedData);
        setError(null);
      } catch (err: unknown) {
        setError('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleData = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(defaultData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'sample-model-performance.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderChart = () => {
    const svg = d3.select('#chart');
    svg.selectAll("*").remove();

    const sortedData = sortData(data);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(sortedData.map(d => d.model));
    y.domain([0, Math.max(d3.max(sortedData, d => d.metric) || 1, 1)]);

    // Add X axis with rotated labels
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d3.format(".0%")(d)));

    // Add bars
    g.selectAll(".bar")
      .data(sortedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.model) || 0)
      .attr("y", d => y(d.metric))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.metric))
      .attr("fill", d => d.model === selectedModel ? "#2563eb" : "#64748b")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 1)
          .html(`${d.model}<br/>Metric: ${d3.format(".1%")(d.metric)}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
      })
      .on("click", (_, d) => {
        setSelectedModel(prev => prev === d.model ? null : d.model);
      });

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Performance Metric");

    g.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .text("Models");
  };

  useEffect(() => {
    renderChart();
  }, [data, selectedModel, sortOrder]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Model Performance Comparison</h1>
      
      <div className="mb-4 flex gap-4">
        <Button
          onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          variant="outline"
        >
          Sort {sortOrder === 'desc' ? '↓' : '↑'}
        </Button>
        
        <Button onClick={downloadSampleData} variant="outline">
          Download Sample Data
        </Button>
        
        <div>
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
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative bg-white rounded-lg shadow-sm p-4">
        <svg
          id="chart"
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        />
        <div
          id="tooltip"
          className="absolute opacity-0 bg-slate-800 text-white p-2 rounded pointer-events-none"
        />
      </div>
    </div>
  );
}

export default App;
