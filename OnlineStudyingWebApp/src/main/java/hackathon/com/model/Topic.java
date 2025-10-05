package hackathon.com.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int importantScore;

    @ManyToOne
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @ManyToMany(mappedBy = "topics")
    private List<Quiz> quizzes;

    public Topic(){
        quizzes = new ArrayList<>();
    }

}
