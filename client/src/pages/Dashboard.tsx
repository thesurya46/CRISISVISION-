import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Users, Home, Zap, TrendingUp, MapPin, Activity } from "lucide-react";
import { useEffect, useState } from "react";

// ── Live data simulation hook ──────────────────────────────────────────────
function useLiveData<T>(initial: T, intervalMs = 5000): T {
  const [data, setData] = useState(initial);
  useEffect(() => {
    const timer = setInterval(() => {
      // Bump values slightly to simulate live updates
      setData((prev: any) => {
        if (typeof prev === "number") return prev + Math.round((Math.random() - 0.3) * 5);
        if (Array.isArray(prev)) return prev;
        if (typeof prev === "object" && prev !== null) {
          const bump = (v: number) => Math.max(0, v + Math.round((Math.random() - 0.3) * 3));
          return {
            ...prev,
            events: prev.events
              ? {
                  ...prev.events,
                  activeCount: bump(prev.events.activeCount),
                  criticalCount: bump(prev.events.criticalCount),
                  totalAffected: bump(prev.events.totalAffected),
                }
              : prev.events,
            shelters: prev.shelters
              ? {
                  ...prev.shelters,
                  openCount: bump(prev.shelters.openCount),
                  totalOccupancy: bump(prev.shelters.totalOccupancy),
                  totalCapacity: prev.shelters.totalCapacity,
                }
              : prev.shelters,
            resources: prev.resources
              ? {
                  ...prev.resources,
                  deployedCount: bump(prev.resources.deployedCount),
                  availableCount: bump(prev.resources.availableCount),
                  totalResources: bump(prev.resources.totalResources),
                }
              : prev.resources,
          };
        }
        return prev;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return data;
}

// ── Animated counter ───────────────────────────────────────────────────────
interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "cyan" | "red";
  isLoading?: boolean;
}

function AnimatedCounter({ value, label, icon, color, isLoading }: AnimatedCounterProps) {
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

  if (isLoading) {
    return (
      <Card className={`border ${borderColor} bg-card/50 backdrop-blur-sm ${glowClass}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24 bg-card" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-20 bg-card" />
        </CardContent>
      </Card>
    );
  }

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

// ── Map placeholder component ──────────────────────────────────────────────
function DisasterMap() {
  // Disaster hot-spot coordinates for demo
  const hotspots = [
    { name: "San Francisco EQ", lat: 37.77, lng: -122.41, severity: "critical", color: "#ff006e" },
    { name: "LA Wildfire", lat: 34.05, lng: -118.24, severity: "high", color: "#ff8c00" },
    { name: "Houston Flood", lat: 29.76, lng: -95.36, severity: "high", color: "#ff8c00" },
    { name: "Miami Hurricane", lat: 25.76, lng: -80.19, severity: "critical", color: "#ff006e" },
    { name: "Chicago Storm", lat: 41.87, lng: -87.62, severity: "medium", color: "#ffd700" },
    { name: "Denver Snow", lat: 39.73, lng: -104.99, severity: "low", color: "#00d9ff" },
    { name: "Seattle Rain", lat: 47.60, lng: -122.33, severity: "low", color: "#00d9ff" },
  ];

  // Pulse animation for critical hotspots
  return (
    <div className="relative w-full h-full min-h-[300px] bg-card rounded-lg overflow-hidden border border-[#00d9ff]/20">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent),
                          linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* US outline approximation with hotspots */}
      <svg viewBox="0 0 600 400" className="w-full h-full absolute inset-0" fill="none">
        {/* Connecting lines */}
        {hotspots.map((h, i) => (
          <line
            key={`line-${i}`}
            x1={h.lng * 3 + 360}
            y1={400 - h.lat * 5 + 180}
            x2={295}
            y2={200}
            stroke={h.color}
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="4 4"
          />
        ))}

        {/* Hotspot dots */}
        {hotspots.map((h, i) => (
          <g key={i}>
            {/* Pulse ring for critical */}
            {h.severity === "critical" && (
              <circle
                cx={h.lng * 3 + 360}
                cy={400 - h.lat * 5 + 180}
                r="12"
                fill={h.color}
                opacity="0.15"
              >
                <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Main dot */}
            <circle
              cx={h.lng * 3 + 360}
              cy={400 - h.lat * 5 + 180}
              r={h.severity === "critical" ? 6 : h.severity === "high" ? 5 : 4}
              fill={h.color}
              stroke="#0a0e27"
              strokeWidth="2"
            />
            {/* Label */}
            <text
              x={h.lng * 3 + 370}
              y={400 - h.lat * 5 + 185}
              fill="#e0e0e0"
              fontSize="8"
              fontFamily="monospace"
            >
              {h.name.split(" ").slice(0, 1)}
            </text>
          </g>
        ))}

        {/* Center hub */}
        <circle cx="295" cy="200" r="3" fill="#00d9ff" opacity="0.5" />
        <text x="298" y="204" fill="#00d9ff" fontSize="7" fontFamily="monospace">HQ</text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-gray-500 bg-card/80 px-2 py-1 rounded border border-border/30">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff006e]" /> Critical</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff8c00]" /> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ffd700]" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00d9ff]" /> Low</span>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-green-400 bg-card/80 px-2 py-1 rounded border border-border/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        LIVE
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const dashboardQuery = trpc.dashboard.overview.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const initialData = dashboardQuery.data;
  const liveData = useLiveData(initialData, 4000);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const isLoading = dashboardQuery.isLoading;
  const overview = liveData || dashboardQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold neon-cyan">Dashboard</h1>
              <p className="text-gray-400 mt-1">Real-time disaster intelligence overview</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-sm text-gray-500">Welcome, {user?.name || "User"}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <Activity className="w-3 h-3 inline mr-1 text-[#00d9ff]" />
                Updated: {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedCounter
            value={overview?.events?.activeCount || 0}
            label="Active Disasters"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
            isLoading={isLoading}
          />
          <AnimatedCounter
            value={overview?.events?.criticalCount || 0}
            label="Critical Events"
            icon={<TrendingUp className="w-5 h-5" />}
            color="red"
            isLoading={isLoading}
          />
          <AnimatedCounter
            value={overview?.events?.totalAffected || 0}
            label="Affected Population"
            icon={<Users className="w-5 h-5" />}
            color="cyan"
            isLoading={isLoading}
          />
          <AnimatedCounter
            value={overview?.shelters?.openCount || 0}
            label="Active Shelters"
            icon={<Home className="w-5 h-5" />}
            color="cyan"
            isLoading={isLoading}
          />
        </div>

        {/* Map + Resource Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disaster Map */}
          <Card className="lg:col-span-2 border border-[#00d9ff]/30 bg-card/50 backdrop-blur-sm glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00d9ff]" />
                Disaster Hotspot Map
              </CardTitle>
              <CardDescription>Real-time disaster event tracking across regions</CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-4 pb-4">
              <DisasterMap />
            </CardContent>
          </Card>

          {/* Resource Utilization */}
          <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff006e]" />
                Resource Utilization
              </CardTitle>
              <CardDescription>Deployed vs available resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-[#ff006e]/10 border border-[#ff006e]/20">
                    <p className="text-xs text-gray-500 mb-1">Deployed</p>
                    <p className="text-3xl font-bold text-[#ff006e]">
                      {overview?.resources?.deployedCount || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/20">
                    <p className="text-xs text-gray-500 mb-1">Available</p>
                    <p className="text-3xl font-bold text-[#00d9ff]">
                      {overview?.resources?.availableCount || 0}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Total Resources</span>
                    <span className="text-sm font-semibold text-[#00d9ff]">
                      {overview?.resources?.totalResources || 0}
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#ff006e] to-[#00d9ff] h-full transition-all duration-500"
                      style={{
                        width: `${
                          overview?.resources?.totalResources
                            ? ((overview.resources.deployedCount || 0) / overview.resources.totalResources) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shelter Capacity + Severity Index */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shelter Capacity */}
          <Card className="lg:col-span-2 border border-[#00d9ff]/30 bg-card/50 backdrop-blur-sm glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-[#00d9ff]" />
                Shelter Capacity
              </CardTitle>
              <CardDescription>Current occupancy vs total capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <Skeleton className="h-4 w-full bg-card" />
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Occupancy</span>
                        <span className="text-sm font-semibold text-[#00d9ff]">
                          {overview?.shelters?.totalOccupancy || 0} / {overview?.shelters?.totalCapacity || 0}
                        </span>
                      </div>
                      <div className="w-full bg-card rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#00d9ff] to-[#00f5ff] h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${
                              overview?.shelters?.totalCapacity
                                ? ((overview.shelters.totalOccupancy || 0) / overview.shelters.totalCapacity) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-sm text-gray-400">
                        {overview?.shelters?.openCount || 0} shelters currently open
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

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
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-24 mx-auto bg-card" />
                  <Skeleton className="h-4 w-32 mx-auto bg-card" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#ff006e] mb-2">
                      {Math.round(
                        ((overview?.events?.criticalCount || 0) / Math.max(overview?.events?.activeCount || 1, 1)) * 100
                      )}%
                    </div>
                    <p className="text-gray-400">Critical severity ratio</p>
                  </div>
                  <div className="pt-4 border-t border-border/30 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Low</p>
                      <p className="text-lg font-semibold text-green-400">
                        {(overview?.events?.activeCount || 0) - (overview?.events?.criticalCount || 0) <= 0 ? 0 : (overview?.events?.activeCount || 0) - (overview?.events?.criticalCount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Medium</p>
                      <p className="text-lg font-semibold text-yellow-400">0</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">High+</p>
                      <p className="text-lg font-semibold text-[#ff006e]">
                        {overview?.events?.criticalCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
