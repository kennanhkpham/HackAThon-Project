package hackathon.com.auth;

import hackathon.com.dto.UserDTO;

public record LoginResponse(
        String jwtToken,
        UserDTO userDTO
) {
}
