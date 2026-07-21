import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, MapPin, Package } from "lucide-react";

const STATUS_COLORS = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  deployed: "bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30",
  depleted: "bg-[#ff006e]/20 text-[#ff006e] border-[#ff006e]/30",
};

const RESOURCE_TYPES = {
  personnel: "👥",
  vehicle: "🚗",
  medical_supply: "⚕️",
  food: "🍱",
  supplies: "📦",
};

export default function Resources() {
  const { isAuthenticated } = useAuth();
  const resourcesQuery = trpc.resources.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
  const statsQuery = trpc.resources.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access resource tracking.</p>
        </div>
      </div>
    );
  }

  const resources = resourcesQuery.data || [];
  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-cyan">Resource Allocation</h1>
          <p className="text-gray-400 mt-1">Track personnel, vehicles, and supplies across disaster zones</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#00d9ff]" />
                Total Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00d9ff]">{stats?.totalResources || 0}</div>
            </CardContent>
          </Card>

          <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00d9ff]" />
                Deployed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00d9ff]">{stats?.deployedCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border border-green-500/30 bg-card/50 glow-cyan">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-green-400" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats?.availableCount || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card className="border border-border/30 bg-card/50">
          <CardHeader>
            <CardTitle>Resource Inventory</CardTitle>
            <CardDescription>All deployed and available resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-[#00d9ff]">Resource</TableHead>
                    <TableHead className="text-[#00d9ff]">Type</TableHead>
                    <TableHead className="text-[#00d9ff]">Quantity</TableHead>
                    <TableHead className="text-[#00d9ff]">Location</TableHead>
                    <TableHead className="text-[#00d9ff]">Status</TableHead>
                    <TableHead className="text-[#00d9ff]">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow
                      key={resource.id}
                      className="border-border/30 hover:bg-card/50 transition-colors"
                    >
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {RESOURCE_TYPES[resource.type as keyof typeof RESOURCE_TYPES] || "📦"}
                          </span>
                          {resource.name}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-gray-400">{resource.type}</TableCell>
                      <TableCell className="font-semibold">
                        {resource.quantity} {resource.unit || "units"}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#ff006e]" />
                          {resource.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            STATUS_COLORS[resource.status as keyof typeof STATUS_COLORS] ||
                            "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          } border capitalize`}
                        >
                          {resource.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(resource.lastUpdated).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
