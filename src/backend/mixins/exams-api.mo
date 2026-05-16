import List "mo:core/List";
import Map "mo:core/Map";
import ExamTypes "../types/exams";
import AuthTypes "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import ExamLib "../lib/exams";
import Runtime "mo:core/Runtime";

mixin (
  exams : List.List<ExamTypes.Exam>,
  subjectMarks : List.List<ExamTypes.SubjectMark>,
  sessions : Map.Map<Common.UserId, AuthTypes.Session>,
  examState : { var nextId : Nat },
  markState : { var nextId : Nat },
) {
  public shared ({ caller }) func createExam(payload : ExamTypes.ExamPayload) : async ExamTypes.ExamId {
    AuthLib.requireAdmin(sessions, caller);
    ExamLib.createExam(exams, examState, payload, Time.now());
  };

  public query func getExam(id : ExamTypes.ExamId) : async ?ExamTypes.ExamView {
    ExamLib.getExam(exams, id);
  };

  public query func listExams() : async [ExamTypes.ExamView] {
    ExamLib.listExams(exams);
  };

  public shared ({ caller }) func enterMarks(
    examId : ExamTypes.ExamId,
    entries : [ExamTypes.SubjectMarkEntry],
  ) : async Nat {
    AuthLib.requireAdmin(sessions, caller);
    let exam = switch (ExamLib.getExam(exams, examId)) {
      case (?e) e;
      case null Runtime.trap("Exam not found");
    };
    ExamLib.enterMarks(subjectMarks, markState, examId, exam.totalMarks, entries, Time.now());
  };

  public query func getReportCard(studentId : Common.Id, examId : ExamTypes.ExamId) : async ?ExamTypes.ReportCard {
    ExamLib.getReportCard(exams, subjectMarks, studentId, examId);
  };
}
