import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { GraduationCap, Moon, Shield, Sparkles, Sun, Zap } from "lucide-react";
import { useEffect } from "react";

const features = [
  { icon: GraduationCap, text: "Student & Teacher Management" },
  { icon: Sparkles, text: "AI-Powered Insights" },
  { icon: Shield, text: "Secure Internet Identity" },
  { icon: Zap, text: "Real-time Attendance Tracking" },
];

export function LoginPage() {
  const { login, loginStatus, isAuthenticated } = useInternetIdentity();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      data-ocid="login.page"
      className="min-h-screen flex flex-col bg-background overflow-hidden relative"
    >
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-ocid="login.theme_toggle"
          className="rounded-full glass"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          {/* Card */}
          <div className="glass-elevated p-8 rounded-2xl shadow-xl border border-border/60">
            {/* Logo area */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg mb-4 relative">
                <span className="text-white font-black text-2xl font-display">
                  SA
                </span>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent/90 border-2 border-background flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-accent-foreground" />
                </div>
              </div>
              <h1 className="text-2xl font-bold font-display text-foreground">
                SA EduSmart
              </h1>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                S.A. Educational Institute
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Irong Chesaba, Thoubal District, Manipur
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 mb-6" />

            {/* Sign in section */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-base font-semibold text-foreground font-display">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in with Internet Identity to access the admin portal
                </p>
              </div>

              <Button
                type="button"
                className="w-full h-11 gradient-primary text-white font-semibold font-display text-sm shadow-md hover:opacity-90 transition-smooth"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="login.sign_in_button"
              >
                {loginStatus === "logging-in" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign in with Internet Identity
                  </span>
                )}
              </Button>
            </div>

            {/* Features grid */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
