package com.example.wordle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuessRequest {

  @NotBlank(message = "Guess cannot be empty")
  @Size(min = 5, max = 5, message = "Guess must be exactly 5 letters")
  private String guess;
}
