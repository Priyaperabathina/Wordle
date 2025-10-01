package com.example.wordle.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

  private final Algorithm algorithm;
  private final JWTVerifier verifier;
  private final long expirationMs;

  public JwtUtils(@Value("${jwt.secret}") String secret,
      @Value("${jwt.expirationMs}") long expirationMs) {
    this.algorithm = Algorithm.HMAC256(secret);
    this.verifier = JWT.require(algorithm).build();
    this.expirationMs = expirationMs;
  }

  // Generate JWT with username and role
  public String generateToken(String username, String role) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + expirationMs);

    return JWT.create()
        .withSubject(username)
        .withClaim("role", "ROLE_" + role) // Add ROLE_ prefix
        .withIssuedAt(now)
        .withExpiresAt(expiry)
        .sign(algorithm);
  }

  // Validate token
  public boolean validateToken(String token) {
    try {
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException e) {
      return false;
    }
  }

  // Extract username
  public String getUsernameFromToken(String token) {
    DecodedJWT decodedJWT = verifier.verify(token);
    return decodedJWT.getSubject();
  }

  // Extract role
  public String getRoleFromToken(String token) {
    DecodedJWT decodedJWT = verifier.verify(token);
    return decodedJWT.getClaim("role").asString();
  }
}
