import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddStudent,
  useDeleteStudent,
  useListStudents,
  useUpdateStudent,
} from "@/lib/backend-hooks";
import type { StudentPayload, StudentView } from "@/types";
import {
  GraduationCap,
  Hash,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm: StudentPayload = {
  name: "",
  rollNumber: "",
  className: "",
  contactPhone: "",
  contactEmail: "",
};

type FormField = [string, keyof StudentPayload, string, string];

const FORM_FIELDS: FormField[] = [
  ["Full Name *", "name", "text", "e.g. Arjun Singh"],
  ["Roll Number *", "rollNumber", "text", "e.g. 10A-001"],
  ["Class / Section *", "className", "text", "e.g. 10-A"],
  ["Phone", "contactPhone", "tel", "e.g. +91 98765 43210"],
  ["Email", "contactEmail", "email", "e.g. student@sa.edu"],
];

function StudentFormDialog({
  open,
  onOpenChange,
  title,
  form,
  onChange,
  onSubmit,
  isPending,
  submitLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  form: StudentPayload;
  onChange: (key: keyof StudentPayload, value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="students.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Fill in the details below. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {FORM_FIELDS.map(([label, key, type, placeholder]) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`form-${key}`} className="text-sm font-medium">
                {label}
              </Label>
              <Input
                id={`form-${key}`}
                type={type}
                placeholder={placeholder}
                value={(form[key] as string) ?? ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="border-border/60 focus:border-primary/60 transition-colors"
                data-ocid={`students.form.${key}_input`}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="students.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="gradient-primary text-white font-semibold"
            data-ocid="students.submit_button"
          >
            {isPending ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StudentTableRow({
  student,
  index,
  onEdit,
  onDelete,
}: {
  student: StudentView;
  index: number;
  onEdit: (s: StudentView) => void;
  onDelete: (s: StudentView) => void;
}) {
  return (
    <tr
      className="border-b border-border/40 hover:bg-primary/5 transition-colors group"
      data-ocid={`students.item.${index}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm font-display">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold text-foreground text-sm truncate max-w-[160px]">
            {student.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 font-medium text-xs"
        >
          {student.className}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
          <Hash className="h-3 w-3 text-accent" />
          {student.rollNumber}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3 w-3" />
          {student.contactPhone || <span className="opacity-40">—</span>}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground truncate max-w-[200px]">
          <Mail className="h-3 w-3" />
          {student.contactEmail || <span className="opacity-40">—</span>}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
            onClick={() => onEdit(student)}
            data-ocid={`students.edit_button.${index}`}
            aria-label={`Edit ${student.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
            onClick={() => onDelete(student)}
            data-ocid={`students.delete_button.${index}`}
            aria-label={`Delete ${student.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function StudentsPage() {
  const { data: students, isLoading } = useListStudents();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<StudentView | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentView | null>(null);
  const [addForm, setAddForm] = useState<StudentPayload>(emptyForm);
  const [editForm, setEditForm] = useState<StudentPayload>(emptyForm);

  const filtered = (students ?? []).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.className.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddField = (key: keyof StudentPayload, value: string) =>
    setAddForm((prev) => ({ ...prev, [key]: value }));

  const handleEditField = (key: keyof StudentPayload, value: string) =>
    setEditForm((prev) => ({ ...prev, [key]: value }));

  const handleAdd = async () => {
    if (!addForm.name || !addForm.rollNumber || !addForm.className) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addStudent.mutateAsync(addForm);
      toast.success("Student added successfully");
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      toast.error("Failed to add student");
    }
  };

  const openEdit = (student: StudentView) => {
    setEditTarget(student);
    setEditForm({
      name: student.name,
      rollNumber: student.rollNumber,
      className: student.className,
      contactPhone: student.contactPhone,
      contactEmail: student.contactEmail,
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    if (!editForm.name || !editForm.rollNumber || !editForm.className) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await updateStudent.mutateAsync({ id: editTarget.id, payload: editForm });
      toast.success("Student updated successfully");
      setEditTarget(null);
    } catch {
      toast.error("Failed to update student");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStudent.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove student");
    }
  };

  return (
    <Layout>
      <div
        className="p-4 sm:p-6 space-y-6 animate-fade-in"
        data-ocid="students.page"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold font-display text-foreground leading-tight">
                  Students
                </h1>
                {!isLoading && (
                  <Badge
                    className="bg-primary/15 text-primary border-primary/25 font-semibold tabular-nums"
                    data-ocid="students.count_badge"
                  >
                    {students?.length ?? 0}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Manage student enrollments and records
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowAdd(true)}
            className="gradient-primary text-white font-semibold shrink-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-smooth"
            data-ocid="students.add_button"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, roll number or class\u2026"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card/60 border-border/50 backdrop-blur-sm focus:border-primary/50 transition-colors"
            data-ocid="students.search_input"
          />
          {search && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {filtered.length} found
            </span>
          )}
        </div>

        {/* Table card */}
        <div className="glass-card overflow-hidden" data-ocid="students.table">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <div key="sk0" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div key="sk1" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div key="sk2" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div key="sk3" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div key="sk4" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div key="sk5" className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 px-8"
              data-ocid="students.empty_state"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-primary/50" />
              </div>
              <h3 className="font-semibold font-display text-foreground mb-1.5">
                {search ? "No results found" : "No students enrolled yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs mb-5">
                {search
                  ? `No students match \u201c${search}\u201d. Try a different search term.`
                  : "Get started by adding your first student to SA EduSmart."}
              </p>
              {!search && (
                <Button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="gradient-primary text-white font-medium"
                  data-ocid="students.empty_add_button"
                >
                  <Plus className="mr-2 h-4 w-4" /> Enroll First Student
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Roll No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, i) => (
                    <StudentTableRow
                      key={student.id.toString()}
                      student={student}
                      index={i + 1}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary footer */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filtered.length} of {students?.length ?? 0} students
          </p>
        )}
      </div>

      {/* Add student dialog */}
      <StudentFormDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        title="Enroll New Student"
        form={addForm}
        onChange={handleAddField}
        onSubmit={handleAdd}
        isPending={addStudent.isPending}
        submitLabel="Enroll Student"
      />

      {/* Edit student dialog */}
      <StudentFormDialog
        open={!!editTarget}
        onOpenChange={(v) => {
          if (!v) setEditTarget(null);
        }}
        title={`Edit \u2014 ${editTarget?.name ?? ""}`}
        form={editForm}
        onChange={handleEditField}
        onSubmit={handleEdit}
        isPending={updateStudent.isPending}
        submitLabel="Save Changes"
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="students.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Remove Student
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              from SA EduSmart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="students.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="students.confirm_button"
            >
              {deleteStudent.isPending ? "Removing\u2026" : "Yes, Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
