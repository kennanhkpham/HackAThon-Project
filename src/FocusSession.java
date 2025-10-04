import java.util.ZonedDateTime;

public class FocusSession{
    private long sessionId;
    private long userId;
    private SessionType mode;
    private SessionStatus status;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private String spotifyUrl;
}