package hackathon.com.repository;

import hackathon.com.model.Quiz;
import hackathon.com.model.Report;
import hackathon.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUser(User user);
    Optional<Report> findByQuiz(Quiz quiz);
}
