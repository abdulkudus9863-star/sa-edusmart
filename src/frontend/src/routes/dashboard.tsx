import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListAnnouncements,
  useListParents,
  useListStudents,
  useListTeachers,
} from "@/lib/backend-hooks";
import { cn } from "@/lib/utils";
import type { AnnouncementView } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Heart,
  MapPin,
  Megaphone,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Mock chart data ──────────────────────────────────────────────────────────
const attendanceTrend = [
  { month: "Jan", present: 92, absent: 8 },
  { month: "Feb", present: 88, absent: 12 },
  { month: "Mar", present: 95, absent: 5 },
  { month: "Apr", present: 91, absent: 9 },
  { month: "May", present: 94, absent: 6 },
  { month: "Jun", present: 87, absent: 13 },
  { month: "Jul", present: 96, absent: 4 },
];

const gradeDistribution = [
  { grade: "A+", count: 42 },
  { grade: "A", count: 67 },
  { grade: "B+", count: 54 },
  { grade: "B", count: 38 },
  { grade: "C", count: 22 },
  { grade: "D", count: 9 },
];

const enrollmentByClass = [
  { name: "Class 6", value: 48 },
  { name: "Class 7", value: 52 },
  { name: "Class 8", value: 45 },
  { name: "Class 9", value: 60 },
  { name: "Class 10", value: 55 },
];

const PIE_COLORS = ["#22c55e", "#d4a017", "#3b82f6", "#a855f7", "#f97316"];

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  subtitle,
  loading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconBg: string;
  subtitle?: string;
  loading: boolean;
}) {
  return (
    <div
      className="glass-card p-5 hover:shadow-elevated transition-smooth group cursor-default"
      data-ocid={`dashboard.stat.${label.toLowerCase().replace(/\s+/g, "_")}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-9 w-20 mt-1" />
          ) : (
            <p className="text-4xl font-bold font-display text-foreground mt-1 tabular-nums">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center transition-smooth group-hover:scale-110 shrink-0",
            iconBg,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// ─── Chart Card ────────────────────────────────────────────────────────────────
function ChartCard({
  title,
  subtitle,
  children,
  ocid,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  ocid: string;
}) {
  return (
    <div className="glass-card p-5" data-ocid={ocid}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold font-display text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Announcement Item ────────────────────────────────────────────────────────
function AnnouncementItem({
  announcement,
  index,
}: {
  announcement: AnnouncementView;
  index: number;
}) {
  const groupColors: Record<string, string> = {
    All: "bg-primary/15 text-primary",
    Students: "bg-blue-500/15 text-blue-400",
    Teachers: "bg-accent/15 text-accent",
    Parents: "bg-purple-500/15 text-purple-400",
  };
  const groupKey = Object.prototype.hasOwnProperty.call(
    announcement.recipientGroup,
    "All",
  )
    ? "All"
    : (Object.keys(announcement.recipientGroup)[0] ?? "All");
  const badgeClass = groupColors[groupKey] ?? "bg-muted text-muted-foreground";

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth"
      data-ocid={`dashboard.announcement.item.${index + 1}`}
    >
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Bell className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {announcement.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {announcement.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
              badgeClass,
            )}
          >
            {groupKey}
          </span>
          <span className="text-[10px] text-muted-foreground">
            by {announcement.createdBy}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action ──────────────────────────────────────────────────────────────
const quickActions = [
  {
    label: "Mark Attendance",
    icon: CalendarCheck,
    path: "/attendance",
    color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    ocid: "dashboard.quick_action.mark_attendance",
  },
  {
    label: "Add Student",
    icon: UserPlus,
    path: "/students",
    color:
      "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    ocid: "dashboard.quick_action.add_student",
  },
  {
    label: "Add Exam",
    icon: BookOpen,
    path: "/exams",
    color: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
    ocid: "dashboard.quick_action.add_exam",
  },
  {
    label: "Announcement",
    icon: Megaphone,
    path: "/announcements",
    color:
      "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    ocid: "dashboard.quick_action.create_announcement",
  },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const navigate = useNavigate();
  const { data: students, isLoading: loadingStudents } = useListStudents();
  const { data: teachers, isLoading: loadingTeachers } = useListTeachers();
  const { data: parents, isLoading: loadingParents } = useListParents();
  const { data: announcements, isLoading: loadingAnn } = useListAnnouncements();

  const recentAnnouncements = announcements?.slice(0, 3) ?? [];

  return (
    <Layout>
      <div
        className="p-4 md:p-6 space-y-6 animate-fade-in"
        data-ocid="dashboard.page"
      >
        {/* ── School header ─────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 md:p-7"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.16 0.06 142) 0%, oklch(0.12 0.03 142) 50%, oklch(0.14 0.05 60) 100%)",
            border: "1px solid oklch(0.35 0.12 142 / 0.4)",
          }}
          data-ocid="dashboard.school_header"
        >
          {/* decorative glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, oklch(0.45 0.22 142 / 0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.22 142) 0%, oklch(0.65 0.2 60) 100%)",
                  boxShadow: "0 0 24px oklch(0.55 0.22 142 / 0.5)",
                }}
              >
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-display text-white">
                  SA EduSmart
                </h1>
                <p className="text-sm text-white/60 font-medium">
                  S.A. Educational Institute
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-accent/70" />
                  <span className="text-xs text-white/50">
                    Irong Chesaba, Thoubal District, Manipur
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="border-primary/30 bg-primary/10 text-primary/90 hidden sm:flex">
                <TrendingUp className="mr-1 h-3 w-3" /> Academic Year 2025–26
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/announcements" })}
                className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white hidden sm:flex"
                data-ocid="dashboard.view_announcements_button"
              >
                View All
              </Button>
            </div>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="dashboard.stats_grid"
        >
          <StatCard
            label="Students"
            value={students?.length ?? 0}
            icon={GraduationCap}
            iconBg="bg-primary/10 text-primary"
            subtitle="Enrolled this year"
            loading={loadingStudents}
          />
          <StatCard
            label="Teachers"
            value={teachers?.length ?? 0}
            icon={Users}
            iconBg="bg-accent/10 text-accent"
            subtitle="Active staff"
            loading={loadingTeachers}
          />
          <StatCard
            label="Parents"
            value={parents?.length ?? 0}
            icon={Heart}
            iconBg="bg-blue-500/10 text-blue-400"
            subtitle="Registered"
            loading={loadingParents}
          />
          <StatCard
            label="Notices"
            value={announcements?.length ?? 0}
            icon={Megaphone}
            iconBg="bg-purple-500/10 text-purple-400"
            subtitle="Published"
            loading={loadingAnn}
          />
        </div>

        {/* ── Charts row ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance trend */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Attendance Trend"
              subtitle="Monthly present vs absent percentage"
              ocid="dashboard.chart.attendance_trend"
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.4 0 0 / 0.15)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[70, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ fill: "#22c55e", r: 4 }}
                    name="Present %"
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="#d4a017"
                    strokeWidth={2}
                    dot={{ fill: "#d4a017", r: 3 }}
                    name="Absent %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Enrollment pie */}
          <ChartCard
            title="Enrollment by Class"
            subtitle="Student distribution"
            ocid="dashboard.chart.enrollment_pie"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={enrollmentByClass}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  strokeWidth={0}
                >
                  {enrollmentByClass.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} students`]}
                  contentStyle={{
                    background: "oklch(0.14 0 0)",
                    border: "1px solid oklch(0.3 0 0)",
                    borderRadius: "0.5rem",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Grade distribution bar ────────────────────────────────────────── */}
        <ChartCard
          title="Grade Distribution"
          subtitle="Student performance across all exams"
          ocid="dashboard.chart.grade_distribution"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gradeDistribution} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.4 0 0 / 0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="grade"
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                {gradeDistribution.map((entry, i) => (
                  <Cell
                    key={entry.grade}
                    fill={i < 2 ? "#22c55e" : i < 4 ? "#d4a017" : "#6b7280"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Bottom row: quick actions + recent announcements ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <div className="glass-card p-5" data-ocid="dashboard.quick_actions">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold font-display text-foreground">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, icon: Icon, path, color, ocid }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    navigate({
                      to: path as
                        | "/attendance"
                        | "/students"
                        | "/exams"
                        | "/announcements",
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-smooth hover:scale-[1.02] hover:shadow-elevated",
                    color,
                  )}
                  data-ocid={ocid}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent announcements */}
          <div
            className="glass-card p-5"
            data-ocid="dashboard.recent_announcements"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold font-display text-foreground">
                Recent Announcements
              </h2>
              <button
                type="button"
                onClick={() => navigate({ to: "/announcements" })}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                data-ocid="dashboard.announcements.view_all_button"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {loadingAnn ? (
              <div
                className="space-y-3"
                data-ocid="dashboard.announcements.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : recentAnnouncements.length > 0 ? (
              <div className="space-y-2">
                {recentAnnouncements.map((ann, i) => (
                  <AnnouncementItem
                    key={ann.id.toString()}
                    announcement={ann}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8 text-center"
                data-ocid="dashboard.announcements.empty_state"
              >
                <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No announcements yet
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/announcements" })}
                  className="text-xs text-primary hover:underline mt-1"
                  data-ocid="dashboard.announcements.create_button"
                >
                  Create first announcement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
