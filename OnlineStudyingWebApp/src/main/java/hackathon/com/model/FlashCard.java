package hackathon.com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class FlashCard {
    public FlashCard(String term, String definition) {
        this.term = term;
        this.definition = definition;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String term;
    private String definition;
    private String example;
    private int difficultyLevel;

    @ManyToOne
    private Note note;
}
