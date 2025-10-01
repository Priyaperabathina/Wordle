package com.example.wordle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import com.example.wordle.model.User;

@Getter
@Setter
public class RegisterRequest {

  @NotBlank(message = "Username is required")
  @Size(min = 5, max = 50, message = "Username must be between 5 and 50 characters")
  private String username;

  @NotBlank(message = "Password is required")
  @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
  private String password;

  @NotNull(message = "Role is required")
  private User.Role role;
}
