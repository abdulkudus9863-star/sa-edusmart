import { RecipientGroup } from "@/backend";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAnnouncement,
  useListAnnouncements,
} from "@/lib/backend-hooks";
import type { AnnouncementPayload, AnnouncementView } from "@/types";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Heart,
  Megaphone,
  Plus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FilterTab = "_all" | RecipientGroup;

const groupConfig: Record<
  RecipientGroup,
  { label: string; badgeClass: string; tabClass: string; icon: React.ReactNode }
> = {
  [RecipientGroup.all]: {
    label: "All",
    badgeClass:
      "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20",
    tabClass:
      "data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-primary/40",
    icon: <Users className="h-3 w-3" />,
  },
  [RecipientGroup.students]: {
    label: "Students",
    badgeClass:
      "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
    tabClass:
      "data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/40",
    icon: <GraduationCap className="h-3 w-3" />,
  },
  [RecipientGroup.teachers]: {
    label: "Teachers",
    badgeClass: "bg-accent/15 text-accent border-accent/30 hover:bg-accent/20",
    tabClass:
      "data-[active=true]:bg-accent/15 data-[active=true]:text-accent data-[active=true]:border-accent/40",
    icon: <BookOpen className="h-3 w-3" />,
  },
  [RecipientGroup.parents]: {
    label: "Parents",
    badgeClass:
      "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
    tabClass:
      "data-[active=true]:bg-purple-500/15 data-[active=true]:text-purple-400 data-[active=true]:border-purple-500/40",
    icon: <Heart className="h-3 w-3" />,
  },
};

const FILTER_TABS: Array<{
  id: FilterTab;
  label: string;
  icon?: React.ReactNode;
}> = [
  { id: "_all", label: "All", icon: <Megaphone className="h-3.5 w-3.5" /> },
  {
    id: RecipientGroup.all,
    label: "Everyone",
    icon: <Users className="h-3.5 w-3.5" />,
  },
  {
    id: RecipientGroup.students,
    label: "Students",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
  },
  {
    id: RecipientGroup.teachers,
    label: "Teachers",
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
  {
    id: RecipientGroup.parents,
    label: "Parents",
    icon: <Heart className="h-3.5 w-3.5" />,
  },
];

const emptyForm: AnnouncementPayload = {
  title: "",
  message: "",
  recipientGroup: RecipientGroup.all,
};

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const now = Date.now();
  const diff = now - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AnnouncementCard({
  ann,
  index,
}: { ann: AnnouncementView; index: number }) {
  const cfg = groupConfig[ann.recipientGroup];
  return (
    <motion.div
      key={ann.id.toString()}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="glass-card p-5 space-y-3 hover:shadow-elevated transition-smooth border border-white/10 hover:border-primary/20 group"
      data-ocid={`announcements.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
            <Megaphone className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {ann.title}
          </h3>
        </div>
        <Badge
          className={`shrink-0 flex items-center gap-1.5 text-xs font-medium border ${cfg.badgeClass}`}
        >
          {cfg.icon}
          {cfg.label}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed pl-10">
        {ann.message}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span>{formatRelativeTime(ann.createdAt)}</span>
        {ann.createdBy && (
          <>
            <span className="text-border">·</span>
            <span className="text-muted-foreground/80">by {ann.createdBy}</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function AnnouncementsPage() {
  const { data: announcements, isLoading } = useListAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<AnnouncementPayload>(emptyForm);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("_all");

  const filtered = useMemo(() => {
    const list = announcements ?? [];
    if (activeFilter === "_all") return list;
    return list.filter((a) => a.recipientGroup === activeFilter);
  }, [announcements, activeFilter]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    try {
      await createAnnouncement.mutateAsync(form);
      toast.success("Announcement published successfully");
      setShowCreate(false);
      setForm(emptyForm);
    } catch {
      toast.error("Failed to publish announcement");
    }
  };

  const counts = useMemo(() => {
    const list = announcements ?? [];
    const map: Partial<Record<FilterTab, number>> = {
      _all: list.length,
      [RecipientGroup.students]: list.filter(
        (a) => a.recipientGroup === RecipientGroup.students,
      ).length,
      [RecipientGroup.teachers]: list.filter(
        (a) => a.recipientGroup === RecipientGroup.teachers,
      ).length,
      [RecipientGroup.parents]: list.filter(
        (a) => a.recipientGroup === RecipientGroup.parents,
      ).length,
    };
    // RecipientGroup.all might equal "all" — set separately to avoid collision
    map[RecipientGroup.all] = list.filter(
      (a) => a.recipientGroup === RecipientGroup.all,
    ).length;
    return map as Record<FilterTab, number>;
  }, [announcements]);

  return (
    <Layout>
      <div className="p-6 space-y-6" data-ocid="announcements.page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-primary" />
              </span>
              Announcements
            </h1>
            <p className="text-sm text-muted-foreground mt-1 pl-11">
              Broadcast notices to students, teachers, and parents
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setShowCreate(true)}
            className="gradient-primary text-white font-semibold shrink-0 shadow-soft"
            data-ocid="announcements.add_button"
          >
            <Plus className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-2"
          data-ocid="announcements.filter.tab"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = counts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                data-active={isActive}
                onClick={() => setActiveFilter(tab.id)}
                className={[
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-smooth",
                  isActive
                    ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                    : "bg-card/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                ].join(" ")}
                data-ocid={`announcements.filter.${tab.id}`}
              >
                {tab.icon}
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Announcements List */}
        <div className="space-y-3" data-ocid="announcements.list">
          {isLoading ? (
            <>
              <div key="sk0" className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
                <Skeleton className="h-3 w-full rounded ml-10" />
                <Skeleton className="h-3 w-3/4 rounded ml-10" />
                <Skeleton className="h-3 w-28 rounded ml-10" />
              </div>
              <div key="sk1" className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
                <Skeleton className="h-3 w-full rounded ml-10" />
                <Skeleton className="h-3 w-3/4 rounded ml-10" />
                <Skeleton className="h-3 w-28 rounded ml-10" />
              </div>
              <div key="sk2" className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
                <Skeleton className="h-3 w-full rounded ml-10" />
                <Skeleton className="h-3 w-3/4 rounded ml-10" />
                <Skeleton className="h-3 w-28 rounded ml-10" />
              </div>
              <div key="sk3" className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
                <Skeleton className="h-3 w-full rounded ml-10" />
                <Skeleton className="h-3 w-3/4 rounded ml-10" />
                <Skeleton className="h-3 w-28 rounded ml-10" />
              </div>
            </>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 glass-card rounded-xl"
              data-ocid="announcements.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-foreground font-semibold font-display">
                No announcements found
              </p>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                {activeFilter === "_all"
                  ? "Be the first to publish a school-wide notice"
                  : `No announcements for ${FILTER_TABS.find((t) => t.id === activeFilter)?.label ?? activeFilter} yet`}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(true)}
                data-ocid="announcements.empty_add_button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((ann, i) => (
                <AnnouncementCard key={ann.id.toString()} ann={ann} index={i} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg" data-ocid="announcements.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              New Announcement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ann-title">Title *</Label>
              <Input
                id="ann-title"
                placeholder="e.g. Annual Sports Day – 20th June"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="announcements.form.title_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ann-message">Message *</Label>
              <Textarea
                id="ann-message"
                placeholder="Write your announcement here. Be clear and concise."
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                data-ocid="announcements.form.message_textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Recipients</Label>
              <Select
                value={form.recipientGroup}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    recipientGroup: v as RecipientGroup,
                  }))
                }
              >
                <SelectTrigger data-ocid="announcements.form.recipients_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupConfig).map(([val, cfg]) => (
                    <SelectItem key={val} value={val}>
                      <span className="flex items-center gap-2">
                        {cfg.icon} {cfg.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose who will receive this announcement notification
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreate(false);
                setForm(emptyForm);
              }}
              data-ocid="announcements.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={
                createAnnouncement.isPending ||
                !form.title.trim() ||
                !form.message.trim()
              }
              className="gradient-primary text-white font-semibold"
              data-ocid="announcements.submit_button"
            >
              {createAnnouncement.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Megaphone className="mr-2 h-4 w-4" />
                  Publish Announcement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
