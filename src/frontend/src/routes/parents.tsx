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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddParent,
  useDeleteParent,
  useListParents,
  useUpdateParent,
} from "@/lib/backend-hooks";
import type { Id, ParentPayload, ParentView } from "@/types";
import {
  Heart,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm: ParentPayload = {
  name: "",
  studentIds: [],
  contactPhone: "",
  contactEmail: "",
};

function parseStudentIds(raw: string): Id[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => BigInt(s));
}

function formatStudentIds(ids: Id[]): string {
  return ids.map(String).join(", ");
}

type DialogMode = { kind: "add" } | { kind: "edit"; parent: ParentView };

export function ParentsPage() {
  const { data: parents, isLoading } = useListParents();
  const addParent = useAddParent();
  const updateParent = useUpdateParent();
  const deleteParent = useDeleteParent();

  const [search, setSearch] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [form, setForm] = useState<ParentPayload>(emptyForm);
  const [studentIdsRaw, setStudentIdsRaw] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ParentView | null>(null);

  const filtered = (parents ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contactPhone.includes(search) ||
      p.contactEmail.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setForm(emptyForm);
    setStudentIdsRaw("");
    setDialogMode({ kind: "add" });
  }

  function openEdit(parent: ParentView) {
    setForm({
      name: parent.name,
      contactPhone: parent.contactPhone,
      contactEmail: parent.contactEmail,
      studentIds: parent.studentIds,
    });
    setStudentIdsRaw(formatStudentIds(parent.studentIds));
    setDialogMode({ kind: "edit", parent });
  }

  function closeDialog() {
    setDialogMode(null);
    setForm(emptyForm);
    setStudentIdsRaw("");
  }

  const isAdd = dialogMode?.kind === "add";
  const isPending = isAdd ? addParent.isPending : updateParent.isPending;

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    const payload: ParentPayload = {
      ...form,
      studentIds: parseStudentIds(studentIdsRaw),
    };
    try {
      if (dialogMode?.kind === "add") {
        await addParent.mutateAsync(payload);
        toast.success("Parent added successfully");
      } else if (dialogMode?.kind === "edit") {
        await updateParent.mutateAsync({
          id: dialogMode.parent.id,
          payload,
        });
        toast.success("Parent updated successfully");
      }
      closeDialog();
    } catch {
      toast.error(isAdd ? "Failed to add parent" : "Failed to update parent");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteParent.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed`);
    } catch {
      toast.error("Failed to delete parent");
    } finally {
      setDeleteTarget(null);
    }
  }

  const avatarColors = [
    "from-primary/30 to-primary/10 text-primary",
    "from-accent/30 to-accent/10 text-accent",
    "from-blue-500/30 to-blue-500/10 text-blue-500",
    "from-purple-500/30 to-purple-500/10 text-purple-500",
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6" data-ocid="parents.page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Parents
                </h1>
                <Badge
                  className="gradient-primary text-white border-0 font-semibold"
                  data-ocid="parents.count_badge"
                >
                  {parents?.length ?? 0}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage parent accounts and family links
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={openAdd}
            className="gradient-primary text-white font-semibold shadow-soft shrink-0"
            data-ocid="parents.add_button"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Parent
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 glass border-border/50"
            data-ocid="parents.search_input"
          />
        </div>

        {/* Stats bar */}
        {!isLoading && (parents?.length ?? 0) > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Parents</p>
                <p className="font-bold text-foreground font-display">
                  {parents?.length ?? 0}
                </p>
              </div>
            </div>
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Linked Children</p>
                <p className="font-bold text-foreground font-display">
                  {(parents ?? []).reduce(
                    (sum, p) => sum + p.studentIds.length,
                    0,
                  )}
                </p>
              </div>
            </div>
            <div className="glass-card p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">With Email</p>
                <p className="font-bold text-foreground font-display">
                  {(parents ?? []).filter((p) => p.contactEmail).length}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator className="opacity-50" />

        {/* Parent List */}
        <div className="space-y-2" data-ocid="parents.list">
          {isLoading ? (
            <>
              <Skeleton key="sk0" className="h-20 w-full rounded-xl" />
              <Skeleton key="sk1" className="h-20 w-full rounded-xl" />
              <Skeleton key="sk2" className="h-20 w-full rounded-xl" />
              <Skeleton key="sk3" className="h-20 w-full rounded-xl" />
              <Skeleton key="sk4" className="h-20 w-full rounded-xl" />
            </>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 glass-card rounded-xl border border-dashed border-border"
              data-ocid="parents.empty_state"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-foreground font-semibold font-display">
                {search ? "No matching parents" : "No parents yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? "Try a different name, phone, or email"
                  : "Add your first parent to get started"}
              </p>
              {!search && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5"
                  onClick={openAdd}
                  data-ocid="parents.empty_add_button"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Parent
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((parent, i) => {
                const colorClass = avatarColors[i % avatarColors.length];
                return (
                  <div
                    key={parent.id.toString()}
                    className="glass-card p-4 flex items-center gap-4 hover:shadow-soft transition-smooth group"
                    data-ocid={`parents.item.${i + 1}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-br ${colorClass} border border-white/10 flex items-center justify-center shrink-0`}
                    >
                      <span className="font-bold text-sm font-display">
                        {parent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground truncate font-display">
                          {parent.name}
                        </p>
                        {parent.studentIds.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0"
                            data-ocid={`parents.children_badge.${i + 1}`}
                          >
                            <Users className="mr-1 h-2.5 w-2.5" />
                            {parent.studentIds.length}{" "}
                            {parent.studentIds.length === 1
                              ? "child"
                              : "children"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {parent.contactPhone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {parent.contactPhone}
                          </span>
                        )}
                        {parent.contactEmail && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {parent.contactEmail}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-smooth">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-smooth"
                        onClick={() => openEdit(parent)}
                        data-ocid={`parents.edit_button.${i + 1}`}
                        aria-label={`Edit ${parent.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-smooth"
                        onClick={() => setDeleteTarget(parent)}
                        data-ocid={`parents.delete_button.${i + 1}`}
                        aria-label={`Delete ${parent.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-md" data-ocid="parents.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {isAdd ? "Add Parent" : "Edit Parent"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Full Name *</Label>
              <Input
                id="p-name"
                placeholder="e.g. Ravi Kumar Singh"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                data-ocid="parents.form.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-phone">Phone Number</Label>
              <Input
                id="p-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    contactPhone: e.target.value,
                  }))
                }
                data-ocid="parents.form.phone_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email Address</Label>
              <Input
                id="p-email"
                type="email"
                placeholder="parent@example.com"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                data-ocid="parents.form.email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-students">
                Linked Student IDs{" "}
                <span className="text-muted-foreground font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Input
                id="p-students"
                placeholder="e.g. 1, 2, 3"
                value={studentIdsRaw}
                onChange={(e) => setStudentIdsRaw(e.target.value)}
                data-ocid="parents.form.student_ids_input"
              />
              {studentIdsRaw && (
                <p className="text-xs text-muted-foreground">
                  {parseStudentIds(studentIdsRaw).length} student(s) linked
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              data-ocid="parents.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="gradient-primary text-white"
              data-ocid="parents.submit_button"
            >
              {isPending
                ? isAdd
                  ? "Adding…"
                  : "Saving…"
                : isAdd
                  ? "Add Parent"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="parents.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Parent
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="parents.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="parents.delete_confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
