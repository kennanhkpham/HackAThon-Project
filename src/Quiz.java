import java.util.ArrayList;
import java.util.ZonedDateTime;

public class Quiz{
    private long quizId;
    private String title;
    private ZonedDateTime dateCreated;
    private List<Topic> topicsCovered;
    private float score;
    private List<QuizQuestion> questions;
}