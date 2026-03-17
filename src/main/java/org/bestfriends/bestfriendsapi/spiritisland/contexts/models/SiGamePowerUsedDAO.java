package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_game_power_used")
@Data
public class SiGamePowerUsedDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "game_spirit_id", nullable = false)
  private Long gameSpiritId;

  @Column(name = "power_card_id", nullable = false)
  private Long powerCardId;

  @Column(name = "times_played", nullable = false)
  private Integer timesPlayed = 1;
}
