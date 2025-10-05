package hackathon.com.dao;

import hackathon.com.model.User;
import hackathon.com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@RequiredArgsConstructor
@Repository
public class UserJPADataAccessService {
    private final UserRepository userRepository;

    public void addUser(User user) {
        userRepository.save(user);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
