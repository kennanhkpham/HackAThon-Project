import java.util.ArrayList;
import java.util.ZonedDateTime;

public class Report{
    private long reportId;
    private long userId;
    private long quizId;
    private ZonedDateTime dateGen;
    private int totalQuestions;
    private int correctCount;
    private List<Studyable> weakTopics;
    private List<Studyable> strongtopics;
}