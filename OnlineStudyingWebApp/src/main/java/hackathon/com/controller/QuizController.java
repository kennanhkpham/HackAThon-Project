package hackathon.com.controller;

import hackathon.com.model.Quiz;
import hackathon.com.repository.QuizRepository;
import hackathon.com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Quiz>> getUserQuizzes(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(quizRepository.findByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long quizId) {
        return quizRepository.findById(quizId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
