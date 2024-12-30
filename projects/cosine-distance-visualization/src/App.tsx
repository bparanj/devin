import { useState } from 'react'
import Plot from 'react-plotly.js'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card'
import { Label } from './components/ui/label'
import { Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

function calculateCosineDistance(vector1: number[], vector2: number[]): number {
  // Calculate dot product
  const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0)
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val * val, 0))
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val * val, 0))
  
  // Calculate cosine similarity
  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2)
  
  // Convert to distance (1 - similarity)
  return 1 - cosineSimilarity
}

function calculateEuclideanDistance(vector1: number[], vector2: number[]): number {
  return Math.sqrt((vector1[0] - vector2[0]) ** 2 + (vector1[1] - vector2[1]) ** 2)
}

function calculateManhattanDistance(vector1: number[], vector2: number[]): number {
  return Math.abs(vector1[0] - vector2[0]) + Math.abs(vector1[1] - vector2[1])
}

function App() {
  const [vector1, setVector1] = useState<string>('2,4')
  const [vector2, setVector2] = useState<string>('4,2')
  const [distance, setDistance] = useState<number | null>(null)
  const [euclideanDist, setEuclideanDist] = useState<number | null>(null)
  const [manhattanDist, setManhattanDist] = useState<number | null>(null)
  const [annotations, setAnnotations] = useState<any[]>([])

  const calculateAngle = (v1: number[], v2: number[]): number => {
    const dotProduct = v1.reduce((acc, val, i) => acc + val * v2[i], 0)
    const magnitude1 = Math.sqrt(v1.reduce((acc, val) => acc + val * val, 0))
    const magnitude2 = Math.sqrt(v2.reduce((acc, val) => acc + val * val, 0))
    const cosTheta = dotProduct / (magnitude1 * magnitude2)
    return Math.acos(cosTheta) * (180 / Math.PI) // Convert to degrees
  }

  const handleCalculate = () => {
    try {
      const v1 = vector1.split(',').map(Number)
      const v2 = vector2.split(',').map(Number)
      
      if (v1.length !== v2.length) {
        throw new Error('Vectors must have the same length')
      }
      
      const cosineDistance = calculateCosineDistance(v1, v2)
      const angle = calculateAngle(v1, v2)
      const euclidean = calculateEuclideanDistance(v1, v2)
      const manhattan = calculateManhattanDistance(v1, v2)
      setDistance(cosineDistance)
      setEuclideanDist(euclidean)
      setManhattanDist(manhattan)

      // Add angle annotation
      const midX = (v1[0] + v2[0]) / 4
      const midY = (v1[1] + v2[1]) / 4
      
      const annotations = [
        {
          x: midX,
          y: midY,
          text: `θ = ${angle.toFixed(1)}°`,
          showarrow: false,
          font: { size: 14 }
        }
      ]
      
      setAnnotations(annotations)
    } catch (error) {
      console.error('Error calculating distance:', error)
      setDistance(null)
      setAnnotations([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Visualizer
              <Info className="w-5 h-5 text-gray-400" />
            </CardTitle>
            <CardDescription>
              Enter two vectors (comma-separated numbers) to calculate and visualize their cosine distance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vector1">Vector 1</Label>
                <Input
                  id="vector1"
                  value={vector1}
                  onChange={(e) => setVector1(e.target.value)}
                  placeholder="e.g., 1,0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vector2">Vector 2</Label>
                <Input
                  id="vector2"
                  value={vector2}
                  onChange={(e) => setVector2(e.target.value)}
                  placeholder="e.g., 0,1"
                />
              </div>
            </div>
            
            <Button onClick={handleCalculate} className="w-full">
              Visualize
            </Button>

            {distance !== null && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div></div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="distance-metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="distance-metrics">Distance Comparison Metrics</TabsTrigger>
                    <TabsTrigger value="cosine-similarity">Cosine Similarity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="distance-metrics" className="bg-white p-4 rounded-lg shadow-sm">
                    <Plot
                      data={[
                        {
                          x: [0, Number(vector1.split(',')[0])],
                          y: [0, Number(vector1.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines+markers',
                          line: { color: 'blue', width: 3 },
                          name: 'Vector A',
                          hoverinfo: 'name'
                        },
                        {
                          x: [0, Number(vector2.split(',')[0])],
                          y: [0, Number(vector2.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines+markers',
                          line: { color: 'red', width: 3 },
                          name: 'Vector B',
                          hoverinfo: 'name'
                        },
                        {
                          x: [Number(vector1.split(',')[0]), Number(vector2.split(',')[0])],
                          y: [Number(vector1.split(',')[1]), Number(vector2.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines',
                          line: { color: '#00FF00', width: 2, dash: 'dot' },
                          name: 'Euclidean Distance',
                          hoverinfo: 'name'
                        },
                        {
                          x: [Number(vector1.split(',')[0]), Number(vector2.split(',')[0])],
                          y: [Number(vector1.split(',')[1]), Number(vector1.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines',
                          line: { color: '#800080', width: 2, dash: 'dash' },
                          name: 'Manhattan Distance (H)',
                          hoverinfo: 'name'
                        },
                        {
                          x: [Number(vector2.split(',')[0]), Number(vector2.split(',')[0])],
                          y: [Number(vector1.split(',')[1]), Number(vector2.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines',
                          line: { color: '#800080', width: 2, dash: 'dash' },
                          name: 'Manhattan Distance (V)',
                          hoverinfo: 'name'
                        }
                      ]}
                      layout={{
                        width: 600,
                        height: 400,
                        title: 'Distance Comparison Metrics',
                        showlegend: true,
                        xaxis: {
                          zeroline: true,
                          zerolinecolor: '#969696',
                          gridcolor: '#bdbdbd',
                          range: [-5, 5]
                        },
                        yaxis: {
                          zeroline: true,
                          zerolinecolor: '#969696',
                          gridcolor: '#bdbdbd',
                          range: [-5, 5]
                        },
                        annotations: [
                          ...annotations,
                          {
                            ax: 0,
                            ay: 0,
                            axref: 'x',
                            ayref: 'y',
                            x: Number(vector1.split(',')[0]),
                            y: Number(vector1.split(',')[1]),
                            xref: 'x',
                            yref: 'y',
                            showarrow: true,
                            arrowhead: 3,
                            arrowsize: 1.5,
                            arrowwidth: 2,
                            arrowcolor: 'blue'
                          },
                          {
                            ax: 0,
                            ay: 0,
                            axref: 'x',
                            ayref: 'y',
                            x: Number(vector2.split(',')[0]),
                            y: Number(vector2.split(',')[1]),
                            xref: 'x',
                            yref: 'y',
                            showarrow: true,
                            arrowhead: 3,
                            arrowsize: 1.5,
                            arrowwidth: 2,
                            arrowcolor: 'red'
                          }
                        ]
                      }}
                      config={{ responsive: true }}
                    />
                    <div className="mt-6 space-y-2">
                      <p className="text-center text-2xl font-bold">
                        Cosine Distance: {distance.toFixed(4)}
                      </p>
                      <p className="text-center text-2xl font-bold mt-4">
                        Euclidean Distance: {euclideanDist?.toFixed(4)}
                      </p>
                      <p className="text-center text-2xl font-bold mt-4">
                        Manhattan Distance: {manhattanDist?.toFixed(4)}
                      </p>
                      <div className="text-center text-sm text-gray-600 mt-6">
                        <p>1. Dot Product = {vector1.split(',').map(Number).reduce((acc, val, i) => acc + val * vector2.split(',').map(Number)[i], 0)}</p>
                        <p>2. ||Vector A|| = {Math.sqrt(vector1.split(',').map(Number).reduce((acc, val) => acc + val * val, 0)).toFixed(4)}</p>
                        <p>   ||Vector B|| = {Math.sqrt(vector2.split(',').map(Number).reduce((acc, val) => acc + val * val, 0)).toFixed(4)}</p>
                        <p>3. Cosine Similarity = {(1 - distance).toFixed(4)}</p>
                        <p>4. Cosine Distance = 1 - {(1 - distance).toFixed(4)} = {distance.toFixed(4)}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cosine-similarity" className="bg-white p-4 rounded-lg shadow-sm">
                    <Plot
                      data={[
                        {
                          x: [0, Number(vector1.split(',')[0])],
                          y: [0, Number(vector1.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines+markers',
                          line: { color: 'steelblue', width: 3 },
                          name: 'Vector A',
                          hoverinfo: 'text',
                          text: [`Vector A (${vector1})`]
                        },
                        {
                          x: [0, Number(vector2.split(',')[0])],
                          y: [0, Number(vector2.split(',')[1])],
                          type: 'scatter',
                          mode: 'lines+markers',
                          line: { color: 'tomato', width: 3 },
                          name: 'Vector B',
                          hoverinfo: 'text',
                          text: [`Vector B (${vector2})`]
                        }
                      ]}
                      layout={{
                        width: 600,
                        height: 400,
                        title: 'Cosine Similarity Visualization',
                        showlegend: true,
                        xaxis: {
                          zeroline: true,
                          zerolinecolor: '#969696',
                          gridcolor: '#bdbdbd',
                          range: [-5, 5],
                          title: 'X'
                        },
                        yaxis: {
                          zeroline: true,
                          zerolinecolor: '#969696',
                          gridcolor: '#bdbdbd',
                          range: [-5, 5],
                          title: 'Y'
                        },
                        annotations: [
                          {
                            x: (Number(vector1.split(',')[0]) + Number(vector2.split(',')[0])) / 4,
                            y: (Number(vector1.split(',')[1]) + Number(vector2.split(',')[1])) / 4,
                            text: `θ = ${calculateAngle(
                              vector1.split(',').map(Number),
                              vector2.split(',').map(Number)
                            ).toFixed(1)}°`,
                            showarrow: false,
                            font: { size: 16, color: '#333' }
                          }
                        ]
                      }}
                      config={{ responsive: true }}
                    />
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        Cosine Similarity = {(1 - distance).toFixed(4)}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
