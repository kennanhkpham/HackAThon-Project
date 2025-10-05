package hackathon.com.controller;

import hackathon.com.model.Note;
import hackathon.com.model.Quiz;
import hackathon.com.model.User;
import hackathon.com.repository.NoteRepository;
import hackathon.com.repository.QuizRepository;
import hackathon.com.repository.UserRepository;
import hackathon.com.response.NoteUploadResponse;
import hackathon.com.service.NoteProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all origins for development
public class NoteController {
    private final NoteProcessingService noteProcessingService;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<NoteUploadResponse> uploadNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) throws Exception {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NoteUploadResponse response = noteProcessingService.processNoteUpload(file, user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<Note> getNote(@PathVariable Long noteId) {
        return noteProcessingService.getNoteById(noteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Note>> getUserNotes(@PathVariable String email) {
        try {
            List<Note> notes = noteProcessingService.getNotesByUserEmail(email);
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}