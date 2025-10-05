package hackathon.com.dto;

import hackathon.com.model.Note;
import hackathon.com.model.Quiz;
import hackathon.com.model.Report;

import java.time.LocalDateTime;
import java.util.List;

public record UserDTO(
        String username,
        String email,
        String password,
        LocalDateTime createdAt,
        int noteCount,
        int quizCount,
        int reportCount,
        List<String> roles
) {
}
