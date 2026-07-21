import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock weather data for different disaster zones
const weatherData = [
  {
    time: "00:00",
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
  },
  {
    time: "04:00",
    temp: 25,
    humidity: 72,
    windSpeed: 18,
    rainfall: 2,
  },
  {
    time: "08:00",
    temp: 32,
    humidity: 58,
    windSpeed: 25,
    rainfall: 5,
  },
  {
    time: "12:00",
    temp: 38,
    humidity: 45,
    windSpeed: 35,
    rainfall: 8,
  },
  {
    time: "16:00",
    temp: 36,
    humidity: 50,
    windSpeed: 32,
    rainfall: 12,
  },
  {
    time: "20:00",
    temp: 30,
    humidity: 60,
    windSpeed: 20,
    rainfall: 6,
  },
];

const zoneWeather = [
  {
    zone: "San Francisco",
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
  },
  {
    zone: "Los Angeles",
    temp: 38,
    humidity: 45,
    windSpeed: 35,
    rainfall: 8,
  },
  {
    zone: "Houston",
    temp: 32,
    humidity: 72,
    windSpeed: 18,
    rainfall: 15,
  },
  {
    zone: "Miami",
    temp: 35,
    humidity: 80,
    windSpeed: 28,
    rainfall: 20,
  },
];

export default function WeatherIntel() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access weather intelligence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-cyan">Weather Intelligence</h1>
          <p className="text-gray-400 mt-1">Real-time weather conditions across disaster zones</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Zone Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {zoneWeather.map((zone) => (
            <Card key={zone.zone} className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{zone.zone}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#ff006e]" />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-sm font-semibold">{zone.temp}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#00d9ff]" />
                  <div>
                    <p className="text-xs text-gray-500">Humidity</p>
                    <p className="text-sm font-semibold">{zone.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#ff006e]" />
                  <div>
                    <p className="text-xs text-gray-500">Wind Speed</p>
                    <p className="text-sm font-semibold">{zone.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#00d9ff]" />
                  <div>
                    <p className="text-xs text-gray-500">Rainfall</p>
                    <p className="text-sm font-semibold">{zone.rainfall} mm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature & Humidity Trend */}
          <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
            <CardHeader>
              <CardTitle>Temperature & Humidity Trend</CardTitle>
              <CardDescription>24-hour forecast for primary disaster zone</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" />
                  <XAxis dataKey="time" stroke="#808080" />
                  <YAxis stroke="#808080" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1429",
                      border: "1px solid #1a1f3a",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#ff006e"
                    strokeWidth={2}
                    name="Temperature (°C)"
                    dot={{ fill: "#ff006e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#00d9ff"
                    strokeWidth={2}
                    name="Humidity (%)"
                    dot={{ fill: "#00d9ff", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Wind Speed & Rainfall */}
          <Card className="border border-[#ff006e]/30 bg-card/50 glow-red">
            <CardHeader>
              <CardTitle>Wind Speed & Rainfall</CardTitle>
              <CardDescription>24-hour forecast for primary disaster zone</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" />
                  <XAxis dataKey="time" stroke="#808080" />
                  <YAxis stroke="#808080" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1429",
                      border: "1px solid #1a1f3a",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="windSpeed" fill="#ff006e" name="Wind Speed (km/h)" />
                  <Bar dataKey="rainfall" fill="#00d9ff" name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weather Alerts */}
        <Card className="border border-[#ff006e]/30 bg-card/50 glow-red mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#ff006e]" />
              Active Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#ff006e]/10 border border-[#ff006e]/30">
                <p className="font-semibold text-[#ff006e]">⚠️ High Wind Warning</p>
                <p className="text-sm text-gray-400 mt-1">Los Angeles area: Wind speeds exceeding 35 km/h expected</p>
              </div>
              <div className="p-3 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30">
                <p className="font-semibold text-[#00d9ff]">💧 Heavy Rainfall Alert</p>
                <p className="text-sm text-gray-400 mt-1">Houston area: 20mm+ rainfall expected in next 12 hours</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <p className="font-semibold text-orange-400">🌡️ Extreme Heat Advisory</p>
                <p className="text-sm text-gray-400 mt-1">Miami area: Temperature reaching 38°C with high humidity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
