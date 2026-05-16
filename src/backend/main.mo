import List "mo:core/List";
import Map "mo:core/Map";

import StudentTypes "types/students";
import TeacherTypes "types/teachers";
import ParentTypes "types/parents";
import AttendanceTypes "types/attendance";
import ExamTypes "types/exams";
import AnnouncementTypes "types/announcements";
import AuthTypes "types/auth";
import Common "types/common";

import AuthApi "mixins/auth-api";
import StudentsApi "mixins/students-api";
import TeachersApi "mixins/teachers-api";
import ParentsApi "mixins/parents-api";
import AttendanceApi "mixins/attendance-api";
import ExamsApi "mixins/exams-api";
import AnnouncementsApi "mixins/announcements-api";

actor {
  // Auth
  let sessions = Map.empty<Common.UserId, AuthTypes.Session>();

  // Students
  let students = List.empty<StudentTypes.Student>();
  let studentState = { var nextId = 0 };

  // Teachers
  let teachers = List.empty<TeacherTypes.Teacher>();
  let teacherState = { var nextId = 0 };

  // Parents
  let parents = List.empty<ParentTypes.Parent>();
  let parentState = { var nextId = 0 };

  // Attendance
  let attendanceRecords = List.empty<AttendanceTypes.AttendanceRecord>();
  let attendanceState = { var nextId = 0 };

  // Exams
  let exams = List.empty<ExamTypes.Exam>();
  let subjectMarks = List.empty<ExamTypes.SubjectMark>();
  let examState = { var nextId = 0 };
  let markState = { var nextId = 0 };

  // Announcements
  let announcements = List.empty<AnnouncementTypes.Announcement>();
  let announcementState = { var nextId = 0 };

  include AuthApi(sessions);
  include StudentsApi(students, sessions, studentState);
  include TeachersApi(teachers, sessions, teacherState);
  include ParentsApi(parents, sessions, parentState);
  include AttendanceApi(attendanceRecords, sessions, attendanceState);
  include ExamsApi(exams, subjectMarks, sessions, examState, markState);
  include AnnouncementsApi(announcements, sessions, announcementState);
};
