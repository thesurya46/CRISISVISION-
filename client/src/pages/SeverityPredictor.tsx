import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

const DISASTER_TYPES = [
  "Earthquake",
  "Hurricane",
  "Tornado",
  "Flood",
  "Wildfire",
  "Tsunami",
  "Landslide",
  "Volcanic Eruption",
];

const SEVERITY_COLORS = {
  low: { bg: "bg-green-500/20", text: "text-green-400", label: "Low Risk" },
  medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Medium Risk" },
  high: { bg: "bg-orange-500/20", text: "text-orange-400", label: "High Risk" },
  critical: { bg: "bg-[#ff006e]/20", text: "text-[#ff006e]", label: "Critical Risk" },
};

interface PredictionResult {
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  recommendations: string[];
  affectedPopulation: number;
  responseActions: string[];
}

export default function SeverityPredictor() {
  const { isAuthenticated } = useAuth();
  const [disasterType, setDisasterType] = useState("");
  const [location, setLocation] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [population, setPopulation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock prediction - in production, call tRPC LLM endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const windSpeedNum = parseFloat(windSpeed) || 0;
      const rainfallNum = parseFloat(rainfall) || 0;
      const populationNum = parseInt(population) || 0;

      // Simple severity calculation
      let severity: "low" | "medium" | "high" | "critical" = "low";
      let score = 0;

      if (windSpeedNum > 150 || rainfallNum > 100 || populationNum > 100000) {
        severity = "critical";
        score = 95;
      } else if (windSpeedNum > 100 || rainfallNum > 50 || populationNum > 50000) {
        severity = "high";
        score = 75;
      } else if (windSpeedNum > 50 || rainfallNum > 20 || populationNum > 10000) {
        severity = "medium";
        score = 50;
      } else {
        severity = "low";
        score = 25;
      }

      const recommendations = {
        Earthquake: ["Activate emergency shelters", "Deploy search and rescue teams", "Establish medical triage centers"],
        Hurricane: ["Issue evacuation orders", "Secure critical infrastructure", "Pre-position emergency supplies"],
        Tornado: ["Issue tornado warnings", "Activate community shelters", "Deploy rapid response teams"],
        Flood: ["Evacuate low-lying areas", "Deploy water rescue teams", "Establish evacuation routes"],
        Wildfire: ["Establish evacuation zones", "Deploy firefighting resources", "Activate air support"],
        Tsunami: ["Issue evacuation alerts", "Move populations to high ground", "Activate coastal emergency protocols"],
        Landslide: ["Evacuate at-risk areas", "Deploy geological assessment teams", "Monitor slope stability"],
        "Volcanic Eruption": ["Establish exclusion zones", "Deploy monitoring equipment", "Prepare ash management"],
      };

      const responseActions = [
        "Activate Emergency Operations Center",
        "Notify all relevant agencies and stakeholders",
        "Deploy emergency response teams to affected areas",
        "Establish communication channels with affected populations",
        "Coordinate resource allocation and logistics",
        "Establish medical and shelter facilities",
        "Begin damage assessment and documentation",
      ];

      setPrediction({
        severity,
        score,
        recommendations: recommendations[disasterType as keyof typeof recommendations] || recommendations.Earthquake,
        affectedPopulation: populationNum,
        responseActions,
      });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the severity predictor.</p>
        </div>
      </div>
    );
  }

  const severityInfo = prediction ? SEVERITY_COLORS[prediction.severity] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-cyan">Severity Predictor</h1>
          <p className="text-gray-400 mt-1">AI-powered disaster severity assessment and response recommendations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
              <CardHeader>
                <CardTitle>Disaster Parameters</CardTitle>
                <CardDescription>Enter disaster details for prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePredict} className="space-y-4">
                  {/* Disaster Type */}
                  <div>
                    <Label htmlFor="disaster-type" className="text-gray-300">
                      Disaster Type
                    </Label>
                    <Select value={disasterType} onValueChange={setDisasterType}>
                      <SelectTrigger id="disaster-type" className="border-border/50 bg-card">
                        <SelectValue placeholder="Select disaster type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50">
                        {DISASTER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-gray-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, Region"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-border/50 bg-card text-foreground placeholder:text-gray-600"
                    />
                  </div>

                  {/* Wind Speed */}
                  <div>
                    <Label htmlFor="wind-speed" className="text-gray-300">
                      Wind Speed (km/h)
                    </Label>
                    <Input
                      id="wind-speed"
                      type="number"
                      placeholder="0"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(e.target.value)}
                      className="border-border/50 bg-card text-foreground placeholder:text-gray-600"
                    />
                  </div>

                  {/* Rainfall */}
                  <div>
                    <Label htmlFor="rainfall" className="text-gray-300">
                      Rainfall (mm)
                    </Label>
                    <Input
                      id="rainfall"
                      type="number"
                      placeholder="0"
                      value={rainfall}
                      onChange={(e) => setRainfall(e.target.value)}
                      className="border-border/50 bg-card text-foreground placeholder:text-gray-600"
                    />
                  </div>

                  {/* Population */}
                  <div>
                    <Label htmlFor="population" className="text-gray-300">
                      Affected Population
                    </Label>
                    <Input
                      id="population"
                      type="number"
                      placeholder="0"
                      value={population}
                      onChange={(e) => setPopulation(e.target.value)}
                      className="border-border/50 bg-card text-foreground placeholder:text-gray-600"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !disasterType}
                    className="w-full bg-[#00d9ff] text-[#0a0e27] hover:bg-[#00e5ff] font-semibold"
                  >
                    {isLoading ? "Analyzing..." : "Predict Severity"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {prediction ? (
              <>
                {/* Severity Score */}
                <Card className={`border ${severityInfo?.bg} bg-card/50`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${severityInfo?.text}`} />
                      Severity Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-5xl font-bold ${severityInfo?.text} mb-2`}>
                          {prediction.score}%
                        </div>
                        <p className={`text-lg font-semibold ${severityInfo?.text}`}>
                          {severityInfo?.label}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-border/30">
                        <p className="text-sm text-gray-400 mb-2">
                          <strong>Affected Population:</strong> {prediction.affectedPopulation.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Disaster Type:</strong> {disasterType}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border border-[#ff006e]/30 bg-card/50 glow-red">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#ff006e]" />
                      Immediate Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-[#ff006e] font-bold mt-1">→</span>
                          <span className="text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Response Actions */}
                <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#00d9ff]" />
                      Recommended Response Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {prediction.responseActions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="text-[#00d9ff] font-bold min-w-6">{idx + 1}.</span>
                          <span className="text-gray-300">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border border-border/30 bg-card/50">
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Enter disaster parameters on the left to generate a severity prediction and recommended response actions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
