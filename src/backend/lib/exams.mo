import List "mo:core/List";
import Float "mo:core/Float";
import Types "../types/exams";
import Common "../types/common";

module {
  public func calcGrade(percentage : Float) : Types.Grade {
    if (percentage >= 90.0) #aPlus
    else if (percentage >= 80.0) #a
    else if (percentage >= 70.0) #bPlus
    else if (percentage >= 60.0) #b
    else if (percentage >= 50.0) #cPlus
    else if (percentage >= 40.0) #c
    else if (percentage >= 33.0) #d
    else #f;
  };

  public func createExam(
    exams : List.List<Types.Exam>,
    state : { var nextId : Nat },
    payload : Types.ExamPayload,
    now : Common.Timestamp,
  ) : Types.ExamId {
    let id = state.nextId;
    state.nextId += 1;
    let exam : Types.Exam = {
      id;
      var name = payload.name;
      var date = payload.date;
      var subjects = payload.subjects;
      var totalMarks = payload.totalMarks;
      createdAt = now;
    };
    exams.add(exam);
    id;
  };

  public func getExam(
    exams : List.List<Types.Exam>,
    id : Types.ExamId,
  ) : ?Types.ExamView {
    switch (exams.find(func(e) { e.id == id })) {
      case (?e) ?{ id = e.id; name = e.name; date = e.date; subjects = e.subjects; totalMarks = e.totalMarks; createdAt = e.createdAt };
      case null null;
    };
  };

  public func listExams(
    exams : List.List<Types.Exam>,
  ) : [Types.ExamView] {
    exams.map<Types.Exam, Types.ExamView>(func(e) {
      { id = e.id; name = e.name; date = e.date; subjects = e.subjects; totalMarks = e.totalMarks; createdAt = e.createdAt };
    }).toArray();
  };

  public func enterMarks(
    marks : List.List<Types.SubjectMark>,
    state : { var nextId : Nat },
    examId : Types.ExamId,
    totalMarks : Nat,
    entries : [Types.SubjectMarkEntry],
    now : Common.Timestamp,
  ) : Nat {
    var count = 0;
    for (entry in entries.values()) {
      let pct = if (totalMarks == 0) 0.0 else entry.marksObtained.toFloat() / totalMarks.toFloat() * 100.0;
      let mark : Types.SubjectMark = {
        id = state.nextId;
        examId;
        studentId = entry.studentId;
        subject = entry.subject;
        marksObtained = entry.marksObtained;
        totalMarks;
        grade = calcGrade(pct);
        recordedAt = now;
      };
      marks.add(mark);
      state.nextId += 1;
      count += 1;
    };
    count;
  };

  public func getReportCard(
    exams : List.List<Types.Exam>,
    marks : List.List<Types.SubjectMark>,
    studentId : Common.Id,
    examId : Types.ExamId,
  ) : ?Types.ReportCard {
    switch (exams.find(func(e) { e.id == examId })) {
      case null null;
      case (?exam) {
        let studentMarks = marks.filter(func(m) { m.examId == examId and m.studentId == studentId });
        let subjectViews = studentMarks.map<Types.SubjectMark, Types.SubjectMarkView>(func(m) {
          { subject = m.subject; marksObtained = m.marksObtained; totalMarks = m.totalMarks; grade = m.grade };
        }).toArray();
        let totalObtained = studentMarks.foldLeft(0, func(acc, m) { acc + m.marksObtained });
        let totalPossible = studentMarks.foldLeft(0, func(acc, m) { acc + m.totalMarks });
        let pct = if (totalPossible == 0) 0.0 else totalObtained.toFloat() / totalPossible.toFloat() * 100.0;
        ?{
          studentId;
          examId;
          examName = exam.name;
          subjects = subjectViews;
          totalObtained;
          totalPossible;
          percentage = pct;
          grade = calcGrade(pct);
        };
      };
    };
  };
}
