import Common "common";

module {
  public type AttendanceId = Common.Id;

  public type AttendanceStatus = {
    #present;
    #absent;
  };

  public type AttendanceRecord = {
    id : AttendanceId;
    studentId : Common.Id;
    className : Text;
    date : Text;
    status : AttendanceStatus;
    markedAt : Common.Timestamp;
  };

  public type AttendanceEntry = {
    studentId : Common.Id;
    status : AttendanceStatus;
  };

  public type AttendanceStats = {
    studentId : Common.Id;
    totalDays : Nat;
    presentDays : Nat;
    absentDays : Nat;
    presentPercent : Float;
  };
}
