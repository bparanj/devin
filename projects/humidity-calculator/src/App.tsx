import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplets, Box } from "lucide-react"

function App() {
  const [indoorHumidity, setIndoorHumidity] = useState('')
  const [outdoorHumidity, setOutdoorHumidity] = useState('')
  const [indoorVolume, setIndoorVolume] = useState('')
  const [outdoorVolume, setOutdoorVolume] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const calculateHumidityChange = () => {
    const indoor = {
      humidity: parseFloat(indoorHumidity),
      volume: parseFloat(indoorVolume)
    }
    const outdoor = {
      humidity: parseFloat(outdoorHumidity),
      volume: parseFloat(outdoorVolume)
    }

    if (isNaN(indoor.humidity) || isNaN(outdoor.humidity) || 
        isNaN(indoor.volume) || isNaN(outdoor.volume)) {
      setResult('Please enter valid numbers for all fields')
      return
    }

    // Calculate humidity change using mixing formula
    const totalVolume = indoor.volume + outdoor.volume
    const deltaHumidity = (
      (outdoor.humidity * (outdoor.volume / totalVolume) +
       indoor.humidity * (indoor.volume / totalVolume)) -
      indoor.humidity
    )
    
    setResult(deltaHumidity > 0 
      ? `Humidity will RISE by approximately ${deltaHumidity.toFixed(1)}% if windows and doors are opened`
      : `Humidity will DROP by approximately ${Math.abs(deltaHumidity).toFixed(1)}% if windows and doors are opened`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Humidity Change Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="text-blue-500" />
                Humidity
              </h2>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Indoor Humidity (%)"
                  value={indoorHumidity}
                  onChange={(e) => setIndoorHumidity(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Outdoor Humidity (%)"
                  value={outdoorHumidity}
                  onChange={(e) => setOutdoorHumidity(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Box className="text-green-500" />
                Air Volume (cubic feet)
              </h2>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Indoor Air Volume"
                  value={indoorVolume}
                  onChange={(e) => setIndoorVolume(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Outdoor Exchange Volume"
                  value={outdoorVolume}
                  onChange={(e) => setOutdoorVolume(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateHumidityChange}
            className="w-full"
          >
            Calculate
          </Button>

          {result && (
            <Alert className={result.includes('RISE') ? 'bg-blue-50' : 'bg-green-50'}>
              <AlertDescription className="text-center font-semibold">
                {result}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
