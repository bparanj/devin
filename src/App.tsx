import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { sampleLossData } from './data/loss-data';
import { PlusCircle, X, Upload } from 'lucide-react';
import { DataPoint } from './types';

interface Annotation {
  epoch: number;
  text: string;
}

const validateData = (data: any[]): DataPoint[] | null => {
  if (!Array.isArray(data) || data.length < 5) {
    return null;
  }

  return data.every(point => 
    typeof point === 'object' &&
    'epoch' in point &&
    'run' in point &&
    'loss' in point &&
    typeof point.epoch === 'number' &&
    typeof point.run === 'string' &&
    typeof point.loss === 'number'
  ) ? data : null;
};

function App() {
  const [rawData, setRawData] = useState<DataPoint[]>(sampleLossData);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Group data by run parameter
  const groupedData = rawData.reduce((acc, point) => {
    if (!acc[point.run]) {
      acc[point.run] = [];
    }
    acc[point.run].push(point);
    return acc;
  }, {} as Record<string, DataPoint[]>);

  // Transform data for chart - create one series per run
  const chartData = Array.from(new Set(rawData.map(d => d.epoch))).map(epoch => {
    const point: Record<string, any> = { epoch };
    Object.entries(groupedData).forEach(([run, points]) => {
      const matchingPoint = points.find(p => p.epoch === epoch);
      point[run] = matchingPoint?.loss;
    });
    return point;
  });

  // Define colors for different runs
  const COLOR_ARRAY = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#eab308'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const validatedData = validateData(data);

        if (validatedData) {
          setRawData(validatedData);
          setError(null);
          setAnnotations([]);
        } else {
          setError('Invalid data format. Please provide an array of at least 5 points with epoch, run, and loss values.');
        }
      } catch (err) {
        setError('Failed to parse JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload) {
      const epoch = data.activePayload[0].payload.epoch;
      setSelectedEpoch(epoch);
    }
  };

  const addAnnotation = () => {
    if (selectedEpoch && annotationText) {
      setAnnotations([...annotations, { epoch: selectedEpoch, text: annotationText }]);
      setAnnotationText('');
      setSelectedEpoch(null);
    }
  };

  const removeAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Loss Over Time</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Upload className="w-5 h-5" />
            Upload Data
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" className="text-gray-200" />
            <XAxis 
              dataKey="epoch" 
              label={{ value: 'Epoch', position: 'bottom', offset: 0 }}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              label={{ 
                value: 'Loss', 
                angle: -90, 
                position: 'left', 
                offset: 0,
                style: { textAnchor: 'middle' }
              }}
              tickFormatter={(value) => value.toFixed(4)}
              tickLine={true}
              axisLine={true}
              allowDecimals={true}
              scale="auto"
            />
            <Tooltip 
              formatter={(value: number, name: string) => [value.toFixed(4), name]}
              labelFormatter={(label) => `Epoch ${label}`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const [lr, batch] = value.split(',');
                return `${lr}, ${batch}`;
              }}
            />
            {Object.entries(groupedData).map(([run], idx) => (
              <Line
                key={run}
                type="monotone"
                dataKey={run}
                name={run}
                stroke={COLOR_ARRAY[idx % COLOR_ARRAY.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: COLOR_ARRAY[idx % COLOR_ARRAY.length] }}
                activeDot={{ r: 6, fill: COLOR_ARRAY[idx % COLOR_ARRAY.length] }}
              />
            ))}
            {annotations.map((annotation, index) => (
              <ReferenceLine
                key={index}
                x={annotation.epoch}
                stroke="#dc2626"
                strokeDasharray="3 3"
                label={{ value: annotation.text, position: 'top' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {selectedEpoch && (
          <div className="mt-4 flex items-center gap-4">
            <input
              type="text"
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Add annotation for epoch..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addAnnotation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-5 h-5" />
              Add
            </button>
          </div>
        )}

        {annotations.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Annotations</h2>
            <div className="space-y-2">
              {annotations.map((annotation, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span>Epoch {annotation.epoch}: {annotation.text}</span>
                  <button
                    onClick={() => removeAnnotation(index)}
                    className="text-gray-500 hover:text-red-600 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
