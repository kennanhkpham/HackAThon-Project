package hackathon.com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor

public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataGenerated;

    private int totalQuestions;

    private int correctCount;

    @ElementCollection
    private List<String> weakTopics;

    @ElementCollection
    private List<String> strongTopics;

    @ManyToOne
    private User user;

    @OneToOne
    private Quiz quiz;

    public Report(){
        weakTopics = new ArrayList<>();
        strongTopics = new ArrayList<>();
    }
}
