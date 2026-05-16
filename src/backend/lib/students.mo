import List "mo:core/List";
import Types "../types/students";
import Common "../types/common";

module {
  public func toView(s : Types.Student) : Types.StudentView {
    {
      id = s.id;
      name = s.name;
      className = s.className;
      rollNumber = s.rollNumber;
      contactPhone = s.contactPhone;
      contactEmail = s.contactEmail;
      parentId = s.parentId;
      createdAt = s.createdAt;
    };
  };

  public func add(
    students : List.List<Types.Student>,
    state : { var nextId : Nat },
    payload : Types.StudentPayload,
    now : Common.Timestamp,
  ) : Types.StudentId {
    let id = state.nextId;
    state.nextId += 1;
    let student : Types.Student = {
      id;
      var name = payload.name;
      var className = payload.className;
      var rollNumber = payload.rollNumber;
      var contactPhone = payload.contactPhone;
      var contactEmail = payload.contactEmail;
      var parentId = payload.parentId;
      createdAt = now;
    };
    students.add(student);
    id;
  };

  public func update(
    students : List.List<Types.Student>,
    id : Types.StudentId,
    payload : Types.StudentPayload,
  ) : Bool {
    switch (students.find(func(s) { s.id == id })) {
      case (?s) {
        s.name := payload.name;
        s.className := payload.className;
        s.rollNumber := payload.rollNumber;
        s.contactPhone := payload.contactPhone;
        s.contactEmail := payload.contactEmail;
        s.parentId := payload.parentId;
        true;
      };
      case null false;
    };
  };

  public func remove(
    students : List.List<Types.Student>,
    id : Types.StudentId,
  ) : Bool {
    let before = students.size();
    let filtered = students.filter(func(s) { s.id != id });
    if (filtered.size() < before) {
      students.clear();
      students.append(filtered);
      true;
    } else false;
  };

  public func get(
    students : List.List<Types.Student>,
    id : Types.StudentId,
  ) : ?Types.StudentView {
    switch (students.find(func(s) { s.id == id })) {
      case (?s) ?toView(s);
      case null null;
    };
  };

  public func listAll(
    students : List.List<Types.Student>,
  ) : [Types.StudentView] {
    students.map<Types.Student, Types.StudentView>(toView).toArray();
  };

  public func search(
    students : List.List<Types.Student>,
    term : Text,
  ) : [Types.StudentView] {
    let lower = term.toLower();
    students.filter(func(s) {
      s.name.toLower().contains(#text lower) or s.className.toLower().contains(#text lower)
    }).map<Types.Student, Types.StudentView>(toView).toArray();
  };
}
