import { useState, useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import './App.css'
import sampleData from '../public/sample-data.json'

interface DataPoint {
  id: string
  x: number
  y: number
  z?: number
  label?: string
}

function App() {
  const initialLabels = Array.from(new Set(sampleData.map((point: DataPoint) => point.label)))
    .filter((label): label is string => !!label)
  
  const [data, setData] = useState<DataPoint[]>(sampleData)
  const [error, setError] = useState<string>('')
  const [uniqueLabels, setUniqueLabels] = useState<string[]>(initialLabels)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateData = (jsonData: any[]): { isValid: boolean; error?: string } => {
    if (!Array.isArray(jsonData)) {
      return { isValid: false, error: 'Data must be an array' }
    }

    if (jsonData.length < 5) {
      return { isValid: false, error: 'At least 5 data points are required' }
    }

    for (const point of jsonData) {
      if (!point.id || typeof point.id !== 'string') {
        return { isValid: false, error: 'Each point must have a string ID' }
      }
      if (typeof point.x !== 'number' || typeof point.y !== 'number') {
        return { isValid: false, error: 'X and Y coordinates must be numbers' }
      }
    }

    return { isValid: true }
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        const validation = validateData(jsonData)
        
        if (!validation.isValid) {
          setError(validation.error || 'Invalid data format')
          return
        }

        const labels = Array.from(new Set(jsonData.map((point: DataPoint) => point.label)))
          .filter((label): label is string => !!label)
        
        setData(jsonData)
        setUniqueLabels(labels)
        setError('')
      } catch (err) {
        setError('Failed to parse JSON file')
      }
    }
    reader.readAsText(file)
  }, [])

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe',
    '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-left">Dimensionality Reduction Visualization</h1>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Data
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white p-4 rounded-lg">
            <ScatterChart
              width={800}
              height={600}
              margin={{ top: 20, right: 80, bottom: 60, left: 160 }}
            >
              <XAxis 
                type="number" 
                dataKey="x" 
                name="X" 
                label={{ value: 'X', position: 'bottom', dy: 35 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Y" 
                label={{ value: 'Y', angle: -90, position: 'insideLeft', dx: -80, dy: 0 }}
              />
              {uniqueLabels.map((label, index) => (
                <Scatter
                  key={label}
                  name={label}
                  data={data.filter(point => point.label === label)}
                  fill={COLORS[index % COLORS.length]}
                >
                </Scatter>
              ))}
              {data.length > 0 && uniqueLabels.length === 0 && (
                <Scatter
                  name="All Points"
                  data={data}
                  fill="#8884d8"
                />
              )}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0].payload as DataPoint
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p>ID: {point.id}</p>
                        <p>X: {point.x.toFixed(2)}</p>
                        <p>Y: {point.y.toFixed(2)}</p>
                        {point.label && <p>Label: {point.label}</p>}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend 
                wrapperStyle={{ position: 'relative', right: -10, top: -20 }}
                verticalAlign="top"
                align="right"
              />
            </ScatterChart>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-left">Expected Data Format</h2>
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-left">
{`[
  {
    "id": "sample1",
    "x": 2.3,
    "y": -1.1,
    "label": "Class A"
  },
  // ... more points
]`}
          </pre>
          <ul className="mt-4 list-disc list-inside text-gray-600 text-left">
            <li>Minimum 5 data points required</li>
            <li>Each point must have an ID and numeric X, Y coordinates</li>
            <li>Labels are optional but enable color coding</li>
          </ul>
          <div className="mt-4">
            <Button
              onClick={() => {
                const element = document.createElement('a')
                element.href = '/example-data.json'
                element.download = 'example-data.json'
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
              className="flex items-center gap-2"
            >
              Download Sample Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
