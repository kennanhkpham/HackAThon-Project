import java.util.ArrayList;
import java.util.ZonedDateTime;

public class Note{
    private long noteId;
    private List<vocabList> vocabsTerm;
    private List<topicExtracted> Topic;
    private boolean processed;
    private ZonedDateTime uploadDate;
    private String fileName;
    private String fileSource;
}