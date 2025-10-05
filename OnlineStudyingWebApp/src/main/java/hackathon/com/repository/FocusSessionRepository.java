package hackathon.com.repository;

import hackathon.com.Enum.SessionStatus;
import hackathon.com.model.FocusSession;
import hackathon.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUser(User user);
    List<FocusSession> findByUserAndStatus(User user, SessionStatus status);

}
