package hackathon.com.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JWTUtil {
    private static final String SECRET_KEY = "webbers_webbers_webbers_webbers_webbers_webbers_webbers_webbers_webbers";

    public String issueToken(String subject, String ...scopes){
        return issueToken(subject, Map.of("scopes", scopes));
    }

    public String issueToken(String subject, List<String> scopes){
        return issueToken(subject, Map.of("scopes", scopes));
    }

    public String issueToken(String subject, Map<String, Object> claims) {
        return
                Jwts
                        .builder()
                        .claims()
                        .add(claims)
                        .subject(subject)
                        .issuer("Webbers")
                        .issuedAt(Date.from(Instant.now()))
                        .expiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                        .and()
                        .signWith(getSigningKey())
                        .compact();
    }

    public SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String getSubject(String token){
        return getClaims(token).getSubject();
    }

    public Claims getClaims(String token){
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String jwt, String username){
        String subject = getSubject(jwt);

        return subject.equals(username) && !isTokenExpired(jwt);
    }

    public boolean isTokenExpired(String jwt){
        return getClaims(jwt).getExpiration().before(Date.from(Instant.now()));
    }
}
