import List "mo:core/List";
import Types "../types/teachers";
import Common "../types/common";

module {
  public func toView(t : Types.Teacher) : Types.TeacherView {
    {
      id = t.id;
      name = t.name;
      subjects = t.subjects;
      contactPhone = t.contactPhone;
      contactEmail = t.contactEmail;
      createdAt = t.createdAt;
    };
  };

  public func add(
    teachers : List.List<Types.Teacher>,
    state : { var nextId : Nat },
    payload : Types.TeacherPayload,
    now : Common.Timestamp,
  ) : Types.TeacherId {
    let id = state.nextId;
    state.nextId += 1;
    let teacher : Types.Teacher = {
      id;
      var name = payload.name;
      var subjects = payload.subjects;
      var contactPhone = payload.contactPhone;
      var contactEmail = payload.contactEmail;
      createdAt = now;
    };
    teachers.add(teacher);
    id;
  };

  public func update(
    teachers : List.List<Types.Teacher>,
    id : Types.TeacherId,
    payload : Types.TeacherPayload,
  ) : Bool {
    switch (teachers.find(func(t) { t.id == id })) {
      case (?t) {
        t.name := payload.name;
        t.subjects := payload.subjects;
        t.contactPhone := payload.contactPhone;
        t.contactEmail := payload.contactEmail;
        true;
      };
      case null false;
    };
  };

  public func remove(
    teachers : List.List<Types.Teacher>,
    id : Types.TeacherId,
  ) : Bool {
    let before = teachers.size();
    let filtered = teachers.filter(func(t) { t.id != id });
    if (filtered.size() < before) {
      teachers.clear();
      teachers.append(filtered);
      true;
    } else false;
  };

  public func get(
    teachers : List.List<Types.Teacher>,
    id : Types.TeacherId,
  ) : ?Types.TeacherView {
    switch (teachers.find(func(t) { t.id == id })) {
      case (?t) ?toView(t);
      case null null;
    };
  };

  public func listAll(
    teachers : List.List<Types.Teacher>,
  ) : [Types.TeacherView] {
    teachers.map<Types.Teacher, Types.TeacherView>(toView).toArray();
  };

  public func search(
    teachers : List.List<Types.Teacher>,
    term : Text,
  ) : [Types.TeacherView] {
    let lower = term.toLower();
    teachers.filter(func(t) {
      t.name.toLower().contains(#text lower)
    }).map<Types.Teacher, Types.TeacherView>(toView).toArray();
  };
}
