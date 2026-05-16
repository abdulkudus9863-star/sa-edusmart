import List "mo:core/List";
import Types "../types/announcements";
import Common "../types/common";

module {
  public func toView(a : Types.Announcement) : Types.AnnouncementView {
    {
      id = a.id;
      title = a.title;
      message = a.message;
      recipientGroup = a.recipientGroup;
      createdBy = a.createdBy.toText();
      createdAt = a.createdAt;
    };
  };

  public func create(
    announcements : List.List<Types.Announcement>,
    state : { var nextId : Nat },
    caller : Common.UserId,
    payload : Types.AnnouncementPayload,
    now : Common.Timestamp,
  ) : Types.AnnouncementId {
    let id = state.nextId;
    state.nextId += 1;
    let announcement : Types.Announcement = {
      id;
      var title = payload.title;
      var message = payload.message;
      var recipientGroup = payload.recipientGroup;
      createdBy = caller;
      createdAt = now;
    };
    announcements.add(announcement);
    id;
  };

  public func listAll(
    announcements : List.List<Types.Announcement>,
  ) : [Types.AnnouncementView] {
    announcements.map<Types.Announcement, Types.AnnouncementView>(toView).toArray();
  };

  public func listByGroup(
    announcements : List.List<Types.Announcement>,
    group : Common.RecipientGroup,
  ) : [Types.AnnouncementView] {
    announcements.filter(func(a) {
      a.recipientGroup == #all or a.recipientGroup == group
    }).map<Types.Announcement, Types.AnnouncementView>(toView).toArray();
  };
}
