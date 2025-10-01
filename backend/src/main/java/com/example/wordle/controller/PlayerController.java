package com.example.wordle.controller;

import com.example.wordle.dto.GuessRequest;
import com.example.wordle.model.Game;
import com.example.wordle.model.Guess;
import com.example.wordle.service.GameService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

  private final GameService gameService;

  public PlayerController(GameService gameService) {
    this.gameService = gameService;
  }

  @PostMapping("/game/start")
  public ResponseEntity<?> startGame(@RequestParam Long userId) {
    try {
      Game game = gameService.startNewGame(userId);
      return ResponseEntity.ok(game);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/game/{gameId}/guess")
  public ResponseEntity<?> makeGuess(@PathVariable Long gameId,
      @Valid @RequestBody GuessRequest request) {
    try {
      Guess guess = gameService.makeGuess(gameId, request.getGuess());
      return ResponseEntity.ok(guess);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/game/{gameId}/status")
  public ResponseEntity<?> gameStatus(@PathVariable Long gameId) {
    try {
      Game game = gameService.getGameById(gameId);
      return ResponseEntity.ok(game);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/{userId}/games/today")
  public ResponseEntity<?> getGamesPlayedToday(@PathVariable Long userId) {
    try {
      List<Game> games = gameService.getGamesPlayedToday(userId);
      return ResponseEntity.ok(games);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

}
