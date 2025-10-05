package hackathon.com.auth;

import hackathon.com.dto.UserDTO;
import hackathon.com.dto.UserDTOMapper;
import hackathon.com.jwt.JWTUtil;
import hackathon.com.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class LoginServices {
    private final AuthenticationManager authenticationManager;
    private final UserDTOMapper userDTOMapper;
    private final JWTUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        User user = (User) authentication.getPrincipal();
        UserDTO userDTO = userDTOMapper.apply(user);
        String jwtToken = jwtUtil.issueToken(userDTO.username(), userDTO.roles());

        return new LoginResponse(
                jwtToken, userDTO
        );
    }
}
