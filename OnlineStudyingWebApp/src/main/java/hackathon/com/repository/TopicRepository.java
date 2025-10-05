package hackathon.com.repository;

import hackathon.com.model.Note;
import hackathon.com.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByNote(Note note);
    List<Topic> findByNoteOrderByImportantScoreDesc(Note note);
}
