import { useTheme } from "@/hooks/use-theme";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Navigate, Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";

function RootLayout() {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootLayout,
});
