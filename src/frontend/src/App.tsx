import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { AnnouncementsPage } from "@/routes/announcements";
import { AttendancePage } from "@/routes/attendance";
import { DashboardPage } from "@/routes/dashboard";
import { ExamsPage } from "@/routes/exams";
import { LoginPage } from "@/routes/login";
import { ParentsPage } from "@/routes/parents";
import { StudentsPage } from "@/routes/students";
import { TeachersPage } from "@/routes/teachers";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

function RootLayout() {
  const { isDark } = useTheme();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return <Outlet />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loginStatus } = useInternetIdentity();
  if (loginStatus === "initializing") return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/dashboard" />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: () => (
    <ProtectedRoute>
      <StudentsPage />
    </ProtectedRoute>
  ),
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers",
  component: () => (
    <ProtectedRoute>
      <TeachersPage />
    </ProtectedRoute>
  ),
});

const parentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/parents",
  component: () => (
    <ProtectedRoute>
      <ParentsPage />
    </ProtectedRoute>
  ),
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance",
  component: () => (
    <ProtectedRoute>
      <AttendancePage />
    </ProtectedRoute>
  ),
});

const examsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exams",
  component: () => (
    <ProtectedRoute>
      <ExamsPage />
    </ProtectedRoute>
  ),
});

const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/announcements",
  component: () => (
    <ProtectedRoute>
      <AnnouncementsPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  studentsRoute,
  teachersRoute,
  parentsRoute,
  attendanceRoute,
  examsRoute,
  announcementsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
