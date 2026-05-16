module {
  public type UserId = Principal;
  public type Timestamp = Int;
  public type Id = Nat;

  public type Role = {
    #admin;
    #teacher;
    #student;
    #parent;
  };

  public type RecipientGroup = {
    #all;
    #students;
    #teachers;
    #parents;
  };
}
