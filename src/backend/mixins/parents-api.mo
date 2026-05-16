import List "mo:core/List";
import Map "mo:core/Map";
import ParentTypes "../types/parents";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import ParentLib "../lib/parents";

mixin (
  parents : List.List<ParentTypes.Parent>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  parentState : { var nextId : Nat },
) {
  public shared ({ caller }) func addParent(payload : ParentTypes.ParentPayload) : async ParentTypes.ParentId {
    AuthLib.requireAdmin(sessions, caller);
    ParentLib.add(parents, parentState, payload, Time.now());
  };

  public shared ({ caller }) func updateParent(id : ParentTypes.ParentId, payload : ParentTypes.ParentPayload) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    ParentLib.update(parents, id, payload);
  };

  public shared ({ caller }) func deleteParent(id : ParentTypes.ParentId) : async Bool {
    AuthLib.requireAdmin(sessions, caller);
    ParentLib.remove(parents, id);
  };

  public query func getParent(id : ParentTypes.ParentId) : async ?ParentTypes.ParentView {
    ParentLib.get(parents, id);
  };

  public query func listParents() : async [ParentTypes.ParentView] {
    ParentLib.listAll(parents);
  };

  public query func searchParents(term : Text) : async [ParentTypes.ParentView] {
    ParentLib.search(parents, term);
  };
}
