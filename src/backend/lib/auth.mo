import Map "mo:core/Map";
import Types "../types/auth";
import Common "../types/common";
import Runtime "mo:core/Runtime";

module {
  public func registerRole(
    sessions : Map.Map<Common.UserId, Types.Session>,
    principal : Common.UserId,
    role : Common.Role,
    now : Common.Timestamp,
  ) : () {
    let session : Types.Session = { principal; role; registeredAt = now };
    sessions.add(principal, session);
  };

  public func getRole(
    sessions : Map.Map<Common.UserId, Types.Session>,
    principal : Common.UserId,
  ) : ?Common.Role {
    switch (sessions.get(principal)) {
      case (?s) ?s.role;
      case null null;
    };
  };

  public func requireAdmin(
    sessions : Map.Map<Common.UserId, Types.Session>,
    caller : Common.UserId,
  ) : () {
    switch (sessions.get(caller)) {
      case (?s) {
        if (s.role != #admin) Runtime.trap("Unauthorized: admin role required");
      };
      case null Runtime.trap("Unauthorized: not registered");
    };
  };

  public func isAdmin(
    sessions : Map.Map<Common.UserId, Types.Session>,
    principal : Common.UserId,
  ) : Bool {
    switch (sessions.get(principal)) {
      case (?s) s.role == #admin;
      case null false;
    };
  };
}
