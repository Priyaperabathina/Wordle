package com.example.wordle.repository;

import org.springframework.stereotype.Repository;

import com.example.wordle.model.Guess;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface GuessRepository extends JpaRepository<Guess, Long> {
  List<Guess> findAllByGameId(Long gameId);
}
