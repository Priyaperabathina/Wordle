package com.example.wordle.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
@Table(name = "guesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Guess {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "game_id", nullable = false)
  private Game game;

  @Column(length = 5, nullable = false)
  private String guessedWord;

  @Column(nullable = false)
  private String feedback;

  private LocalDateTime guessedAt = LocalDateTime.now();

  @PrePersist
  protected void onCreate() {
    guessedAt = LocalDateTime.now();
  }

}
