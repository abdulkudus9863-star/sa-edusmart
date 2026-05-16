import { Grade } from "@/backend";
import type { SubjectMarkEntry } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useCreateExam,
  useEnterMarks,
  useGetReportCard,
  useListExams,
  useListStudents,
} from "@/lib/backend-hooks";
import type { ExamPayload } from "@/types";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Plus,
  Printer,
  Star,
  Trophy,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Grade helpers ──────────────────────────────────────────────────────────
const gradeColors: Record<Grade, string> = {
  [Grade.aPlus]: "bg-primary/15 text-primary border-primary/30",
  [Grade.a]:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  [Grade.bPlus]:
    "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  [Grade.b]: "bg-blue-500/10 text-blue-500 border-blue-400/20",
  [Grade.cPlus]:
    "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400",
  [Grade.c]:
    "bg-yellow-400/10 text-yellow-600 border-yellow-400/20 dark:text-yellow-400",
  [Grade.d]:
    "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400",
  [Grade.f]: "bg-destructive/15 text-destructive border-destructive/30",
};

const gradeLabel: Record<Grade, string> = {
  [Grade.aPlus]: "A+",
  [Grade.a]: "A",
  [Grade.bPlus]: "B+",
  [Grade.b]: "B",
  [Grade.cPlus]: "C+",
  [Grade.c]: "C",
  [Grade.d]: "D",
  [Grade.f]: "F",
};

const gradeBarColor: Record<Grade, string> = {
  [Grade.aPlus]: "bg-primary",
  [Grade.a]: "bg-emerald-500",
  [Grade.bPlus]: "bg-blue-500",
  [Grade.b]: "bg-blue-400",
  [Grade.cPlus]: "bg-yellow-500",
  [Grade.c]: "bg-yellow-400",
  [Grade.d]: "bg-orange-500",
  [Grade.f]: "bg-destructive",
};

const emptyExam: ExamPayload = {
  name: "",
  subjects: [],
  date: "",
  totalMarks: BigInt(100),
};

// ─── Exam List Tab ──────────────────────────────────────────────────────────
function ExamListTab({ onCreateClick }: { onCreateClick: () => void }) {
  const { data: exams, isLoading } = useListExams();
  return (
    <div className="space-y-3" data-ocid="exams.list">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {exams?.length ?? 0} exams on record
        </p>
        <Button
          type="button"
          size="sm"
          onClick={onCreateClick}
          className="gradient-primary text-white font-semibold"
          data-ocid="exams.add_button"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create Exam
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton key="sk0" className="h-20 w-full rounded-xl" />
          <Skeleton key="sk1" className="h-20 w-full rounded-xl" />
          <Skeleton key="sk2" className="h-20 w-full rounded-xl" />
        </div>
      ) : (exams ?? []).length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 glass-card rounded-xl"
          data-ocid="exams.empty_state"
        >
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">
            No exams created yet
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onCreateClick}
            data-ocid="exams.empty_add_button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Exam
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {(exams ?? []).map((exam, i) => (
            <div
              key={exam.id.toString()}
              className="glass-card p-4 flex items-start gap-4 hover:shadow-soft transition-smooth"
              data-ocid={`exams.item.${i + 1}`}
            >
              <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-foreground truncate">
                    {exam.name}
                  </p>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-xs border-accent/30 text-accent bg-accent/5"
                  >
                    {exam.totalMarks.toString()} marks
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {exam.date}
                  </span>
                  {exam.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Enter Marks Tab ────────────────────────────────────────────────────────
function EnterMarksTab() {
  const { data: exams } = useListExams();
  const { data: students } = useListStudents();
  const enterMarks = useEnterMarks();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});

  const selectedExam = exams?.find((e) => e.id.toString() === selectedExamId);

  const handleExamChange = (val: string) => {
    setSelectedExamId(val);
    setMarks({});
  };

  const handleSave = async () => {
    if (!selectedExamId || !selectedStudentId) {
      toast.error("Please select exam and student");
      return;
    }
    if (!selectedExam) return;
    const entries: SubjectMarkEntry[] = selectedExam.subjects.map(
      (subject) => ({
        studentId: BigInt(selectedStudentId),
        subject,
        marksObtained: BigInt(marks[subject] || 0),
      }),
    );
    try {
      await enterMarks.mutateAsync({ examId: BigInt(selectedExamId), entries });
      toast.success("Marks saved successfully");
      setMarks({});
    } catch {
      toast.error("Failed to save marks");
    }
  };

  return (
    <div className="space-y-5" data-ocid="enter-marks.panel">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" /> Select Exam &
          Student
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={selectedExamId} onValueChange={handleExamChange}>
              <SelectTrigger data-ocid="enter-marks.exam_select">
                <SelectValue placeholder="Choose exam..." />
              </SelectTrigger>
              <SelectContent>
                {(exams ?? []).map((e) => (
                  <SelectItem key={e.id.toString()} value={e.id.toString()}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger data-ocid="enter-marks.student_select">
                <SelectValue placeholder="Choose student..." />
              </SelectTrigger>
              <SelectContent>
                {(students ?? []).map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.name}{" "}
                    <span className="text-muted-foreground">
                      ({s.rollNumber})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedExam && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" /> Enter Marks —{" "}
            {selectedExam.name}
            <Badge
              variant="outline"
              className="ml-auto text-xs border-accent/30 text-accent bg-accent/5"
            >
              Max: {selectedExam.totalMarks.toString()} per subject
            </Badge>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedExam.subjects.map((subject) => (
              <div key={subject} className="space-y-1.5">
                <Label htmlFor={`mark-${subject}`}>{subject}</Label>
                <Input
                  id={`mark-${subject}`}
                  type="number"
                  min={0}
                  max={Number(selectedExam.totalMarks)}
                  placeholder={`0 – ${selectedExam.totalMarks.toString()}`}
                  value={marks[subject] ?? ""}
                  onChange={(e) =>
                    setMarks((p) => ({ ...p, [subject]: e.target.value }))
                  }
                  data-ocid={`enter-marks.${subject.toLowerCase().replace(/\s+/g, "_")}_input`}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={enterMarks.isPending || !selectedStudentId}
            className="w-full gradient-primary text-white font-semibold"
            data-ocid="enter-marks.save_button"
          >
            {enterMarks.isPending ? "Saving..." : "Save Marks"}
          </Button>
        </div>
      )}

      {!selectedExam && (
        <div
          className="flex flex-col items-center justify-center py-10 glass-card rounded-xl text-center"
          data-ocid="enter-marks.empty_state"
        >
          <ClipboardList className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            Select an exam above to enter marks
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Report Card Tab ────────────────────────────────────────────────────────
function ReportCardTab() {
  const { data: exams } = useListExams();
  const { data: students } = useListStudents();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const enabled = !!selectedExamId && !!selectedStudentId;
  const reportCardQuery = useGetReportCard(
    selectedStudentId ? BigInt(selectedStudentId) : BigInt(0),
    selectedExamId ? BigInt(selectedExamId) : BigInt(0),
  );
  const rc = reportCardQuery.data;

  const selectedStudent = students?.find(
    (s) => s.id.toString() === selectedStudentId,
  );

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>Report Card — ${rc?.examName ?? ""}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:"Segoe UI",Arial,sans-serif;color:#111;background:#fff;padding:32px}
        .header{text-align:center;margin-bottom:24px;border-bottom:2px solid #22c55e;padding-bottom:16px}
        .school-name{font-size:22px;font-weight:700;color:#166534}
        .school-sub{font-size:12px;color:#555;margin-top:4px}
        .exam-title{font-size:16px;font-weight:600;margin-top:12px}
        .meta{display:flex;justify-content:space-between;margin:16px 0;padding:12px;background:#f0fdf4;border-radius:8px}
        .meta-item label{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.5px}
        .meta-item p{font-size:14px;font-weight:600}
        table{width:100%;border-collapse:collapse;margin:16px 0}
        th{background:#166534;color:#fff;padding:8px 12px;text-align:left;font-size:12px}
        td{padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px}
        tr:nth-child(even){background:#f9fafb}
        .grade-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700;font-size:12px}
        .grade-ap,.grade-a{background:#dcfce7;color:#166534}
        .grade-bp,.grade-b{background:#dbeafe;color:#1d4ed8}
        .grade-cp,.grade-c{background:#fef9c3;color:#854d0e}
        .grade-d{background:#ffedd5;color:#9a3412}
        .grade-f{background:#fee2e2;color:#991b1b}
        .summary{display:flex;gap:24px;justify-content:center;margin:20px 0;padding:16px;background:#f0fdf4;border-radius:8px}
        .summary-item{text-align:center}
        .summary-item .val{font-size:24px;font-weight:700;color:#166534}
        .summary-item .lbl{font-size:11px;color:#666}
        .footer{margin-top:32px;text-align:center;font-size:11px;color:#999;border-top:1px solid #e5e7eb;padding-top:12px}
      </style></head><body>
      <div class="header">
        <div class="school-name">S.A. Educational Institute</div>
        <div class="school-sub">Irong Chesaba, Thoubal District, Manipur</div>
        <div class="exam-title">${rc?.examName ?? ""} — Report Card</div>
      </div>
      <div class="meta">
        <div class="meta-item"><label>Student</label><p>${selectedStudent?.name ?? ""}</p></div>
        <div class="meta-item"><label>Roll No.</label><p>${selectedStudent?.rollNumber ?? ""}</p></div>
        <div class="meta-item"><label>Class</label><p>${selectedStudent?.className ?? ""}</p></div>
      </div>
      <table>
        <thead><tr><th>Subject</th><th>Marks Obtained</th><th>Total Marks</th><th>Grade</th></tr></thead>
        <tbody>
          ${(rc?.subjects ?? [])
            .map(
              (sub) => `<tr>
            <td>${sub.subject}</td>
            <td>${sub.marksObtained.toString()}</td>
            <td>${sub.totalMarks.toString()}</td>
            <td><span class="grade-badge grade-${gradeLabel[sub.grade].toLowerCase().replace("\u002B", "p")}">${gradeLabel[sub.grade]}</span></td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <div class="summary">
        <div class="summary-item"><div class="val">${rc?.totalObtained.toString()}/${rc?.totalPossible.toString()}</div><div class="lbl">Total Score</div></div>
        <div class="summary-item"><div class="val">${rc?.percentage.toFixed(1)}%</div><div class="lbl">Percentage</div></div>
        <div class="summary-item"><div class="val">${rc ? gradeLabel[rc.grade] : ""}</div><div class="lbl">Overall Grade</div></div>
      </div>
      <div class="footer">Generated by SA EduSmart &mdash; S.A. Educational Institute &mdash; ${new Date().toLocaleDateString()}</div>
    </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-5" data-ocid="report-card.panel">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-4 w-4 text-accent" /> Report Card Lookup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Select Exam</Label>
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger data-ocid="report-card.exam_select">
                <SelectValue placeholder="Choose exam..." />
              </SelectTrigger>
              <SelectContent>
                {(exams ?? []).map((e) => (
                  <SelectItem key={e.id.toString()} value={e.id.toString()}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Select Student</Label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger data-ocid="report-card.student_select">
                <SelectValue placeholder="Choose student..." />
              </SelectTrigger>
              <SelectContent>
                {(students ?? []).map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.name}{" "}
                    <span className="text-muted-foreground">
                      ({s.rollNumber})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {enabled && (
        <div>
          {reportCardQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : rc ? (
            <div className="space-y-4" ref={printRef}>
              {/* Summary Banner */}
              <div className="glass-card p-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-accent pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-display">
                      {rc.examName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedStudent?.name} &bull;{" "}
                      {selectedStudent?.rollNumber} &bull;{" "}
                      {selectedStudent?.className}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {rc.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Percentage
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {rc.totalObtained.toString()}
                        <span className="text-sm text-muted-foreground">
                          /{rc.totalPossible.toString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Score
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <Badge
                        className={`text-lg px-3 py-1 font-bold border ${gradeColors[rc.grade]}`}
                      >
                        {gradeLabel[rc.grade]}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Overall
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${gradeBarColor[rc.grade]}`}
                    style={{ width: `${Math.min(rc.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" /> Subject Breakdown
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
                    data-ocid="report-card.print_button"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print / Download
                  </Button>
                </div>

                <div className="space-y-2">
                  {rc.subjects.map((sub) => (
                    <div
                      key={sub.subject}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {sub.subject}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {sub.marksObtained.toString()}/
                              {sub.totalMarks.toString()}
                            </span>
                            <Badge
                              className={`text-xs border ${gradeColors[sub.grade]}`}
                            >
                              {gradeLabel[sub.grade]}
                            </Badge>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${gradeBarColor[sub.grade]}`}
                            style={{
                              width: `${sub.totalMarks > 0 ? Math.min((Number(sub.marksObtained) / Number(sub.totalMarks)) * 100, 100) : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Footer */}
              <div className="glass-card p-4 flex items-center gap-3 border-primary/10">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    S.A. Educational Institute
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Irong Chesaba, Thoubal District, Manipur
                  </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-10 glass-card rounded-xl text-center"
              data-ocid="report-card.empty_state"
            >
              <Trophy className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">
                No report card found
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Marks may not have been entered yet
              </p>
            </div>
          )}
        </div>
      )}

      {!enabled && (
        <div
          className="flex flex-col items-center justify-center py-10 glass-card rounded-xl text-center"
          data-ocid="report-card.prompt_state"
        >
          <Trophy className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            Select exam and student to view report card
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Create Exam Dialog ─────────────────────────────────────────────────────
function CreateExamDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const createExam = useCreateExam();
  const [form, setForm] = useState<ExamPayload>(emptyExam);
  const [subjectsInput, setSubjectsInput] = useState("");

  const handleCreate = async () => {
    if (!form.name || !form.date) {
      toast.error("Name and date are required");
      return;
    }
    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await createExam.mutateAsync({ ...form, subjects });
      toast.success("Exam created successfully");
      onClose();
      setForm(emptyExam);
      setSubjectsInput("");
    } catch {
      toast.error("Failed to create exam");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="exams.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Exam</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ename">Exam Name *</Label>
            <Input
              id="ename"
              placeholder="Mid-term 2025"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              data-ocid="exams.form.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edate">Date *</Label>
            <Input
              id="edate"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              data-ocid="exams.form.date_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="esubjects">Subjects (comma separated)</Label>
            <Input
              id="esubjects"
              placeholder="Math, Science, English, Social Studies"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              data-ocid="exams.form.subjects_input"
            />
            <p className="text-xs text-muted-foreground">
              Each subject will have marks entered separately
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="etotal">Total Marks Per Subject</Label>
            <Input
              id="etotal"
              type="number"
              placeholder="100"
              defaultValue={100}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  totalMarks: BigInt(e.target.value || 100),
                }))
              }
              data-ocid="exams.form.total_marks_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="exams.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={createExam.isPending}
            className="gradient-primary text-white"
            data-ocid="exams.submit_button"
          >
            {createExam.isPending ? "Creating..." : "Create Exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page Root ──────────────────────────────────────────────────────────────
export function ExamsPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in" data-ocid="exams.page">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Exams &amp; Results
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage exams, enter marks, and view report cards
            </p>
          </div>
        </div>

        <Tabs defaultValue="list" data-ocid="exams.tabs">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="list"
              data-ocid="exams.list_tab"
              className="gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" /> Exams List
            </TabsTrigger>
            <TabsTrigger
              value="marks"
              data-ocid="exams.enter_marks_tab"
              className="gap-1.5"
            >
              <ClipboardList className="h-3.5 w-3.5" /> Enter Marks
            </TabsTrigger>
            <TabsTrigger
              value="report"
              data-ocid="exams.report_card_tab"
              className="gap-1.5"
            >
              <Trophy className="h-3.5 w-3.5" /> Report Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ExamListTab onCreateClick={() => setShowCreate(true)} />
          </TabsContent>

          <TabsContent value="marks">
            <EnterMarksTab />
          </TabsContent>

          <TabsContent value="report">
            <ReportCardTab />
          </TabsContent>
        </Tabs>
      </div>

      <CreateExamDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </Layout>
  );
}
