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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddTeacher,
  useDeleteTeacher,
  useListTeachers,
  useUpdateTeacher,
} from "@/lib/backend-hooks";
import type { Id, TeacherPayload, TeacherView } from "@/types";
import {
  BookOpen,
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

const emptyForm: TeacherPayload = {
  name: "",
  subjects: [],
  contactPhone: "",
  contactEmail: "",
};

function TeacherFormDialog({
  open,
  onOpenChange,
  title,
  initialForm,
  initialSubjects,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initialForm: TeacherPayload;
  initialSubjects: string;
  isPending: boolean;
  onSubmit: (form: TeacherPayload, subjects: string) => void;
}) {
  const [form, setForm] = useState<TeacherPayload>(initialForm);
  const [subjectsInput, setSubjectsInput] = useState(initialSubjects);

  const handleOpenChange = (v: boolean) => {
    if (v) {
      setForm(initialForm);
      setSubjectsInput(initialSubjects);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="teachers.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="t-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="t-name"
              placeholder="Dr. Rajan Sharma"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              data-ocid="teachers.form.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-subjects">
              Subjects{" "}
              <span className="text-muted-foreground text-xs">
                (comma separated)
              </span>
            </Label>
            <Input
              id="t-subjects"
              placeholder="Mathematics, Physics"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              data-ocid="teachers.form.subjects_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-phone">Phone</Label>
            <Input
              id="t-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.contactPhone}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactPhone: e.target.value }))
              }
              data-ocid="teachers.form.phone_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-email">Email</Label>
            <Input
              id="t-email"
              type="email"
              placeholder="teacher@school.edu"
              value={form.contactEmail}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactEmail: e.target.value }))
              }
              data-ocid="teachers.form.email_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            data-ocid="teachers.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit(form, subjectsInput)}
            disabled={isPending}
            className="gradient-primary text-primary-foreground"
            data-ocid="teachers.submit_button"
          >
            {isPending ? "Saving..." : title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TeachersPage() {
  const { data: teachers, isLoading } = useListTeachers();
  const addTeacher = useAddTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTeacher, setEditTeacher] = useState<TeacherView | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id;
    name: string;
  } | null>(null);

  const filtered = (teachers ?? []).filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  const handleAdd = async (form: TeacherPayload, subjectsInput: string) => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await addTeacher.mutateAsync({ ...form, subjects });
      toast.success("Teacher added successfully");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add teacher");
    }
  };

  const handleEdit = async (form: TeacherPayload, subjectsInput: string) => {
    if (!editTeacher) return;
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await updateTeacher.mutateAsync({
        id: editTeacher.id,
        payload: { ...form, subjects },
      });
      toast.success("Teacher updated successfully");
      setEditTeacher(null);
    } catch {
      toast.error("Failed to update teacher");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTeacher.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove teacher");
    }
  };

  const count = teachers?.length ?? 0;

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in" data-ocid="teachers.page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Teachers
                </h1>
                {!isLoading && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 font-semibold"
                    data-ocid="teachers.count_badge"
                  >
                    {count}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {count === 1
                  ? "1 teaching staff member"
                  : `${count} teaching staff members`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowAdd(true)}
            className="gradient-primary text-primary-foreground font-semibold shrink-0 shadow-soft"
            data-ocid="teachers.add_button"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 glass border-border/50"
            data-ocid="teachers.search_input"
          />
        </div>

        {/* List */}
        <div className="space-y-3" data-ocid="teachers.list">
          {isLoading ? (
            <>
              <Skeleton key="sk0" className="h-24 w-full rounded-xl" />
              <Skeleton key="sk1" className="h-24 w-full rounded-xl" />
              <Skeleton key="sk2" className="h-24 w-full rounded-xl" />
              <Skeleton key="sk3" className="h-24 w-full rounded-xl" />
            </>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 glass-card rounded-xl border border-border/50"
              data-ocid="teachers.empty_state"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                {search ? "No teachers match your search" : "No teachers yet"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {search
                  ? "Try a different name or subject"
                  : "Add your first teacher to get started"}
              </p>
              {!search && (
                <Button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="gradient-primary text-primary-foreground"
                  data-ocid="teachers.empty_add_button"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add First Teacher
                </Button>
              )}
            </div>
          ) : (
            filtered.map((teacher, i) => (
              <div
                key={teacher.id.toString()}
                className="glass-card rounded-xl border border-border/40 p-4 flex items-start gap-4 hover:border-primary/30 hover:shadow-soft transition-smooth"
                data-ocid={`teachers.item.${i + 1}`}
              >
                {/* Avatar */}
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-soft">
                  <span className="text-primary-foreground font-bold text-lg font-display">
                    {teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-base">
                    {teacher.name}
                  </p>

                  {/* Subject badges — gold accent */}
                  {teacher.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {teacher.subjects.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accent/15 text-accent border border-accent/30"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    {teacher.contactPhone && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-primary" />
                        {teacher.contactPhone}
                      </span>
                    )}
                    {teacher.contactEmail && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                        <Mail className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate">{teacher.contactEmail}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                    onClick={() => setEditTeacher(teacher)}
                    aria-label={`Edit ${teacher.name}`}
                    data-ocid={`teachers.edit_button.${i + 1}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                    onClick={() =>
                      setDeleteTarget({ id: teacher.id, name: teacher.name })
                    }
                    aria-label={`Delete ${teacher.name}`}
                    data-ocid={`teachers.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <TeacherFormDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        title="Add New Teacher"
        initialForm={emptyForm}
        initialSubjects=""
        isPending={addTeacher.isPending}
        onSubmit={handleAdd}
      />

      {/* Edit Dialog */}
      {editTeacher && (
        <TeacherFormDialog
          open={!!editTeacher}
          onOpenChange={(v) => {
            if (!v) setEditTeacher(null);
          }}
          title="Edit Teacher"
          initialForm={{
            name: editTeacher.name,
            subjects: editTeacher.subjects,
            contactPhone: editTeacher.contactPhone,
            contactEmail: editTeacher.contactEmail,
          }}
          initialSubjects={editTeacher.subjects.join(", ")}
          isPending={updateTeacher.isPending}
          onSubmit={handleEdit}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="teachers.confirm_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Remove Teacher?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="teachers.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="teachers.confirm_button"
            >
              {deleteTeacher.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
