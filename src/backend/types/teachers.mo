import Common "common";

module {
  public type TeacherId = Common.Id;

  public type Teacher = {
    id : TeacherId;
    var name : Text;
    var subjects : [Text];
    var contactPhone : Text;
    var contactEmail : Text;
    createdAt : Common.Timestamp;
  };

  public type TeacherPayload = {
    name : Text;
    subjects : [Text];
    contactPhone : Text;
    contactEmail : Text;
  };

  public type TeacherView = {
    id : TeacherId;
    name : Text;
    subjects : [Text];
    contactPhone : Text;
    contactEmail : Text;
    createdAt : Common.Timestamp;
  };
}
