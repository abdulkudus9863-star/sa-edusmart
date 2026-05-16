import Map "mo:core/Map";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";

mixin (
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
) {
  public shared ({ caller }) func registerSelf(role : Common.Role) : async () {
    AuthLib.registerRole(sessions, caller, role, Time.now());
  };

  public query ({ caller }) func getMyRole() : async ?Common.Role {
    AuthLib.getRole(sessions, caller);
  };

  public shared ({ caller }) func assignRole(target : Common.UserId, role : Common.Role) : async () {
    AuthLib.requireAdmin(sessions, caller);
    AuthLib.registerRole(sessions, target, role, Time.now());
  };

  public query func isAdminPrincipal(principal : Common.UserId) : async Bool {
    AuthLib.isAdmin(sessions, principal);
  };
}
