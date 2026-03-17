package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_game_spirit")
@Data
public class SiGameSpiritDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "game_id", nullable = false)
  private Long gameId;

  @Column(name = "spirit_id", nullable = false)
  private Long spiritId;

  @Column(name = "player_name", nullable = false)
  private String playerName;

  @Column(name = "damage_dealt")
  private Integer damageDealt;

  @Column(name = "damage_prevented")
  private Integer damagePrevented;

  @Column(name = "fear_generated")
  private Integer fearGenerated;

  @Column(name = "cities_destroyed")
  private Integer citiesDestroyed;

  @Column(name = "towns_destroyed")
  private Integer townsDestroyed;

  @Column(name = "explorers_destroyed")
  private Integer explorersDestroyed;

  @Column(name = "dahan_saved")
  private Integer dahanSaved;

  @Column(name = "blight_removed")
  private Integer blightRemoved;

  private String notes;
}
