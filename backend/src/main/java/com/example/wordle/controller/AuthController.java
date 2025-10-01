package com.example.wordle.controller;

import com.example.wordle.dto.RegisterRequest;
import com.example.wordle.dto.LoginRequest;
import com.example.wordle.dto.AuthResponse;
import com.example.wordle.model.User;
import com.example.wordle.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    try {
      User user = authService.register(request.getUsername(), request.getPassword(), request.getRole());
      String token = authService.login(user.getUsername(), request.getPassword());
      return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getUsername(), user.getRole()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new AuthResponse(e.getMessage(), null, null, null));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    try {
      String token = authService.login(request.getUsername(), request.getPassword());
      User user = authService.findByUsername(request.getUsername()).orElseThrow();
      return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getUsername(), user.getRole()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new AuthResponse(e.getMessage(), null, null, null));
    }
  }
}
