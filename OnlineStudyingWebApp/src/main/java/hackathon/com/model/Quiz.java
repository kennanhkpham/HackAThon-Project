package hackathon.com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDateTime dateCreated;

    private double score;

    @ManyToOne
    private User user;

    @OneToOne
    private Note note;

    @OneToMany
    private List<QuizQuestion> quizQuestions;

    @OneToMany
    private List<Topic> topics;


}
