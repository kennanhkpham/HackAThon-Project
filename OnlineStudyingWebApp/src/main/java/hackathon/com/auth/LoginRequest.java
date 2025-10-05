package hackathon.com.auth;

public record LoginRequest(
        String email,
        String password
) {
}
