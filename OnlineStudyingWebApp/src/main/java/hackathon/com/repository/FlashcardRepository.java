package hackathon.com.repository;

import hackathon.com.model.FlashCard;
import hackathon.com.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<FlashCard, Long> {
    List<FlashCard> findByNote(Note note);
    List<FlashCard> findByNoteAndDifficultyLevelGreaterThanEqual(Note note, int difficultyLevel);
}
