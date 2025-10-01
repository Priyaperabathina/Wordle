package com.example.wordle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateWordDto {

  @NotBlank(message = "Word cannot be blank")
  @Size(min = 5, max = 5, message = "Word must be exactly 5 letters")
  @Pattern(regexp = "^[a-zA-Z]+$", message = "Word must contain only letters")
  private String word;

  private Boolean active = true;
}
