package hackathon.com.repository;

import hackathon.com.model.Note;
import hackathon.com.model.Quiz;
import hackathon.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUser(User user);
    List<Quiz> findByNote(Note note);
    List<Quiz> findByUserOrderByDateCreatedDesc(User user);
}
