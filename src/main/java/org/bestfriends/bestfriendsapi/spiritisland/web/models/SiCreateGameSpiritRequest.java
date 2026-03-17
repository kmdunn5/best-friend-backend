package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import lombok.Data;

@Data
public class SiCreateGameSpiritRequest {
  private Long spiritId;
  private String playerName;
  private Integer damageDealt;
  private Integer damagePrevented;
  private Integer fearGenerated;
  private Integer citiesDestroyed;
  private Integer townsDestroyed;
  private Integer explorersDestroyed;
  private Integer dahanSaved;
  private Integer blightRemoved;
  private String notes;
}
