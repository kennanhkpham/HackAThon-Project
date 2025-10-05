package hackathon.com.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 500)
    private String term;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    @Column(columnDefinition = "TEXT")
    private String example;

    @Column(nullable = false)
    private int difficultyLevel;

    @ManyToOne
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;
}
