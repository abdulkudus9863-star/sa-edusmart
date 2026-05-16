import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useListAnnouncements } from "@/lib/backend-hooks";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Bell, ChevronDown, LogOut, Menu, Moon, Sun, User } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, clear } = useInternetIdentity();
  const isLoggedIn = isAuthenticated;
  const { data: announcements } = useListAnnouncements();
  const notificationCount =
    announcements?.filter((a) => {
      const ts = Number(a.createdAt) / 1_000_000;
      return Date.now() - ts < 24 * 60 * 60 * 1000;
    }).length ?? 0;

  return (
    <header
      data-ocid="app.header"
      className="sticky top-0 z-40 h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shadow-sm"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
          aria-label="Toggle menu"
          data-ocid="app.sidebar_toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm font-display shadow-sm">
            SA
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold font-display text-foreground leading-none">
              SA EduSmart
            </p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              S.A. Educational Institute
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-ocid="app.theme_toggle"
          className="transition-smooth"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          data-ocid="app.notifications_button"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
              {notificationCount}
            </Badge>
          )}
        </Button>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 px-2"
                data-ocid="app.user_menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="font-medium">
                Admin Portal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clear}
                className="text-destructive focus:text-destructive"
                data-ocid="app.logout_button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
