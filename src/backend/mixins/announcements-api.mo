import List "mo:core/List";
import Map "mo:core/Map";
import AnnouncementTypes "../types/announcements";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import AnnouncementLib "../lib/announcements";

mixin (
  announcements : List.List<AnnouncementTypes.Announcement>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  announcementState : { var nextId : Nat },
) {
  public shared ({ caller }) func createAnnouncement(payload : AnnouncementTypes.AnnouncementPayload) : async AnnouncementTypes.AnnouncementId {
    AuthLib.requireAdmin(sessions, caller);
    AnnouncementLib.create(announcements, announcementState, caller, payload, Time.now());
  };

  public query func listAnnouncements() : async [AnnouncementTypes.AnnouncementView] {
    AnnouncementLib.listAll(announcements);
  };

  public query func listAnnouncementsByGroup(group : Common.RecipientGroup) : async [AnnouncementTypes.AnnouncementView] {
    AnnouncementLib.listByGroup(announcements, group);
  };
}
