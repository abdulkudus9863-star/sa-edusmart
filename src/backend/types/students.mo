import Common "common";

module {
  public type StudentId = Common.Id;

  public type Student = {
    id : StudentId;
    var name : Text;
    var className : Text;
    var rollNumber : Text;
    var contactPhone : Text;
    var contactEmail : Text;
    var parentId : ?Common.Id;
    createdAt : Common.Timestamp;
  };

  public type StudentPayload = {
    name : Text;
    className : Text;
    rollNumber : Text;
    contactPhone : Text;
    contactEmail : Text;
    parentId : ?Common.Id;
  };

  public type StudentView = {
    id : StudentId;
    name : Text;
    className : Text;
    rollNumber : Text;
    contactPhone : Text;
    contactEmail : Text;
    parentId : ?Common.Id;
    createdAt : Common.Timestamp;
  };
}
