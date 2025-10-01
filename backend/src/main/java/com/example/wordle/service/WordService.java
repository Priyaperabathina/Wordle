package com.example.wordle.service;

import com.example.wordle.dto.CreateWordDto;
import com.example.wordle.model.Word;
import com.example.wordle.repository.WordRepository;
import com.example.wordle.model.User;
import com.example.wordle.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class WordService {

  private final WordRepository wordRepository;
  private final UserRepository userRepository;

  public WordService(WordRepository wordRepository, UserRepository userRepository) {
    this.wordRepository = wordRepository;
    this.userRepository = userRepository;
  }

  // Create
  public Word createWord(CreateWordDto dto) {
    Word word = new Word();
    word.setWord(dto.getWord());
    word.setIsActive(true);
    word.setCreatedAt(LocalDateTime.now());
    word.setUpdatedAt(LocalDateTime.now());

    // get logged-in admin
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String username = auth.getName(); // this is the username from JWT
    User admin = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalStateException("User not found"));

    word.setCreatedBy(admin); // <-- set the creator
    return wordRepository.save(word);
  }

  // Read
  public List<Word> getAllWords() {
    return wordRepository.findAll();
  }

  public Word getWordById(Long id) {
    return wordRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Word not found with id: " + id));
  }

  // Update
  public Word updateWord(Long id, CreateWordDto dto) {
    Word word = getWordById(id);

    if (StringUtils.hasText(dto.getWord())) {
      String wordText = dto.getWord().toLowerCase().trim();
      word.setWord(wordText);
    }

    if (dto.getActive() != null) {
      word.setIsActive(dto.getActive());
    }

    return wordRepository.save(word);
  }

  // Delete
  public void deleteWord(Long id) {
    Word word = getWordById(id);
    wordRepository.delete(word);
  }

  // Player-specific
  public List<Word> getActiveWordsNotGuessedByUser(Long userId) {
    return wordRepository.findActiveWordsNotGuessedByUser(userId);
  }
}
