package hackathon.com.service;

import hackathon.com.dto.UserDTO;
import hackathon.com.model.User;
import hackathon.com.request.UserRegistrationRequest;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserService {
    void addUser(UserRegistrationRequest userRegistrationRequest);
    UserDTO getUserByEmail(String email);
}
