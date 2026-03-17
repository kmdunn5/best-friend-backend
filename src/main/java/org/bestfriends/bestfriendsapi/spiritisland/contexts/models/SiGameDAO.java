package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.time.OffsetDateTime;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.LossReason;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_game")
@Data
public class SiGameDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "played_at", nullable = false)
  private OffsetDateTime playedAt;

  @Column(name = "num_players", nullable = false)
  private Integer numPlayers;

  @Column(name = "adversary_level_id")
  private Long adversaryLevelId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GameResult result;

  @Enumerated(EnumType.STRING)
  @Column(name = "loss_reason")
  private LossReason lossReason;

  @Column(name = "victory_terror_level")
  private Integer victoryTerrorLevel;

  @Column(name = "num_rounds")
  private Integer numRounds;

  @Column(name = "board_setup")
  private String boardSetup;

  private String notes;

  @Column(nullable = false)
  private Boolean fake = false;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = OffsetDateTime.now();
    if (playedAt == null) {
      playedAt = OffsetDateTime.now();
    }
  }
}
