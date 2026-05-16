import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Megaphone,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Students", path: "/students", icon: GraduationCap },
  { label: "Teachers", path: "/teachers", icon: BookOpen },
  { label: "Parents", path: "/parents", icon: Heart },
  { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { label: "Exams", path: "/exams", icon: FileText },
  { label: "Announcements", path: "/announcements", icon: Megaphone },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) =>
            e.key === "Enter" || e.key === " " ? onClose() : undefined
          }
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar panel */}
      <aside
        data-ocid="app.sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
          "bg-card/95 backdrop-blur-xl border-r border-border/50",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm font-display">
                SA
              </span>
            </div>
            <div>
              <p className="font-bold text-sm font-display text-foreground leading-none">
                SA EduSmart
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Admin Portal
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-smooth",
                      isActive ? "text-primary" : "group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3 w-3 text-primary/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border/50 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[11px] text-primary font-medium">
              S.A. Educational Institute
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Irong Chesaba, Thoubal
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
