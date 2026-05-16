import Common "common";

module {
  public type AnnouncementId = Common.Id;

  public type Announcement = {
    id : AnnouncementId;
    var title : Text;
    var message : Text;
    var recipientGroup : Common.RecipientGroup;
    createdBy : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type AnnouncementPayload = {
    title : Text;
    message : Text;
    recipientGroup : Common.RecipientGroup;
  };

  public type AnnouncementView = {
    id : AnnouncementId;
    title : Text;
    message : Text;
    recipientGroup : Common.RecipientGroup;
    createdBy : Text;
    createdAt : Common.Timestamp;
  };
}
