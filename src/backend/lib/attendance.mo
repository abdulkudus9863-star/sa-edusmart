import List "mo:core/List";
import Float "mo:core/Float";
import Types "../types/attendance";
import Common "../types/common";

module {
  public func markBulk(
    records : List.List<Types.AttendanceRecord>,
    state : { var nextId : Nat },
    className : Text,
    date : Text,
    entries : [Types.AttendanceEntry],
    now : Common.Timestamp,
  ) : Nat {
    var count = 0;
    for (entry in entries.values()) {
      let record : Types.AttendanceRecord = {
        id = state.nextId;
        studentId = entry.studentId;
        className;
        date;
        status = entry.status;
        markedAt = now;
      };
      records.add(record);
      state.nextId += 1;
      count += 1;
    };
    count;
  };

  public func getByStudent(
    records : List.List<Types.AttendanceRecord>,
    studentId : Common.Id,
  ) : [Types.AttendanceRecord] {
    records.filter(func(r) { r.studentId == studentId }).toArray();
  };

  public func getByClassAndDate(
    records : List.List<Types.AttendanceRecord>,
    className : Text,
    date : Text,
  ) : [Types.AttendanceRecord] {
    records.filter(func(r) { r.className == className and r.date == date }).toArray();
  };

  public func getByDateRange(
    records : List.List<Types.AttendanceRecord>,
    className : ?Text,
    fromDate : Text,
    toDate : Text,
  ) : [Types.AttendanceRecord] {
    records.filter(func(r) {
      let dateOk = r.date >= fromDate and r.date <= toDate;
      let classOk = switch (className) {
        case (?cn) r.className == cn;
        case null true;
      };
      dateOk and classOk;
    }).toArray();
  };

  public func statsForStudent(
    records : List.List<Types.AttendanceRecord>,
    studentId : Common.Id,
  ) : Types.AttendanceStats {
    let studentRecords = records.filter(func(r) { r.studentId == studentId });
    let total = studentRecords.size();
    let present = studentRecords.filter(func(r) { r.status == #present }).size();
    let absent = total - present;
    let pct : Float = if (total == 0) 0.0 else present.toFloat() / total.toFloat() * 100.0;
    { studentId; totalDays = total; presentDays = present; absentDays = absent; presentPercent = pct };
  };
}
