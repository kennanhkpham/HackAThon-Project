package hackathon.com.dto;

import hackathon.com.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserDTOMapper implements Function<User, UserDTO> {
    @Override
    public UserDTO apply(User user) {
        return new UserDTO(
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getCreatedAt(),
                user.getNotes().size(),
                user.getQuizzes().size(),
                user.getReports().size(),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );
    }
}
