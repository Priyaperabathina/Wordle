package com.example.wordle.repository;

import com.example.wordle.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

  // Fetch all games by a specific player
  List<Game> findAllByPlayerId(Long playerId);

  // Fetch all games finished between two timestamps (for daily report)
  List<Game> findAllByFinishedAtBetween(LocalDateTime start, LocalDateTime end);

  // Count active games for a player today (to enforce max 3 games/day)
  Long countByPlayerIdAndStartedAtBetween(Long playerId, LocalDateTime start, LocalDateTime end);

  // Fetch ongoing games for a player
  List<Game> findAllByPlayerIdAndFinishedFalse(Long playerId);

  // Fetch games by user ID and creation date range
  List<Game> findByPlayer_IdAndStartedAtBetweenAndFinishedTrue(Long userId, LocalDateTime start, LocalDateTime end);

  // Fetch today's unfinished games
  List<Game> findByPlayer_IdAndStartedAtBetweenAndFinishedFalse(Long userId, LocalDateTime start, LocalDateTime end);

  // Get distinct users played today
  @Query("SELECT COUNT(DISTINCT g.player) " +
      "FROM Game g " +
      "WHERE DATE(g.startedAt) = :date " +
      "AND g.player.role = 'PLAYER'")
  Long countDistinctPlayersByDate(@Param("date") LocalDate date);

}
