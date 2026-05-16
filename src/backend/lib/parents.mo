import List "mo:core/List";
import Types "../types/parents";
import Common "../types/common";

module {
  public func toView(p : Types.Parent) : Types.ParentView {
    {
      id = p.id;
      name = p.name;
      contactPhone = p.contactPhone;
      contactEmail = p.contactEmail;
      studentIds = p.studentIds;
      createdAt = p.createdAt;
    };
  };

  public func add(
    parents : List.List<Types.Parent>,
    state : { var nextId : Nat },
    payload : Types.ParentPayload,
    now : Common.Timestamp,
  ) : Types.ParentId {
    let id = state.nextId;
    state.nextId += 1;
    let parent : Types.Parent = {
      id;
      var name = payload.name;
      var contactPhone = payload.contactPhone;
      var contactEmail = payload.contactEmail;
      var studentIds = payload.studentIds;
      createdAt = now;
    };
    parents.add(parent);
    id;
  };

  public func update(
    parents : List.List<Types.Parent>,
    id : Types.ParentId,
    payload : Types.ParentPayload,
  ) : Bool {
    switch (parents.find(func(p) { p.id == id })) {
      case (?p) {
        p.name := payload.name;
        p.contactPhone := payload.contactPhone;
        p.contactEmail := payload.contactEmail;
        p.studentIds := payload.studentIds;
        true;
      };
      case null false;
    };
  };

  public func remove(
    parents : List.List<Types.Parent>,
    id : Types.ParentId,
  ) : Bool {
    let before = parents.size();
    let filtered = parents.filter(func(p) { p.id != id });
    if (filtered.size() < before) {
      parents.clear();
      parents.append(filtered);
      true;
    } else false;
  };

  public func get(
    parents : List.List<Types.Parent>,
    id : Types.ParentId,
  ) : ?Types.ParentView {
    switch (parents.find(func(p) { p.id == id })) {
      case (?p) ?toView(p);
      case null null;
    };
  };

  public func listAll(
    parents : List.List<Types.Parent>,
  ) : [Types.ParentView] {
    parents.map<Types.Parent, Types.ParentView>(toView).toArray();
  };

  public func search(
    parents : List.List<Types.Parent>,
    term : Text,
  ) : [Types.ParentView] {
    let lower = term.toLower();
    parents.filter(func(p) {
      p.name.toLower().contains(#text lower)
    }).map<Types.Parent, Types.ParentView>(toView).toArray();
  };
}
