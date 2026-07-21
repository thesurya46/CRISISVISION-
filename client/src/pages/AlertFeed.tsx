import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

const SEVERITY_COLORS = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-[#ff006e]/20 text-[#ff006e] border-[#ff006e]/30",
};

const SEVERITY_ICONS = {
  low: "🟢",
  medium: "🟡",
  high: "🟠",
  critical: "🔴",
};

export default function AlertFeed() {
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState<"latest" | "severity">("latest");
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "high">("all");

  const eventsQuery = trpc.events.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the alert feed.</p>
        </div>
      </div>
    );
  }

  let events = eventsQuery.data || [];

  // Filter events
  if (filterSeverity !== "all") {
    events = events.filter((e) => {
      if (filterSeverity === "critical") return e.severity === "critical";
      if (filterSeverity === "high") return e.severity === "high" || e.severity === "critical";
      return true;
    });
  }

  // Sort events
  if (sortBy === "severity") {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    events = [...events].sort(
      (a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]
    );
  } else {
    events = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-cyan mb-4">Alert Feed</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === "latest" ? "default" : "outline"}
                onClick={() => setSortBy("latest")}
                className={sortBy === "latest" ? "bg-[#00d9ff] text-[#0a0e27]" : ""}
              >
                Latest
              </Button>
              <Button
                size="sm"
                variant={sortBy === "severity" ? "default" : "outline"}
                onClick={() => setSortBy("severity")}
                className={sortBy === "severity" ? "bg-[#ff006e] text-white" : ""}
              >
                By Severity
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterSeverity === "all" ? "default" : "outline"}
                onClick={() => setFilterSeverity("all")}
                className={filterSeverity === "all" ? "bg-[#00d9ff] text-[#0a0e27]" : ""}
              >
                All Events
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === "high" ? "default" : "outline"}
                onClick={() => setFilterSeverity("high")}
                className={filterSeverity === "high" ? "bg-orange-500 text-white" : ""}
              >
                High+
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === "critical" ? "default" : "outline"}
                onClick={() => setFilterSeverity("critical")}
                className={filterSeverity === "critical" ? "bg-[#ff006e] text-white" : ""}
              >
                Critical
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {eventsQuery.isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">No events found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className={`border ${
                  event.severity === "critical"
                    ? "border-[#ff006e]/50 bg-[#ff006e]/5"
                    : event.severity === "high"
                      ? "border-orange-500/50 bg-orange-500/5"
                      : "border-border/30 bg-card/50"
                } hover:border-[#00d9ff]/50 transition-all duration-300 cursor-pointer`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Severity Icon */}
                    <div className="text-2xl mt-1">
                      {SEVERITY_ICONS[event.severity as keyof typeof SEVERITY_ICONS]}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{event.type}</h3>
                          <p className="text-sm text-gray-400 mt-1">{event.location}</p>
                        </div>
                        <Badge
                          className={`${
                            SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS]
                          } border`}
                        >
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/20">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00d9ff]" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm font-semibold">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#ff006e]" />
                          <div>
                            <p className="text-xs text-gray-500">Coordinates</p>
                            <p className="text-sm font-semibold">
                              {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#00d9ff]" />
                          <div>
                            <p className="text-xs text-gray-500">Affected</p>
                            <p className="text-sm font-semibold">{event.affectedCount?.toLocaleString() || 0}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#ff006e]" />
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm font-semibold capitalize">{event.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
