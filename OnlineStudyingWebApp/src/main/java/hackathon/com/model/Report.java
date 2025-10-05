package hackathon.com.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataGenerated;

    @Column(nullable = false)
    private int totalQuestions;

    @Column(nullable = false)
    private int correctCount;

    @ElementCollection
    @CollectionTable(name = "report_weak_topics", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "topic")
    private List<String> weakTopics;

    @ElementCollection
    @CollectionTable(name = "report_strong_topics", joinColumns = @JoinColumn(name = "report_id"))
    private List<String> strongTopics;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    public Report(){
        weakTopics = new ArrayList<>();
        strongTopics = new ArrayList<>();
    }
}
