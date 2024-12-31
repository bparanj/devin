import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Upload } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import './App.css'

interface DataPoint {
  epoch: number
  training: number
  validation: number
}

const sampleData: DataPoint[] = [
  { epoch: 1, training: 1.00, validation: 1.10 },
  { epoch: 2, training: 0.90, validation: 1.05 },
  { epoch: 3, training: 0.80, validation: 0.95 },
  { epoch: 4, training: 0.70, validation: 0.88 },
  { epoch: 5, training: 0.65, validation: 0.85 },
  { epoch: 6, training: 0.58, validation: 0.86 },
  { epoch: 7, training: 0.52, validation: 0.90 },
  { epoch: 8, training: 0.50, validation: 0.92 },
  { epoch: 9, training: 0.48, validation: 0.95 },
  { epoch: 10, training: 0.45, validation: 1.00 }
]

function App() {
  const [data, setData] = useState<DataPoint[]>(sampleData)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          setData(jsonData)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Set up dimensions
    const margin = { top: 20, right: 150, bottom: 50, left: 70 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([1, d3.max(data, d => d.epoch) || 10])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.training, d.validation)) || 1])
      .range([height, 0])

    // Create lines
    const trainingLine = d3.line<DataPoint>()
      .x(d => xScale(d.epoch))
      .y(d => yScale(d.training))

    const validationLine = d3.line<DataPoint>()
      .x(d => xScale(d.epoch))
      .y(d => yScale(d.validation))

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(data.length))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Epoch')

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Loss')

    // Add lines
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)
      .attr('d', trainingLine)
      .attr('class', 'training-line')

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2)
      .attr('d', validationLine)
      .attr('class', 'validation-line')

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 10}, 0)`)

    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 6)
      .style('fill', '#2563eb')

    legend.append('text')
      .attr('x', 10)
      .attr('y', 4)
      .text('Training')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle')

    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 25)
      .attr('r', 6)
      .style('fill', '#dc2626')

    legend.append('text')
      .attr('x', 10)
      .attr('y', 29)
      .text('Validation')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle')

    // Add tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .attr('class', 'tooltip')

    // Add hover effects and tooltip
    const focus = svg.append('g')
      .style('display', 'none')

    focus.append('circle')
      .attr('class', 'training-point')
      .attr('r', 5)
      .style('fill', '#2563eb')

    focus.append('circle')
      .attr('class', 'validation-point')
      .attr('r', 5)
      .style('fill', '#dc2626')

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        focus.style('display', null)
        tooltip.style('opacity', 1)
      })
      .on('mouseout', () => {
        focus.style('display', 'none')
        tooltip.style('opacity', 0)
      })
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event)
        const x0 = xScale.invert(mouseX)
        const i = d3.bisector<DataPoint, number>(d => d.epoch).left(data, x0)
        const d = data[i]

        if (d) {
          focus.select('.training-point')
            .attr('cx', xScale(d.epoch))
            .attr('cy', yScale(d.training))

          focus.select('.validation-point')
            .attr('cx', xScale(d.epoch))
            .attr('cy', yScale(d.validation))

          tooltip
            .html(`Epoch: ${d.epoch}<br/>Training: ${d.training.toFixed(3)}<br/>Validation: ${d.validation.toFixed(3)}`)
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`)
        }
      })

  }, [data])

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Training vs. Validation Metrics</h1>
        <div className="mb-4">
          <Button asChild className="gap-2">
            <label>
              <Upload className="w-4 h-4" />
              Upload JSON Data
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
        <div className="relative">
          <svg ref={svgRef}></svg>
          <div
            ref={tooltipRef}
            className="absolute bg-white p-2 rounded shadow-lg border pointer-events-none"
            style={{ opacity: 0 }}
          ></div>
        </div>
      </Card>
    </div>
  )
}

export default App
