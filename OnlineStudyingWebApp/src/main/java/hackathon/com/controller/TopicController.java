package hackathon.com.controller;

import hackathon.com.model.Topic;
import hackathon.com.repository.NoteRepository;
import hackathon.com.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
public class TopicController {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping("/note/{noteId}")
    public ResponseEntity<List<Topic>> getTopicsByNote(@PathVariable Long noteId) {
        return noteRepository.findById(noteId)
                .map(note -> ResponseEntity.ok(topicRepository.findByNoteOrderByImportantScoreDesc(note)))
                .orElse(ResponseEntity.notFound().build());
    }
}
