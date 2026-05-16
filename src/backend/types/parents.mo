import Common "common";

module {
  public type ParentId = Common.Id;

  public type Parent = {
    id : ParentId;
    var name : Text;
    var contactPhone : Text;
    var contactEmail : Text;
    var studentIds : [Common.Id];
    createdAt : Common.Timestamp;
  };

  public type ParentPayload = {
    name : Text;
    contactPhone : Text;
    contactEmail : Text;
    studentIds : [Common.Id];
  };

  public type ParentView = {
    id : ParentId;
    name : Text;
    contactPhone : Text;
    contactEmail : Text;
    studentIds : [Common.Id];
    createdAt : Common.Timestamp;
  };
}
