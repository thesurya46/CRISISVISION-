import { useState, useRef, useEffect } from "react";
import { Search, LayoutDashboard, AlertTriangle, Cloud, Package, MessageSquare, Zap } from "lucide-react";

interface SearchResult {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  shortcut?: string;
}

const SEARCH_ITEMS: SearchResult[] = [
  { id: "overview", label: "Dashboard Overview", description: "Real-time disaster intelligence overview", icon: <LayoutDashboard className="w-4 h-4 text-[#00d9ff]" />, path: "/dashboard", shortcut: "G + D" },
  { id: "alerts", label: "Alert Feed", description: "Live disaster event alerts", icon: <AlertTriangle className="w-4 h-4 text-[#ff006e]" />, path: "/dashboard", shortcut: "G + A" },
  { id: "weather", label: "Weather Intel", description: "Weather conditions across disaster zones", icon: <Cloud className="w-4 h-4 text-[#00d9ff]" />, path: "/dashboard", shortcut: "G + W" },
  { id: "resources", label: "Resource Allocation", description: "Track personnel, vehicles, and supplies", icon: <Package className="w-4 h-4 text-[#ff006e]" />, path: "/dashboard", shortcut: "G + R" },
  { id: "ai", label: "AI Assistant", description: "Expert guidance on disaster response", icon: <MessageSquare className="w-4 h-4 text-[#00d9ff]" />, path: "/dashboard", shortcut: "G + I" },
  { id: "predictor", label: "Severity Predictor", description: "AI-powered disaster severity assessment", icon: <Zap className="w-4 h-4 text-[#ff006e]" />, path: "/dashboard", shortcut: "G + P" },
];

interface GlobalSearchProps {
  onNavigate: (path: string, section: string) => void;
}

export default function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = query
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    onNavigate(item.path, item.id);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-card/50 text-gray-500 hover:text-gray-300 hover:border-[#00d9ff]/30 transition-all text-sm w-48 lg:w-64"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-card border border-border/30 rounded font-mono text-gray-600">
          <span className="text-[9px]">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
            <div className="w-full max-w-lg bg-card border border-border/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border/30">
                <Search className="w-5 h-5 text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, features, or commands..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-gray-600 text-sm"
                />
                <kbd className="text-[10px] px-1.5 py-0.5 bg-card border border-border/30 rounded font-mono text-gray-600">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No results found</p>
                    <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-600 px-3 py-1 font-semibold">
                      Pages
                    </p>
                    {filteredItems.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          index === selectedIndex
                            ? "bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/30"
                            : "text-gray-400 hover:text-foreground hover:bg-card/50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-card border border-border/30 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        </div>
                        {item.shortcut && (
                          <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border/30 flex items-center justify-between text-[10px] text-gray-600">
                <div className="flex items-center gap-3">
                  <span><kbd className="px-1 py-0.5 bg-card border border-border/30 rounded font-mono">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1 py-0.5 bg-card border border-border/30 rounded font-mono">↵</kbd> Open</span>
                </div>
                <span><kbd className="px-1 py-0.5 bg-card border border-border/30 rounded font-mono">ESC</kbd> Close</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

