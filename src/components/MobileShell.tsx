import { Link, useLocation } from "@tanstack/react-router";
import { Calendar, Map as MapIcon, Settings as SettingsIcon } from "lucide-react";
import type { ReactNode } from "react";

export function MobileShell({ children, showNav = true }: { children: ReactNode; showNav?: boolean }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#E9F3EE]">
      <div className="relative w-full max-w-[440px] min-h-screen bg-background shadow-soft overflow-hidden flex flex-col">
        <div className="flex-1 pb-[88px]">{children}</div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

function BottomNav() {
  const loc = useLocation();
  const path = loc.pathname;
  const items = [
    { to: "/events", label: "Events", icon: Calendar, active: path.startsWith("/events") },
    { to: "/", label: "Map", icon: MapIcon, active: path === "/" },
    { to: "/settings", label: "Settings", icon: SettingsIcon, active: path.startsWith("/settings") || path.startsWith("/verify") },
  ] as const;
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-border z-40">
      <div className="grid grid-cols-3 px-2 pt-2 pb-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className="flex flex-col items-center gap-1 py-1 transition-colors"
            >
              <div
                className={`flex items-center justify-center w-12 h-8 rounded-xl transition-all ${
                  it.active ? "bg-turquoise/15 text-turquoise" : "text-forest/60"
                }`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <span className={`text-[11px] font-medium ${it.active ? "text-turquoise" : "text-forest/60"}`}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
