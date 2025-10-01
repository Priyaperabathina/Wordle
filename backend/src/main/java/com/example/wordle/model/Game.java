package com.example.wordle.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Game {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User player;

  @ManyToOne
  @JoinColumn(name = "word_id", nullable = false)
  private Word word;

  private Boolean won = false;

  private Integer guessesAllowed = 5;

  private Integer guessesMade = 0;

  private Boolean finished = false;

  private LocalDateTime startedAt = LocalDateTime.now();

  private LocalDateTime finishedAt;
}
