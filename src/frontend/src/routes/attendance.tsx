import { AttendanceStatus } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetStudentAttendanceStats,
  useListStudents,
  useMarkAttendance,
} from "@/lib/backend-hooks";
import type { AttendanceEntry, StudentView } from "@/types";
import {
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Save,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_LIST = [
  "8-A",
  "8-B",
  "9-A",
  "9-B",
  "10-A",
  "10-B",
  "11-A",
  "11-B",
  "12-A",
  "12-B",
];

function StatsRow({ student }: { student: StudentView }) {
  const { data: stats, isLoading } = useGetStudentAttendanceStats(student.id);
  const pct = stats ? Math.round(stats.presentPercent) : 0;
  const colorClass =
    pct >= 75 ? "bg-primary" : pct >= 50 ? "bg-accent" : "bg-destructive";
  const textClass =
    pct >= 75 ? "text-primary" : pct >= 50 ? "text-accent" : "text-destructive";
  return (
    <div
      className="glass-card p-4 space-y-2"
      data-ocid={`attendance.stats_row.${student.rollNumber}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {student.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Roll #{student.rollNumber}
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-6 w-14" />
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-sm font-bold ${textClass}`}>{pct}%</span>
            {pct >= 75 ? (
              <ChevronUp className="h-4 w-4 text-primary" />
            ) : (
              <ChevronDown className="h-4 w-4 text-destructive" />
            )}
          </div>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-2 w-full rounded-full" />
      ) : (
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {!isLoading && stats && (
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserCheck className="h-3 w-3 text-primary" />
            {stats.presentDays.toString()} present
          </span>
          <span className="flex items-center gap-1">
            <UserX className="h-3 w-3 text-destructive" />
            {stats.absentDays.toString()} absent
          </span>
          <span>{stats.totalDays.toString()} total</span>
        </div>
      )}
    </div>
  );
}

export function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const { data: students, isLoading } = useListStudents();
  const markAttendance = useMarkAttendance();
  const [activeTab, setActiveTab] = useState<"mark" | "stats">("mark");
  const [className, setClassName] = useState("10-A");
  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = (students ?? []).filter(
    (s) => s.className === className,
  );

  const toggle = (id: string) =>
    setEntries((prev) => ({
      ...prev,
      [id]:
        prev[id] === AttendanceStatus.absent
          ? AttendanceStatus.present
          : AttendanceStatus.absent,
    }));

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    for (const s of classStudents) {
      updated[s.id.toString()] = status;
    }
    setEntries(updated);
  };

  const handleSave = async () => {
    if (!className) {
      toast.error("Class name required");
      return;
    }
    if (classStudents.length === 0) {
      toast.error("No students found for this class");
      return;
    }
    const attendanceEntries: AttendanceEntry[] = classStudents.map((s) => ({
      studentId: s.id,
      status: entries[s.id.toString()] ?? AttendanceStatus.present,
    }));
    try {
      await markAttendance.mutateAsync({
        className,
        date,
        entries: attendanceEntries,
      });
      toast.success(`Attendance saved for ${className} on ${date}`, {
        description: `${presentCount} present, ${classStudents.length - presentCount} absent`,
      });
    } catch {
      toast.error("Failed to save attendance");
    }
  };

  const presentCount = classStudents.filter(
    (s) =>
      (entries[s.id.toString()] ?? AttendanceStatus.present) ===
      AttendanceStatus.present,
  ).length;
  const absentCount = classStudents.length - presentCount;

  return (
    <Layout>
      <div
        className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto"
        data-ocid="attendance.page"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mark and monitor daily attendance for SA EduSmart
          </p>
        </div>

        {/* Controls Card */}
        <div className="glass-card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger data-ocid="attendance.class_select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_LIST.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date-input">Date</Label>
              <Input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="attendance.date_input"
              />
            </div>
          </div>

          {/* Summary badges */}
          {classStudents.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <UserCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {presentCount} Present
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
                <UserX className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">
                  {absentCount} Absent
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {classStudents.length} Total
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "mark" | "stats")}
        >
          <TabsList className="w-full sm:w-auto" data-ocid="attendance.tab">
            <TabsTrigger
              value="mark"
              className="flex-1 sm:flex-none gap-2"
              data-ocid="attendance.mark_tab"
            >
              <ClipboardCheck className="h-4 w-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex-1 sm:flex-none gap-2"
              data-ocid="attendance.stats_tab"
            >
              <BarChart3 className="h-4 w-4" />
              View Stats
            </TabsTrigger>
          </TabsList>

          {/* ── Mark Attendance Tab ── */}
          <TabsContent value="mark" className="mt-4 space-y-4">
            {/* Bulk actions */}
            {classStudents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => markAll(AttendanceStatus.present)}
                  className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
                  data-ocid="attendance.mark_all_present_button"
                >
                  <Check className="h-3.5 w-3.5" /> Mark All Present
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => markAll(AttendanceStatus.absent)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1.5"
                  data-ocid="attendance.mark_all_absent_button"
                >
                  <X className="h-3.5 w-3.5" /> Mark All Absent
                </Button>
              </div>
            )}

            {/* Student list */}
            <div className="space-y-2" data-ocid="attendance.list">
              {isLoading ? (
                <>
                  <Skeleton key="sk0" className="h-[72px] w-full rounded-xl" />
                  <Skeleton key="sk1" className="h-[72px] w-full rounded-xl" />
                  <Skeleton key="sk2" className="h-[72px] w-full rounded-xl" />
                  <Skeleton key="sk3" className="h-[72px] w-full rounded-xl" />
                  <Skeleton key="sk4" className="h-[72px] w-full rounded-xl" />
                  <Skeleton key="sk5" className="h-[72px] w-full rounded-xl" />
                </>
              ) : classStudents.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 glass-card rounded-xl"
                  data-ocid="attendance.empty_state"
                >
                  <ClipboardCheck className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    No students in class "{className}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Students enrolled in this class will appear here
                  </p>
                </div>
              ) : (
                classStudents.map((student, i) => {
                  const status =
                    entries[student.id.toString()] ?? AttendanceStatus.present;
                  const isPresent = status === AttendanceStatus.present;
                  return (
                    <button
                      key={student.id.toString()}
                      type="button"
                      onClick={() => toggle(student.id.toString())}
                      className={`w-full glass-card p-4 flex items-center gap-4 transition-smooth cursor-pointer text-left
                        ${
                          isPresent
                            ? "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                            : "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                        }`}
                      data-ocid={`attendance.item.${i + 1}`}
                    >
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-smooth
                          ${
                            isPresent
                              ? "bg-primary/10 border border-primary/30"
                              : "bg-destructive/10 border border-destructive/30"
                          }`}
                      >
                        {isPresent ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : (
                          <X className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Roll #{student.rollNumber} · {student.contactEmail}
                        </p>
                      </div>
                      <Badge
                        className={`shrink-0 text-xs font-semibold ${
                          isPresent
                            ? "bg-primary/15 text-primary border-primary/25 hover:bg-primary/20"
                            : "bg-destructive/15 text-destructive border-destructive/25 hover:bg-destructive/20"
                        }`}
                      >
                        {isPresent ? "Present" : "Absent"}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>

            {/* Save button */}
            {classStudents.length > 0 && (
              <Button
                type="button"
                onClick={handleSave}
                disabled={markAttendance.isPending}
                className="w-full sm:w-auto gradient-primary text-primary-foreground font-semibold shadow-elevated gap-2"
                data-ocid="attendance.save_button"
              >
                <Save className="h-4 w-4" />
                {markAttendance.isPending ? "Saving…" : "Save Attendance"}
              </Button>
            )}
          </TabsContent>

          {/* ── View Stats Tab ── */}
          <TabsContent
            value="stats"
            className="mt-4 space-y-3"
            data-ocid="attendance.stats_list"
          >
            {isLoading ? (
              <>
                <Skeleton key="sk0" className="h-24 w-full rounded-xl" />
                <Skeleton key="sk1" className="h-24 w-full rounded-xl" />
                <Skeleton key="sk2" className="h-24 w-full rounded-xl" />
                <Skeleton key="sk3" className="h-24 w-full rounded-xl" />
                <Skeleton key="sk4" className="h-24 w-full rounded-xl" />
                <Skeleton key="sk5" className="h-24 w-full rounded-xl" />
              </>
            ) : classStudents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 glass-card rounded-xl"
                data-ocid="attendance.stats_empty_state"
              >
                <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No students in class "{className}"
                </p>
              </div>
            ) : (
              classStudents.map((student) => (
                <StatsRow key={student.id.toString()} student={student} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
