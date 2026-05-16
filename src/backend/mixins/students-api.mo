import List "mo:core/List";
import Map "mo:core/Map";
import StudentTypes "../types/students";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import StudentLib "../lib/students";

mixin (
  students : List.List<StudentTypes.Student>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  studentState : { var nextId : Nat },
) {
  public shared ({ caller }) func addStudent(payload : StudentTypes.StudentPayload) : async StudentTypes.StudentId {
    AuthLib.requireAdmin(sessions, caller);
    StudentLib.add(students, studentState, payload, Time.now());
  };

  public shared ({ caller }) func updateStudent(id : StudentTypes.StudentId, payload : StudentTypes.StudentPayload) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    StudentLib.update(students, id, payload);
  };

  public shared ({ caller }) func deleteStudent(id : StudentTypes.StudentId) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    StudentLib.remove(students, id);
  };

  public query func getStudent(id : StudentTypes.StudentId) : async ?StudentTypes.StudentView {
    StudentLib.get(students, id);
  };

  public query func listStudents() : async [StudentTypes.StudentView] {
    StudentLib.listAll(students);
  };

  public query func searchStudents(term : Text) : async [StudentTypes.StudentView] {
    StudentLib.search(students, term);
  };
}
