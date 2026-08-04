import { useState, useEffect, useRef } from "react";
import { Bell, X, AlertTriangle, Home, Zap, Cloud } from "lucide-react";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "Critical Event Alert",
    message: "Magnitude 7.2 earthquake detected near San Francisco. Immediate response required.",
    time: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Resource Depletion Warning",
    message: "Medical supplies in Houston are running low. Restock needed within 24 hours.",
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Weather Advisory",
    message: "Hurricane warning issued for Miami area. Wind speeds expected to reach 120 km/h.",
    time: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "Shelter Update",
    message: "3 new shelters have been opened in Los Angeles to accommodate displaced residents.",
    time: new Date(Date.now() - 120 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "System Update",
    message: "AI prediction models have been updated with new weather data.",
    time: new Date(Date.now() - 240 * 60 * 1000),
    read: true,
  },
];

const TYPE_ICONS = {
  critical: AlertTriangle,
  warning: Cloud,
  info: Home,
};

const TYPE_COLORS = {
  critical: "text-[#ff006e] bg-[#ff006e]/10 border-[#ff006e]/30",
  warning: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  info: "text-[#00d9ff] bg-[#00d9ff]/10 border-[#00d9ff]/30",
};

const TYPE_BADGE = {
  critical: "bg-[#ff006e]",
  warning: "bg-orange-400",
  info: "bg-[#00d9ff]",
};

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-card/50 transition-colors text-gray-400 hover:text-[#00d9ff]"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#ff006e] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border/50 rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00d9ff]" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-[#ff006e]/20 text-[#ff006e] px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#00d9ff] hover:text-[#00e5ff] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = TYPE_ICONS[notif.type];
                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-border/20 hover:bg-card/50 transition-colors cursor-pointer ${
                      !notif.read ? "bg-card/30" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[notif.type]}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              !notif.read ? "text-foreground" : "text-gray-400"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {timeAgo(notif.time)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full mt-2 ${TYPE_BADGE[notif.type]}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border/30 text-center">
            <button className="text-xs text-gray-500 hover:text-[#00d9ff] transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

