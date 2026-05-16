import List "mo:core/List";
import Map "mo:core/Map";
import TeacherTypes "../types/teachers";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import TeacherLib "../lib/teachers";

mixin (
  teachers : List.List<TeacherTypes.Teacher>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  teacherState : { var nextId : Nat },
) {
  public shared ({ caller }) func addTeacher(payload : TeacherTypes.TeacherPayload) : async TeacherTypes.TeacherId {
    AuthLib.requireAdmin(sessions, caller);
    TeacherLib.add(teachers, teacherState, payload, Time.now());
  };

  public shared ({ caller }) func updateTeacher(id : TeacherTypes.TeacherId, payload : TeacherTypes.TeacherPayload) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    TeacherLib.update(teachers, id, payload);
  };

  public shared ({ caller }) func deleteTeacher(id : TeacherTypes.TeacherId) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    TeacherLib.remove(teachers, id);
  };

  public query func getTeacher(id : TeacherTypes.TeacherId) : async ?TeacherTypes.TeacherView {
    TeacherLib.get(teachers, id);
  };

  public query func listTeachers() : async [TeacherTypes.TeacherView] {
    TeacherLib.listAll(teachers);
  };

  public query func searchTeachers(term : Text) : async [TeacherTypes.TeacherView] {
    TeacherLib.search(teachers, term);
  };
}
