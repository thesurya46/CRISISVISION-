import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Users,
  Home,
  Zap,
  TrendingUp,
  MapPin,
  Activity,
  Bell,
  Shield,
  MessageSquare,
  Cloud,
  Package,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// ── Live data simulation hook ──────────────────────────────────────────────
function useLiveData<T>(initial: T, intervalMs = 5000): T {
  const [data, setData] = useState(initial);
  useEffect(() => {
    const timer = setInterval(() => {
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
  const hotspots = [
    { name: "San Francisco EQ", lat: 37.77, lng: -122.41, severity: "critical", color: "#ff006e" },
    { name: "LA Wildfire", lat: 34.05, lng: -118.24, severity: "high", color: "#ff8c00" },
    { name: "Houston Flood", lat: 29.76, lng: -95.36, severity: "high", color: "#ff8c00" },
    { name: "Miami Hurricane", lat: 25.76, lng: -80.19, severity: "critical", color: "#ff006e" },
    { name: "Chicago Storm", lat: 41.87, lng: -87.62, severity: "medium", color: "#ffd700" },
    { name: "Denver Snow", lat: 39.73, lng: -104.99, severity: "low", color: "#00d9ff" },
    { name: "Seattle Rain", lat: 47.60, lng: -122.33, severity: "low", color: "#00d9ff" },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] bg-card rounded-lg overflow-hidden border border-[#00d9ff]/20">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent),
                          linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)`,
          backgroundSize: "40px 40px",
        }}
      />
      <svg viewBox="0 0 600 400" className="w-full h-full absolute inset-0" fill="none">
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
        {hotspots.map((h, i) => (
          <g key={i}>
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
            <circle
              cx={h.lng * 3 + 360}
              cy={400 - h.lat * 5 + 180}
              r={h.severity === "critical" ? 6 : h.severity === "high" ? 5 : 4}
              fill={h.color}
              stroke="#0a0e27"
              strokeWidth="2"
            />
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
        <circle cx="295" cy="200" r="3" fill="#00d9ff" opacity="0.5" />
        <text x="298" y="204" fill="#00d9ff" fontSize="7" fontFamily="monospace">HQ</text>
      </svg>
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-gray-500 bg-card/80 px-2 py-1 rounded border border-border/30">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff006e]" /> Critical</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff8c00]" /> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ffd700]" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00d9ff]" /> Low</span>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-green-400 bg-card/80 px-2 py-1 rounded border border-border/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        LIVE
      </div>
    </div>
  );
}

// ── Quick Action Card ──────────────────────────────────────────────────────
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: "cyan" | "red";
  onClick?: () => void;
}

function QuickAction({ icon, label, description, color, onClick }: QuickActionProps) {
  const borderColor = color === "cyan" ? "border-[#00d9ff]/20 hover:border-[#00d9ff]/50" : "border-[#ff006e]/20 hover:border-[#ff006e]/50";
  const textColor = color === "cyan" ? "text-[#00d9ff]" : "text-[#ff006e]";
  const bgColor = color === "cyan" ? "bg-[#00d9ff]/5" : "bg-[#ff006e]/5";
  const glowClass = color === "cyan" ? "hover:glow-cyan" : "hover:glow-red";

  return (
    <button
      onClick={onClick}
      className={`group p-4 rounded-lg border ${borderColor} ${bgColor} ${glowClass} transition-all duration-300 text-left`}
    >
      <div className={`${textColor} mb-2`}>{icon}</div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors">{label}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </button>
  );
}

// ── Recent Alerts Widget ───────────────────────────────────────────────────
const MOCK_RECENT_ALERTS = [
  { id: "1", type: "Earthquake", location: "San Francisco, CA", severity: "critical", time: "2 min ago", status: "active" },
  { id: "2", type: "Wildfire", location: "Los Angeles, CA", severity: "high", time: "15 min ago", status: "active" },
  { id: "3", type: "Flood", location: "Houston, TX", severity: "high", time: "32 min ago", status: "active" },
  { id: "4", type: "Hurricane", location: "Miami, FL", severity: "critical", time: "1 hour ago", status: "monitoring" },
];

const SEVERITY_BADGES = {
  critical: "bg-[#ff006e]/20 text-[#ff006e] border-[#ff006e]/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

// ── Trend Chart Data ───────────────────────────────────────────────────────
const TREND_DATA = [
  { hour: "00:00", events: 12, critical: 3, resources: 45 },
  { hour: "02:00", events: 15, critical: 4, resources: 48 },
  { hour: "04:00", events: 18, critical: 5, resources: 52 },
  { hour: "06:00", events: 22, critical: 7, resources: 58 },
  { hour: "08:00", events: 28, critical: 9, resources: 65 },
  { hour: "10:00", events: 35, critical: 12, resources: 72 },
  { hour: "12:00", events: 32, critical: 10, resources: 68 },
  { hour: "14:00", events: 38, critical: 14, resources: 75 },
  { hour: "16:00", events: 42, critical: 16, resources: 80 },
  { hour: "18:00", events: 40, critical: 15, resources: 78 },
  { hour: "20:00", events: 36, critical: 11, resources: 70 },
  { hour: "22:00", events: 30, critical: 8, resources: 62 },
];

const RESOURCE_PIE_DATA = [
  { name: "Personnel", value: 45, color: "#00d9ff" },
  { name: "Vehicles", value: 25, color: "#ff006e" },
  { name: "Medical Supply", value: 35, color: "#00f5ff" },
  { name: "Food & Water", value: 40, color: "#ff1493" },
  { name: "Equipment", value: 30, color: "#ffd700" },
];

// ── System Status ──────────────────────────────────────────────────────────
function SystemStatus() {
  const statuses = [
    { label: "AI Prediction Engine", status: "online", latency: "12ms" },
    { label: "Weather Data Feed", status: "online", latency: "45ms" },
    { label: "Alert System", status: "online", latency: "8ms" },
    { label: "Database Cluster", status: "online", latency: "3ms" },
    { label: "Resource Tracker", status: "online", latency: "22ms" },
  ];

  return (
    <div className="space-y-2">
      {statuses.map((s) => (
        <div key={s.label} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-card/30 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
          <span className="text-[10px] font-mono text-gray-600">{s.latency}</span>
        </div>
      ))}
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ── Main Dashboard Component ──────────────────────────────────────────────
interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
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
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00d9ff]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAction
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Alert Feed"
              description="View live disaster alerts"
              color="red"
              onClick={() => onNavigate?.("alerts")}
            />
            <QuickAction
              icon={<Cloud className="w-5 h-5" />}
              label="Weather Intel"
              description="Check weather conditions"
              color="cyan"
              onClick={() => onNavigate?.("weather")}
            />
            <QuickAction
              icon={<MessageSquare className="w-5 h-5" />}
              label="AI Assistant"
              description="Get expert guidance"
              color="red"
              onClick={() => onNavigate?.("ai")}
            />
            <QuickAction
              icon={<Package className="w-5 h-5" />}
              label="Resources"
              description="Track resource allocation"
              color="cyan"
              onClick={() => onNavigate?.("resources")}
            />
          </div>
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

        {/* Shelter Capacity + Severity Index + Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          {/* Recent Alerts */}
          <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-[#ff006e]" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Latest disaster events requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-4 pb-4">
              <div className="space-y-2">
                {MOCK_RECENT_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-card/30 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#ff006e] animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{alert.type}</p>
                        <Badge className={`${SEVERITY_BADGES[alert.severity as keyof typeof SEVERITY_BADGES]} border text-[10px] px-1.5 py-0 capitalize`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{alert.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-600">{alert.time}</span>
                        <span className="text-[10px] text-gray-600 capitalize">· {alert.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => onNavigate?.("alerts")}
                  className="w-full mt-2 py-2 text-center text-xs text-[#00d9ff] hover:text-[#00e5ff] transition-colors border-t border-border/20 pt-3"
                >
                  View all alerts <ArrowRight className="w-3 h-3 inline ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disaster Trend Chart */}
          <Card className="border border-[#00d9ff]/30 bg-card/50 backdrop-blur-sm glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00d9ff]" />
                24h Disaster Trend
              </CardTitle>
              <CardDescription>Event frequency and critical incident tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff006e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff006e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" />
                  <XAxis dataKey="hour" stroke="#808080" fontSize={11} />
                  <YAxis stroke="#808080" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", color: "#808080" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#00d9ff"
                    strokeWidth={2}
                    fill="url(#eventGradient)"
                    name="Total Events"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    stroke="#ff006e"
                    strokeWidth={2}
                    fill="url(#criticalGradient)"
                    name="Critical"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resource Distribution Pie Chart */}
          <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#ff006e]" />
                Resource Distribution
              </CardTitle>
              <CardDescription>Breakdown of resources by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={RESOURCE_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {RESOURCE_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "#808080" }}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Status + Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card className="border border-[#00d9ff]/30 bg-card/50 backdrop-blur-sm glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-[#00d9ff]" />
                System Status
              </CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemStatus />
            </CardContent>
          </Card>

          {/* Severity Predictor Quick Access */}
          <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-[#ff006e]" />
                AI Severity Predictor
              </CardTitle>
              <CardDescription>Get AI-powered severity assessment and response recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    Use our AI model to predict disaster severity based on parameters like disaster type, wind speed, rainfall, and affected population.
                  </p>
                  <p className="text-xs text-gray-600">
                    Supports: Earthquake, Hurricane, Tornado, Flood, Wildfire, Tsunami, Landslide, Volcanic Eruption
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.("predictor")}
                  className="shrink-0 px-6 py-3 rounded-lg bg-gradient-to-r from-[#ff006e] to-[#ff1493] text-white font-semibold text-sm hover:from-[#ff1493] hover:to-[#ff006e] transition-all duration-300 glow-red flex items-center gap-2"
                >
                  Open Predictor
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

