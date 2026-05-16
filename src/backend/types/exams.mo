import Common "common";

module {
  public type ExamId = Common.Id;
  public type SubjectMarkId = Common.Id;

  public type Grade = {
    #aPlus;
    #a;
    #bPlus;
    #b;
    #cPlus;
    #c;
    #d;
    #f;
  };

  public type Exam = {
    id : ExamId;
    var name : Text;
    var date : Text;
    var subjects : [Text];
    var totalMarks : Nat;
    createdAt : Common.Timestamp;
  };

  public type ExamPayload = {
    name : Text;
    date : Text;
    subjects : [Text];
    totalMarks : Nat;
  };

  public type SubjectMark = {
    id : SubjectMarkId;
    examId : ExamId;
    studentId : Common.Id;
    subject : Text;
    marksObtained : Nat;
    totalMarks : Nat;
    grade : Grade;
    recordedAt : Common.Timestamp;
  };

  public type SubjectMarkEntry = {
    studentId : Common.Id;
    subject : Text;
    marksObtained : Nat;
  };

  public type ReportCard = {
    studentId : Common.Id;
    examId : ExamId;
    examName : Text;
    subjects : [SubjectMarkView];
    totalObtained : Nat;
    totalPossible : Nat;
    percentage : Float;
    grade : Grade;
  };

  public type SubjectMarkView = {
    subject : Text;
    marksObtained : Nat;
    totalMarks : Nat;
    grade : Grade;
  };

  public type ExamView = {
    id : ExamId;
    name : Text;
    date : Text;
    subjects : [Text];
    totalMarks : Nat;
    createdAt : Common.Timestamp;
  };
}
