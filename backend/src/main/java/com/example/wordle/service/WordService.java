package com.example.wordle.service;

import org.springframework.stereotype.Service;

import com.example.wordle.model.Word;
import com.example.wordle.repository.WordRepository;

import java.util.List;

@Service
public class WordService {
  private final WordRepository wordRepository;

  public WordService(WordRepository wordRepository) {
    this.wordRepository = wordRepository;
  }

  public Word addWord(String word) {
    if (word.length() != 5) {
      throw new IllegalArgumentException("Word must be 5 letters long");
    } else if (wordRepository.existsByWord(word)) {
      throw new IllegalArgumentException("Word already exists");
    }
    Word newWord = new Word();
    newWord.setWord(word.toUpperCase());
    return wordRepository.save(newWord);
  }

  public Word toggleWordStatus(Integer id) {
    Word word = wordRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Word not found"));
    word.setIsActive(!word.getIsActive());
    return wordRepository.save(word);
  }

  public void deleteWord(Integer id) {
    if (!wordRepository.existsById(id)) {
      throw new RuntimeException("Word not found");
    }
    wordRepository.deleteById(id);
  }

  public List<Word> getAllWords() {
    return wordRepository.findAll();
  }
}
