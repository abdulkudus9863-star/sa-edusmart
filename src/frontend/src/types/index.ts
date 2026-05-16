import type {
  AnnouncementPayload,
  AnnouncementView,
  AttendanceEntry,
  AttendanceRecord,
  AttendanceStats,
  AttendanceStatus,
  ExamPayload,
  ExamView,
  Grade,
  Id,
  ParentPayload,
  ParentView,
  RecipientGroup,
  ReportCard,
  Role,
  StudentPayload,
  StudentView,
  SubjectMarkEntry,
  SubjectMarkView,
  TeacherPayload,
  TeacherView,
  Timestamp,
} from "@/backend";

export type {
  StudentView,
  TeacherView,
  ParentView,
  AttendanceRecord,
  AttendanceStats,
  ExamView,
  ReportCard,
  SubjectMarkView,
  SubjectMarkEntry,
  AttendanceEntry,
  StudentPayload,
  TeacherPayload,
  ParentPayload,
  ExamPayload,
  AnnouncementPayload,
  AnnouncementView,
  Grade,
  AttendanceStatus,
  RecipientGroup,
  Role,
  Id,
  Timestamp,
};

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export interface StatsCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
  color: "green" | "gold" | "blue" | "purple";
}
