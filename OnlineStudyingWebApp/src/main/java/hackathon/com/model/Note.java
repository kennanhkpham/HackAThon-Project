package hackathon.com.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileSource;

    private LocalDateTime uploadDate;

    @ManyToOne
    private User user;

    @OneToMany
    private List<FlashCard> flashCardList;

    @OneToMany
    private List<Quiz> quizzes;

    @OneToMany
    private List<Topic> topics;

}
