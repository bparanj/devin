import { useState, useMemo } from 'react'
import { Textarea } from './components/ui/textarea'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Tooltip } from './components/ui/tooltip'
import { TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Cell, ResponsiveContainer } from 'recharts'
import './App.css'

interface CorrelationData {
  features: string[];
  matrix: number[][];
}

const sampleData: CorrelationData = {
  features: ["A", "B", "C"],
  matrix: [
    [1.00, -0.90, 0.10],
    [-0.90, 1.00, -0.50],
    [0.10, -0.50, 1.00]
  ]
};

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  xFeature: string;
  yFeature: string;
}

const validateData = (data: any): data is CorrelationData => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.features) || !Array.isArray(data.matrix)) return false;
  if (data.features.length < 2) return false;
  if (data.matrix.length !== data.features.length) return false;
  
  for (const row of data.matrix) {
    if (!Array.isArray(row) || row.length !== data.features.length) return false;
    for (const value of row) {
      if (typeof value !== 'number' || value < -1 || value > 1) return false;
    }
  }
  
  return true;
};

const getColor = (value: number, colorScale: 'blue-red' | 'green-red'): string => {
  const clampedValue = Math.max(-1, Math.min(1, value));
  console.log(`Calculating color for value: ${value}, scale: ${colorScale}`);
  
  if (colorScale === 'blue-red') {
    const intensity = Math.abs(clampedValue);
    if (clampedValue >= 0) {
      const color = `rgb(0, 0, ${Math.round(255 * intensity)})`;
      console.log(`Positive correlation (${value}) -> Blue: ${color}`);
      return color;
    } else {
      const color = `rgb(${Math.round(255 * intensity)}, 0, 0)`;
      console.log(`Negative correlation (${value}) -> Red: ${color}`);
      return color;
    }
  } else {
    const intensity = Math.abs(clampedValue);
    if (clampedValue >= 0) {
      const color = `rgb(0, ${Math.round(255 * intensity)}, 0)`;
      console.log(`Positive correlation (${value}) -> Green: ${color}`);
      return color;
    } else {
      const color = `rgb(${Math.round(255 * intensity)}, 0, 0)`;
      console.log(`Negative correlation (${value}) -> Red: ${color}`);
      return color;
    }
  }
};

interface CustomCellProps {
  cx: number;
  cy: number;
  payload: HeatmapPoint;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  colorScale: 'blue-red' | 'green-red';
}

const CustomCell = (props: CustomCellProps) => {
  const { cx, cy, payload, style, onMouseEnter, onMouseLeave } = props;
  const size = 50; // Fixed size for the squares
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill={getColor(payload.value, props.colorScale)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      stroke="rgba(0,0,0,0.1)"
      strokeWidth={1}
    />
  );
};

function App() {
  const [data, setData] = useState<CorrelationData>(sampleData);
  const [error, setError] = useState<string>('');
  const [colorScale, setColorScale] = useState<'blue-red' | 'green-red'>('blue-red');
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  const handleDataInput = (input: string) => {
    try {
      const parsedData = JSON.parse(input);
      if (validateData(parsedData)) {
        setData(parsedData);
        setError('');
      } else {
        const errors: string[] = [];
        if (parsedData.features?.length < 2) errors.push('At least 2 features are required.');
        if (!Array.isArray(parsedData.matrix)) errors.push('Matrix must be a 2D array.');
        if (parsedData.matrix?.length !== parsedData.features?.length) errors.push('Matrix dimensions must match feature count.');
        if (parsedData.matrix?.some((row: number[]) => !Array.isArray(row) || row.length !== parsedData.features?.length)) 
          errors.push('Matrix must be square.');
        if (parsedData.matrix?.some((row: number[]) => row?.some((val: number) => typeof val !== 'number' || val < -1 || val > 1)))
          errors.push('Correlation values must be numbers between -1 and 1.');
        setError(errors.join(' '));
      }
    } catch (e) {
      setError('Invalid JSON format.');
    }
  };

  const heatmapData = useMemo(() => {
    const points: HeatmapPoint[] = [];
    data.matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        points.push({
          x: j,
          y: i,
          value,
          xFeature: data.features[j],
          yFeature: data.features[i],
        });
      });
    });
    return points;
  }, [data]);

  const isHighlighted = (x: number, y: number) => {
    if (!hoveredCell) return false;
    const [hx, hy] = hoveredCell;
    return x === hx || y === hy;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Correlation Matrix Visualization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                variant={colorScale === 'blue-red' ? 'default' : 'outline'}
                onClick={() => {
                  console.log('Switching to blue-red scale');
                  setColorScale('blue-red');
                }}
              >
                Blue-Red Scale
              </Button>
              <Button
                variant={colorScale === 'green-red' ? 'default' : 'outline'}
                onClick={() => {
                  console.log('Switching to green-red scale');
                  setColorScale('green-red');
                }}
              >
                Green-Red Scale
              </Button>
            </div>
            <div className="w-full aspect-square bg-slate-100 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
                >
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[-0.5, data.features.length - 0.5]}
                    ticks={[...Array(data.features.length)].map((_, i) => i)}
                    tickFormatter={(value) => data.features[value] || ''}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[-0.5, data.features.length - 0.5]}
                    ticks={[...Array(data.features.length)].map((_, i) => i)}
                    tickFormatter={(value) => data.features[value] || ''}
                  />
                  <ZAxis type="number" range={[100, 100]} />
                  <Scatter 
                    data={heatmapData}
                    shape={(props: any) => <CustomCell {...props} colorScale={colorScale} />}
                  >
                    {heatmapData.map((point, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Cell
                              key={index}
                              fill={getColor(point.value, colorScale)}
                              style={{
                                opacity: isHighlighted(point.x, point.y) ? 1 : hoveredCell ? 0.5 : 0.9,
                                cursor: 'pointer'
                              }}
                              onMouseEnter={() => setHoveredCell([point.x, point.y])}
                              onMouseLeave={() => setHoveredCell(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>{point.xFeature} × {point.yFeature}</div>
                              <div className="font-bold">Correlation: {point.value.toFixed(2)}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Data Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono"
              placeholder="Paste your JSON data here..."
              rows={10}
              onChange={(e) => handleDataInput(e.target.value)}
            />
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
