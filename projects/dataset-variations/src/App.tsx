import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import './App.css'

interface DataPoint {
  dataset: string
  metric: number
}

const sampleData: DataPoint[] = [
  { dataset: "Cross-Validation", metric: 0.88 },
  { dataset: "Training", metric: 0.92 },
  { dataset: "Test", metric: 0.85 },
  { dataset: "External Test", metric: 0.83 }
]

function validateData(data: any[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { isValid: false, error: "Input must be an array" }
  }
  
  if (data.length < 2) {
    return { isValid: false, error: "At least 2 datasets are required" }
  }

  for (const item of data) {
    if (!item.dataset || typeof item.dataset !== 'string' || item.dataset.trim() === '') {
      return { isValid: false, error: "Each item must have a non-empty dataset name" }
    }
    
    if (typeof item.metric !== 'number' || item.metric < 0 || item.metric > 1) {
      return { isValid: false, error: "Metric must be a number between 0 and 1" }
    }
  }

  return { isValid: true }
}

function App() {
  const [data, setData] = useState<DataPoint[]>(sampleData)
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [inputData, setInputData] = useState('')
  const [error, setError] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const createVisualization = () => {
    if (!svgRef.current) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 100, left: 80 }
    const width = 800 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.dataset))
      .padding(0.1)

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 1])

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dy', '1em')
      .attr('dx', '-1em')
      .style('font-size', '12px')

    svg.append('g')
      .call(d3.axisLeft(y))

    // Add axis labels
    svg.append('text')
      .attr('transform', `translate(${width/2},${height + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .text('Dataset')

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 15)
      .attr('x', 0 - height/2)
      .attr('dy', '1em')
      .attr('class', 'text-sm')
      .style('text-anchor', 'middle')
      .text('Performance Metric')

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.dataset)!)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.metric))
      .attr('height', d => height - y(d.metric))
      .attr('fill', d => d.dataset === selectedDataset ? '#2563eb' : '#93c5fd')
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`Dataset: ${d.dataset}<br/>Metric: ${d.metric.toFixed(3)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden')
      })
      .on('click', (_, d) => {
        setSelectedDataset(prev => prev === d.dataset ? null : d.dataset)
      })
  }

  useEffect(() => {
    createVisualization()
    return () => {
      // Clean up tooltip on unmount
      d3.selectAll('.tooltip').remove()
    }
  }, [data, selectedDataset])

  const handleDataInput = () => {
    try {
      const parsedData = JSON.parse(inputData)
      const validation = validateData(parsedData)
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid data format')
        return
      }

      setData(parsedData)
      setError(null)
      setInputData('')
    } catch (e) {
      setError('Invalid JSON format')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dataset Variations Performance</h1>
      
      <div className="grid gap-4">
        <Card className="p-4">
          <div className="w-full overflow-x-auto mb-4">
            <div className="min-w-[800px]">
              <svg ref={svgRef} className="w-full"></svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Input Custom Data</h2>
          <div className="space-y-2">
            <Textarea
              placeholder="Paste your JSON data here..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleDataInput}>Update Chart</Button>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
