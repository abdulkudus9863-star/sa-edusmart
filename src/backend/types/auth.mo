import Common "common";

module {
  public type Session = {
    principal : Common.UserId;
    role : Common.Role;
    registeredAt : Common.Timestamp;
  };
}
