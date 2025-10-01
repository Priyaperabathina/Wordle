package com.example.wordle.service;

import com.example.wordle.model.Game;
import com.example.wordle.model.User;
import com.example.wordle.repository.GameRepository;
import com.example.wordle.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

  private final GameRepository gameRepository;
  private final UserRepository userRepository;

  public ReportService(GameRepository gameRepository,
      UserRepository userRepository) {
    this.gameRepository = gameRepository;
    this.userRepository = userRepository;
  }

  // Daily Report
  public Map<String, Object> getDailyReport(String date) {
    LocalDate reportDate;
    try {
      // Parse ISO-8601 timestamp to LocalDateTime first
      LocalDateTime dateTime = LocalDateTime.parse(date, DateTimeFormatter.ISO_DATE_TIME);
      reportDate = dateTime.toLocalDate();
    } catch (DateTimeParseException e) {
      // Fallback to parsing just the date if timestamp fails
      reportDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
    }

    LocalDateTime startOfDay = reportDate.atStartOfDay();
    LocalDateTime endOfDay = reportDate.plusDays(1).atStartOfDay();

    List<Game> gamesToday = gameRepository.findAllByFinishedAtBetween(startOfDay, endOfDay);

    long totalGames = gamesToday.size();
    long gamesWon = gamesToday.stream().filter(Game::getWon).count();

    Map<String, Object> report = new HashMap<>();
    report.put("date", reportDate);
    report.put("totalUsers", gameRepository.countDistinctPlayersByDate(reportDate));
    report.put("totalGames", totalGames);
    report.put("gamesWon", gamesWon);

    return report;
  }

  // Per-player report
  public List<Map<String, Object>> getPlayerReport(Long userId) {
    @SuppressWarnings("unused")
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

    // Group games by date
    Map<LocalDate, List<Game>> gamesByDate = gameRepository.findAllByPlayerId(userId).stream()
        .collect(Collectors.groupingBy(game -> game.getFinishedAt().toLocalDate()));

    List<Map<String, Object>> report = new ArrayList<>();

    for (Map.Entry<LocalDate, List<Game>> entry : gamesByDate.entrySet()) {
      LocalDate date = entry.getKey();
      List<Game> gamesOnDate = entry.getValue();

      Map<String, Object> dailyStats = new HashMap<>();
      dailyStats.put("date", date);
      dailyStats.put("attempts", gamesOnDate.size());
      dailyStats.put("wins", gamesOnDate.stream().filter(Game::getWon).count());

      report.add(dailyStats);
    }

    return report;
  }

  // Get all users with PLAYER role
  public List<Map<String, Object>> getAllPlayers() {
    return userRepository.findAllByRole(User.Role.PLAYER).stream()
        .map(user -> {
          Map<String, Object> userMap = new HashMap<>();
          userMap.put("id", user.getId());
          userMap.put("username", user.getUsername());
          userMap.put("createdAt", user.getCreatedAt());
          return userMap;
        })
        .collect(Collectors.toList());
  }
}