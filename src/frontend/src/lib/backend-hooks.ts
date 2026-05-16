import { type ExamId, type SubjectMarkEntry, createActor } from "@/backend";
import type {
  AnnouncementPayload,
  AttendanceEntry,
  ExamPayload,
  Id,
  ParentPayload,
  RecipientGroup,
  Role,
  StudentPayload,
  TeacherPayload,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackend() {
  return useActor(createActor);
}

// ─── Students ────────────────────────────────────────────────────────────────
export function useListStudents() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchStudents(term: string) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["students", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchStudents(term);
    },
    enabled: !!actor && !isFetching && term.length > 0,
  });
}

export function useGetStudent(id: Id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["students", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStudent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.addStudent(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: StudentPayload }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateStudent(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteStudent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

// ─── Teachers ────────────────────────────────────────────────────────────────
export function useListTeachers() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeachers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTeacher() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TeacherPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.addTeacher(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useUpdateTeacher() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: TeacherPayload }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTeacher(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useDeleteTeacher() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteTeacher(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

// ─── Parents ─────────────────────────────────────────────────────────────────
export function useListParents() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listParents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddParent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ParentPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.addParent(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parents"] }),
  });
}

export function useUpdateParent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: ParentPayload }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateParent(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parents"] }),
  });
}

export function useDeleteParent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteParent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parents"] }),
  });
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export function useGetClassAttendance(className: string, date: string) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["attendance", "class", className, date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClassAttendance(className, date);
    },
    enabled: !!actor && !isFetching && !!className && !!date,
  });
}

export function useGetStudentAttendance(studentId: Id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["attendance", "student", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentAttendance(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudentAttendanceStats(studentId: Id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["attendance", "stats", studentId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentAttendanceStats(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkAttendance() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      className,
      date,
      entries,
    }: {
      className: string;
      date: string;
      entries: AttendanceEntry[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.markAttendance(className, date, entries);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

// ─── Exams ────────────────────────────────────────────────────────────────────
export function useListExams() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listExams();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReportCard(studentId: Id, examId: Id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["reportcard", studentId.toString(), examId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReportCard(studentId, examId);
    },
    enabled:
      !!actor && !isFetching && studentId !== BigInt(0) && examId !== BigInt(0),
  });
}

export function useCreateExam() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExamPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.createExam(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exams"] }),
  });
}

export function useEnterMarks() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      examId,
      entries,
    }: { examId: ExamId; entries: SubjectMarkEntry[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.enterMarks(examId, entries);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reportcard"] }),
  });
}

// ─── Announcements ────────────────────────────────────────────────────────────
export function useListAnnouncements() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAnnouncementsByGroup(group: RecipientGroup) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["announcements", "group", group],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAnnouncementsByGroup(group);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnnouncementPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.createAnnouncement(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

// ─── Auth / Role ──────────────────────────────────────────────────────────────
export function useGetMyRole() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["my-role"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterSelf() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (role: Role) => {
      if (!actor) throw new Error("No actor");
      return actor.registerSelf(role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-role"] }),
  });
}
