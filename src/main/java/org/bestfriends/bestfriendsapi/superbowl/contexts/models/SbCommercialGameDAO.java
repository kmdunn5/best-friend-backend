package org.bestfriends.bestfriendsapi.superbowl.contexts.models;

import java.time.OffsetDateTime;

import org.bestfriends.bestfriendsapi.superbowl.contexts.enums.GameStatus;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sb_commercial_game")
@Data
public class SbCommercialGameDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "\"year\"", nullable = false, unique = true)
  private Integer year;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GameStatus status = GameStatus.CLOSED;

  @Column(name = "winning_category")
  private String winningCategory;

  @Column(name = "guessing_opens_at")
  private OffsetDateTime guessingOpensAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = OffsetDateTime.now();
  }
}
