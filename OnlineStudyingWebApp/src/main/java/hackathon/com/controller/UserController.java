package hackathon.com.controller;

import hackathon.com.request.UserRegistrationRequest;
import hackathon.com.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public void addUser(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        userService.addUser(userRegistrationRequest);
    }
}
