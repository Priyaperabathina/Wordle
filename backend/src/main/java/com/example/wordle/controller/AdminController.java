package com.example.wordle.controller;

import com.example.wordle.dto.CreateWordDto;
import com.example.wordle.model.Word;
import com.example.wordle.service.ReportService;
import com.example.wordle.service.WordService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

  private final WordService wordService;
  private final ReportService reportService;

  public AdminController(WordService wordService, ReportService reportService) {
    this.wordService = wordService;
    this.reportService = reportService;
  }

  // Word Management

  @GetMapping("/words")
  public ResponseEntity<?> getAllWords() {
    try {
      List<Word> words = wordService.getAllWords();
      return ResponseEntity.ok(words);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/words")
  public ResponseEntity<?> createWord(@Valid @RequestBody CreateWordDto dto) {
    try {
      Word word = wordService.createWord(dto);
      return ResponseEntity.ok(word);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }

  @PutMapping("/words/{id}")
  public ResponseEntity<?> updateWord(@PathVariable Long id,
      @Valid @RequestBody CreateWordDto dto) {
    try {
      Word updated = wordService.updateWord(id, dto);
      return ResponseEntity.ok(updated);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }

  @DeleteMapping("/words/{id}")
  public ResponseEntity<Map<String, String>> deleteWord(@PathVariable Long id) {
    try {
      wordService.deleteWord(id);
      return ResponseEntity.ok(Map.of("message", "Word deleted successfully"));
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }

  // Daily Report
  @GetMapping("/report/daily/{date}")
  public ResponseEntity<Map<String, Object>> dailyReport(@PathVariable String date) {
    Map<String, Object> report = reportService.getDailyReport(date);
    return ResponseEntity.ok(report);
  }

  @GetMapping("/report/player/{userId}")
  public ResponseEntity<?> playerReport(@PathVariable Long userId) {
    try {
      List<Map<String, Object>> report = reportService.getPlayerReport(userId);
      return ResponseEntity.ok(report);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }

  // to get list of users with player role
  @GetMapping("/players")
  public ResponseEntity<?> getAllPlayers() {
    try {
      List<Map<String, Object>> players = reportService.getAllPlayers();
      return ResponseEntity.ok(players);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
  }
}
