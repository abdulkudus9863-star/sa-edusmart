import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface ReportCard {
    studentId: Id;
    subjects: Array<SubjectMarkView>;
    totalObtained: bigint;
    grade: Grade;
    examId: ExamId;
    totalPossible: bigint;
    examName: string;
    percentage: number;
}
export type AttendanceId = bigint;
export interface AnnouncementPayload {
    title: string;
    recipientGroup: RecipientGroup;
    message: string;
}
export interface TeacherView {
    id: TeacherId;
    subjects: Array<string>;
    name: string;
    createdAt: Timestamp;
    contactEmail: string;
    contactPhone: string;
}
export type ParentId = bigint;
export type ExamId = bigint;
export interface SubjectMarkEntry {
    studentId: Id;
    subject: string;
    marksObtained: bigint;
}
export interface TeacherPayload {
    subjects: Array<string>;
    name: string;
    contactEmail: string;
    contactPhone: string;
}
export interface ExamView {
    id: ExamId;
    totalMarks: bigint;
    subjects: Array<string>;
    date: string;
    name: string;
    createdAt: Timestamp;
}
export interface AnnouncementView {
    id: AnnouncementId;
    title: string;
    recipientGroup: RecipientGroup;
    createdAt: Timestamp;
    createdBy: string;
    message: string;
}
export interface StudentPayload {
    name: string;
    rollNumber: string;
    contactEmail: string;
    parentId?: Id;
    className: string;
    contactPhone: string;
}
export interface ParentView {
    id: ParentId;
    name: string;
    createdAt: Timestamp;
    studentIds: Array<Id>;
    contactEmail: string;
    contactPhone: string;
}
export interface AttendanceRecord {
    id: AttendanceId;
    status: AttendanceStatus;
    studentId: Id;
    date: string;
    markedAt: Timestamp;
    className: string;
}
export interface AttendanceEntry {
    status: AttendanceStatus;
    studentId: Id;
}
export interface ExamPayload {
    totalMarks: bigint;
    subjects: Array<string>;
    date: string;
    name: string;
}
export interface ParentPayload {
    name: string;
    studentIds: Array<Id>;
    contactEmail: string;
    contactPhone: string;
}
export interface StudentView {
    id: StudentId;
    name: string;
    createdAt: Timestamp;
    rollNumber: string;
    contactEmail: string;
    parentId?: Id;
    className: string;
    contactPhone: string;
}
export interface SubjectMarkView {
    totalMarks: bigint;
    subject: string;
    marksObtained: bigint;
    grade: Grade;
}
export type StudentId = bigint;
export type TeacherId = bigint;
export interface AttendanceStats {
    studentId: Id;
    presentDays: bigint;
    totalDays: bigint;
    absentDays: bigint;
    presentPercent: number;
}
export type UserId = Principal;
export type Id = bigint;
export type AnnouncementId = bigint;
export enum AttendanceStatus {
    present = "present",
    absent = "absent"
}
export enum Grade {
    a = "a",
    b = "b",
    c = "c",
    d = "d",
    f = "f",
    aPlus = "aPlus",
    cPlus = "cPlus",
    bPlus = "bPlus"
}
export enum RecipientGroup {
    all = "all",
    students = "students",
    teachers = "teachers",
    parents = "parents"
}
export enum Role {
    admin = "admin",
    teacher = "teacher",
    student = "student",
    parent = "parent"
}
export interface backendInterface {
    addParent(payload: ParentPayload): Promise<ParentId>;
    addStudent(payload: StudentPayload): Promise<StudentId>;
    addTeacher(payload: TeacherPayload): Promise<TeacherId>;
    assignRole(target: UserId, role: Role): Promise<void>;
    createAnnouncement(payload: AnnouncementPayload): Promise<AnnouncementId>;
    createExam(payload: ExamPayload): Promise<ExamId>;
    deleteParent(id: ParentId): Promise<boolean>;
    deleteStudent(id: StudentId): Promise<boolean>;
    deleteTeacher(id: TeacherId): Promise<boolean>;
    enterMarks(examId: ExamId, entries: Array<SubjectMarkEntry>): Promise<bigint>;
    getAttendanceReport(className: string | null, fromDate: string, toDate: string): Promise<Array<AttendanceRecord>>;
    getClassAttendance(className: string, date: string): Promise<Array<AttendanceRecord>>;
    getExam(id: ExamId): Promise<ExamView | null>;
    getMyRole(): Promise<Role | null>;
    getParent(id: ParentId): Promise<ParentView | null>;
    getReportCard(studentId: Id, examId: ExamId): Promise<ReportCard | null>;
    getStudent(id: StudentId): Promise<StudentView | null>;
    getStudentAttendance(studentId: Id): Promise<Array<AttendanceRecord>>;
    getStudentAttendanceStats(studentId: Id): Promise<AttendanceStats>;
    getTeacher(id: TeacherId): Promise<TeacherView | null>;
    isAdminPrincipal(principal: UserId): Promise<boolean>;
    listAnnouncements(): Promise<Array<AnnouncementView>>;
    listAnnouncementsByGroup(group: RecipientGroup): Promise<Array<AnnouncementView>>;
    listExams(): Promise<Array<ExamView>>;
    listParents(): Promise<Array<ParentView>>;
    listStudents(): Promise<Array<StudentView>>;
    listTeachers(): Promise<Array<TeacherView>>;
    markAttendance(className: string, date: string, entries: Array<AttendanceEntry>): Promise<bigint>;
    registerSelf(role: Role): Promise<void>;
    searchParents(term: string): Promise<Array<ParentView>>;
    searchStudents(term: string): Promise<Array<StudentView>>;
    searchTeachers(term: string): Promise<Array<TeacherView>>;
    updateParent(id: ParentId, payload: ParentPayload): Promise<boolean>;
    updateStudent(id: StudentId, payload: StudentPayload): Promise<boolean>;
    updateTeacher(id: TeacherId, payload: TeacherPayload): Promise<boolean>;
}
