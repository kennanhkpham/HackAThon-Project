package hackathon.com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    private LocalDateTime createdAt;

    @OneToMany
    private List<Note> notes;

    @OneToMany
    private List<Quiz> quizzes;

    @OneToMany
    private List<Report> reports;

//    @OneToOne
//    private List<StudyGuide> studyGuides;
}
