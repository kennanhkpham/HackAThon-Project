package hackathon.com.controller;
import hackathon.com.model.FlashCard;
import hackathon.com.repository.FlashcardRepository;
import hackathon.com.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping("/note/{noteId}")
    public ResponseEntity<List<FlashCard>> getFlashcardsByNote(@PathVariable Long noteId) {
        return noteRepository.findById(noteId)
                .map(note -> ResponseEntity.ok(flashcardRepository.findByNote(note)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{flashcardId}")
    public ResponseEntity<FlashCard> getFlashcard(@PathVariable Long flashcardId) {
        return flashcardRepository.findById(flashcardId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
