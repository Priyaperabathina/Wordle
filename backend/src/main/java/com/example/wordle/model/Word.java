package com.example.wordle.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

@Entity
@Table(name = "words")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Word {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  @Column(length = 5, nullable = false, unique = true)
  private String word;
  @Column(nullable = false)
  private Boolean isActive = true;
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;
  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @jakarta.persistence.ManyToOne
  @jakarta.persistence.JoinColumn(name = "created_by_id", nullable = false)
  private User createdBy;

  @PrePersist
  protected void onCreate() {
    isActive = true;
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
