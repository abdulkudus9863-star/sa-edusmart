import List "mo:core/List";
import Map "mo:core/Map";
import AttendanceTypes "../types/attendance";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import AttendanceLib "../lib/attendance";

mixin (
  attendanceRecords : List.List<AttendanceTypes.AttendanceRecord>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  attendanceState : { var nextId : Nat },
) {
  public shared ({ caller }) func markAttendance(
    className : Text,
    date : Text,
    entries : [AttendanceTypes.AttendanceEntry],
  ) : async Nat {
    AuthLib.requireAdmin(sessions, caller);
    AttendanceLib.markBulk(attendanceRecords, attendanceState, className, date, entries, Time.now());
  };

  public query func getStudentAttendance(studentId : Common.Id) : async [AttendanceTypes.AttendanceRecord] {
    AttendanceLib.getByStudent(attendanceRecords, studentId);
  };

  public query func getClassAttendance(className : Text, date : Text) : async [AttendanceTypes.AttendanceRecord] {
    AttendanceLib.getByClassAndDate(attendanceRecords, className, date);
  };

  public query func getAttendanceReport(
    className : ?Text,
    fromDate : Text,
    toDate : Text,
  ) : async [AttendanceTypes.AttendanceRecord] {
    AttendanceLib.getByDateRange(attendanceRecords, className, fromDate, toDate);
  };

  public query func getStudentAttendanceStats(studentId : Common.Id) : async AttendanceTypes.AttendanceStats {
    AttendanceLib.statsForStudent(attendanceRecords, studentId);
  };
}
