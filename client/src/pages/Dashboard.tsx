import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Home, Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "cyan" | "red";
}

function AnimatedCounter({ value, label, icon, color }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(value / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  const borderColor = color === "cyan" ? "border-[#00d9ff]/30" : "border-[#ff006e]/30";
  const textColor = color === "cyan" ? "text-[#00d9ff]" : "text-[#ff006e]";
  const glowClass = color === "cyan" ? "glow-cyan" : "glow-red";

  return (
    <Card className={`border ${borderColor} bg-card/50 backdrop-blur-sm ${glowClass}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <div className={textColor}>{icon}</div>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor}`}>{displayValue.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const dashboardQuery = trpc.dashboard.overview.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const overview = dashboardQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-cyan">Dashboard</h1>
              <p className="text-gray-400 mt-1">Real-time disaster intelligence overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome, {user?.name || "User"}</p>
              <p className="text-xs text-gray-600 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnimatedCounter
            value={overview?.events.activeCount || 0}
            label="Active Disasters"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
          />
          <AnimatedCounter
            value={overview?.events.criticalCount || 0}
            label="Critical Events"
            icon={<TrendingUp className="w-5 h-5" />}
            color="red"
          />
          <AnimatedCounter
            value={overview?.events.totalAffected || 0}
            label="Affected Population"
            icon={<Users className="w-5 h-5" />}
            color="cyan"
          />
          <AnimatedCounter
            value={overview?.shelters.openCount || 0}
            label="Active Shelters"
            icon={<Home className="w-5 h-5" />}
            color="cyan"
          />
        </div>

        {/* Resource Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Shelter Capacity */}
          <Card className="border border-[#00d9ff]/30 bg-card/50 backdrop-blur-sm glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-[#00d9ff]" />
                Shelter Capacity
              </CardTitle>
              <CardDescription>Current occupancy vs total capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Occupancy</span>
                    <span className="text-sm font-semibold text-[#00d9ff]">
                      {overview?.shelters.totalOccupancy || 0} / {overview?.shelters.totalCapacity || 0}
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00d9ff] to-[#00f5ff] h-full transition-all duration-500"
                      style={{
                        width: `${
                          overview?.shelters.totalCapacity
                            ? (overview.shelters.totalOccupancy / overview.shelters.totalCapacity) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <p className="text-sm text-gray-400">
                    {overview?.shelters.openCount || 0} shelters currently open
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Status */}
          <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff006e]" />
                Resource Utilization
              </CardTitle>
              <CardDescription>Deployed vs available resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deployed</p>
                    <p className="text-2xl font-bold text-[#ff006e]">
                      {overview?.resources.deployedCount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Available</p>
                    <p className="text-2xl font-bold text-[#00d9ff]">
                      {overview?.resources.availableCount || 0}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <p className="text-sm text-gray-400">
                    Total: {overview?.resources.totalResources || 0} resources
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Severity Index */}
        <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ff006e]" />
              Severity Index
            </CardTitle>
            <CardDescription>Overall disaster response priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#ff006e] mb-2">
                  {Math.round(
                    ((overview?.events.criticalCount || 0) / Math.max(overview?.events.activeCount || 1, 1)) * 100
                  )}%
                </div>
                <p className="text-gray-400">Critical severity ratio</p>
              </div>
              <div className="pt-4 border-t border-border/30 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Low</p>
                  <p className="text-lg font-semibold text-green-400">0</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medium</p>
                  <p className="text-lg font-semibold text-yellow-400">0</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">High+</p>
                  <p className="text-lg font-semibold text-[#ff006e]">
                    {overview?.events.criticalCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
