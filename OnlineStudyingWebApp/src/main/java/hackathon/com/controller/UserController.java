package hackathon.com.controller;

import hackathon.com.dto.UserDTO;
import hackathon.com.jwt.JWTUtil;
import hackathon.com.model.User;
import hackathon.com.request.UserRegistrationRequest;
import hackathon.com.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;
    private final JWTUtil jwtUtil;

    @PostMapping()
    public ResponseEntity<?> addUser(@RequestBody UserRegistrationRequest userRegistrationRequest) {

        userService.addUser(userRegistrationRequest);

        String jwt = jwtUtil.issueToken(userRegistrationRequest.email(), "ROLE_USER");

        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, jwt)
                .build();
    }

    @GetMapping("{email}")
    public UserDTO getUserByEmail(@PathVariable("email") String email) {
        return userService.getUserByEmail(email);
    }
}
