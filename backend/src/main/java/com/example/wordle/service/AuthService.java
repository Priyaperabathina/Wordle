package com.example.wordle.service;

import com.example.wordle.model.User;
import com.example.wordle.repository.UserRepository;
import com.example.wordle.config.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final JwtUtils jwtUtils;
  private final PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.jwtUtils = jwtUtils;
    this.passwordEncoder = passwordEncoder;
  }

  // Register a new user
  @Transactional
  public User register(String username, String password, User.Role role) {
    if (username == null || username.length() < 5) {
      throw new IllegalArgumentException("Username must be at least 5 characters");
    }

    if (password == null || password.length() < 8) {
      throw new IllegalArgumentException("Password must be at least 8 characters");
    }

    Optional<User> existing = userRepository.findByUsername(username);
    if (existing.isPresent()) {
      throw new IllegalStateException("Username already exists");
    }

    User user = new User();
    user.setUsername(username);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(role);

    return userRepository.save(user);
  }

  // Authenticate user and generate JWT token
  public String login(String username, String password) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid username or password");
    }

    return jwtUtils.generateToken(user.getUsername(), user.getRole().name());
  }

  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }
}
