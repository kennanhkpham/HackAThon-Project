package hackathon.com.service;

import hackathon.com.dao.UserJPADataAccessService;
import hackathon.com.dto.UserDTO;
import hackathon.com.dto.UserDTOMapper;
import hackathon.com.model.User;
import hackathon.com.repository.UserRepository;
import hackathon.com.request.UserRegistrationRequest;
import hackathon.exception.RequestValidationException;
import hackathon.exception.ResourceNotFoundException;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service

public class UserService implements IUserService {

    private final UserJPADataAccessService userRepository;
    private final UserDTOMapper userDTOMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserJPADataAccessService userRepository, UserDTOMapper userDTOMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void addUser(UserRegistrationRequest userRegistrationRequest) {
        if( userRegistrationRequest == null){
            throw new RequestValidationException("userRegistrationRequest cannot be null");
        }
        User user = new User(
                userRegistrationRequest.username(),
                userRegistrationRequest.email(),
                passwordEncoder.encode(userRegistrationRequest.password()),
                LocalDateTime.now()
        );

        userRepository.addUser(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        if(email == null || email.isEmpty()){
            throw new RequestValidationException("email cannot be null or empty");
        }

        return userRepository.findUserByEmail(email).map(userDTOMapper).orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));
    }


}
