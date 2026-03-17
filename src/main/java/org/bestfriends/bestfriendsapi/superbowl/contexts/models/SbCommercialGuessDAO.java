package org.bestfriends.bestfriendsapi.superbowl.contexts.models;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sb_commercial_guess")
@Data
public class SbCommercialGuessDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "game_id", nullable = false)
  private Long gameId;

  @Column(name = "guesser_name", nullable = false)
  private String guesserName;

  @Column(nullable = false)
  private String category;

  @Column(name = "guessed_at", nullable = false, updatable = false)
  private OffsetDateTime guessedAt;

  @PrePersist
  protected void onCreate() {
    guessedAt = OffsetDateTime.now();
  }
}
