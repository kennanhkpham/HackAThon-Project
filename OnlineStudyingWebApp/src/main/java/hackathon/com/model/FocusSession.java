package hackathon.com.model;


import hackathon.com.Enum.SessionStatus;
import hackathon.com.Enum.SessionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocusSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String spotifyUrl;

    private SessionStatus status;

    private SessionType sessionType;

    @OneToOne
    private User user;
}

