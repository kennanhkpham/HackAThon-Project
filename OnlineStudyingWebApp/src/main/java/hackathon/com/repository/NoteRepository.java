package hackathon.com.repository;

import hackathon.com.model.Note;
import hackathon.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);
    List<Note> findByUserAndProcessed(User user, Boolean processed);
}
