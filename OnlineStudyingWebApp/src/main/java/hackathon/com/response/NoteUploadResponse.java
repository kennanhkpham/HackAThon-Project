package hackathon.com.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoteUploadResponse {
    private Long noteId;
    private String message;
    private Integer flashcardCount;
    private Integer topicCount;
    private Long quizId;

    public NoteUploadResponse(Long noteId, String message) {
        this.noteId = noteId;
        this.message = message;
    }
}
