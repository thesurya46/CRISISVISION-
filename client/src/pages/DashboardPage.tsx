import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Cloud,
  Package,
  MessageSquare,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "./Dashboard";
import AlertFeed from "./AlertFeed";
import WeatherIntel from "./WeatherIntel";
import Resources from "./Resources";
import AIAssistant from "./AIAssistant";
import SeverityPredictor from "./SeverityPredictor";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import GlobalSearch from "@/components/GlobalSearch";
import { useState } from "react";

type NavItem = "overview" | "alerts" | "weather" | "resources" | "ai" | "predictor";

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "alerts", label: "Alert Feed", icon: <AlertTriangle className="w-5 h-5" /> },
  { id: "weather", label: "Weather Intel", icon: <Cloud className="w-5 h-5" /> },
  { id: "resources", label: "Resources", icon: <Package className="w-5 h-5" /> },
  { id: "ai", label: "AI Assistant", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "predictor", label: "Severity Predictor", icon: <Zap className="w-5 h-5" /> },
];

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeNav, setActiveNav] = useState<NavItem>("overview");

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

  const renderContent = () => {
    switch (activeNav) {
      case "overview":
        return <Dashboard />;
      case "alerts":
        return <AlertFeed />;
      case "weather":
        return <WeatherIntel />;
      case "resources":
        return <Resources />;
      case "ai":
        return <AIAssistant />;
      case "predictor":
        return <SeverityPredictor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/30 bg-card/50 backdrop-blur-sm flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-border/30">
          <h1 className="text-2xl font-bold neon-cyan">CrisisVision</h1>
          <p className="text-xs text-gray-500 mt-1">Disaster Intelligence Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeNav === item.id
                  ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/50"
                  : "text-gray-400 hover:text-[#00d9ff] hover:bg-card/50"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border/30 space-y-3">
          <div className="px-4 py-3 rounded-lg bg-card/50 border border-border/30">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-semibold text-[#00d9ff] truncate">{user?.name || "User"}</p>
          </div>
          <Button
            onClick={() => {
              logout();
              navigate("/");
            }}
            variant="outline"
            className="w-full border-[#ff006e]/50 text-[#ff006e] hover:bg-[#ff006e]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
