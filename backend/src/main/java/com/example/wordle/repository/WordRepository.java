package com.example.wordle.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.wordle.model.Word;

@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {
  boolean existsByWord(String word);
}
