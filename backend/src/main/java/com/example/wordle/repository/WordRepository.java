package com.example.wordle.repository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.wordle.model.Word;

@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {
  Optional<Word> findById(Long id);

  Optional<Word> findByWord(String word);

  List<Word> findByIsActiveTrue();

  @Query("SELECT w FROM Word w LEFT JOIN Game g ON g.word = w AND g.player.id = :userId AND g.won = true " +
      "WHERE w.isActive = true AND g.id IS NULL")
  List<Word> findActiveWordsNotGuessedByUser(Long userId);

}
