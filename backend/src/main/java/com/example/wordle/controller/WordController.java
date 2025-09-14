package com.example.wordle.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.wordle.service.WordService;

import com.example.wordle.model.Word;

import java.util.List;

@RestController
@RequestMapping("/api/admin/words")
public class WordController {
  private final WordService wordService;

  public WordController(WordService wordService) {
    this.wordService = wordService;
  }

  @PostMapping
  public ResponseEntity<Word> addWord(@RequestParam String word) {
    Word newWord = wordService.addWord(word);
    return ResponseEntity.status(HttpStatus.CREATED).body(newWord);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<Word> toggleWordStatus(@PathVariable Integer id) {
    Word updatedWord = wordService.toggleWordStatus(id);
    return ResponseEntity.ok(updatedWord);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteWord(@PathVariable Integer id) {
    wordService.deleteWord(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<Word>> getAllWords() {
    List<Word> words = wordService.getAllWords();
    return ResponseEntity.ok(words);
  }
}
