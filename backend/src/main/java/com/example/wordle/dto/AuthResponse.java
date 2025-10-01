package com.example.wordle.dto;

import com.example.wordle.model.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

  private String token;
  private Long userId;
  private String username;
  private User.Role role;
}
