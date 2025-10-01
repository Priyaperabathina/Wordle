package com.example.wordle.service;

import com.example.wordle.model.Game;
import com.example.wordle.model.Guess;
import com.example.wordle.model.User;
import com.example.wordle.model.Word;
import com.example.wordle.repository.GameRepository;
import com.example.wordle.repository.GuessRepository;
import com.example.wordle.repository.UserRepository;
import com.example.wordle.repository.WordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class GameService {

  private final GameRepository gameRepository;
  private final WordRepository wordRepository;
  private final GuessRepository guessRepository;
  private final UserRepository userRepository;
  private final Random random = new Random();

  public GameService(GameRepository gameRepository,
      WordRepository wordRepository,
      GuessRepository guessRepository,
      UserRepository userRepository) {
    this.gameRepository = gameRepository;
    this.wordRepository = wordRepository;
    this.guessRepository = guessRepository;
    this.userRepository = userRepository;
  }

  // Start a new game
  @Transactional
  public Game startNewGame(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    LocalDate today = LocalDate.now();
    LocalDateTime startOfDay = today.atStartOfDay();

    // Check if user has an unfinished game today
    List<Game> unfinishedGames = gameRepository.findByPlayer_IdAndStartedAtBetweenAndFinishedFalse(
        userId,
        startOfDay,
        today.plusDays(1).atStartOfDay());

    if (!unfinishedGames.isEmpty()) {
      // Return the first unfinished game
      return unfinishedGames.get(0);
    }
    // Check max 3 games/day
    long gamesToday = gameRepository.findAllByPlayerIdAndFinishedFalse(userId)
        .stream()
        .filter(g -> !g.getFinished() && g.getStartedAt().isAfter(startOfDay))
        .count();

    if (gamesToday >= 3) {
      throw new IllegalStateException("Maximum 3 games per day allowed");
    }

    // Pick random word not already guessed
    List<Word> availableWords = wordRepository.findActiveWordsNotGuessedByUser(userId);
    if (availableWords.isEmpty()) {
      throw new IllegalStateException("No available words for you today");
    }
    Word word = availableWords.get(random.nextInt(availableWords.size()));

    // Create game
    Game game = new Game();
    game.setPlayer(user);
    game.setWord(word);
    game.setGuessesAllowed(5);
    game.setGuessesMade(0);
    game.setWon(false);
    game.setFinished(false);
    game.setStartedAt(LocalDateTime.now());

    return gameRepository.save(game);
  }

  // Make a guess
  @Transactional
  public Guess makeGuess(Long gameId, String guessText) {
    Game game = gameRepository.findById(gameId)
        .orElseThrow(() -> new IllegalArgumentException("Game not found"));

    if (game.getFinished()) {
      throw new IllegalStateException("Game is already finished");
    }

    if (game.getGuessesMade() >= game.getGuessesAllowed()) {
      game.setGuessesMade(game.getGuessesAllowed());
      game.setFinished(true);
      game.setFinishedAt(LocalDateTime.now());
      gameRepository.save(game);
      throw new IllegalStateException("Maximum guesses reached");
    }

    if (guessText.length() != 5) {
      throw new IllegalArgumentException("Guess must be exactly 5 letters");
    }

    String feedback = generateFeedback(game.getWord().getWord(), guessText);

    // Save guess
    Guess guess = new Guess();
    guess.setGame(game);
    guess.setGuessedWord(guessText.toUpperCase());
    guess.setFeedback(feedback);
    guessRepository.save(guess);

    // Update game status
    game.setGuessesMade(game.getGuessesMade() + 1);

    if ("GGGGG".equals(feedback)) {
      game.setWon(true);
      game.setFinished(true);
      game.setFinishedAt(LocalDateTime.now());
    } else if (game.getGuessesMade() >= game.getGuessesAllowed()) {
      game.setFinished(true);
      game.setFinishedAt(LocalDateTime.now());
    }

    gameRepository.save(game);
    return guess;
  }

  // Feedback generator
  private String generateFeedback(String targetWord, String guess) {
    targetWord = targetWord.toUpperCase();
    guess = guess.toUpperCase();
    char[] feedback = new char[5];
    boolean[] used = new boolean[5];

    // First pass: correct letters in correct position
    for (int i = 0; i < 5; i++) {
      if (guess.charAt(i) == targetWord.charAt(i)) {
        feedback[i] = 'G';
        used[i] = true;
      }
    }

    // Second pass: correct letters in wrong position
    for (int i = 0; i < 5; i++) {
      if (feedback[i] == 'G')
        continue;
      boolean found = false;
      for (int j = 0; j < 5; j++) {
        if (!used[j] && guess.charAt(i) == targetWord.charAt(j)) {
          found = true;
          used[j] = true;
          break;
        }
      }
      feedback[i] = found ? 'O' : '-';
    }

    return new String(feedback);
  }

  // Get game by ID
  public Game getGameById(Long gameId) {
    return gameRepository.findById(gameId)
        .orElseThrow(() -> new IllegalArgumentException("Game not found"));
  }

  public List<Game> getGamesPlayedToday(Long userId) {
    LocalDate today = LocalDate.now();
    return gameRepository.findByPlayer_IdAndStartedAtBetweenAndFinishedTrue(
        userId,
        today.atStartOfDay(),
        today.plusDays(1).atStartOfDay());
  }
}
