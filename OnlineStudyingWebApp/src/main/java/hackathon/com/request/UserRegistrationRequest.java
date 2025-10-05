package hackathon.com.request;

public record UserRegistrationRequest(
        String username,
        String email,
        String password
) {
}
